import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getVendorRiskDetails = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ vendorId: z.string() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;

    const { data: vulnerabilities } = await supabase
      .from("vulnerabilities")
      .select("cve_id, cvss_score, epss_score, known_exploited")
      .eq("asset_id", data.vendorId);

    return { vulnerabilities: vulnerabilities || [] };
  });

export const getSupplyChainRisk = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ vendorId: z.string() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;

    const { data: cascade } = await supabase
      .from("supply_chain_risk_scores")
      .select("*")
      .eq("vendor_id", data.vendorId)
      .maybeSingle();

    const { data: deps } = await (supabase
      .from("vendor_dependencies")
      .select("target_vendor_id, relationship_type")
      .eq("source_vendor_id", data.vendorId) as any);

    // Fetch target vendor details separately to avoid relationship inference issues
    const enrichedDeps = [];
    if (deps) {
      for (const dep of deps) {
        const { data: targetVendor } = await supabase
          .from("vendors")
          .select("name, domain, risk_score")
          .eq("id", dep.target_vendor_id)
          .maybeSingle();
        enrichedDeps.push({ ...dep, vendors: targetVendor });
      }
    }

    return {
      cascade_metrics: cascade || { avg_downstream_risk: 0, downstream_count: 0 },
      dependencies: enrichedDeps,
    };
  });

export const getVendorAttck = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ vendorId: z.string() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;

    // Get vendor assets
    const { data: assets } = await supabase
      .from("assets")
      .select("id")
      .eq("vendor_id", data.vendorId);

    if (!assets || assets.length === 0) return { techniques: [] };

    const assetIds = assets.map((a: any) => a.id);

    // Get vulnerabilities for these assets
    const { data: vulns } = await supabase
      .from("vulnerabilities")
      .select("cve_id")
      .in("asset_id", assetIds);

    if (!vulns || vulns.length === 0) return { techniques: [] };

    const cveIds = vulns.map((v: any) => v.cve_id);

    // Get ATT&CK mappings
    const { data: mappings } = await supabase
      .from("cve_attck_mapping")
      .select("technique_ids")
      .in("cve_id", cveIds);

    const techniqueCount: Record<string, number> = {};
    if (mappings) {
      mappings.forEach((m: any) => {
        if (m.technique_ids) {
          m.technique_ids.forEach((tid: string) => {
            techniqueCount[tid] = (techniqueCount[tid] || 0) + 1;
          });
        }
      });
    }

    const techniques = Object.entries(techniqueCount).map(([technique_id, count]) => ({
      technique_id,
      name: technique_id, // Could map to real names if we had a dictionary
      count: count as number,
    }));

    return { techniques };
  });

export const getForecast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      vendorId: z.string(),
      periods: z.number().optional().default(30),
      model: z.enum(["arima", "prophet", "lstm"]).optional().default("arima"),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const forecastUrl = process.env.FORECAST_SERVICE_URL || "http://localhost:8000";
      const res = await fetch(`${forecastUrl}/forecast/${data.model}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor_id: data.vendorId, periods: data.periods }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  });

export const getVendorThreatFeeds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ vendorId: z.string() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;

    const { data: assets } = await supabase
      .from("assets")
      .select("ip_address")
      .eq("vendor_id", data.vendorId)
      .not("ip_address", "is", null);

    if (!assets || assets.length === 0) {
      return {
        abuseipdb: { maliciousIps: 0 },
        greynoise: { classification: "benign" },
        otx: { pulseCount: 0 },
      };
    }

    const ips = assets.map((a: any) => a.ip_address);

    const { data: abuseipdb } = await supabase
      .from("abuseipdb_reports")
      .select("abuse_confidence_score")
      .in("ip_address", ips)
      .gte("abuse_confidence_score", 50);

    const { data: greynoise } = await supabase
      .from("greynoise_ip_context")
      .select("classification")
      .in("ip_address", ips)
      .eq("classification", "malicious")
      .limit(1)
      .maybeSingle();

    const { data: otx } = await supabase.from("otx_pulses").select("id").in("indicator", ips);

    return {
      abuseipdb: { maliciousIps: abuseipdb?.length || 0 },
      greynoise: { classification: greynoise?.classification || "benign" },
      otx: { pulseCount: otx?.length || 0 },
    };
  });
