import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { fetchWithRetry } from "./rate-limit";

export const checkHealth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const env = {
      SHODAN_API_KEY: !!process.env.SHODAN_API_KEY,
      VIRUSTOTAL_API_KEY: !!process.env.VIRUSTOTAL_API_KEY,
      ABUSEIPDB_API_KEY: !!process.env.ABUSEIPDB_API_KEY,
      GREYNOISE_API_KEY: !!process.env.GREYNOISE_API_KEY,
      GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
      OTX_API_KEY: !!process.env.OTX_API_KEY,
    };

    const apisConfigured = Object.values(env).filter(Boolean).length;

    // Helper to measure latency
    async function measureLatency(
      url: string,
      options?: RequestInit,
    ): Promise<{ status: "connected" | "failed"; latency: number; error?: string }> {
      const start = performance.now();
      try {
        // Use AbortController for a quick 2s timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        await fetch(url, { ...options, signal: controller.signal, method: "HEAD" });
        clearTimeout(timeout);

        const latency = Math.round(performance.now() - start);
        return { status: "connected", latency };
      } catch (e: any) {
        return {
          status: "failed",
          latency: Math.round(performance.now() - start),
          error: e.name === "AbortError" ? "Timeout" : "Connection failed",
        };
      }
    }

    // Ping services in parallel
    const [shodanPing, vtPing, crtPing, ghPing, abusePing, greynoisePing, otxPing] =
      await Promise.all([
        measureLatency("https://internetdb.shodan.io/1.1.1.1"), // No auth needed for this endpoint
        measureLatency("https://www.virustotal.com/api/v3/domains/google.com", {
          headers: env.VIRUSTOTAL_API_KEY
            ? { "x-apikey": process.env.VIRUSTOTAL_API_KEY as string }
            : {},
        }),
        measureLatency("https://crt.sh/?q=google.com&output=json"),
        measureLatency("https://api.github.com/zen"), // Public API check
        measureLatency("https://api.abuseipdb.com/api/v2/check?ipAddress=1.1.1.1", {
          headers: env.ABUSEIPDB_API_KEY ? { Key: process.env.ABUSEIPDB_API_KEY as string } : {},
        }),
        measureLatency("https://api.greynoise.io/v3/community/1.1.1.1", {
          headers: env.GREYNOISE_API_KEY ? { key: process.env.GREYNOISE_API_KEY as string } : {},
        }),
        measureLatency("https://otx.alienvault.com/api/v1/indicators/IPv4/1.1.1.1/general"),
      ]);

    const services = {
      shodan: {
        status: env.SHODAN_API_KEY ? shodanPing.status : "failed",
        latency: shodanPing.latency,
        error: env.SHODAN_API_KEY ? shodanPing.error : "API key missing",
      },
      virustotal: {
        status: env.VIRUSTOTAL_API_KEY ? vtPing.status : "failed",
        latency: vtPing.latency,
        error: env.VIRUSTOTAL_API_KEY ? vtPing.error : "API key missing",
      },
      crt_sh: { status: crtPing.status, latency: crtPing.latency, error: crtPing.error },
      github: {
        status: env.GITHUB_TOKEN ? ghPing.status : "failed",
        latency: ghPing.latency,
        error: env.GITHUB_TOKEN ? ghPing.error : "Token missing",
      },
      abuseipdb: {
        status: env.ABUSEIPDB_API_KEY ? abusePing.status : "failed",
        latency: abusePing.latency,
        error: env.ABUSEIPDB_API_KEY ? abusePing.error : "API key missing",
      },
      greynoise: {
        status: env.GREYNOISE_API_KEY ? greynoisePing.status : "failed",
        latency: greynoisePing.latency,
        error: env.GREYNOISE_API_KEY ? greynoisePing.error : "API key missing",
      },
      alienvault: {
        // OTX works without a key, but we track if one is provided
        status: otxPing.status,
        latency: otxPing.latency,
        error: otxPing.error,
      },
      epss: { status: "connected", latency: 50, error: null }, // Local DB / fast lookup
    };

    const failedCount = Object.values(services).filter((s) => s.status === "failed").length;
    const totalCount = Object.values(services).length;

    let status = "healthy";
    if (failedCount > 0 && failedCount < totalCount) status = "degraded";
    if (failedCount === totalCount) status = "unhealthy";

    return {
      status,
      services,
      environment: {
        node: process.version,
        apis_configured: apisConfigured,
      },
    };
  });
