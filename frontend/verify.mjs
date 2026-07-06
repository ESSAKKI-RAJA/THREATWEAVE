import { chromium } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";
import "dotenv/config";

const artifactDir =
  "C:\\Users\\ESSAKKI RAJA T  EV\\.gemini\\antigravity-ide\\brain\\397937d8-d9e4-41b6-8d46-a1969c8c35b4";

(async () => {
  console.log("Starting Verification Process...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  const takeScreenshot = async (name) => {
    const screenshotPath = path.join(artifactDir, `${name}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot: ${name}.png`);
  };

  try {
    // We assume the dev server is running on http://127.0.0.1:5173
    const baseURL = "http://localhost:5173";

    console.log("Checking login screen...");
    await page.goto(`${baseURL}/login`);
    await page.waitForLoadState("networkidle");
    await takeScreenshot("verification_login_page");

    console.log("Navigating to dashboard...");
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForLoadState("networkidle");
    await takeScreenshot("verification_dashboard");

    // Verify Dashboard Data
    console.log("Checking Alerts...");
    await page.goto(`${baseURL}/alerts`);
    await page.waitForLoadState("networkidle");
    await takeScreenshot("verification_alerts");

    console.log("Checking Investigations...");
    await page.goto(`${baseURL}/investigations`);
    await page.waitForLoadState("networkidle");
    await takeScreenshot("verification_investigations");

    console.log("Checking Threat Intel...");
    await page.goto(`${baseURL}/threats`);
    await page.waitForLoadState("networkidle");
    await takeScreenshot("verification_threat_intel");

    console.log("Checking Remove Monitoring...");
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForLoadState("networkidle");

    // Attempt to delete a vendor (e.g. microsoft.com or whatever is available)
    const menus = await page.getByTestId(/vendor-menu-.*/).all();
    if (menus.length > 0) {
      await menus[0].click();
      await page.getByText("Remove from monitoring").click();
      await page.waitForTimeout(1000);
      await takeScreenshot("verification_after_remove");

      await page.reload();
      await page.waitForLoadState("networkidle");
      await takeScreenshot("verification_after_refresh");
    }

    console.log("Checking Export Report...");
    const exportBtn = page.getByRole("button", { name: /export/i }).first();
    if (await exportBtn.isVisible()) {
      const downloadPromise = page.waitForEvent("download");
      await exportBtn.click();
      const download = await downloadPromise;
      console.log("Exported file: " + download.suggestedFilename());
      await takeScreenshot("verification_export_clicked");
    }

    console.log("Checking for Console Errors...");
    const filteredErrors = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("net::ERR"),
    );
    if (filteredErrors.length > 0) {
      console.error("Console Errors Found:", filteredErrors);
    } else {
      console.log("No critical console/hydration errors found.");
    }
  } catch (err) {
    console.error("Error during verification:", err);
  } finally {
    await browser.close();
    console.log("Verification complete.");
  }
})();
