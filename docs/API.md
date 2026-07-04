# API Documentation

## TanStack Server Functions
All frontend-facing APIs are implemented as TanStack `createServerFn` inside `src/api/`.
- `getActivities()`
- `getAlerts()`
- `getInvestigations()`

## FastAPI Forecasting Service
- `POST /forecast/lstm`
- `POST /forecast/prophet`
- `POST /forecast/arima`
- `POST /forecast/ensemble`
