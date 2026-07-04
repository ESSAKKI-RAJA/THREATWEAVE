/**
 * Health endpoint – returns a simple status check for the service.
 * Called directly from src/server.ts, not through TanStack's file router.
 */
export async function handleHealthCheck(): Promise<Response> {
  return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
