import { chromium, FullConfig } from "@playwright/test";
import * as path from "path";
import fs from "fs";

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  if (!baseURL) {
    throw new Error("baseURL is not defined in Playwright config.");
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate explicitly to /login to ensure we hit the Clerk sign-in form
  await page.goto(`${baseURL}/login`);

  try {
    await page.waitForSelector('input[type="email"], input[name="identifier"]', { timeout: 10000 });
  } catch (e) {
    console.log("Could not find login form. Proceeding to save state anyway.");
  }

  const url = page.url();
  if (url.includes("sign-in") || url.includes("login") || url.includes("auth")) {
    const email = process.env.E2E_TEST_EMAIL;
    const password = process.env.E2E_TEST_PASSWORD;

    if (!email || !password) {
      throw new Error("E2E_TEST_EMAIL and E2E_TEST_PASSWORD environment variables are missing. Please set them to run authentication tests.");
    }

    console.log(`Authenticating with Clerk as ${email}`);

    // Fill Clerk (or custom) login form
    const emailInput = page.locator('input[type="email"], input[name="identifier"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(email);

    // Depending on the Clerk UI version, there might be a continue button
    const continueBtn = page.locator('.cl-formButtonPrimary');
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    }

    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    await passwordInput.fill(password);

    if (await continueBtn.isVisible()) {
        await continueBtn.click();
    } else {
        await passwordInput.press('Enter');
    }

    // Wait for the redirect back to the app and the dashboard to load
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });
  }

  // Save the authenticated state
  const storageStatePath = path.resolve(process.cwd(), "playwright/.auth/user.json");
  
  // Ensure the directory exists
  const dir = path.dirname(storageStatePath);
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  await page.context().storageState({ path: storageStatePath });
  await browser.close();
}

export default globalSetup;
