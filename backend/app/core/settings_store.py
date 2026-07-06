import logging
import threading
from app.core.database import db_manager
from app.core.exceptions import DatabaseConnectionError, StartupInitializationError

logger = logging.getLogger(__name__)

class SettingsStore:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(SettingsStore, cls).__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True

    def init_db(self):
        """Initializes settings tables."""
        logger.info("Initializing Settings tables...")
        query = """
            CREATE TABLE IF NOT EXISTS organization_settings (
                org_id VARCHAR(255) PRIMARY KEY,
                shodan_api_key VARCHAR(500),
                virustotal_api_key VARCHAR(500),
                greynoise_api_key VARCHAR(500),
                security_strict_ip BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """
        try:
            db_manager.execute_query(query, commit=True)
            logger.info("Settings tables verified/created successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Settings database: {str(e)}")
            raise StartupInitializationError(f"Settings DB init failed: {str(e)}") from e

    def get_settings(self, org_id: str = "default") -> dict:
        query = "SELECT shodan_api_key, virustotal_api_key, greynoise_api_key, security_strict_ip FROM organization_settings WHERE org_id = %s"
        try:
            result = db_manager.execute_query(query, (org_id,), fetch=True)
            if result and len(result) > 0:
                row = result[0]
                return {
                    "shodan": row[0] or "",
                    "virustotal": row[1] or "",
                    "greynoise": row[2] or "",
                    "security_strict_ip": row[3] or False
                }
            return {"shodan": "", "virustotal": "", "greynoise": "", "security_strict_ip": False}
        except Exception as e:
            logger.error(f"Failed to get settings for {org_id}: {str(e)}")
            return {"shodan": "", "virustotal": "", "greynoise": "", "security_strict_ip": False}

    def update_settings(self, org_id: str, shodan: str, virustotal: str, greynoise: str, security_strict_ip: bool = False):
        query = """
            INSERT INTO organization_settings (org_id, shodan_api_key, virustotal_api_key, greynoise_api_key, security_strict_ip)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (org_id) 
            DO UPDATE SET 
                shodan_api_key = EXCLUDED.shodan_api_key,
                virustotal_api_key = EXCLUDED.virustotal_api_key,
                greynoise_api_key = EXCLUDED.greynoise_api_key,
                security_strict_ip = EXCLUDED.security_strict_ip,
                updated_at = CURRENT_TIMESTAMP;
        """
        try:
            db_manager.execute_query(query, (org_id, shodan, virustotal, greynoise, security_strict_ip), commit=True)
        except Exception as e:
            logger.error(f"Failed to update settings for {org_id}: {str(e)}")
            raise DatabaseConnectionError(f"Update settings failed: {str(e)}") from e
