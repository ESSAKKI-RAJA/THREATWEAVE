# Troubleshooting

## Common Issues
1. **Import Protection Error**: Ensure server logic is in `src/api` and not `src/server`.
2. **Clerk Auth Loop**: Ensure `VITE_BYPASS_AUTH` is correctly set and keys are valid.
3. **Forecasting Service Down**: Verify TensorFlow installation and model paths.
