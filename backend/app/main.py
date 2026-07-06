import os
import psycopg2
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
HAS_STATS = True
try:
    from statsmodels.tsa.arima.model import ARIMA
except Exception as e:
    import logging
    logging.getLogger("threatweave.forecasting").warning(f"Failed to import statsmodels (ARIMA): {e}")
    HAS_STATS = False

HAS_PROPHET = True
try:
    from prophet import Prophet
except Exception as e:
    import logging
    logging.getLogger("threatweave.forecasting").warning(f"Failed to import Prophet: {e}")
    HAS_PROPHET = False

import joblib
import logging
from contextlib import asynccontextmanager

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
try:
    from tensorflow.keras.models import load_model # type: ignore
    HAS_TF = True
except ImportError:
    HAS_TF = False

from app.core.config import get_settings
from app.core.database import db_manager
from app.core.exceptions import ThreatWeaveError, ConfigurationError
from app.feature_store import FeatureStore
from app.model_registry import ModelRegistry

from app.api.v1 import threats, vendors, alerts, investigations, analytics, settings
from app.core.settings_store import SettingsStore

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("threatweave.forecasting")

# Instantiate service components lazily (no connections happen here)
feature_store = FeatureStore()
model_registry = ModelRegistry()
settings_store = SettingsStore()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Lifecycle Phase
    logger.info("========================================================")
    logger.info("THREATWEAVE FORECASTING SERVICE STARTUP INITIALIZATION")
    logger.info("========================================================")
    
    try:
        settings = get_settings()
    except Exception as ce:
        logger.critical(f"[CONFIG ERROR] Configuration validation failed: {str(ce)}")
        # Raise exception to prevent application from starting without a valid config
        raise RuntimeError(f"Startup failed due to configuration error: {str(ce)}") from ce
        
    import sys
    logger.info(f"Python Version: {sys.version}")
    logger.info(f"Working Directory: {os.getcwd()}")
    logger.info(f"Target Environment: {settings.ENV}")
    logger.info(f"Binds Host: {settings.HOST}, Port: {settings.PORT}")
    logger.info(f"DATABASE_URL Configured: {bool(settings.DATABASE_URL)}")
    
    # Securely log Database Host details (masking user/password)
    try:
        if settings.DATABASE_URL:
            from urllib.parse import urlparse
            parsed = urlparse(settings.DATABASE_URL)
            logger.info(f"Connecting to database: {parsed.scheme}://{parsed.hostname or 'localhost'}:{parsed.port or 5432}/{parsed.path.lstrip('/')}")
        else:
            logger.info("Connecting to database: None (DATABASE_URL empty)")
    except Exception:
        logger.info("Connecting to database: [Secure Masked Connection String]")

    # Initialize connection pool
    logger.info("Step 1: Setting up database connection pool...")
    db_manager.initialize_pool()

    # Verify database structures exist
    logger.info("Step 2: Testing connection & running schema synchronization...")
    try:
        if db_manager.pool:
            feature_store.init_db()
            model_registry.init_db()
            settings_store.init_db()
            logger.info("Step 3: Database schema initialized successfully.")
        else:
            logger.info("Step 3: Skipping DB schema sync (running in degraded offline mode).")
    except Exception as e:
        logger.error(f"[SCHEMA ERROR] Failed to initialize DB schemas: {str(e)}. Running in degraded state.")

    # Diagnostic checks for available ML models
    logger.info("Step 4: Scanning registered ML models...")
    try:
        if db_manager.pool:
            prod_lstm = model_registry.get_production_model("cyber_risk_lstm")
            if prod_lstm:
                logger.info(f"Active production model: {prod_lstm['model_name']} version {prod_lstm['version']}")
            else:
                logger.warning("No production LSTM model is registered yet. Run train_lstm.py to create one.")
        else:
            logger.warning("Database unavailable. Scanning registered ML models skipped.")
    except Exception as e:
        logger.error(f"[MODEL ERROR] Failed to check model registry status: {str(e)}")

    # Log loaded routes
    routes = []
    for route in app.routes:
        if hasattr(route, "path"):
            methods = getattr(route, "methods", None)
            methods_str = f" [{','.join(methods)}]" if methods else ""
            routes.append(f"{route.path}{methods_str}")
    logger.info(f"Loaded routes: {', '.join(routes)}")

    logger.info("Startup sequence completed. Application is ready to receive requests.")
    logger.info("========================================================")
    
    yield
    
    # Shutdown Lifecycle Phase
    logger.info("========================================================")
    logger.info("THREATWEAVE FORECASTING SERVICE SHUTDOWN")
    logger.info("========================================================")
    logger.info("Closing active resources...")
    db_manager.close_all()
    logger.info("Resource cleanup completed.")
    logger.info("========================================================")

app = FastAPI(title="THREATWEAVE Forecasting Service", lifespan=lifespan)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In a strict prod environment this would be specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Include route managers
app.include_router(threats.router, prefix="/api/v1/threats", tags=["threats"])
app.include_router(vendors.router, prefix="/api/v1/vendors", tags=["vendors"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["alerts"])
app.include_router(investigations.router, prefix="/api/v1/investigations", tags=["investigations"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(settings.router, prefix="/api/v1/settings", tags=["settings"])

class ForecastRequest(BaseModel):
    vendor_id: str
    periods: int = 30

class ForecastResponse(BaseModel):
    dates: List[str]
    predictions: List[float]
    confidence_lower: List[float]
    confidence_upper: List[float]

@app.get("/")
def root_check():
    return {
        "service": "THREATWEAVE Forecasting Service",
        "status": "online",
        "health_check_url": "/health",
        "liveness_check_url": "/liveness",
        "readiness_check_url": "/readiness"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/liveness")
def liveness_check():
    return {"status": "alive"}

@app.get("/readiness")
def readiness_check():
    db_status = "unhealthy"
    db_details = None
    try:
        if db_manager.pool:
            conn = db_manager.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT 1;")
            cur.fetchone()
            db_status = "healthy"
            cur.close()
            db_manager.release_connection(conn)
        else:
            db_status = "offline"
            db_details = "Database connection pool is not configured."
    except Exception as e:
        db_details = str(e)
        logger.error(f"Readiness check failed for Database: {db_details}")

    model_status = "unhealthy"
    model_details = None
    try:
        if db_manager.pool:
            prod_model = model_registry.get_production_model("cyber_risk_lstm")
            if prod_model:
                model_status = "healthy"
                model_details = f"version {prod_model['version']}"
            else:
                model_status = "no_model_registered"
                model_details = "No production LSTM model is registered yet."
        else:
            model_status = "offline"
            model_details = "Database unavailable; model registry status skipped."
    except Exception as e:
        model_details = str(e)
        logger.error(f"Readiness check failed for Model Registry: {model_details}")

    status = "ready" if (db_status == "healthy" or db_status == "offline") else "degraded"
    
    return {
        "status": status,
        "checks": {
            "database": {
                "status": db_status,
                "error": db_details
            },
            "model_registry": {
                "status": model_status,
                "details": model_details
            }
        }
    }

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

@app.get("/forecast/arima")
@app.post("/forecast/arima", response_model=ForecastResponse)
def forecast_arima(req: ForecastRequest):
    if not HAS_STATS:
        raise HTTPException(
            status_code=503,
            detail="ARIMA forecasting service (statsmodels) is currently unavailable due to startup dependency failure."
        )
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
        logger.error(f"[ML Resilience] ARIMA forecasting failed for vendor {req.vendor_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"ARIMA error: {str(e)}")

@app.post("/forecast/prophet", response_model=ForecastResponse)
def forecast_prophet(req: ForecastRequest):
    if not HAS_PROPHET:
        raise HTTPException(
            status_code=503,
            detail="Prophet forecasting service is currently unavailable due to startup dependency failure."
        )
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
        logger.error(f"[ML Resilience] Prophet forecasting failed for vendor {req.vendor_id}: {str(e)}")
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
        logger.error(f"[ML Resilience] LSTM prediction error for vendor {req.vendor_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"LSTM prediction error: {str(e)}")

@app.post("/forecast/ensemble", response_model=ForecastResponse)
def forecast_ensemble(req: ForecastRequest):
    preds_list = []
    conf_l_list = []
    conf_u_list = []
    dates = []

    arima_success = False
    try:
        if HAS_STATS:
            arima_res = forecast_arima(req)
            arima_success = True
    except Exception:
        pass

    prophet_success = False
    try:
        if HAS_PROPHET:
            prophet_res = forecast_prophet(req)
            prophet_success = True
    except Exception:
        pass

    lstm_success = False
    try:
        if HAS_TF:
            lstm_res = forecast_lstm(req)
            lstm_success = True
    except Exception:
        pass

    # If no models are successful, return fallback
    if not (arima_success or prophet_success or lstm_success):
        df = feature_store.get_historical_features(req.vendor_id)
        return get_fallback(df, req.periods)

    # Use whatever dates we can get
    if arima_success:
        dates = arima_res.dates
    elif prophet_success:
        dates = prophet_res.dates
    elif lstm_success:
        dates = lstm_res.dates

    for i in range(req.periods):
        vals = []
        cls = []
        cus = []
        if arima_success:
            vals.append(arima_res.predictions[i])
            cls.append(arima_res.confidence_lower[i])
            cus.append(arima_res.confidence_upper[i])
        if prophet_success:
            vals.append(prophet_res.predictions[i])
            cls.append(prophet_res.confidence_lower[i])
            cus.append(prophet_res.confidence_upper[i])
        if lstm_success:
            vals.append(lstm_res.predictions[i])
            cls.append(lstm_res.confidence_lower[i])
            cus.append(lstm_res.confidence_upper[i])

        preds_list.append(sum(vals) / len(vals))
        conf_l_list.append(sum(cls) / len(cls))
        conf_u_list.append(sum(cus) / len(cus))

    return ForecastResponse(
        dates=dates,
        predictions=preds_list,
        confidence_lower=conf_l_list,
        confidence_upper=conf_u_list
    )
