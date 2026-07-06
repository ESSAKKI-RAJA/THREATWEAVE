# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 2.x (current) | ✅ Active security support |
| 1.x | ⚠️ Critical patches only |
| < 1.0 | ❌ No longer supported |

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

Security vulnerabilities in THREATWEAVE — especially those relating to authentication bypass, data exfiltration, or supply chain integrity — must be reported privately to give us time to patch before public disclosure.

### How to Report

**Preferred:** Use GitHub's private vulnerability reporting:
1. Go to the [Security tab](https://github.com/ESSAKKI-RAJA/THREATWEAVE/security/advisories/new) of this repository
2. Click **"Report a vulnerability"**
3. Fill in the vulnerability details

**Alternative:** Email the maintainer directly:
- Contact via GitHub profile: [@ESSAKKI-RAJA](https://github.com/ESSAKKI-RAJA)
- Subject line format: `[SECURITY] <brief description>`

### What to Include in Your Report

To help us triage quickly, include:

- **Type of vulnerability** — e.g., Auth bypass, XSS, SSRF, SQL injection, information disclosure
- **Affected component** — e.g., `auth-middleware.ts`, OSINT connector, backend API
- **CVSS score estimate** (if known)
- **Steps to reproduce** — a minimal, reproducible example
- **Proof of concept** — screenshots, HTTP request/response logs, or code
- **Suggested fix** (optional but appreciated)

---

## Disclosure Timeline

| Timeline | Action |
|---|---|
| Day 0 | Vulnerability report received |
| Day 1–2 | Initial acknowledgment sent to reporter |
| Day 3–7 | Triage, severity assessment, and patch development |
| Day 7–14 | Patch deployed to production |
| Day 14–21 | CVE/advisory published (if applicable), reporter credited |
| Day 90 | Maximum embargo period — public disclosure regardless |

We follow **coordinated vulnerability disclosure (CVD)**. Reporters who follow this process in good faith will be acknowledged in the security advisory.

---

## Security Architecture

### Authentication
- All user authentication is handled by **Clerk** — a SOC 2 Type II certified authentication provider
- Clerk JWTs are verified server-side using RS256 via `@clerk/backend`'s `verifyToken()` on every protected server function call
- `BYPASS_AUTH` is **hard-blocked in `NODE_ENV=production`** — it cannot be enabled in a deployed environment

### Authorization
- **Supabase Row-Level Security (RLS)** enforces data isolation at the database level
- All database queries are scoped to the authenticated user's organization
- Service role keys (`SUPABASE_SERVICE_ROLE_KEY`) are never exposed to client-side JavaScript

### Secrets Management
- No secrets are hardcoded in source code
- `VITE_*` prefixed variables are client-side safe (anon/public keys only)
- Server secrets (`CLERK_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are only accessible within Nitro server functions
- Environment variables are validated at startup — missing required secrets cause an explicit startup failure

### OSINT Connector Security
- All external OSINT API calls are made from **server-side server functions** only — never from the browser
- API keys are stored in server-only environment variables
- Rate limiting and circuit breaking prevent abuse of external APIs

### Known Security Decisions

| Decision | Rationale |
|---|---|
| Anon key in `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon keys are intentionally public — RLS enforces access control |
| `BYPASS_AUTH=true` in test environment | Standard test infrastructure — blocked in production via `NODE_ENV` check |

---

## Responsible Disclosure Policy

We ask security researchers to:
1. Give us a reasonable amount of time to fix the issue before public disclosure
2. Not access or modify user data that doesn't belong to you
3. Not perform denial-of-service attacks
4. Not use social engineering, phishing, or physical security attacks

In return, we commit to:
1. Respond to your report within 48 hours
2. Keep you informed of our progress
3. Credit you in the security advisory (unless you prefer to remain anonymous)
4. Not pursue legal action against researchers who follow this policy in good faith

---

## PGP Key

For encrypted communication, a PGP key will be published here upon first security advisory. Until then, please use GitHub's private vulnerability reporting or direct contact via GitHub profile.

---

*This security policy follows industry standards established by Google Project Zero, HackerOne, and CERT/CC coordinated vulnerability disclosure guidelines.*
