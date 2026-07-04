import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    // Only run unit tests; Playwright handles E2E separately via `npm run test:e2e`.
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**", ".output/**", ".vinxi/**"],
  },
});
