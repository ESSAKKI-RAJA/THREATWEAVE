//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DLU_wNo_.js
var manifest = {
	"0702012d759db3beb18f2e9e909ee3590fa506123079218498411296e782a399": {
		functionName: "getVendorThreatFeeds_createServerFn_handler",
		importer: () => import("./_ssr/vendor-intelligence.functions-DmeRdqoB.mjs")
	},
	"2138eafa429613569ef15b6524507378036a4cec9b58e38b6c36e0feec9ec06e": {
		functionName: "createInvestigation_createServerFn_handler",
		importer: () => import("./_ssr/investigations.api-gcI1_wnD.mjs")
	},
	"4038762dec7b6fb04f3424f73b3d464608171c652fa14cc3cb48d25e53225dba": {
		functionName: "generateNarrative_createServerFn_handler",
		importer: () => import("./_ssr/narrative.functions-kUi9_TE3.mjs")
	},
	"4284751539db0f8ad5084fe09419a992658134c858b5a3e59ff4c21bc344e77c": {
		functionName: "getSupplyChainDepthRisk_createServerFn_handler",
		importer: () => import("./_ssr/supplyChainDepth.functions-XhcW6Zbt.mjs")
	},
	"59781a883b240e37043844df027a979aaa84534c9a5c6db3c0d306c834a44a3c": {
		functionName: "getIOCs_createServerFn_handler",
		importer: () => import("./_ssr/intelligence.api-DNRHES4q.mjs")
	},
	"5e8a81784374fcbfe431371b032c04b2dd0d630ab5341bd437787bf8dfe6415b": {
		functionName: "getAlerts_createServerFn_handler",
		importer: () => import("./_ssr/alerts.api-DD0nVAEr.mjs")
	},
	"5f1b36128167df7a834c5d5f598810f5c337cedf21d4b61d836aec159270c414": {
		functionName: "getVendorAttck_createServerFn_handler",
		importer: () => import("./_ssr/vendor-intelligence.functions-DmeRdqoB.mjs")
	},
	"689e656e803db218ca7f44bb40e37cbf788050a9f82a2cf6a68dd5efc2cd2ea6": {
		functionName: "backfillThreatSignatures_createServerFn_handler",
		importer: () => import("./_ssr/threats.functions-CG3PRZqe.mjs")
	},
	"7a4867f9118a791d654edd689bb83a0043d19a50844deee0b334e67909674ada": {
		functionName: "matchThreats_createServerFn_handler",
		importer: () => import("./_ssr/threats.functions-CG3PRZqe.mjs")
	},
	"80028d9fe868ccadaf7661bdcc04a1964b761225a7eb88a6f0a25740339859a3": {
		functionName: "getSupplyChainRisk_createServerFn_handler",
		importer: () => import("./_ssr/vendor-intelligence.functions-DmeRdqoB.mjs")
	},
	"ac9c060df86146d48b893ffdcc8aa54038ee39019a3000eb7a37d965406dfc64": {
		functionName: "getVendorRiskDetails_createServerFn_handler",
		importer: () => import("./_ssr/vendor-intelligence.functions-DmeRdqoB.mjs")
	},
	"c3ed8a96e48e61137269cf14bd41eb8b8783ae61636e7352cbe1bc9148b386cc": {
		functionName: "executeMockDbRequest_createServerFn_handler",
		importer: () => import("./_ssr/mock-db.functions-DamkGd_e.mjs")
	},
	"ea4a9d869b97cce1b6c9bb0b76881ef3461611c6e6693ee9415d4c564f8d0d1b": {
		functionName: "getForecast_createServerFn_handler",
		importer: () => import("./_ssr/vendor-intelligence.functions-DmeRdqoB.mjs")
	},
	"ef1863e280ebd1dd0867f763e2bb1a53ec6aa6f06b0940ac0ef3a4fc67671769": {
		functionName: "getActivities_createServerFn_handler",
		importer: () => import("./_ssr/activities.api-DbApgiKd.mjs")
	},
	"f4e27d44dfeb09cf759d8ffcee0b3def5d46031102322aed8534ba847cefbfc7": {
		functionName: "getInvestigations_createServerFn_handler",
		importer: () => import("./_ssr/investigations.api-gcI1_wnD.mjs")
	},
	"fa8336d1481611070fd84160b87a6d6d362b4d6bd6b5c4f6b107f76e6f70d307": {
		functionName: "runScan_createServerFn_handler",
		importer: () => import("./_ssr/scan.functions-BQxX9TL6.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
