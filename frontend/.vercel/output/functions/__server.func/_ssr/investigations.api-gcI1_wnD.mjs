import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as createServerRpc } from "./createServerRpc-4C8DKW8q.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
import { readMockDb, writeMockDb } from "./dashboard.api-DIQuavpu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/investigations.api-gcI1_wnD.js
var getInvestigations_createServerFn_handler = createServerRpc({
	id: "f4e27d44dfeb09cf759d8ffcee0b3def5d46031102322aed8534ba847cefbfc7",
	name: "getInvestigations",
	filename: "src/api/investigations.api.ts"
}, (opts) => getInvestigations.__executeServer(opts));
var getInvestigations = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getInvestigations_createServerFn_handler, async () => {
	try {
		return readMockDb().investigations || [];
	} catch (e) {
		console.error("Failed to get investigations:", e);
		return [];
	}
});
var createInvestigation_createServerFn_handler = createServerRpc({
	id: "2138eafa429613569ef15b6524507378036a4cec9b58e38b6c36e0feec9ec06e",
	name: "createInvestigation",
	filename: "src/api/investigations.api.ts"
}, (opts) => createInvestigation.__executeServer(opts));
var createInvestigation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => data).handler(createInvestigation_createServerFn_handler, async ({ data }) => {
	const db = readMockDb();
	if (!db.investigations) db.investigations = [];
	const newCase = {
		id: `CAS-${Math.floor(Math.random() * 1e4).toString().padStart(4, "0")}`,
		date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		...data
	};
	db.investigations.push(newCase);
	writeMockDb(db);
	return newCase;
});
//#endregion
export { createInvestigation_createServerFn_handler, getInvestigations_createServerFn_handler };
