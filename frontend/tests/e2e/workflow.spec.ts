import { test, expect } from "@playwright/test";

test.describe("THREATWEAVE E2E Workflow", () => {
  test("Completes Vendor Onboarding and views intelligence dashboard", async ({ page }) => {
    // Navigate to application
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByTestId("dashboard-header")).toBeVisible();

    // The user clicks on the first vendor in the grid
    // Wait for the actual vendors to load by waiting for a specific vendor name or checking that 'Fetching perimeter status' is gone.
    await expect(page.locator("text=Fetching perimeter status")).not.toBeVisible({
      timeout: 15000,
    });

    // We expect the mock vendor 'acme.com' to be present
    const vendorRow = page.getByTestId("vendor-row-acme.com");
    await expect(vendorRow).toBeVisible();
    await vendorRow.click();

    // Verify Vendor Details view loaded
    await expect(page).toHaveURL(/.*vendors\/.+/);

    // Verify Skeleton unloads and intelligence is displayed
    await expect(page.locator("text=Back to Intelligence Dashboard")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator("text=Risk Details")).toBeVisible();
    await expect(page.locator("text=Supply Chain Cascade")).toBeVisible();
  });
});
