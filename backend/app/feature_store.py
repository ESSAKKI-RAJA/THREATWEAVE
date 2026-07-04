import psycopg2
import pandas as pd
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

class FeatureStore:
    def __init__(self):
        self.db_url = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:54322/postgres")
        self._init_db()

    def get_connection(self):
        return psycopg2.connect(self.db_url)

    def _init_db(self):
        # We need a table to store feature metadata if it doesn't exist
        # But we assume THREATWEAVE schema holds actual features in vendor_risk_history or similar.
        # This table just tracks feature definitions.
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS ml_feature_definitions (
                feature_name VARCHAR(255) PRIMARY KEY,
                description TEXT,
                data_type VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        cur.close()
        conn.close()

    def register_feature(self, name: str, description: str, data_type: str = "float"):
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO ml_feature_definitions (feature_name, description, data_type)
            VALUES (%s, %s, %s)
            ON CONFLICT (feature_name) 
            DO UPDATE SET description = EXCLUDED.description, data_type = EXCLUDED.data_type, updated_at = CURRENT_TIMESTAMP;
        """, (name, description, data_type))
        conn.commit()
        cur.close()
        conn.close()

    def get_historical_features(self, vendor_id: str, feature_names: List[str] = None) -> pd.DataFrame:
        """
        Retrieves offline features for training.
        Assuming primary table is vendor_risk_history, we return a dataframe.
        """
        conn = self.get_connection()
        query = f"SELECT snapshot_date, risk_score FROM vendor_risk_history WHERE vendor_id = '{vendor_id}' ORDER BY snapshot_date ASC"
        df = pd.read_sql(query, conn)
        conn.close()
        
        if df.empty:
            return df
            
        df['snapshot_date'] = pd.to_datetime(df['snapshot_date'])
        df.set_index('snapshot_date', inplace=True)
        # Ensure daily frequency
        df = df.resample('D').ffill()
        if df['risk_score'].isnull().any():
            df['risk_score'] = df['risk_score'].fillna(method='bfill')
            
        return df

    def get_online_features(self, vendor_id: str) -> Dict[str, Any]:
        """
        Retrieves the latest features for online inference.
        """
        df = self.get_historical_features(vendor_id)
        if df.empty:
            return {}
            
        return {
            "latest_risk_score": float(df['risk_score'].iloc[-1]),
            "last_updated": df.index[-1].isoformat()
        }
