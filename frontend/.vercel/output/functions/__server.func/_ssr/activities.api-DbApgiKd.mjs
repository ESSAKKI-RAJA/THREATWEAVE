import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as createServerRpc } from "./createServerRpc-4C8DKW8q.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
import { readMockDb, writeMockDb } from "./dashboard.api-DIQuavpu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activities.api-DbApgiKd.js
var getActivities_createServerFn_handler = createServerRpc({
	id: "ef1863e280ebd1dd0867f763e2bb1a53ec6aa6f06b0940ac0ef3a4fc67671769",
	name: "getActivities",
	filename: "src/api/activities.api.ts"
}, (opts) => getActivities.__executeServer(opts));
var getActivities = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getActivities_createServerFn_handler, async () => {
	const db = readMockDb();
	if (!db.activities || db.activities.length === 0) {
		db.activities = [
			{
				id: "1",
				title: "Scan completed for Globex Inc.",
				detail: "Composite risk score recalculated.",
				time: "2026-07-03T18:00:00Z",
				type: "success"
			},
			{
				id: "2",
				title: "New vulnerability detected",
				detail: "Exposed database service found in Initech perimeter.",
				time: "2026-07-03T17:55:00Z",
				type: "error"
			},
			{
				id: "3",
				title: "Data sync completed",
				detail: "Synchronized Let's Encrypt certificate feeds.",
				time: "2026-07-03T17:50:00Z",
				type: "info"
			},
			{
				id: "4",
				title: "New vendor added",
				detail: "Registered Umbrella Corp. into critical monitoring.",
				time: "2026-07-03T17:45:00Z",
				type: "info"
			}
		];
		writeMockDb(db);
	}
	return db.activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
});
//#endregion
export { getActivities_createServerFn_handler };
