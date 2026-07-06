import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as createServerRpc } from "./createServerRpc-4C8DKW8q.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts.api-DD0nVAEr.js
var getAlerts_createServerFn_handler = createServerRpc({
	id: "5e8a81784374fcbfe431371b032c04b2dd0d630ab5341bd437787bf8dfe6415b",
	name: "getAlerts",
	filename: "src/api/alerts.api.ts"
}, (opts) => getAlerts.__executeServer(opts));
var getAlerts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAlerts_createServerFn_handler, async () => {
	return [
		{
			id: "AL-1092",
			source: "CrowdStrike",
			title: "Suspicious PowerShell Execution",
			time: "10m ago",
			severity: "high",
			status: "new",
			vendor: "acme.com"
		},
		{
			id: "AL-1091",
			source: "Palo Alto",
			title: "Beaconing to Known C2 IP",
			time: "45m ago",
			severity: "critical",
			status: "investigating",
			vendor: "globex.com"
		},
		{
			id: "AL-1090",
			source: "Azure AD",
			title: "Impossible Travel Detected",
			time: "2h ago",
			severity: "medium",
			status: "resolved",
			vendor: "acme.com"
		}
	];
});
//#endregion
export { getAlerts_createServerFn_handler };
