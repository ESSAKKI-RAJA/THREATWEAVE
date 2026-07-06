import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as createServerRpc } from "./createServerRpc-4C8DKW8q.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
import * as fs from "node:fs";
import * as path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/intelligence.api-DNRHES4q.js
var getIOCs_createServerFn_handler = createServerRpc({
	id: "59781a883b240e37043844df027a979aaa84534c9a5c6db3c0d306c834a44a3c",
	name: "getIOCs",
	filename: "src/api/intelligence.api.ts"
}, (opts) => getIOCs.__executeServer(opts));
var getIOCs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getIOCs_createServerFn_handler, async () => {
	try {
		const dbPath = path.resolve(process.cwd(), "src/integrations/supabase/mock-db.json");
		if (!fs.existsSync(dbPath)) return [];
		return (JSON.parse(fs.readFileSync(dbPath, "utf-8")).iocs || []).sort((a, b) => new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime());
	} catch (e) {
		console.error("Failed to get IOCs:", e);
		return [];
	}
});
//#endregion
export { getIOCs_createServerFn_handler };
