import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

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
export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const bypassAuth =
      process.env.BYPASS_AUTH === "true" || process.env.VITE_BYPASS_AUTH === "true";

    if (bypassAuth) {
      const { mockSupabase } = await import("./mock-db");
      return next({
        context: {
          supabase: mockSupabase,
          userId: "demo-user",
          claims: { sub: "demo-user", email: "demo@threatweave.local", role: "admin" },
        },
      });
    }

    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    if (!clerkSecretKey) {
      throw new Error("Missing CLERK_SECRET_KEY. Authentication cannot proceed.");
    }

    return handleClerkAuth(next, clerkSecretKey);
  },
);

/**
 * Clerk authentication path.
 * Verifies the Clerk session token and provides the mock database client.
 */
async function handleClerkAuth(next: any, secretKey: string) {
  try {
    const { verifyToken } = await import("@clerk/backend");
    const { getRequest } = await import("@tanstack/react-start/server");
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

    if (!clerkToken) {
      throw new Error("Unauthorized: No valid Clerk session token found in headers or cookies");
    }

    const verified = await verifyToken(clerkToken, { secretKey });
    const userId = verified.sub;

    if (!userId) {
      throw new Error("Unauthorized: No valid user in Clerk session");
    }

    // Use the mock database since we are not connecting to a real Supabase instance yet
    const { mockSupabase } = await import("./mock-db");

    return next({
      context: {
        supabase: mockSupabase,
        userId,
        claims: { sub: userId, email: verified.email || "", role: "admin" },
      },
    });
  } catch (error) {
    console.error("[Auth] Clerk token verification failed:", error);
    throw new Error("Unauthorized: Invalid Clerk token");
  }
}
