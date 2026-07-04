# Security & Compliance

## Authentication
- Handled exclusively via **Clerk**.
- Middleware enforces `requireSupabaseAuth` on all API endpoints.

## Protection Mechanisms
- **CSP**: Strict Content Security Policy blocking unsafe-eval (except where required by Clerk) and enforcing TLS.
- **Headers**: HSTS, X-Content-Type-Options, X-Frame-Options configured at the server entry point.
- **CSRF & XSS**: React handles DOM escaping; API validates inputs.

## OWASP Top 10 Status
- Validated against common vulnerabilities.
- No direct SQL execution (ORM used).
- Rate limiting implemented on critical endpoints.
