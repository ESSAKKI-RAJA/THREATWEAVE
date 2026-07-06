import { test, expect } from "@playwright/test";

test("Debug Vendor Skeleton", async ({ page }) => {
  page.on("console", (msg) => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", (err) => console.log(`[BROWSER ERROR] ${err.name}: ${err.message}`));
  page.on("requestfailed", (request) =>
    console.log(`[NETWORK ERROR] ${request.url()} - ${request.failure()?.errorText}`),
  );

  console.log("Navigating to /vendors/acme.com");
  await page.goto("/vendors/acme.com");

  await page.waitForTimeout(5000);

  console.log("DOM Snapshot:");
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.substring(0, 1000));
});
