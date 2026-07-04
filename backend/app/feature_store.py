import logging
import threading
import pandas as pd
from typing import List, Dict, Any, Optional
from app.core.database import db_manager
from app.core.exceptions import DatabaseConnectionError, StartupInitializationError

logger = logging.getLogger(__name__)

class FeatureStore:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(FeatureStore, cls).__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True

    def init_db(self):
        """Initializes tables. Called during FastAPI startup lifespan, not import time."""
        logger.info("Initializing Feature Store tables...")
        query = """
            CREATE TABLE IF NOT EXISTS ml_feature_definitions (
                feature_name VARCHAR(255) PRIMARY KEY,
                description TEXT,
                data_type VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """
        try:
            db_manager.execute_query(query, commit=True)
            logger.info("Feature Store tables verified/created successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Feature Store database: {str(e)}")
            raise StartupInitializationError(f"Feature Store DB init failed: {str(e)}") from e

    def get_connection(self):
        """Keep backward compatibility for other modules if they call get_connection() directly."""
        return db_manager.get_connection()

    def register_feature(self, name: str, description: str, data_type: str = "float"):
        query = """
            INSERT INTO ml_feature_definitions (feature_name, description, data_type)
            VALUES (%s, %s, %s)
            ON CONFLICT (feature_name) 
            DO UPDATE SET description = EXCLUDED.description, data_type = EXCLUDED.data_type, updated_at = CURRENT_TIMESTAMP;
        """
        try:
            db_manager.execute_query(query, (name, description, data_type), commit=True)
        except Exception as e:
            logger.error(f"Failed to register feature {name}: {str(e)}")
            raise DatabaseConnectionError(f"Register feature failed: {str(e)}") from e

    def get_historical_features(self, vendor_id: str, feature_names: List[str] = None) -> pd.DataFrame:
        """Retrieves offline features for training."""
        conn = None
        try:
            conn = db_manager.get_connection()
            query = "SELECT snapshot_date, risk_score FROM vendor_risk_history WHERE vendor_id = %s ORDER BY snapshot_date ASC"
            df = pd.read_sql(query, conn, params=(vendor_id,))
            
            if df.empty:
                return df
                
            df['snapshot_date'] = pd.to_datetime(df['snapshot_date'])
            df.set_index('snapshot_date', inplace=True)
            # Ensure daily frequency
            df = df.resample('D').ffill()
            if df['risk_score'].isnull().any():
                df['risk_score'] = df['risk_score'].ffill().bfill()
                
            return df
        except Exception as e:
            logger.error(f"Failed to retrieve historical features for vendor {vendor_id}: {str(e)}")
            # Return empty DataFrame as a graceful fallback instead of crashing
            return pd.DataFrame()
        finally:
            if conn:
                db_manager.release_connection(conn)

    def get_online_features(self, vendor_id: str) -> Dict[str, Any]:
        """Retrieves the latest features for online inference."""
        df = self.get_historical_features(vendor_id)
        if df.empty:
            return {}
            
        return {
            "latest_risk_score": float(df['risk_score'].iloc[-1]),
            "last_updated": df.index[-1].isoformat()
        }
