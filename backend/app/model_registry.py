import logging
import json
import uuid
import threading
from typing import Dict, Any, List
from app.core.database import db_manager
from app.core.exceptions import DatabaseConnectionError, StartupInitializationError

logger = logging.getLogger(__name__)

class ModelRegistry:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(ModelRegistry, cls).__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True

    def init_db(self):
        """Initializes model registry tables. Called during startup lifespan."""
        logger.info("Initializing Model Registry tables...")
        query = """
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
        """
        try:
            db_manager.execute_query(query, commit=True)
            logger.info("Model Registry tables verified/created successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Model Registry database: {str(e)}")
            raise StartupInitializationError(f"Model Registry DB init failed: {str(e)}") from e

    def get_connection(self):
        """Backward compatibility."""
        return db_manager.get_connection()

    def register_model(self, model_name: str, version: str, artifact_path: str, metrics: Dict[str, Any] = None, parameters: Dict[str, Any] = None) -> str:
        query = """
            INSERT INTO ml_model_registry (model_name, version, artifact_path, metrics, parameters)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING model_id;
        """
        try:
            rows = db_manager.execute_query(
                query, 
                (model_name, version, artifact_path, json.dumps(metrics or {}), json.dumps(parameters or {})),
                fetch=True,
                commit=True
            )
            if rows:
                return str(rows[0][0])
            raise DatabaseConnectionError("Failed to retrieve generated model ID.")
        except Exception as e:
            logger.error(f"Failed to register model {model_name}: {str(e)}")
            raise DatabaseConnectionError(f"Model registration failed: {str(e)}") from e

    def promote_model(self, model_name: str, version: str):
        conn = None
        cur = None
        try:
            conn = db_manager.get_connection()
            cur = conn.cursor()
            
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
            if conn:
                conn.rollback()
            logger.error(f"Failed to promote model {model_name} version {version}: {str(e)}")
            raise DatabaseConnectionError(f"Model promotion failed: {str(e)}") from e
        finally:
            if cur:
                cur.close()
            if conn:
                db_manager.release_connection(conn)

    def get_production_model(self, model_name: str) -> Dict[str, Any]:
        query = """
            SELECT model_id, model_name, version, artifact_path, metrics, parameters, created_at
            FROM ml_model_registry 
            WHERE model_name = %s AND status = 'PRODUCTION'
            ORDER BY created_at DESC LIMIT 1;
        """
        try:
            rows = db_manager.execute_query(query, (model_name,), fetch=True)
            if not rows:
                return None
                
            row = rows[0]
            return {
                "model_id": str(row[0]),
                "model_name": row[1],
                "version": row[2],
                "artifact_path": row[3],
                "metrics": row[4],
                "parameters": row[5],
                "created_at": row[6].isoformat()
            }
        except Exception as e:
            logger.error(f"Failed to get production model {model_name}: {str(e)}")
            return None
