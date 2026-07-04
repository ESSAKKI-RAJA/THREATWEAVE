# AI Engine

THREATWEAVE utilizes an ensemble forecasting model for risk prediction.
- **LSTM**: Captures long-term sequential dependencies.
- **Prophet**: Handles seasonality and overall trends.
- **ARIMA**: Handles autoregressive components.

Fallback mechanisms ensure 100% uptime even if models fail to load.
