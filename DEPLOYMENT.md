# THREATWEAVE Deployment Guide

This document outlines the operational topology, deployment process, and troubleshooting guide for THREATWEAVE in a production environment.

## 1. Operational Topology

THREATWEAVE consists of three primary components:

1. **Frontend / Node Backend**: A Tanstack Start application serving the frontend React application and server-side RPC functions.
2. **Forecasting Service**: A Python FastAPI service responsible for executing ARIMA, Prophet, and LSTM ML models using the Feature Store and Model Registry.
3. **Database Layer**: Supabase (PostgreSQL), handling data persistence, Row-Level Security (RLS), and Recursive CTEs for supply chain traversal.

## 2. Environment Setup

### 2.1 Configuration

Copy `.env.example` to `.env` in both the root directory and the `forecasting-service` directory.
Ensure all API keys are populated.

### 2.2 Database Setup

Execute the Supabase migrations using the Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Verify that the `supply_chain_risk_scores` materialized view has been created, and RLS policies are active on the `vendors` table.

## 3. Starting the Services

### 3.1 Node Application

To run the Node application in production mode:

```bash
npm ci
npm run build
NODE_ENV=production npm run start
```

This will start the Tanstack Start server on `$PORT` (default 3000). The internal scheduler will automatically start if `ENABLE_BACKGROUND_SCHEDULER=true`.

### 3.2 Forecasting Service

The Python service uses Uvicorn and FastAPI.

```bash
cd forecasting-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 4. End-to-End Workflow Testing

To verify the system is fully operational, use the `demo-workflow.ts` script. This script orchestrates an onboarding, triggers intelligence ingestion, traverses the supply chain graph, and generates an ML forecast.

```bash
npx tsx scripts/demo-workflow.ts
```

## 5. Troubleshooting & Observability

### Logging

- Node logs are emitted via `src/lib/logger.ts` in JSON format when `NODE_ENV=production`.
- Monitor for `level: "ERROR"` logs, especially those with `job: "nvd_sync"` or `job: "intelligence_ingestion"`.

### Common Issues

- **Graph Traversal Timeouts**: Ensure `max_depth` limits in Supabase recursive CTEs are enforced. Check if the `get_downstream_vendors` index `idx_vendor_dependencies` exists.
- **Forecasting 502**: Ensure the `FORECASTING_API_URL` environment variable in the Node app accurately points to the Uvicorn port.

## 6. Security Hardening Check

- **API Endpoints**: Input parameters (like IP addresses and domains) are strictly validated via Zod.
- **Secrets Management**: Do not commit `.env`. Ensure API keys (OpenAI, OSINT) are stored securely in AWS Secrets Manager or Vercel Environment Variables.
