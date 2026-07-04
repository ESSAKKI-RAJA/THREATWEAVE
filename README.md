# THREATWEAVE Enterprise

A multi‑tenant cyber risk intelligence platform.

## Features

### Day 1 Features

- Live NVD Integration
- Scalable supply‑chain analytics
- Forecasting microservice scaffold (ARIMA)
- Threat‑feed connectors (interfaces)
- Modular frontend dashboard

### Day 2 Features

- Live Threat Feeds & Reputation Scoring (AbuseIPDB, GreyNoise, OTX)
- Prophet & LSTM predictive forecasting
- Interactive Supply Chain Graph visualizations
- Supply Chain Depth Analytics
- Live ATT&CK Matrix mapping
- Dockerized deployment

## Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=postgres://...
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Third-party APIs (Optional - defaults to graceful degradation if missing)
NVD_API_KEY=...
ABUSEIPDB_API_KEY=...
GREYNOISE_API_KEY=...
OTX_API_KEY=...
GITHUB_TOKEN=...
VIRUSTOTAL_API_KEY=...

FORECAST_SERVICE_URL=http://localhost:8000
```

## Running Locally

### Using Docker Compose (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. Run the application stack:
   ```bash
   docker compose up --build
   ```
3. The frontend will be available at `http://localhost:3000` and the forecasting service at `http://localhost:8000`.

### Manual Start

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Navigate to `/forecasting-service` and install python dependencies: `pip install -r requirements.txt`
4. Run the forecasting service: `uvicorn app.main:app --reload`

## Utilities

### Backfill Reputation Data

Query existing IPs and fetch their reputation data:

```bash
npx tsx scripts/backfillReputation.ts
```

### Generate Synthetic History (For LSTM Training)

Generate historical risk data for predictive training:

```bash
python forecasting-service/generate_synthetic_history.py
```
