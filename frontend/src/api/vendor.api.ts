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
      .eq("asset_id", data.vendorId); // In a real schema, we'd join assets to vendor

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

    const { data: deps } = await supabase
      .from("vendor_dependencies")
      .select(
        "target_vendor_id, relationship_type, vendors!vendor_dependencies_target_vendor_id_fkey(name, domain, risk_score)",
      )
      .eq("source_vendor_id", data.vendorId);

    return {
      cascade_metrics: cascade || { avg_downstream_risk: 0, downstream_count: 0 },
      dependencies: deps || [],
    };
  });

export const getVendorAttck = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ vendorId: z.string() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;
    // For now we just return an empty array if joining across vulnerabilities to attck is too complex for this demo
    return { techniques: [] };
  });
