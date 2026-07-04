import os
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import LSTM, Dense, Dropout # type: ignore
from dotenv import load_dotenv
from app.feature_store import FeatureStore
from app.model_registry import ModelRegistry

load_dotenv()

def create_dataset(dataset, look_back=60, look_forward=30):
    X, Y = [], []
    for i in range(len(dataset) - look_back - look_forward + 1):
        a = dataset[i:(i + look_back), 0]
        X.append(a)
        Y.append(dataset[i + look_back : i + look_back + look_forward, 0])
    return np.array(X), np.array(Y)

def train_model():
    print("Initializing Feature Store and Model Registry...")
    feature_store = FeatureStore()
    registry = ModelRegistry()

    # Get data for all vendors. In a real scenario, we'd query distinct vendor_ids.
    # We will simulate pulling raw feature data from FeatureStore DB by querying vendor_risk_history directly.
    # To do this cleanly, we can use raw pd.read_sql or use our FeatureStore abstraction if expanded.
    
    conn = feature_store.get_connection()
    import pandas as pd
    query = "SELECT vendor_id, snapshot_date, risk_score FROM vendor_risk_history ORDER BY vendor_id, snapshot_date ASC"
    try:
        df = pd.read_sql(query, conn)
    except Exception as e:
        print(f"Failed to load features: {e}")
        return
    finally:
        conn.close()

    if df.empty:
        print("No historical data found.")
        return

    # Prepare data
    all_X, all_Y = [], []
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaler.fit(df[['risk_score']])

    grouped = df.groupby('vendor_id')
    look_back = 60
    look_forward = 30
    
    for vendor_id, group in grouped:
        group = group.sort_values('snapshot_date')
        if len(group) < look_back + look_forward:
            continue
            
        scaled_data = scaler.transform(group[['risk_score']])
        X, Y = create_dataset(scaled_data, look_back, look_forward)
        
        if len(X) > 0:
            all_X.append(X)
            all_Y.append(Y)
            
    if not all_X:
        print(f"Not enough data to train. Need at least {look_back + look_forward} days per vendor.")
        return

    X_train = np.vstack(all_X)
    Y_train = np.vstack(all_Y)
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))
    
    print(f"Training LSTM on {len(X_train)} samples...")
    
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(look_back, 1)))
    model.add(Dropout(0.2))
    model.add(LSTM(50))
    model.add(Dropout(0.2))
    model.add(Dense(look_forward))
    
    model.compile(loss='mean_squared_error', optimizer='adam')
    
    history = model.fit(X_train, Y_train, epochs=20, batch_size=32, verbose=1, validation_split=0.1)
    
    # Save model locally
    os.makedirs('models', exist_ok=True)
    version = f"v{int(pd.Timestamp.now().timestamp())}"
    artifact_path = f'models/lstm_{version}.h5'
    scaler_path = f'models/scaler_{version}.pkl'
    
    model.save(artifact_path)
    joblib.dump(scaler, scaler_path)
    
    # Get metrics
    val_loss = history.history.get('val_loss', [-1])[-1]
    train_loss = history.history.get('loss', [-1])[-1]
    
    metrics = {
        "val_mse": float(val_loss),
        "train_mse": float(train_loss)
    }
    parameters = {
        "look_back": look_back,
        "look_forward": look_forward,
        "epochs": 20,
        "batch_size": 32,
        "optimizer": "adam"
    }

    # Register in Model Registry
    model_id = registry.register_model("cyber_risk_lstm", version, artifact_path, metrics, parameters)
    registry.promote_model("cyber_risk_lstm", version)
    print(f"Training complete. Model registered (ID: {model_id}) and promoted as PRODUCTION.")

if __name__ == "__main__":
    train_model()
