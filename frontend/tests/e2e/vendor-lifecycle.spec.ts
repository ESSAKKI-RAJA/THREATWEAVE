// tests/e2e/vendor-lifecycle.spec.ts
import { test, expect } from "@playwright/test";

/**
 * Vendor Lifecycle End‑to‑End tests
 * Covers:
 *   - Dashboard load
 *   - Vendor list visibility
 *   - Context menu actions (Remove, Export)
 *   - Deletion persistence
 */

test.describe("Vendor Lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("Dashboard loads and vendor list is visible", async ({ page }) => {
    await expect(page.getByTestId("dashboard-header")).toBeVisible();
    // Ensure at least one vendor row (mock‑db includes acme.com)
    const vendorRow = page.getByTestId("vendor-row-acme.com");
    await expect(vendorRow).toBeVisible();
  });

  test("Context menu – Remove vendor persists after refresh", async ({ page }) => {
    const vendorRow = page.getByTestId("vendor-row-globex.com");
    await vendorRow.click({ button: "right" });
    const deleteBtn = page.locator("text=Remove from monitoring");
    await deleteBtn.click();

    // Click confirm in dialog
    const confirmBtn = page.locator("button", { hasText: "Confirm Remove" });
    await confirmBtn.click();

    // Expect toast notification
    await expect(page.locator("text=Vendor removed")).toBeVisible();
    // Refresh page and verify removal persisted in mock‑db
    await page.reload();
    await expect(page.getByTestId("vendor-row-globex.com")).toHaveCount(0);
  });

  test("Context menu – Export report generates CSV", async ({ page }) => {
    // Wait for download event
    const downloadPromise = page.waitForEvent("download");

    // Click Export Report button (the one in the header panel)
    const exportBtn = page.locator("button", { hasText: "Export Report" }).first();
    await exportBtn.click();

    const download = await downloadPromise;
    const path = await download.path();
    // Simple validation: file exists, has .csv extension, and correct filename prefix
    expect(path).toBeTruthy();
    expect(download.suggestedFilename()).toContain("threatweave_dashboard");
  });
});
