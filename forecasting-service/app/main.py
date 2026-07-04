import os
import psycopg2
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet
import joblib
import logging

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
try:
    from tensorflow.keras.models import load_model # type: ignore
    HAS_TF = True
except ImportError:
    HAS_TF = False

from dotenv import load_dotenv
from app.feature_store import FeatureStore
from app.model_registry import ModelRegistry

from app.api.v1 import threats, vendors, alerts, investigations, analytics

load_dotenv()
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="THREATWEAVE Forecasting Service")

app.include_router(threats.router, prefix="/api/v1/threats", tags=["threats"])
app.include_router(vendors.router, prefix="/api/v1/vendors", tags=["vendors"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["alerts"])
app.include_router(investigations.router, prefix="/api/v1/investigations", tags=["investigations"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])


feature_store = FeatureStore()
model_registry = ModelRegistry()

class ForecastRequest(BaseModel):
    vendor_id: str
    periods: int = 30

class ForecastResponse(BaseModel):
    dates: List[str]
    predictions: List[float]
    confidence_lower: List[float]
    confidence_upper: List[float]

@app.get("/health")
def health_check():
    return {"status": "healthy"}

def get_fallback(df: pd.DataFrame, periods: int) -> ForecastResponse:
    base_val = 50.0
    if not df.empty:
        base_val = float(df['risk_score'].iloc[-1])
        last_date = pd.to_datetime(df.index[-1])
    else:
        last_date = pd.Timestamp.now()
        
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=periods)
    preds = [base_val] * periods
    conf_l = [max(0.0, base_val - 10)] * periods
    conf_u = [min(100.0, base_val + 10)] * periods
    
    return ForecastResponse(
        dates=[d.strftime('%Y-%m-%d') for d in future_dates],
        predictions=preds,
        confidence_lower=conf_l,
        confidence_upper=conf_u
    )

@app.post("/forecast/arima", response_model=ForecastResponse)
def forecast_arima(req: ForecastRequest):
    df = feature_store.get_historical_features(req.vendor_id)
    if df.empty or len(df) < 5:
        return get_fallback(df, req.periods)

    try:
        model = ARIMA(df['risk_score'], order=(1, 1, 1))
        model_fit = model.fit()
        forecast = model_fit.get_forecast(steps=req.periods)
        pred_mean = forecast.predicted_mean
        pred_ci = forecast.conf_int(alpha=0.05) 

        future_dates = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=req.periods)
        preds = np.clip(pred_mean.values, 0, 100).tolist()
        conf_l = np.clip(pred_ci.iloc[:, 0].values, 0, 100).tolist()
        conf_u = np.clip(pred_ci.iloc[:, 1].values, 0, 100).tolist()

        return ForecastResponse(
            dates=[d.strftime('%Y-%m-%d') for d in future_dates],
            predictions=preds,
            confidence_lower=conf_l,
            confidence_upper=conf_u
        )
    except Exception as e:
        logging.error(f"[ML Resilience] ARIMA forecasting failed for vendor {req.vendor_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"ARIMA error: {str(e)}")

@app.post("/forecast/prophet", response_model=ForecastResponse)
def forecast_prophet(req: ForecastRequest):
    df = feature_store.get_historical_features(req.vendor_id)
    if df.empty or len(df) < 30:
        return get_fallback(df, req.periods)

    prophet_df = pd.DataFrame({
        'ds': df.index,
        'y': df['risk_score'].values
    })

    try:
        m = Prophet(weekly_seasonality=False, yearly_seasonality=False)
        m.fit(prophet_df)
        future = m.make_future_dataframe(periods=req.periods)
        forecast = m.predict(future)
        forecast_future = forecast.tail(req.periods)
        
        preds = np.clip(forecast_future['yhat'].values, 0, 100).tolist()
        conf_l = np.clip(forecast_future['yhat_lower'].values, 0, 100).tolist()
        conf_u = np.clip(forecast_future['yhat_upper'].values, 0, 100).tolist()
        dates = forecast_future['ds'].dt.strftime('%Y-%m-%d').tolist()

        return ForecastResponse(
            dates=dates,
            predictions=preds,
            confidence_lower=conf_l,
            confidence_upper=conf_u
        )
    except Exception as e:
        logging.error(f"[ML Resilience] Prophet forecasting failed for vendor {req.vendor_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prophet error: {str(e)}")

@app.post("/forecast/lstm", response_model=ForecastResponse)
def forecast_lstm(req: ForecastRequest):
    if not HAS_TF:
        raise HTTPException(status_code=500, detail="TensorFlow not installed")
        
    production_model = model_registry.get_production_model("cyber_risk_lstm")
    if not production_model:
        raise HTTPException(status_code=400, detail="No production LSTM model found in registry.")

    artifact_path = production_model['artifact_path']
    scaler_path = artifact_path.replace('lstm_', 'scaler_').replace('.h5', '.pkl')
    
    if not os.path.exists(artifact_path) or not os.path.exists(scaler_path):
        raise HTTPException(status_code=500, detail="Model artifacts missing from disk")

    try:
        model = load_model(artifact_path)
        scaler = joblib.load(scaler_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model loading error: {str(e)}")

    df = feature_store.get_historical_features(req.vendor_id)
    if df.empty or len(df) < 60:
        return get_fallback(df, req.periods)

    last_60 = df.tail(60)['risk_score'].values.reshape(-1, 1)
    scaled_last_60 = scaler.transform(last_60)
    X_input = scaled_last_60.reshape((1, 60, 1))
    
    try:
        pred_scaled = model.predict(X_input)
        pred_scores = scaler.inverse_transform(pred_scaled.reshape(-1, 1)).flatten()
        preds = np.clip(pred_scores, 0, 100).tolist()
        
        conf_l = np.clip([p - 5 for p in preds], 0, 100).tolist()
        conf_u = np.clip([p + 5 for p in preds], 0, 100).tolist()
        
        future_dates = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=req.periods)
        
        return ForecastResponse(
            dates=[d.strftime('%Y-%m-%d') for d in future_dates],
            predictions=preds,
            confidence_lower=conf_l,
            confidence_upper=conf_u
        )
    except Exception as e:
        logging.error(f"[ML Resilience] LSTM prediction error for vendor {req.vendor_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"LSTM prediction error: {str(e)}")

@app.post("/forecast/ensemble", response_model=ForecastResponse)
def forecast_ensemble(req: ForecastRequest):
    # Ensemble combines ARIMA, Prophet, and LSTM
    arima_res = forecast_arima(req)
    prophet_res = forecast_prophet(req)
    
    lstm_success = True
    try:
        lstm_res = forecast_lstm(req)
    except HTTPException:
        lstm_success = False

    preds = []
    conf_l = []
    conf_u = []
    
    for i in range(req.periods):
        vals = [arima_res.predictions[i], prophet_res.predictions[i]]
        cls = [arima_res.confidence_lower[i], prophet_res.confidence_lower[i]]
        cus = [arima_res.confidence_upper[i], prophet_res.confidence_upper[i]]
        
        if lstm_success:
            vals.append(lstm_res.predictions[i])
            cls.append(lstm_res.confidence_lower[i])
            cus.append(lstm_res.confidence_upper[i])
            
        preds.append(sum(vals) / len(vals))
        conf_l.append(sum(cls) / len(cls))
        conf_u.append(sum(cus) / len(cus))
        
    return ForecastResponse(
        dates=arima_res.dates,
        predictions=preds,
        confidence_lower=conf_l,
        confidence_upper=conf_u
    )
