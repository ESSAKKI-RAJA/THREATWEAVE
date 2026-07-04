import psycopg2
import os
import json
import uuid
from typing import Dict, Any, List
from datetime import datetime

class ModelRegistry:
    def __init__(self):
        self.db_url = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:54322/postgres")
        self._init_db()

    def get_connection(self):
        return psycopg2.connect(self.db_url)

    def _init_db(self):
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS ml_model_registry (
                model_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                model_name VARCHAR(255) NOT NULL,
                version VARCHAR(50) NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'STAGED', -- STAGED, PRODUCTION, ARCHIVED
                metrics JSONB,
                parameters JSONB,
                artifact_path TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(model_name, version)
            );
        """)
        conn.commit()
        cur.close()
        conn.close()

    def register_model(self, model_name: str, version: str, artifact_path: str, metrics: Dict[str, Any] = None, parameters: Dict[str, Any] = None) -> str:
        conn = self.get_connection()
        cur = conn.cursor()
        
        try:
            cur.execute("""
                INSERT INTO ml_model_registry (model_name, version, artifact_path, metrics, parameters)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING model_id;
            """, (model_name, version, artifact_path, json.dumps(metrics or {}), json.dumps(parameters or {})))
            model_id = cur.fetchone()[0]
            conn.commit()
            return str(model_id)
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    def promote_model(self, model_name: str, version: str):
        conn = self.get_connection()
        cur = conn.cursor()
        
        try:
            # Demote current production model
            cur.execute("""
                UPDATE ml_model_registry 
                SET status = 'ARCHIVED' 
                WHERE model_name = %s AND status = 'PRODUCTION';
            """, (model_name,))
            
            # Promote new model
            cur.execute("""
                UPDATE ml_model_registry 
                SET status = 'PRODUCTION' 
                WHERE model_name = %s AND version = %s;
            """, (model_name, version))
            
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    def get_production_model(self, model_name: str) -> Dict[str, Any]:
        conn = self.get_connection()
        cur = conn.cursor()
        
        try:
            cur.execute("""
                SELECT model_id, model_name, version, artifact_path, metrics, parameters, created_at
                FROM ml_model_registry 
                WHERE model_name = %s AND status = 'PRODUCTION'
                ORDER BY created_at DESC LIMIT 1;
            """, (model_name,))
            
            row = cur.fetchone()
            if not row:
                return None
                
            return {
                "model_id": str(row[0]),
                "model_name": row[1],
                "version": row[2],
                "artifact_path": row[3],
                "metrics": row[4],
                "parameters": row[5],
                "created_at": row[6].isoformat()
            }
        finally:
            cur.close()
            conn.close()
