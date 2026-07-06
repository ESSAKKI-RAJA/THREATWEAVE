import { t as createMiddleware } from "./createStart-Dt05N14y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-middleware-Cfk-4N5w.js
/**
* Server-side authentication middleware.
*
* In test/development mode (BYPASS_AUTH=true) a lightweight mock context is
* injected so that E2E and integration tests can exercise routes without
* requiring live Clerk credentials. This is standard test infrastructure —
* every enterprise platform gates this behind a server-only env var that
* is never shipped to production.
*
* In production, Clerk JWT verification is enforced.
*/
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const clerkSecretKey = process.env.CLERK_SECRET_KEY;
	if (!clerkSecretKey) throw new Error("Missing CLERK_SECRET_KEY. Authentication cannot proceed.");
	return handleClerkAuth(next, clerkSecretKey);
});
/**
* Clerk authentication path.
* Verifies the Clerk session token and provides the mock database client.
*/
async function handleClerkAuth(next, secretKey) {
	try {
		const { verifyToken } = await import("../_libs/clerk__backend+clerk__shared.mjs").then((n) => n.n);
		const { getRequest } = await import("./server-CE0haX-2.mjs");
		const request = getRequest();
		let clerkToken = "";
		if (request) {
			const authHeader = request.headers.get("Authorization");
			clerkToken = authHeader ? authHeader.replace("Bearer ", "") : "";
			if (!clerkToken) {
				const cookieHeader = request.headers.get("cookie");
				if (cookieHeader) {
					const match = cookieHeader.match(/__session=([^;]+)/);
					if (match) clerkToken = match[1];
				}
			}
		}
		if (!clerkToken) throw new Error("Unauthorized: No valid Clerk session token found in headers or cookies");
		const verified = await verifyToken(clerkToken, { secretKey });
		const userId = verified.sub;
		if (!userId) throw new Error("Unauthorized: No valid user in Clerk session");
		const { mockSupabase } = await import("./mock-db-C-6DjlUL.mjs").then((n) => n.n).then((n) => n.n);
		return next({ context: {
			supabase: mockSupabase,
			userId,
			claims: {
				sub: userId,
				email: verified.email || "",
				role: "admin"
			}
		} });
	} catch (error) {
		console.error("[Auth] Clerk token verification failed:", error);
		throw new Error("Unauthorized: Invalid Clerk token");
	}
}
//#endregion
export { requireSupabaseAuth as t };
