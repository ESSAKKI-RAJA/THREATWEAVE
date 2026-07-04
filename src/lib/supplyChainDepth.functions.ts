import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getSupplyChainDepthRisk = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ vendorId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;

    // Use the get_downstream_vendors recursive CTE and join with vendors table
    // Since we can't directly execute arbitrary SQL, we need to call the RPC function
    // In Supabase, RPC functions return the result set

    // Fallback if RPC is not directly mapped, we can query supply_chain_risk_scores
    // But the prompt asks to use get_downstream_vendors grouped by depth.
    // If there isn't an explicit RPC wrapper in Supabase client, we might need an edge function or direct call.
    // Assuming supabase.rpc('get_downstream_vendors', { root_id: vendorId }) exists based on the migration.

    const depths: Record<string, { count: number; avgRisk: number; totalRisk: number }> = {};
    let maxDepth = 0;

    try {
      const { data: downstream } = await supabase.rpc("get_downstream_vendors", {
        root_id: data.vendorId,
        max_depth: 5,
      });

      if (downstream && downstream.length > 0) {
        // We have vendor_ids and depths. Need to fetch risk scores for these vendors.
        const vendorIds = downstream.map((d: any) => d.vendor_id);
        const { data: vendors } = await supabase
          .from("vendors")
          .select("id, risk_score")
          .in("id", vendorIds);

        const riskMap = new Map(vendors?.map((v: any) => [v.id, v.risk_score]) || []);

        downstream.forEach((d: any) => {
          const depth = d.depth;
          const risk = Number(riskMap.get(d.vendor_id)) || 0;

          if (!depths[depth]) {
            depths[depth] = { count: 0, avgRisk: 0, totalRisk: 0 };
          }

          depths[depth].count += 1;
          depths[depth].totalRisk += risk;
          depths[depth].avgRisk = depths[depth].totalRisk / depths[depth].count;

          if (depth > maxDepth) maxDepth = depth;
        });
      }
    } catch (e) {
      console.warn("Failed to fetch supply chain depth risk:", e);
    }

    // Clean up response
    const finalDepths: Record<string, { count: number; avgRisk: number }> = {};
    for (const [depth, stats] of Object.entries(depths)) {
      finalDepths[depth] = { count: stats.count, avgRisk: stats.avgRisk };
    }

    return { depths: finalDepths, maxDepth };
  });
