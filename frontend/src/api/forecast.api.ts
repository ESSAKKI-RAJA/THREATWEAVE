import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getForecast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ vendorId: z.string(), periods: z.number().optional().default(30) }))
  .handler(async ({ data }) => {
    try {
      const forecastUrl = process.env.FORECAST_SERVICE_URL || "http://localhost:8000";
      const res = await fetch(`${forecastUrl}/forecast/arima`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor_id: data.vendorId, periods: data.periods }),
      });
      if (!res.ok) throw new Error("Forecast service unavailable");
      return await res.json();
    } catch (e) {
      return null;
    }
  });

export const getVendorThreatFeeds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ vendorId: z.string() }))
  .handler(async ({ data, context }) => {
    // Stub implementation for compilation. In a real app, this would hit the DB or external APIs.
    return {
      abuseipdb: { maliciousIps: 0 },
      greynoise: { classification: "benign" },
      otx: { pulseCount: 0 },
    };
  });
