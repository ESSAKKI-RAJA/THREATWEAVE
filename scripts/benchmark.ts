async function benchmark() {
  console.log("Starting THREATWEAVE Performance Benchmarks...");

  const mockSupabase = {
    rpc: async (functionName: string, args?: object) => {
      // Mock delay representing DB latency
      await new Promise((r) => setTimeout(r, 50));
      if (functionName === "get_downstream_vendors") {
        // Return synthetic graph (5 levels deep)
        const data = [];
        for (let i = 0; i < 50; i++) {
          data.push({
            vendor_id: `v${i}`,
            depth: Math.floor(i / 10) + 1,
          });
        }
        return { data, error: null };
      }
      return { data: null, error: null };
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        in: async (column: string, values: readonly any[]) => {
          await new Promise((r) => setTimeout(r, 20));
          const vendors = [];
          for (let i = 0; i < 50; i++) {
            vendors.push({ id: `v${i}`, risk_score: Math.random() * 100 });
          }
          return { data: vendors, error: null };
        },
      }),
    }),
  };

  // Benchmark supply chain traversal (Simulation of getSupplyChainDepthRisk logic)
  console.log("Benchmarking Supply Chain Graph Traversal...");
  const scStart = performance.now();

  // Logic from getSupplyChainDepthRisk
  const rootId = "v0";
  const max_depth = 5;
  const depths: Record<string, { count: number; avgRisk: number; totalRisk: number }> = {};

  const { data: downstream } = await mockSupabase.rpc("get_downstream_vendors", {
    root_id: rootId,
    max_depth,
  });

  if (downstream) {
    const vendorIds = downstream.map((d: any) => d.vendor_id);
    const { data: vendors } = await mockSupabase
      .from("vendors")
      .select("id, risk_score")
      .in("id", vendorIds);
    const riskMap = new Map(vendors?.map((v: any) => [v.id, v.risk_score]) || []);

    downstream.forEach((d: any) => {
      const depth = d.depth;
      const risk = riskMap.get(d.vendor_id) || 0;
      if (!depths[depth]) {
        depths[depth] = { count: 0, avgRisk: 0, totalRisk: 0 };
      }
      depths[depth].count += 1;
      depths[depth].totalRisk += risk;
      depths[depth].avgRisk = depths[depth].totalRisk / depths[depth].count;
    });
  }

  const scEnd = performance.now();
  const scDuration = scEnd - scStart;

  console.log(`Supply Chain Traversal (Simulated) took: ${scDuration.toFixed(2)}ms`);
  if (scDuration > 500) {
    console.warn("⚠️ Supply Chain Traversal exceeds 500ms target.");
  } else {
    console.log("✅ Supply Chain Traversal is within 500ms target.");
  }

  // Done
  console.log("Benchmarks complete.");
}

benchmark().catch(console.error);
