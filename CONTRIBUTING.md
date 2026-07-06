# Contributing to THREATWEAVE

Thank you for your interest in contributing to THREATWEAVE. This document provides the guidelines and workflow for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Review Process](#review-process)

---

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to treat each other with respect and professionalism.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/THREATWEAVE.git
   cd THREATWEAVE
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/ESSAKKI-RAJA/THREATWEAVE.git
   ```
4. **Install dependencies** (see [README.md](README.md#quick-start))
5. **Create a feature branch** (see [Branch Naming](#branch-naming-convention))

---

## Development Workflow

```
upstream/main
      │
      ├─── your-fork/feature/your-feature
      │              │
      │              └─── PR → upstream/main
      │
      └─── your-fork/fix/bug-description
                     │
                     └─── PR → upstream/main
```

1. Always branch from an up-to-date `main`:
   ```bash
   git fetch upstream
   git checkout -b feat/my-feature upstream/main
   ```
2. Make your changes in small, focused commits
3. Ensure all tests pass locally before pushing
4. Open a Pull Request against `upstream/main`

---

## Branch Naming Convention

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<short-description>` | `feat/mitre-heatmap` |
| Bug Fix | `fix/<short-description>` | `fix/vercel-404-routing` |
| Refactor | `refactor/<short-description>` | `refactor/osint-connector-base` |
| Documentation | `docs/<short-description>` | `docs/api-reference` |
| Testing | `test/<short-description>` | `test/vendor-lifecycle-e2e` |
| Chore | `chore/<short-description>` | `chore/update-dependencies` |
| Hotfix | `hotfix/<short-description>` | `hotfix/auth-middleware-prod` |

---

## Commit Message Convention

We use **Conventional Commits** (https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to Use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semi-colons (no logic change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `build` | Changes to build system or dependencies |
| `ci` | Changes to CI/CD configuration |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

### Scopes (optional)

`dashboard`, `vendors`, `alerts`, `investigations`, `settings`, `auth`, `osint`, `forecast`, `graph`, `ui`, `api`, `db`

### Examples

```bash
feat(dashboard): add MITRE ATT&CK technique heatmap
fix(auth): block BYPASS_AUTH in production middleware
perf(vendors): virtualize table rows with TanStack Virtual
docs(api): document /forecast/arima request schema
test(e2e): add vendor lifecycle happy path spec
build(deps): upgrade TanStack Router to 1.168
```

### Breaking Changes

Append `!` after the type/scope and include a `BREAKING CHANGE:` footer:

```
feat(auth)!: require Clerk organization for all authenticated routes

BREAKING CHANGE: Users without a Clerk organization will be redirected to /onboarding
```

---

## Pull Request Process

### Before Opening a PR

Run the full quality suite locally:

```bash
cd frontend

# 1. Type check
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Unit tests
npm test

# 4. Build
npm run build
```

All checks must pass with **zero errors**.

### PR Checklist

When you open a PR, fill in the [PR template](.github/PULL_REQUEST_TEMPLATE.md). Your PR must:

- [ ] Reference the issue it resolves (`Closes #123`)
- [ ] Include a clear description of what changed and why
- [ ] Pass all CI checks (TypeScript, ESLint, tests, build)
- [ ] Include or update tests for new functionality
- [ ] Update documentation if public API or behavior changes
- [ ] Not include unrelated changes (keep PRs focused)
- [ ] Have a meaningful commit history (squash fixup commits before requesting review)

### PR Size Guidelines

| PR Size | Lines Changed | Notes |
|---|---|---|
| Small | < 100 lines | Ideal — reviewed in < 24h |
| Medium | 100–500 lines | Acceptable — include context |
| Large | 500–1000 lines | Break into smaller PRs if possible |
| Extra Large | > 1000 lines | Requires prior discussion in an issue |

---

## Coding Standards

### TypeScript (Frontend)

- **Strict mode** is enabled — no implicit `any`
- Prefer explicit return types on exported functions
- Use `interface` for object shapes, `type` for unions/intersections
- All new files must be `.ts` or `.tsx` — no `.js`
- Import paths use the `@/` alias (configured in `tsconfig.json`)
- Server-only code must only live in TanStack Start `server()` functions or `src/server/`

### React

- Functional components only — no class components
- Hooks follow the `use` prefix convention
- All interactive elements must have accessible `aria-label` attributes
- Avoid prop-drilling more than 2 levels deep — use TanStack Query or context

### Python (Backend)

- Follow **PEP 8** style guide
- Type hints are required on all function signatures
- Use `async def` for all FastAPI route handlers
- Document every endpoint with FastAPI's docstring → Swagger auto-generation

### File Organization

- One component per file for React components
- OSINT connector logic belongs in `src/lib/connectors/`
- Server functions (database access) belong in `src/api/`
- Shared TypeScript types belong in `src/lib/osint-types.ts` or `src/types/`

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| React component | PascalCase | `VendorRiskCard` |
| Hook | camelCase with `use` prefix | `useVendorsList` |
| Server function | camelCase | `getVendorById` |
| CSS class | kebab-case | `risk-score-badge` |
| Env variable | SCREAMING_SNAKE_CASE | `VITE_SUPABASE_URL` |
| File name | kebab-case | `vendor-intelligence.functions.ts` |

---

## Testing Requirements

### New Features

Every new feature must include:
1. **Unit test** if it contains pure logic (risk scoring, data transformation)
2. **E2E test** if it introduces a new user-visible flow

### Bug Fixes

Every bug fix must include a **regression test** that reproduces the original bug and verifies the fix.

### Test File Location

| Type | Location |
|---|---|
| Unit tests | `frontend/src/lib/__tests__/` |
| E2E tests | `frontend/tests/e2e/` |
| Python tests | `backend/tests/` |

### E2E Test Environment

E2E tests run with:
```
VITE_BYPASS_AUTH=true
```
which injects a mock Supabase client. Tests must not depend on live external services.

---

## Review Process

1. All PRs require **at least 1 approval** from a maintainer
2. Maintainers aim to review PRs within **48 business hours**
3. Reviews may request changes — address all comments before re-requesting review
4. Maintainers may commit minor fixups directly to your PR branch (squash merges)
5. PRs are merged using **Squash and Merge** to keep `main` history clean

### Who are the maintainers?

See [AUTHORS](README.md#authors). Tag `@ESSAKKI-RAJA` in your PR for review.

---

## Reporting Issues

Before opening an issue:
1. Search existing issues to avoid duplicates
2. Check the [Troubleshooting](README.md#troubleshooting) section
3. Use the appropriate [issue template](.github/ISSUE_TEMPLATE/)

---

*Thank you for making THREATWEAVE better.*
