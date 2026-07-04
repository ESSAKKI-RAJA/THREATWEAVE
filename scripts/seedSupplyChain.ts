import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

async function seed() {
  console.log("Seeding supply chain dependencies...");

  // Get all vendors
  const { data: vendors, error: vErr } = await supabase.from("vendors").select("id, domain");
  if (vErr || !vendors || vendors.length < 2) {
    console.error("Not enough vendors to create dependencies.");
    return;
  }

  // Create a linear dependency chain or random tree
  for (let i = 0; i < vendors.length - 1; i++) {
    const source = vendors[i];
    const target = vendors[i + 1];

    await supabase.from("vendor_dependencies").upsert(
      {
        source_vendor_id: source.id,
        target_vendor_id: target.id,
        relationship_type: "uses",
        metadata: { reason: "seeded for testing" },
      },
      { onConflict: "source_vendor_id,target_vendor_id" },
    );

    console.log(`Mapped ${source.domain} -> ${target.domain}`);
  }

  // Refresh materialized view
  console.log("Refreshing supply_chain_risk_scores materialized view...");
  try {
    await supabase.rpc("refresh_materialized_view", { view_name: "supply_chain_risk_scores" });
  } catch (e) {
    console.warn("RPC refresh_materialized_view might not exist yet.");
  }

  console.log("Seeding complete.");
}

seed();
