import time
import logging
import threading
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from app.core.config import get_settings
from app.core.exceptions import DatabaseConnectionError

logger = logging.getLogger(__name__)

class DatabaseManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(DatabaseManager, cls).__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.pool = None
        self._initialized = True

    def initialize_pool(self, min_conn: int = 1, max_conn: int = 20, retries: int = 5, backoff: float = 2.0):
        """Initializes the connection pool with retry logic."""
        settings = get_settings()
        db_url = settings.DATABASE_URL

        if not db_url:
            logger.warning("DATABASE_URL is not configured. Database connection pool will not be initialized. Operating in degraded/offline mode.")
            self.pool = None
            return

        # Determine SSL mode. In production (e.g. Render, Supabase), require sslmode=require if not specified
        if settings.ENV.upper() != "LOCAL" and "sslmode" not in db_url:
            separator = "&" if "?" in db_url else "?"
            db_url = f"{db_url}{separator}sslmode=require"

        logger.info(f"Initializing connection pool for environment: {settings.ENV}")
        
        for attempt in range(1, retries + 1):
            try:
                self.pool = ThreadedConnectionPool(
                    minconn=min_conn,
                    maxconn=max_conn,
                    dsn=db_url
                )
                logger.info("Database connection pool initialized successfully.")
                
                # Test connection
                conn = self.get_connection()
                self.release_connection(conn)
                return
            except Exception as e:
                wait_time = backoff ** attempt
                logger.warning(
                    f"Database connection attempt {attempt}/{retries} failed: {str(e)}. "
                    f"Retrying in {wait_time:.1f}s..."
                )
                if attempt == retries:
                    logger.error("Could not connect to database after all retries.")
                    # Keep pool as None so the server stays alive but fails queries gracefully
                    self.pool = None
                else:
                    time.sleep(wait_time)

    def get_connection(self):
        """Gets a connection from the pool, with automatic reconnect retry if pool is empty/uninitialized."""
        if not self.pool:
            logger.warning("Connection pool not initialized. Attempting lazy initialization...")
            self.initialize_pool(retries=3)
            if not self.pool:
                raise DatabaseConnectionError("Database connection pool is unavailable.")
        
        try:
            return self.pool.getconn()
        except Exception as e:
            raise DatabaseConnectionError(f"Failed to retrieve connection from pool: {str(e)}") from e

    def release_connection(self, conn):
        """Releases a connection back to the pool."""
        if self.pool and conn:
            try:
                self.pool.putconn(conn)
            except Exception as e:
                logger.error(f"Failed to release connection back to pool: {str(e)}")

    def close_all(self):
        """Closes all connections in the pool on shutdown."""
        if self.pool:
            logger.info("Closing all database connections in the pool...")
            try:
                self.pool.closeall()
                logger.info("Database connection pool closed.")
            except Exception as e:
                logger.error(f"Error closing database pool: {str(e)}")
            finally:
                self.pool = None

    def execute_query(self, query: str, params: tuple = None, fetch: bool = False, commit: bool = False):
        """Helper to execute a query safely using a pooled connection with auto-rollback on error."""
        conn = None
        cur = None
        try:
            conn = self.get_connection()
            cur = conn.cursor()
            cur.execute(query, params)
            
            result = None
            if fetch:
                result = cur.fetchall()
            
            if commit:
                conn.commit()
                
            return result
        except Exception as e:
            if conn:
                try:
                    conn.rollback()
                except Exception as rollback_err:
                    logger.error(f"Failed to rollback transaction: {str(rollback_err)}")
            raise DatabaseConnectionError(f"Database query execution failed: {str(e)}") from e
        finally:
            if cur:
                cur.close()
            if conn:
                self.release_connection(conn)

db_manager = DatabaseManager()
