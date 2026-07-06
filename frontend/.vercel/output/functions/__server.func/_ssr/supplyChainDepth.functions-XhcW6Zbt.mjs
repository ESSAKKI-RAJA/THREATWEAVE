import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as createServerRpc } from "./createServerRpc-4C8DKW8q.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supplyChainDepth.functions-XhcW6Zbt.js
var getSupplyChainDepthRisk_createServerFn_handler = createServerRpc({
	id: "4284751539db0f8ad5084fe09419a992658134c858b5a3e59ff4c21bc344e77c",
	name: "getSupplyChainDepthRisk",
	filename: "src/lib/supplyChainDepth.functions.ts"
}, (opts) => getSupplyChainDepthRisk.__executeServer(opts));
var getSupplyChainDepthRisk = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(objectType({ vendorId: stringType().uuid() })).handler(getSupplyChainDepthRisk_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const depths = {};
	let maxDepth = 0;
	try {
		const { data: downstream } = await supabase.rpc("get_downstream_vendors", {
			root_id: data.vendorId,
			max_depth: 5
		});
		if (downstream && downstream.length > 0) {
			const vendorIds = downstream.map((d) => d.vendor_id);
			const { data: vendors } = await supabase.from("vendors").select("id, risk_score").in("id", vendorIds);
			const riskMap = new Map(vendors?.map((v) => [v.id, v.risk_score]) || []);
			downstream.forEach((d) => {
				const depth = d.depth;
				const risk = Number(riskMap.get(d.vendor_id)) || 0;
				if (!depths[depth]) depths[depth] = {
					count: 0,
					avgRisk: 0,
					totalRisk: 0
				};
				depths[depth].count += 1;
				depths[depth].totalRisk += risk;
				depths[depth].avgRisk = depths[depth].totalRisk / depths[depth].count;
				if (depth > maxDepth) maxDepth = depth;
			});
		}
	} catch (e) {
		console.warn("Failed to fetch supply chain depth risk:", e);
	}
	const finalDepths = {};
	for (const [depth, stats] of Object.entries(depths)) finalDepths[depth] = {
		count: stats.count,
		avgRisk: stats.avgRisk
	};
	return {
		depths: finalDepths,
		maxDepth
	};
});
//#endregion
export { getSupplyChainDepthRisk_createServerFn_handler };
