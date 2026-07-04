/**
 * Metrics endpoint – returns simple health metrics for the service.
 * Called directly from src/server.ts, not through TanStack's file router.
 */
export async function handleMetrics(): Promise<Response> {
  const memoryUsage = process.memoryUsage();
  return new Response(
    JSON.stringify({
      status: "ok",
      uptime: process.uptime(),
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
      },
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );
}
