//#region node_modules/.nitro/vite/services/ssr/assets/kev-client-CC0YasJx.js
/**
* Fetches EPSS scores for a list of CVE IDs.
* The API supports querying multiple CVEs separated by commas.
*/
async function fetchEpssScores(cveIds) {
	const scoreMap = /* @__PURE__ */ new Map();
	if (!cveIds || cveIds.length === 0) return scoreMap;
	const chunkSize = 50;
	for (let i = 0; i < cveIds.length; i += chunkSize) {
		const chunk = cveIds.slice(i, i + chunkSize);
		try {
			const url = new URL("https://api.first.org/data/v1/epss");
			url.searchParams.append("cve", chunk.join(","));
			const response = await fetch(url.toString(), {
				method: "GET",
				headers: { Accept: "application/json" }
			});
			if (!response.ok) throw new Error(`EPSS API error: ${response.statusText}`);
			const data = await response.json();
			if (data.data) for (const item of data.data) scoreMap.set(item.cve, parseFloat(item.epss));
		} catch (error) {
			console.error(`[EPSS Client] Error fetching EPSS scores:`, error);
		}
	}
	return scoreMap;
}
var cachedKevSet = null;
var lastFetchTime = 0;
var CACHE_TTL_MS = 1e3 * 60 * 60 * 24;
/**
* Fetches the entire CISA KEV catalog and returns a Set of CVE IDs for fast lookup.
*/
async function getKevCatalogSet() {
	const now = Date.now();
	if (cachedKevSet && now - lastFetchTime < CACHE_TTL_MS) return cachedKevSet;
	try {
		const response = await fetch("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json", {
			method: "GET",
			headers: { Accept: "application/json" }
		});
		if (!response.ok) throw new Error(`KEV API error: ${response.statusText}`);
		const data = await response.json();
		const cveSet = /* @__PURE__ */ new Set();
		if (data.vulnerabilities) for (const item of data.vulnerabilities) cveSet.add(item.cveID);
		cachedKevSet = cveSet;
		lastFetchTime = now;
		return cveSet;
	} catch (error) {
		console.error(`[KEV Client] Error fetching KEV catalog:`, error);
		return cachedKevSet || /* @__PURE__ */ new Set();
	}
}
//#endregion
export { getKevCatalogSet as n, fetchEpssScores as t };
