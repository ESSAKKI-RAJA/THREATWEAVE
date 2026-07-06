# Changelog

All notable changes to THREATWEAVE are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Global command palette (CTRL+K) with fuzzy vendor search
- Notification center with real-time severity-grouped alerts
- MITRE ATT&CK technique heatmap on Mission Control dashboard
- Investigation case management redesign (timeline view)

### Changed
- Dashboard KPI cards redesigned with live trend sparklines
- Settings console redesigned as full Enterprise Control Center with vertical tab navigation

---

## [2.0.0] — 2026-07-06

### Added
- **Enterprise Landing Page** — Hero section, feature cards, customer logo strip, and CTA
- **Workspace Onboarding Wizard** — Multi-step organization setup flow (Create Org → Invite Team → Provision)
- **Sign-Up Route** — `/sign-up` with branded Clerk SignUp → redirects to onboarding
- **Settings Console Redesign** — Defender-inspired dark sidebar with Organization, Security, and Integrations tabs
- **Supply Chain Graph** — Interactive Nth-party dependency visualization using @xyflow/react
- **AI Narrative Generation** — CISO-ready automated risk briefings via OpenAI integration
- **Risk Forecasting Backend** — Python FastAPI service with ARIMA, Prophet, and LSTM time-series models
- **OSINT Connector Architecture** — Pluggable base connector with rate limiting, circuit breaking, and health checks
- **Vercel Deployment** — `vercel.json` at repo root correctly routes monorepo frontend build
- **Route Tree** — `/sign-up` and `/_authenticated/onboarding` registered in `routeTree.gen.ts`
- **Production Auth Hardening** — `BYPASS_AUTH` blocked when `NODE_ENV=production`

### Changed
- Upgraded TanStack Router to 1.168.25
- Upgraded TanStack Start to 1.167.50
- Upgraded Nitro to 3.0.260603-beta (vercel preset)
- Upgraded React to 19.2.0
- Settings form submission updated to use unified `handleSave()` mutation

### Fixed
- 404 on Vercel: Missing `vercel.json` now correctly points to `frontend/.vercel/output`
- TypeScript errors for new routes: `routeTree.gen.ts` manually updated with new route registrations
- `BYPASS_AUTH` production security regression

### Security
- Auth bypass (`BYPASS_AUTH`) now enforced as non-production only via `NODE_ENV !== 'production'` check
- `.vercel/output/` added to `.gitignore` — pre-built artifacts no longer committed to version control

---

## [1.0.0] — 2026-06-01

### Added
- Initial release of THREATWEAVE platform
- Executive dashboard with vendor risk table and virtualized rendering
- Vendor detail page with OSINT signal breakdown
- Alert management system
- Investigations case management
- Threat intelligence feed browser
- Basic supply chain graph
- Clerk authentication integration
- Supabase (PostgreSQL) database with RLS
- Shodan, VirusTotal, crt.sh, AbuseIPDB, GreyNoise, OTX connectors
- Docker + Docker Compose support
- Render.com deployment manifest
- Playwright E2E test suite
- Vitest unit tests

---

[Unreleased]: https://github.com/ESSAKKI-RAJA/THREATWEAVE/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/ESSAKKI-RAJA/THREATWEAVE/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/ESSAKKI-RAJA/THREATWEAVE/releases/tag/v1.0.0
