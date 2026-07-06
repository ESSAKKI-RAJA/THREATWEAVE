import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as createServerRpc } from "./createServerRpc-4C8DKW8q.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
import { a as numberType, i as enumType, o as objectType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendor-intelligence.functions-DmeRdqoB.js
var getVendorRiskDetails_createServerFn_handler = createServerRpc({
	id: "ac9c060df86146d48b893ffdcc8aa54038ee39019a3000eb7a37d965406dfc64",
	name: "getVendorRiskDetails",
	filename: "src/lib/vendor-intelligence.functions.ts"
}, (opts) => getVendorRiskDetails.__executeServer(opts));
var getVendorRiskDetails = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(objectType({ vendorId: stringType() })).handler(getVendorRiskDetails_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: vulnerabilities } = await supabase.from("vulnerabilities").select("cve_id, cvss_score, epss_score, known_exploited").eq("asset_id", data.vendorId);
	return { vulnerabilities: vulnerabilities || [] };
});
var getSupplyChainRisk_createServerFn_handler = createServerRpc({
	id: "80028d9fe868ccadaf7661bdcc04a1964b761225a7eb88a6f0a25740339859a3",
	name: "getSupplyChainRisk",
	filename: "src/lib/vendor-intelligence.functions.ts"
}, (opts) => getSupplyChainRisk.__executeServer(opts));
var getSupplyChainRisk = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(objectType({ vendorId: stringType() })).handler(getSupplyChainRisk_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: cascade } = await supabase.from("supply_chain_risk_scores").select("*").eq("vendor_id", data.vendorId).maybeSingle();
	const { data: deps } = await supabase.from("vendor_dependencies").select("target_vendor_id, relationship_type").eq("source_vendor_id", data.vendorId);
	const enrichedDeps = [];
	if (deps) for (const dep of deps) {
		const { data: targetVendor } = await supabase.from("vendors").select("name, domain, risk_score").eq("id", dep.target_vendor_id).maybeSingle();
		enrichedDeps.push({
			...dep,
			vendors: targetVendor
		});
	}
	return {
		cascade_metrics: cascade || {
			avg_downstream_risk: 0,
			downstream_count: 0
		},
		dependencies: enrichedDeps
	};
});
var getVendorAttck_createServerFn_handler = createServerRpc({
	id: "5f1b36128167df7a834c5d5f598810f5c337cedf21d4b61d836aec159270c414",
	name: "getVendorAttck",
	filename: "src/lib/vendor-intelligence.functions.ts"
}, (opts) => getVendorAttck.__executeServer(opts));
var getVendorAttck = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(objectType({ vendorId: stringType() })).handler(getVendorAttck_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: assets } = await supabase.from("assets").select("id").eq("vendor_id", data.vendorId);
	if (!assets || assets.length === 0) return { techniques: [] };
	const assetIds = assets.map((a) => a.id);
	const { data: vulns } = await supabase.from("vulnerabilities").select("cve_id").in("asset_id", assetIds);
	if (!vulns || vulns.length === 0) return { techniques: [] };
	const cveIds = vulns.map((v) => v.cve_id);
	const { data: mappings } = await supabase.from("cve_attck_mapping").select("technique_ids").in("cve_id", cveIds);
	const techniqueCount = {};
	if (mappings) mappings.forEach((m) => {
		if (m.technique_ids) m.technique_ids.forEach((tid) => {
			techniqueCount[tid] = (techniqueCount[tid] || 0) + 1;
		});
	});
	return { techniques: Object.entries(techniqueCount).map(([technique_id, count]) => ({
		technique_id,
		name: technique_id,
		count
	})) };
});
var getForecast_createServerFn_handler = createServerRpc({
	id: "ea4a9d869b97cce1b6c9bb0b76881ef3461611c6e6693ee9415d4c564f8d0d1b",
	name: "getForecast",
	filename: "src/lib/vendor-intelligence.functions.ts"
}, (opts) => getForecast.__executeServer(opts));
var getForecast = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator(objectType({
	vendorId: stringType(),
	periods: numberType().optional().default(30),
	model: enumType([
		"arima",
		"prophet",
		"lstm"
	]).optional().default("arima")
})).handler(getForecast_createServerFn_handler, async ({ data }) => {
	try {
		const forecastUrl = process.env.FORECAST_SERVICE_URL || "http://localhost:8000";
		const res = await fetch(`${forecastUrl}/forecast/${data.model}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				vendor_id: data.vendorId,
				periods: data.periods
			})
		});
		if (!res.ok) return null;
		return await res.json();
	} catch (e) {
		return null;
	}
});
var getVendorThreatFeeds_createServerFn_handler = createServerRpc({
	id: "0702012d759db3beb18f2e9e909ee3590fa506123079218498411296e782a399",
	name: "getVendorThreatFeeds",
	filename: "src/lib/vendor-intelligence.functions.ts"
}, (opts) => getVendorThreatFeeds.__executeServer(opts));
var getVendorThreatFeeds = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(objectType({ vendorId: stringType() })).handler(getVendorThreatFeeds_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: assets } = await supabase.from("assets").select("ip_address").eq("vendor_id", data.vendorId).not("ip_address", "is", null);
	if (!assets || assets.length === 0) return {
		abuseipdb: { maliciousIps: 0 },
		greynoise: { classification: "benign" },
		otx: { pulseCount: 0 }
	};
	const ips = assets.map((a) => a.ip_address);
	const { data: abuseipdb } = await supabase.from("abuseipdb_reports").select("abuse_confidence_score").in("ip_address", ips).gte("abuse_confidence_score", 50);
	const { data: greynoise } = await supabase.from("greynoise_ip_context").select("classification").in("ip_address", ips).eq("classification", "malicious").limit(1).maybeSingle();
	const { data: otx } = await supabase.from("otx_pulses").select("id").in("indicator", ips);
	return {
		abuseipdb: { maliciousIps: abuseipdb?.length || 0 },
		greynoise: { classification: greynoise?.classification || "benign" },
		otx: { pulseCount: otx?.length || 0 }
	};
});
//#endregion
export { getForecast_createServerFn_handler, getSupplyChainRisk_createServerFn_handler, getVendorAttck_createServerFn_handler, getVendorRiskDetails_createServerFn_handler, getVendorThreatFeeds_createServerFn_handler };
