import os
import logging
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv
from app.core.exceptions import ConfigurationError, EnvironmentValidationError

# Ensure env vars are loaded from .env
load_dotenv()

class Settings(BaseModel):
    ENV: str = Field(default="LOCAL")
    DATABASE_URL: str = Field(default="")
    PORT: int = Field(default=8000)
    HOST: str = Field(default="0.0.0.0")
    
    SHODAN_API_KEY: Optional[str] = Field(default=None)
    VIRUSTOTAL_API_KEY: Optional[str] = Field(default=None)
    ABUSEIPDB_API_KEY: Optional[str] = Field(default=None)
    GREYNOISE_API_KEY: Optional[str] = Field(default=None)
    OTX_API_KEY: Optional[str] = Field(default=None)

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_database_url(cls, v: Optional[str]) -> str:
        # Fallback to os.getenv if not provided directly in constructor args
        val = v or os.getenv("DATABASE_URL")
        if not val:
            raise ConfigurationError(
                "DATABASE_URL environment variable is missing! A valid PostgreSQL connection URL "
                "is required to start the forecasting service."
            )
        
        # Strip outer quotes if any
        val = val.strip().strip("'").strip('"')
        
        # Check for local fallback in non-local environments
        env = os.getenv("ENV", "LOCAL").upper()
        if env != "LOCAL" and ("localhost" in val or "127.0.0.1" in val or "54322" in val):
            raise ConfigurationError(
                f"Security/Configuration violation: Local database fallback detected in non-local environment (ENV={env}). "
                f"Database URL must point to a production service."
            )
        return val

    @field_validator("PORT", mode="before")
    @classmethod
    def validate_port(cls, v: Optional[str]) -> int:
        val = v or os.getenv("PORT")
        if not val:
            return 8000
        try:
            return int(val)
        except ValueError:
            raise EnvironmentValidationError(f"Invalid PORT value: {val}. Port must be an integer.")

_settings: Optional[Settings] = None

def get_settings() -> Settings:
    global _settings
    if _settings is None:
        try:
            _settings = Settings(
                ENV=os.getenv("ENV", "LOCAL"),
                DATABASE_URL=os.getenv("DATABASE_URL", ""),
                PORT=os.getenv("PORT", "8000"),
                HOST=os.getenv("HOST", "0.0.0.0"),
                SHODAN_API_KEY=os.getenv("SHODAN_API_KEY"),
                VIRUSTOTAL_API_KEY=os.getenv("VIRUSTOTAL_API_KEY"),
                ABUSEIPDB_API_KEY=os.getenv("ABUSEIPDB_API_KEY"),
                GREYNOISE_API_KEY=os.getenv("GREYNOISE_API_KEY"),
                OTX_API_KEY=os.getenv("OTX_API_KEY"),
            )
        except Exception as e:
            logging.error(f"Configuration validation failed: {str(e)}")
            raise ConfigurationError(f"Validation error during settings load: {str(e)}") from e
    return _settings
