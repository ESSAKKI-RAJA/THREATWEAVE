const { chromium } = require("@playwright/test");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
  page.on("response", (response) => console.log("RESPONSE:", response.url(), response.status()));

  console.log("Navigating to dashboard...");
  await page.goto("http://localhost:4173/dashboard");

  console.log("Current URL after goto:", page.url());
  await page.waitForTimeout(3000);
  console.log("Current URL after wait:", page.url());

  const email = process.env.E2E_TEST_EMAIL || "mock@clerk.dev";
  const password = process.env.E2E_TEST_PASSWORD || "password";

  const url = page.url();
  if (url.includes("sign-in") || url.includes("login") || url.includes("auth")) {
    console.log("Filling auth form...");
    const emailInput = page.locator('input[type="email"], input[name="identifier"]');
    await emailInput.waitFor({ state: "visible", timeout: 5000 });
    await emailInput.fill(email);

    const continueBtn = page.locator('button:has-text("Continue"), button[type="submit"]');
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    }

    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await passwordInput.waitFor({ state: "visible", timeout: 5000 });
    await passwordInput.fill(password);

    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    } else {
      await passwordInput.press("Enter");
    }

    console.log("Waiting for dashboard redirect...");
    try {
      await page.waitForURL(/.*dashboard/, { timeout: 10000 });
      console.log("Redirected to dashboard!");
    } catch (e) {
      console.log("Timeout waiting for dashboard");
    }
  }

  const state = await page.context().storageState();
  console.log("Storage state:");
  console.log(JSON.stringify(state, null, 2));

  await browser.close();
})();
