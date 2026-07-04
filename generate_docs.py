import os

docs_dir = "docs"
os.makedirs(docs_dir, exist_ok=True)

docs = {
    "Architecture.md": """# THREATWEAVE Enterprise Architecture\n\n## Overview\nTHREATWEAVE Enterprise is a modern, high-performance security operations center (SOC) application.\n\n## Tech Stack\n- **Frontend**: React 19, TanStack Start, TailwindCSS 4, Zustand\n- **Backend (API)**: TanStack Server Functions (RPC) & FastAPI (Forecasting)\n- **Database**: PostgreSQL (SQLAlchemy) & Mock JSON DB (for development/testing)\n- **Authentication**: Clerk (Live)\n- **AI/ML**: TensorFlow (LSTM), Prophet, ARIMA via FastAPI\n\n## Core Principles\n1. **Separation of Concerns**: Strict boundary between client logic and server RPC functions.\n2. **Type Safety**: End-to-end TypeScript.\n3. **Resilience**: Graceful fallbacks for missing external services.\n""",
    "Security.md": """# Security & Compliance\n\n## Authentication\n- Handled exclusively via **Clerk**.\n- Middleware enforces `requireSupabaseAuth` on all API endpoints.\n\n## Protection Mechanisms\n- **CSP**: Strict Content Security Policy blocking unsafe-eval (except where required by Clerk) and enforcing TLS.\n- **Headers**: HSTS, X-Content-Type-Options, X-Frame-Options configured at the server entry point.\n- **CSRF & XSS**: React handles DOM escaping; API validates inputs.\n\n## OWASP Top 10 Status\n- Validated against common vulnerabilities.\n- No direct SQL execution (ORM used).\n- Rate limiting implemented on critical endpoints.\n""",
    "Authentication.md": """# Authentication\n\n- Provider: Clerk\n- Integration: `@clerk/tanstack-react-start`\n- Middleware: Protects routes and APIs. Redirects unauthenticated users to `/login`.\n- JWT Tokens are verified server-side before processing any TanStack Server Function.\n""",
    "Deployment.md": """# Deployment Guide\n\n## Prerequisites\n- Node.js 20+\n- Python 3.12+\n- Docker & Docker Compose\n- Clerk API Keys\n\n## CI/CD\n- Automated testing via GitHub Actions (Playwright, Vitest).\n- Build command: `npm run build`\n- Deploy target: Vercel or Custom Docker container.\n""",
    "API.md": """# API Documentation\n\n## TanStack Server Functions\nAll frontend-facing APIs are implemented as TanStack `createServerFn` inside `src/api/`.\n- `getActivities()`\n- `getAlerts()`\n- `getInvestigations()`\n\n## FastAPI Forecasting Service\n- `POST /forecast/lstm`\n- `POST /forecast/prophet`\n- `POST /forecast/arima`\n- `POST /forecast/ensemble`\n""",
    "Database.md": """# Database Architecture\n\n- **Primary Store**: PostgreSQL (accessed via SQLAlchemy).\n- **Mock Store**: `mock-db.json` used for local testing and UI validation.\n- **Migrations**: Alembic manages schema changes.\n""",
    "Performance.md": """# Performance\n\n## Targets\n- Dashboard Load: < 1.5s\n- Navigation: < 200ms\n- API latency: < 300ms\n\n## Optimizations\n- TanStack Query used for aggressive caching and stale-while-revalidate.\n- Server-side rendering (SSR) for initial load performance.\n- CSS and JS minification enabled.\n""",
    "AIEngine.md": """# AI Engine\n\nTHREATWEAVE utilizes an ensemble forecasting model for risk prediction.\n- **LSTM**: Captures long-term sequential dependencies.\n- **Prophet**: Handles seasonality and overall trends.\n- **ARIMA**: Handles autoregressive components.\n\nFallback mechanisms ensure 100% uptime even if models fail to load.\n""",
    "Operations.md": """# Operations & Maintenance\n\n- Monitor `forecasting-service` via `/health` endpoint.\n- Logs are aggregated via standard stdout (winston/fastapi logger).\n- Health checks integrated into the deployment pipeline.\n""",
    "Troubleshooting.md": """# Troubleshooting\n\n## Common Issues\n1. **Import Protection Error**: Ensure server logic is in `src/api` and not `src/server`.\n2. **Clerk Auth Loop**: Ensure `VITE_BYPASS_AUTH` is correctly set and keys are valid.\n3. **Forecasting Service Down**: Verify TensorFlow installation and model paths.\n"""
}

for filename, content in docs.items():
    filepath = os.path.join(docs_dir, filename)
    with open(filepath, "w") as f:
        f.write(content)
        print(f"Generated {filepath}")
