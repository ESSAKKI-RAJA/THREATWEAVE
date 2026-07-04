# THREATWEAVE Enterprise Architecture

## Overview
THREATWEAVE Enterprise is a modern, high-performance security operations center (SOC) application.

## Tech Stack
- **Frontend**: React 19, TanStack Start, TailwindCSS 4, Zustand
- **Backend (API)**: TanStack Server Functions (RPC) & FastAPI (Forecasting)
- **Database**: PostgreSQL (SQLAlchemy) & Mock JSON DB (for development/testing)
- **Authentication**: Clerk (Live)
- **AI/ML**: TensorFlow (LSTM), Prophet, ARIMA via FastAPI

## Core Principles
1. **Separation of Concerns**: Strict boundary between client logic and server RPC functions.
2. **Type Safety**: End-to-end TypeScript.
3. **Resilience**: Graceful fallbacks for missing external services.
