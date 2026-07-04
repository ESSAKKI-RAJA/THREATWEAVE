# Database Architecture

- **Primary Store**: PostgreSQL (accessed via SQLAlchemy).
- **Mock Store**: `mock-db.json` used for local testing and UI validation.
- **Migrations**: Alembic manages schema changes.
