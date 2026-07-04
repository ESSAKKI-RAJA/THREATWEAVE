import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    // API route handling before SSR
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    if (url.pathname === "/api/health") {
      const { handleHealthCheck } = await import("./api/health.ts");
      return handleHealthCheck();
    }
    if (url.pathname === "/api/metrics") {
      const { handleMetrics } = await import("./api/metrics.ts");
      return handleMetrics();
    }
    if (url.pathname.startsWith("/api/")) {
      if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
        const origin = request.headers.get("origin") || request.headers.get("referer");
        const host = request.headers.get("host");
        if (!origin || (host && !origin.includes(host))) {
          console.warn(`CSRF Warning: Blocked request to ${url.pathname} from origin ${origin}`);
          return new Response(JSON.stringify({ error: "CSRF token mismatch or invalid origin" }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
      const { handleApiRequest } = await import("./api/dashboard.api.ts");
      return handleApiRequest(request);
    }
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);

      // Inject Security Headers (RC-1 Hardening)
      normalized.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload",
      );
      normalized.headers.set("X-Content-Type-Options", "nosniff");
      normalized.headers.set("X-Frame-Options", "DENY");
      normalized.headers.set("X-XSS-Protection", "1; mode=block");
      // Production CSP — Clerk SDK requires script/connect/frame/img access to *.clerk.accounts.dev and img.clerk.com
      normalized.headers.set(
        "Content-Security-Policy",
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev",
          "worker-src 'self' blob:",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https://img.clerk.com https://*.clerk.accounts.dev",
          "connect-src 'self' https://*.clerk.accounts.dev wss:",
          "frame-src 'self' https://*.clerk.accounts.dev",
          "font-src 'self' data:",
        ].join("; ") + ";",
      );

      return normalized;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
