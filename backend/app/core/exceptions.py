class ThreatWeaveError(Exception):
    """Base exception for all ThreatWeave forecasting service errors."""
    pass

class ConfigurationError(ThreatWeaveError):
    """Raised when environment configuration is missing or invalid."""
    pass

class DatabaseConnectionError(ThreatWeaveError):
    """Raised when the database connection fails after retries."""
    pass

class StartupInitializationError(ThreatWeaveError):
    """Raised when service startup sequence fails."""
    pass

class EnvironmentValidationError(ThreatWeaveError):
    """Raised when environment validation fails."""
    pass
