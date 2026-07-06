import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Audits", () => {
  test("Dashboard should not have automatically detectable accessibility violations", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Wait for network idle or main elements
    await page.waitForSelector('[data-testid="dashboard-header"]');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // We expect 0 violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Settings should not have automatically detectable accessibility violations", async ({
    page,
  }) => {
    await page.goto("/settings");
    await page.waitForSelector("text=Enterprise Settings");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
