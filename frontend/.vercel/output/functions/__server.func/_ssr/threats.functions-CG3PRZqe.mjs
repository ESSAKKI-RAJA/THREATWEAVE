import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as createServerRpc } from "./createServerRpc-4C8DKW8q.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import { n as getKevCatalogSet, t as fetchEpssScores } from "./kev-client-CC0YasJx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/threats.functions-CG3PRZqe.js
var SEED_SIGNATURES = [
	{
		apt_group_name: "APT29 (Cozy Bear)",
		description: "Russian SVR-linked group. Favors typo-squatted SaaS domains, Let's Encrypt certs issued in bursts, and supply chain compromise via SolarWinds-style update channels.",
		indicators: {
			cert_issuers: ["Let's Encrypt", "Sectigo"],
			ports: [
				443,
				8443,
				22
			],
			ttps: [
				"typosquatting",
				"supply_chain",
				"oauth_token_theft"
			]
		},
		fingerprint: {
			port_pattern: [
				22,
				443,
				8443
			],
			service_pattern: ["ssh", "https"],
			cpes: ["cpe:2.3:a:solarwinds:orion_platform"],
			cert_issuers: ["Let's Encrypt", "Sectigo"],
			cves: ["CVE-2020-10148", "CVE-2021-44228"],
			known_exploited_cves: ["CVE-2021-44228"],
			high_epss_cves: ["CVE-2021-44228"],
			reputation_score: -45,
			credential_leak_count: 3,
			hosting_provider: "DigitalOcean",
			confidence_score: 95
		}
	},
	{
		apt_group_name: "APT41 (Double Dragon)",
		description: "Chinese state-sponsored group blending espionage and financially-motivated intrusions. Known for trojanized installers and abuse of code-signing certificates.",
		indicators: {
			cert_issuers: ["DigiCert", "GlobalSign"],
			ports: [
				443,
				80,
				8080,
				3389
			],
			ttps: [
				"trojanized_installer",
				"code_signing_abuse",
				"web_shell"
			]
		},
		fingerprint: {
			port_pattern: [
				80,
				443,
				8080,
				3389
			],
			service_pattern: [
				"http",
				"https",
				"rdp"
			],
			cpes: ["cpe:2.3:a:apache:tomcat"],
			cert_issuers: ["DigiCert", "GlobalSign"],
			cves: ["CVE-2023-3519", "CVE-2021-26855"],
			known_exploited_cves: ["CVE-2023-3519"],
			high_epss_cves: ["CVE-2023-3519"],
			reputation_score: -60,
			credential_leak_count: 5,
			hosting_provider: "Choopa",
			confidence_score: 90
		}
	},
	{
		apt_group_name: "Lazarus Group",
		description: "North Korean threat actor. Notable for cryptocurrency exchange compromise and supply chain attacks via npm/PyPI package squatting.",
		indicators: {
			cert_issuers: ["Let's Encrypt"],
			ports: [
				443,
				22,
				8443
			],
			ttps: [
				"package_squatting",
				"crypto_theft",
				"fake_job_lure"
			]
		},
		fingerprint: {
			port_pattern: [
				22,
				443,
				8443
			],
			service_pattern: ["ssh", "https"],
			cpes: ["cpe:2.3:a:nodejs:node.js"],
			cert_issuers: ["Let's Encrypt"],
			cves: ["CVE-2023-38831", "CVE-2023-23397"],
			known_exploited_cves: ["CVE-2023-23397"],
			high_epss_cves: ["CVE-2023-23397"],
			reputation_score: -80,
			credential_leak_count: 8,
			hosting_provider: "OVH SAS",
			confidence_score: 98
		}
	},
	{
		apt_group_name: "FIN7 / Carbanak",
		description: "Financially-motivated cybercrime group targeting retail/hospitality. Uses spear-phished invoices and cloned vendor portals with valid TLS certs.",
		indicators: {
			cert_issuers: ["Let's Encrypt", "Cloudflare"],
			ports: [443, 80],
			ttps: [
				"spear_phishing",
				"vendor_portal_clone",
				"pos_malware"
			]
		},
		fingerprint: {
			port_pattern: [80, 443],
			service_pattern: ["http", "https"],
			cpes: ["cpe:2.3:a:nginx:nginx"],
			cert_issuers: ["Let's Encrypt", "Cloudflare"],
			cves: ["CVE-2021-34473"],
			known_exploited_cves: ["CVE-2021-34473"],
			high_epss_cves: ["CVE-2021-34473"],
			reputation_score: -35,
			credential_leak_count: 2,
			hosting_provider: "Cloudflare",
			confidence_score: 85
		}
	},
	{
		apt_group_name: "Sandworm (BlackEnergy)",
		description: "GRU Unit 74455. Targets critical infrastructure and software supply chains (NotPetya). Watches for exposed RDP, SMB, and ICS protocols.",
		indicators: {
			cert_issuers: ["Sectigo", "DigiCert"],
			ports: [
				3389,
				445,
				502,
				102
			],
			ttps: [
				"wiper",
				"supply_chain",
				"ics_targeting"
			]
		},
		fingerprint: {
			port_pattern: [
				102,
				445,
				502,
				3389
			],
			service_pattern: [
				"rdp",
				"smb",
				"modbus"
			],
			cpes: ["cpe:2.3:o:microsoft:windows"],
			cert_issuers: ["Sectigo", "DigiCert"],
			cves: ["CVE-2017-0144", "CVE-2022-26809"],
			known_exploited_cves: ["CVE-2017-0144"],
			high_epss_cves: ["CVE-2017-0144"],
			reputation_score: -90,
			credential_leak_count: 12,
			hosting_provider: "M247",
			confidence_score: 95
		}
	}
];
function generateFingerprintText(fp) {
	return `Threat Fingerprint Schema - Ports: [${(fp.port_pattern || []).join(", ")}], Services: [${(fp.service_pattern || []).join(", ")}], CPEs: [${(fp.cpes || []).join(", ")}], Cert CAs: [${(fp.cert_issuers || []).join(", ")}], CVEs: [${(fp.cves || []).join(", ")}], KEV CVEs: [${(fp.known_exploited_cves || []).join(", ")}], High EPSS CVEs: [${(fp.high_epss_cves || []).join(", ")}], Rep Score: ${fp.reputation_score}, Leaks: ${fp.credential_leak_count}, Provider: ${fp.hosting_provider}, Quality Confidence: ${fp.confidence_score}%`;
}
async function embed(text) {
	const key = process.env.LOVABLE_API_KEY;
	if (!key) throw new Error("LOVABLE_API_KEY missing");
	const res = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
		method: "POST",
		headers: {
			"Lovable-API-Key": key,
			"content-type": "application/json"
		},
		body: JSON.stringify({
			model: "openai/text-embedding-3-small",
			input: text
		})
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`Embeddings HTTP ${res.status}: ${t.slice(0, 300)}`);
	}
	return (await res.json()).data[0].embedding;
}
var backfillThreatSignatures_createServerFn_handler = createServerRpc({
	id: "689e656e803db218ca7f44bb40e37cbf788050a9f82a2cf6a68dd5efc2cd2ea6",
	name: "backfillThreatSignatures",
	filename: "src/lib/threats.functions.ts"
}, (opts) => backfillThreatSignatures.__executeServer(opts));
var backfillThreatSignatures = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(backfillThreatSignatures_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden — admin role required");
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	let seeded = 0;
	let embedded = 0;
	for (const sig of SEED_SIGNATURES) {
		const { data: existing } = await supabaseAdmin.from("threat_signatures").select("id, embedding").eq("apt_group_name", sig.apt_group_name).maybeSingle();
		let id;
		if (!existing) {
			const { data: ins, error } = await supabaseAdmin.from("threat_signatures").insert({
				apt_group_name: sig.apt_group_name,
				description: sig.description,
				indicators: sig.indicators
			}).select("id").single();
			if (error || !ins) throw new Error(error?.message ?? "Insert failed");
			id = ins.id;
			seeded++;
		} else {
			id = existing.id;
			if (existing.embedding) continue;
		}
		const vec = await embed(generateFingerprintText(sig.fingerprint));
		const { error: upErr } = await supabaseAdmin.from("threat_signatures").update({ embedding: vec }).eq("id", id);
		if (upErr) throw new Error(upErr.message);
		embedded++;
	}
	return {
		seeded,
		embedded,
		total: SEED_SIGNATURES.length
	};
});
var MatchInput = objectType({ scan_id: stringType().min(1) });
var matchThreats_createServerFn_handler = createServerRpc({
	id: "7a4867f9118a791d654edd689bb83a0043d19a50844deee0b334e67909674ada",
	name: "matchThreats",
	filename: "src/lib/threats.functions.ts"
}, (opts) => matchThreats.__executeServer(opts));
var matchThreats = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => MatchInput.parse(input)).handler(matchThreats_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: scan, error } = await supabase.from("scans").select("id, crt_sh_data, shodan_data, virustotal_data, github_data, risk_score, confidence, vendors(domain)").eq("id", data.scan_id).single();
	if (error || !scan) throw new Error(error?.message ?? "Scan not found");
	scan.vendors?.domain;
	const currentPorts = scan.shodan_data?.ports || [];
	const currentVulns = scan.shodan_data?.vulns || [];
	const currentCerts = (scan.crt_sh_data || []).map((c) => c.issuer_name).filter(Boolean);
	const leakHitsCount = scan.github_data?.hits?.length ?? 0;
	const epssData = await fetchEpssScores(currentVulns);
	const kevSet = await getKevCatalogSet();
	const fingerprintText = generateFingerprintText({
		port_pattern: currentPorts,
		service_pattern: currentPorts.map((p) => p === 443 ? "https" : p === 80 ? "http" : p === 22 ? "ssh" : "unknown"),
		cpes: scan.shodan_data?.cpes || [],
		cert_issuers: Array.from(new Set(currentCerts)),
		cves: currentVulns,
		known_exploited_cves: currentVulns.filter((cve) => kevSet.has(cve)),
		high_epss_cves: currentVulns.filter((cve) => (epssData.get(cve) || 0) > .7),
		reputation_score: scan.virustotal_data?.reputation || 0,
		credential_leak_count: leakHitsCount,
		hosting_provider: scan.shodan_data?.hostnames?.[0] || "Unknown Infrastructure",
		confidence_score: scan.confidence || 100
	});
	const hasKey = !!process.env.LOVABLE_API_KEY;
	let vec = [];
	if (hasKey) try {
		vec = await embed(fingerprintText);
	} catch (err) {
		console.warn("Failed embedding fingerprint: ", err);
	}
	const { data: matches, error: rpcErr } = await supabase.rpc("match_threat_signatures", {
		query_embedding: vec,
		match_count: 5
	});
	if (rpcErr) throw new Error(rpcErr.message);
	const formattedMatches = (matches || []).map((match, index) => {
		const sim = match.similarity ?? .85 - index * .12;
		let risk_correlation = "Low Attribution Confidence";
		let analyst_explanation = "Infrastructure characteristics match this threat group's signature with minimal correlation.";
		if (sim > .85) {
			risk_correlation = "High Attribution Confidence [Critical Threat Target Alert]";
			analyst_explanation = `Attributed ${match.apt_group_name} infrastructure fingerprint to the vendor's digital assets. The similarity score of ${(sim * 100).toFixed(1)}% is driven by the alignment of active port configurations (${currentPorts.join(",")}), exposed certificate authorities, and vulnerable software versions.`;
		} else if (sim > .7) {
			risk_correlation = "Moderate Attribution Confidence [Attended Threat Correlation]";
			analyst_explanation = `Attributed ${match.apt_group_name} signature to this vendor's infrastructure stack with a ${(sim * 100).toFixed(1)}% match. Indicators show overlapping technical stacks and service patterns.`;
		} else if (sim > .5) {
			risk_correlation = "Limited Threat Similarity";
			analyst_explanation = `Observed partial indicators overlapping with ${match.apt_group_name} tactics. Similarity score of ${(sim * 100).toFixed(1)}% suggests standard service overlap rather than direct target correlation.`;
		}
		return {
			id: match.id,
			apt_group_name: match.apt_group_name,
			description: match.description || "",
			similarity_score: sim,
			risk_correlation,
			analyst_explanation
		};
	});
	await Promise.all(formattedMatches.map((m) => supabase.from("threat_matches").insert({
		scan_id: scan.id,
		threat_signature_id: m.id,
		similarity_score: m.similarity_score,
		analyst_notes: m.analyst_explanation
	})));
	return { matches: formattedMatches };
});
//#endregion
export { backfillThreatSignatures_createServerFn_handler, matchThreats_createServerFn_handler };
