//#region node_modules/.nitro/vite/services/ssr/index.js
var lastError = null;
function consumeLastCapturedError() {
	const err = lastError;
	lastError = null;
	return err;
}
if (typeof process !== "undefined") {
	process.on("unhandledRejection", (reason) => {
		lastError = reason instanceof Error ? reason : new Error(String(reason));
	});
	process.on("uncaughtException", (err) => {
		lastError = err;
	});
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-DcxEg9W1.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!body.includes("\"unhandled\":true") || !body.includes("\"message\":\"HTTPError\"")) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
var server_default = { async fetch(request, env, ctx) {
	const url = new URL(request.url);
	if (request.method === "OPTIONS") return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
			"Access-Control-Allow-Headers": "Content-Type, Authorization"
		}
	});
	if (url.pathname === "/api/health") {
		const { handleHealthCheck } = await import("./health-DWtoMYGw.mjs");
		return handleHealthCheck();
	}
	if (url.pathname === "/api/metrics") {
		const { handleMetrics } = await import("./metrics-ByVcxdpW.mjs");
		return handleMetrics();
	}
	if (url.pathname.startsWith("/api/")) {
		if ([
			"POST",
			"PUT",
			"DELETE",
			"PATCH"
		].includes(request.method)) {
			const origin = request.headers.get("origin") || request.headers.get("referer");
			const host = request.headers.get("host");
			if (!origin || host && !origin.includes(host)) {
				console.warn(`CSRF Warning: Blocked request to ${url.pathname} from origin ${origin}`);
				return new Response(JSON.stringify({ error: "CSRF token mismatch or invalid origin" }), {
					status: 403,
					headers: { "Content-Type": "application/json" }
				});
			}
		}
		const { handleApiRequest } = await import("./dashboard.api-DIQuavpu.mjs");
		return handleApiRequest(request);
	}
	try {
		const normalized = await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
		normalized.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
		normalized.headers.set("X-Content-Type-Options", "nosniff");
		normalized.headers.set("X-Frame-Options", "DENY");
		normalized.headers.set("X-XSS-Protection", "1; mode=block");
		normalized.headers.set("Content-Security-Policy", [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev",
			"worker-src 'self' blob:",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: https://img.clerk.com https://*.clerk.accounts.dev",
			"connect-src 'self' https://*.clerk.accounts.dev wss: https://*.supabase.co",
			"frame-src 'self' https://*.clerk.accounts.dev",
			"font-src 'self' data:"
		].join("; ") + ";");
		return normalized;
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, renderErrorPage as t };
