import { chromium } from "playwright";
import fs from "fs";
import path from "path";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const artifactDir =
    "C:\\Users\\ESSAKKI RAJA T  EV\\.gemini\\antigravity-ide\\brain\\2804fce5-d53d-465d-a745-4fc813b4be55";

  try {
    console.log("Navigating to dashboard...");
    await page.goto("http://127.0.0.1:8080/dashboard");
    await page.waitForLoadState("networkidle");

    // 1. Cold start threshold: exactly 2 modules
    console.log("Testing 2 modules cold-start...");
    await page.evaluate(() => {
      window.__MOCK_RISK_LOADING = true;
      window.__MOCK_SUPPLY_LOADING = true;
    });
    // Click refresh to trigger a re-render
    await page.evaluate(() => {
      const refreshBtn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("Refresh"),
      );
      if (refreshBtn) refreshBtn.click();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, "screenshot-2-modules-cold.png") });

    // 2. Cold start threshold: exactly 3 modules
    console.log("Testing 3 modules cold-start...");
    await page.evaluate(() => {
      window.__MOCK_FORECAST_LOADING = true;
    });
    await page.evaluate(() => {
      const refreshBtn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("Refresh"),
      );
      if (refreshBtn) refreshBtn.click();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, "screenshot-3-modules-cold.png") });

    // 3. Live transition (back to 2)
    console.log("Testing live transition...");
    await page.evaluate(() => {
      window.__MOCK_FORECAST_LOADING = false;
    });
    await page.evaluate(() => {
      const refreshBtn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("Refresh"),
      );
      if (refreshBtn) refreshBtn.click();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, "screenshot-transition.png") });

    // 4. Error state vs critical
    console.log("Testing error state vs critical...");
    await page.evaluate(() => {
      window.__MOCK_RISK_LOADING = false;
      window.__MOCK_SUPPLY_LOADING = false;
      window.__MOCK_RISK_ERROR = true;
    });
    await page.evaluate(() => {
      const refreshBtn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("Refresh"),
      );
      if (refreshBtn) refreshBtn.click();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, "screenshot-error-vs-critical.png") });

    // 5. Theme toggle
    console.log("Testing theme toggle...");
    await page.evaluate(() => {
      // simulate theme toggle by adding .light class
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, "screenshot-light-theme.png") });

    // 6. Keyboard focus navigation
    console.log("Testing keyboard focus...");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(artifactDir, "screenshot-tab-1.png") });
    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(artifactDir, "screenshot-tab-2.png") });

    console.log("Verification complete.");
  } catch (error) {
    console.error("Verification failed:", error);
  } finally {
    await browser.close();
  }
})();
