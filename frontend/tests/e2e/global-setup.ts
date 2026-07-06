import { chromium, FullConfig, Browser, Page, BrowserContext } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";
import "dotenv/config";

// --- Configuration ---
const ARTIFACTS_DIR = path.resolve(process.cwd(), "playwright/artifacts/auth");
const STORAGE_STATE_PATH = path.resolve(process.cwd(), "playwright/.auth/user.json");

// --- Interfaces ---
interface NetworkRequestRecord {
  method: string;
  url: string;
  status: number | null;
  durationMs: number | null;
  headers: Record<string, string> | null;
}

interface ReportData {
  environment: string;
  browserVersion: string;
  nodeVersion: string;
  playwrightVersion: string;
  authMethod: string;
  storageStatePath: string;
  executionTimeMs: number;
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  warnings: string[];
  redirects: string[];
  sessionCreated: boolean;
  sessionRestored: boolean;
  storageSaved: boolean;
  finalUrl: string;
  status: "PASS" | "FAIL";
  failureReason?: string;
}

// --- Globals for Observability ---
const networkRecords: NetworkRequestRecord[] = [];
const reportData: ReportData = {
  environment: process.env.NODE_ENV || "development",
  browserVersion: "Chromium",
  nodeVersion: process.version,
  playwrightVersion: "unknown",
  authMethod: process.env.VITE_BYPASS_AUTH === "true" ? "BYPASS" : "CLERK",
  storageStatePath: STORAGE_STATE_PATH,
  executionTimeMs: 0,
  consoleErrors: [],
  pageErrors: [],
  failedRequests: [],
  warnings: [],
  redirects: [],
  sessionCreated: false,
  sessionRestored: false,
  storageSaved: false,
  finalUrl: "",
  status: "FAIL",
};

// --- Utilities ---
function ensureDirectories() {
  if (!fs.existsSync(ARTIFACTS_DIR)) fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  const storageDir = path.dirname(STORAGE_STATE_PATH);
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
}

async function captureScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(ARTIFACTS_DIR, `${name}-${timestamp}.png`);
  await page.screenshot({ path: filePath, fullPage: true }).catch(() => {});
}

// --- Observability Attachments ---
function attachConsoleLogger(page: Page) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      reportData.consoleErrors.push(msg.text());
    } else if (msg.type() === "warning") {
      reportData.warnings.push(msg.text());
    }
  });
}

function attachPageErrorLogger(page: Page) {
  page.on("pageerror", (error) => {
    reportData.pageErrors.push(error.message);
  });
}

function attachNetworkLogger(page: Page) {
  page.on("requestfailed", (request) => {
    reportData.failedRequests.push(
      `${request.method()} ${request.url()} - ${request.failure()?.errorText || "Unknown error"}`,
    );
  });

  page.on("response", (response) => {
    const req = response.request();
    const isRedirect = response.status() >= 300 && response.status() < 400;
    if (isRedirect) {
      reportData.redirects.push(`${req.url()} -> ${response.headers()["location"] || "unknown"}`);
    }

    networkRecords.push({
      method: req.method(),
      url: req.url(),
      status: response.status(),
      durationMs: null,
      headers: response.headers(),
    });
  });
}

// --- Auth Flows ---
function restoreStorageState(): boolean {
  if (fs.existsSync(STORAGE_STATE_PATH)) {
    try {
      const state = JSON.parse(fs.readFileSync(STORAGE_STATE_PATH, "utf8"));
      if (state && state.cookies && state.cookies.length > 0) {
        return true;
      }
    } catch (e) {
      console.log("Failed to parse storage state.");
    }
  }
  return false;
}

async function verifyAuthentication(page: Page, baseURL: string): Promise<boolean> {
  await page.goto(`${baseURL}/dashboard`);
  try {
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Check if Clerk Avatar is present (indicates successful auth)
    const avatar = page.locator(".cl-userButtonAvatarBox");
    if (await avatar.isVisible({ timeout: 5000 }).catch(() => false)) {
      return true;
    }

    // Enforce strict check: we MUST see the Clerk Avatar.
    return false;

    return false;
  } catch (error) {
    return false;
  }
}

async function handleEmailVerification(page: Page) {
  const verificationInput = page
    .getByLabel(/verification code/i)
    .or(page.getByRole("textbox", { name: /code/i }));
  if (await verificationInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log("Email verification required. Cannot proceed automatically.");
    await captureScreenshot(page, "email-verification-required");
    throw new Error("Email verification is required but not supported by automated script.");
  }
}

async function handleMFA(page: Page) {
  const mfaInput = page
    .getByLabel(/authenticator code/i)
    .or(page.getByRole("textbox", { name: /authenticator/i }));
  if (await mfaInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log("MFA required. Cannot proceed automatically.");
    await captureScreenshot(page, "mfa-required");
    throw new Error("MFA is required but not supported by automated script.");
  }
}

async function loginIfNeeded(page: Page, baseURL: string) {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error("E2E_TEST_EMAIL and E2E_TEST_PASSWORD environment variables are missing.");
  }

  await page.goto(`${baseURL}/login`);
  await captureScreenshot(page, "login-page");

  // Email Step
  const emailInput = page
    .getByLabel(/email address/i)
    .or(page.getByRole("textbox", { name: /email/i }))
    .or(page.locator('input[type="email"]'))
    .first();
  await emailInput.waitFor({ state: "visible", timeout: 10000 });
  await emailInput.fill(email);
  await captureScreenshot(page, "login-email-filled");

  const continueBtn = page
    .getByRole("button", { name: /continue/i })
    .or(page.locator(".cl-formButtonPrimary"));
  if (await continueBtn.isVisible().catch(() => false)) {
    await continueBtn.click();
  } else {
    await emailInput.press("Enter");
  }

  // Password Step
  const passwordInput = page
    .getByLabel(/password/i)
    .or(page.locator('input[type="password"]'))
    .first();
  await passwordInput.waitFor({ state: "visible", timeout: 10000 });
  await passwordInput.fill(password);
  await captureScreenshot(page, "login-password-filled");

  const signInBtn = page
    .getByRole("button", { name: /sign in/i })
    .or(page.getByRole("button", { name: /continue/i }))
    .or(page.locator(".cl-formButtonPrimary"));
  if (await signInBtn.isVisible().catch(() => false)) {
    await signInBtn.click();
  } else {
    await passwordInput.press("Enter");
  }

  // Handle possible next steps (dashboard, verification, mfa)
  await Promise.race([
    page.waitForURL(/.*dashboard.*/, { timeout: 20000 }).catch(() => null),
    page.waitForSelector(".cl-verificationCodeInput", { timeout: 20000 }).catch(() => null),
    page.waitForSelector(".cl-otpInput", { timeout: 20000 }).catch(() => null),
  ]);

  await handleEmailVerification(page);
  await handleMFA(page);

  // Final confirmation
  await page.waitForURL(/.*dashboard.*/, { timeout: 15000 });
  await captureScreenshot(page, "dashboard");
  reportData.sessionCreated = true;
}

// --- Reporting ---
function generateAuthenticationReport() {
  const reportPath = path.join(ARTIFACTS_DIR, "authentication-report.md");
  const networkPath = path.join(ARTIFACTS_DIR, "authentication-network.json");

  fs.writeFileSync(networkPath, JSON.stringify(networkRecords, null, 2), "utf8");

  const md = `
# Authentication Report
- **Environment:** ${reportData.environment}
- **Browser:** ${reportData.browserVersion}
- **Node Version:** ${reportData.nodeVersion}
- **Playwright Version:** ${reportData.playwrightVersion}
- **Authentication Method:** ${reportData.authMethod}
- **Storage State Path:** ${reportData.storageStatePath}
- **Execution Time:** ${reportData.executionTimeMs}ms
- **Final URL:** ${reportData.finalUrl}
- **Session Created:** ${reportData.sessionCreated}
- **Session Restored:** ${reportData.sessionRestored}
- **Storage Saved:** ${reportData.storageSaved}
- **Status:** ${reportData.status}

## Summary
${reportData.failureReason ? "**Failure Reason:** " + reportData.failureReason : "Successfully authenticated."}

## Telemetry
- **Console Errors:** ${reportData.consoleErrors.length}
- **Page Errors:** ${reportData.pageErrors.length}
- **Failed Requests:** ${reportData.failedRequests.length}
- **Warnings:** ${reportData.warnings.length}
- **Redirects:** ${reportData.redirects.length}

### Console Errors
\`\`\`
${reportData.consoleErrors.join("\\n") || "None"}
\`\`\`

### Page Errors
\`\`\`
${reportData.pageErrors.join("\\n") || "None"}
\`\`\`
  `.trim();

  fs.writeFileSync(reportPath, md, "utf8");
}

// --- Main orchestrator ---
async function globalSetup(config: FullConfig) {
  const startTime = Date.now();
  ensureDirectories();

  // Playwright version omitted to satisfy linter, defaults to unknown
  const { baseURL } = config.projects[0].use;
  if (!baseURL) throw new Error("baseURL is not defined in Playwright config.");

  let browser: Browser | null = null;
  let page: Page | null = null;
  let context: BrowserContext | null = null;

  try {
    browser = await chromium.launch();
    reportData.browserVersion = browser.version();

    // Check if we can reuse storage state
    restoreStorageState();

    context = await browser.newContext(
      fs.existsSync(STORAGE_STATE_PATH) ? { storageState: STORAGE_STATE_PATH } : {},
    );

    page = await context.newPage();

    attachConsoleLogger(page);
    attachPageErrorLogger(page);
    attachNetworkLogger(page);

    if (process.env.VITE_BYPASS_AUTH === "true") {
      console.log("Bypassing Authentication due to VITE_BYPASS_AUTH=true");
      await page.goto(`${baseURL}/dashboard`);
      await page.waitForURL(/.*dashboard.*/, { timeout: 15000 });
      // Write an empty-but-valid storage state so test workers can load it
      await context.storageState({ path: STORAGE_STATE_PATH });
      reportData.sessionCreated = true;
      reportData.status = "PASS";
      reportData.storageSaved = true;
    } else {
      // Regular Clerk Flow
      const isAuthenticated = fs.existsSync(STORAGE_STATE_PATH)
        ? await verifyAuthentication(page, baseURL)
        : false;

      if (isAuthenticated) {
        console.log("Valid session found. Skipping login.");
        reportData.sessionRestored = true;
        reportData.status = "PASS";
      } else {
        console.log("No valid session found. Proceeding to login.");
        // Clear context if it had an invalid state
        await context.close();
        context = await browser.newContext();
        page = await context.newPage();
        attachConsoleLogger(page);
        attachPageErrorLogger(page);
        attachNetworkLogger(page);

        await loginIfNeeded(page, baseURL);

        // Verify
        const verified = await verifyAuthentication(page, baseURL);
        if (verified) {
          await context.storageState({ path: STORAGE_STATE_PATH });
          reportData.storageSaved = true;
          reportData.status = "PASS";
        } else {
          throw new Error("Authentication verification failed after login flow.");
        }
      }
    }

    reportData.finalUrl = page.url();
  } catch (error: any) {
    reportData.status = "FAIL";
    reportData.failureReason = error.message;
    console.error("Authentication setup failed:", error);

    if (page) {
      await captureScreenshot(page, "auth-failure");
      const htmlPath = path.join(ARTIFACTS_DIR, "auth-failure.html");
      fs.writeFileSync(
        htmlPath,
        await page.content().catch(() => "Could not capture HTML"),
        "utf8",
      );
    }
    throw error;
  } finally {
    reportData.executionTimeMs = Date.now() - startTime;
    generateAuthenticationReport();
    if (browser) {
      await browser.close();
    }
  }
}

export default globalSetup;
