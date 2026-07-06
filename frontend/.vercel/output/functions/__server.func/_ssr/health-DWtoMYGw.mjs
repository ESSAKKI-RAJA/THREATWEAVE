//#region node_modules/.nitro/vite/services/ssr/assets/health-DWtoMYGw.js
/**
* Health endpoint – returns a simple status check for the service.
* Called directly from src/server.ts, not through TanStack's file router.
*/
async function handleHealthCheck() {
	return new Response(JSON.stringify({
		status: "ok",
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	}), {
		headers: { "Content-Type": "application/json" },
		status: 200
	});
}
//#endregion
export { handleHealthCheck };
