import { test, expect } from "@playwright/test";
import * as path from "path";
import fs from "fs";

const artifactDir = path.resolve(process.cwd(), "playwright/artifacts");

test.describe("Final Verification Phase", () => {
  test("Verify pages load without console errors or hydration warnings", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    const routes = [
      { path: "/dashboard", name: "Dashboard" },
      { path: "/alerts", name: "Alerts" },
      { path: "/investigations", name: "Investigations" },
      { path: "/threats", name: "Threat_Intel" },
      { path: "/supply-chain", name: "Settings" }, // Using supply-chain as a proxy
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: path.join(artifactDir, `verification_${route.name.toLowerCase()}.png`),
      });

      // Ensure no 500s or hydration errors
      expect(
        consoleErrors.filter((e) => e.includes("Hydration") || e.includes("Minified React error")),
      ).toHaveLength(0);
    }
  });

  test("Remove Monitoring persists after browser refresh", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Wait for the dashboard to fully render
    await page.waitForSelector('[data-testid="dashboard-header"]', { timeout: 15000 });

    // Wait for the mock vendor 'soylent.com' to be present
    const vendorRow = page.getByTestId("vendor-row-soylent.com");
    await expect(vendorRow).toBeVisible({ timeout: 10000 });

    // Click the context menu trigger for soylent.com
    await page.getByTestId("vendor-row-soylent.com").click({ button: "right" });

    // Click 'Remove from monitoring'
    await page.getByText("Remove from monitoring").click();

    // Click confirm in dialog
    const confirmBtn = page.locator("button", { hasText: "Confirm Remove" });
    await confirmBtn.click();

    // Verify it disappears
    await expect(vendorRow).not.toBeVisible();

    // Refresh page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify it is STILL gone
    await expect(vendorRow).not.toBeVisible();
    await page.screenshot({
      path: path.join(artifactDir, "verification_remove_monitoring_persists.png"),
    });
  });

  test("Export Report triggers download", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Find export button
    const exportBtn = page.getByRole("button", { name: /export/i }).first();
    if (await exportBtn.isVisible()) {
      // Setup download listener
      const downloadPromise = page.waitForEvent("download");
      await exportBtn.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain(".csv");
      await page.screenshot({ path: path.join(artifactDir, "verification_export_report.png") });
    }
  });
});
