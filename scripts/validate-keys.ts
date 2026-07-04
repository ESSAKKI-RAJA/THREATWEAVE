import "dotenv/config"; // Ensure .env is loaded

export async function validateKeys() {
  const osintKeys = {
    SHODAN_API_KEY: process.env.SHODAN_API_KEY,
    VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY,
    ABUSEIPDB_API_KEY: process.env.ABUSEIPDB_API_KEY,
    GREYNOISE_API_KEY: process.env.GREYNOISE_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    OTX_API_KEY: process.env.OTX_API_KEY,
  };

  const clerkKeys = {
    VITE_CLERK_PUBLISHABLE_KEY: process.env.VITE_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  };

  let allValid = true;
  console.log("🔍 Validating Environment Config...");

  console.log("\n🛡️ Clerk Authentication:");
  for (const [key, value] of Object.entries(clerkKeys)) {
    if (
      !value ||
      (value.includes("pk_test_") === false &&
        value.includes("sk_test_") === false &&
        value.length < 20)
    ) {
      console.warn(`⚠️ Missing or invalid: ${key}`);
      allValid = false;
    } else {
      console.log(`✅ ${key} is configured.`);
    }
  }

  console.log("\n🌐 OSINT API Keys:");
  for (const [key, value] of Object.entries(osintKeys)) {
    if (!value || value.includes("your-") || value.length < 10) {
      console.warn(`⚠️ Missing or invalid placeholder: ${key}`);
      allValid = false;
    } else {
      console.log(`✅ ${key} is configured.`);
    }
  }

  console.log("\n");
  if (allValid) {
    console.log("✅ All required API keys are configured correctly.");
  } else {
    console.log("⚠️ Some keys are missing or invalid.");
    console.log("   - OSINT features will use realistic mock data fallbacks.");
    console.log("   - Authentication will fall back to Bypass/Demo mode if Clerk is missing.");
  }

  return allValid;
}

// Run standalone if executed directly
if (process.argv[1] && process.argv[1].endsWith("validate-keys.ts")) {
  validateKeys().catch(console.error);
}
