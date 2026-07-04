import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { getIpReputation } from "../src/server/services/reputationService";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function backfill() {
  console.log("Starting reputation backfill...");

  const { data: assets, error } = await supabase
    .from("assets")
    .select("ip_address")
    .not("ip_address", "is", null);

  if (error) {
    console.error("Error fetching assets:", error);
    return;
  }

  // Extract unique IPs
  const ips = [...new Set(assets.map((a) => a.ip_address))];
  console.log(`Found ${ips.length} unique IPs to process.`);

  for (let i = 0; i < ips.length; i++) {
    const ip = ips[i];
    console.log(`[${i + 1}/${ips.length}] Checking reputation for ${ip}...`);
    try {
      const rep = await getIpReputation(ip, supabase);
      console.log(
        `Result for ${ip}: Risk=${rep.aggregatedRisk}, AbuseIPDB=${rep.abuseConfidenceScore}, GreyNoise=${rep.greyNoiseClassification}, OTX=${rep.otxPulseCount}`,
      );
      // The getIpReputation function handles upserting into the specific tables.
      // We could also update the assets table here if it had a reputation_risk column,
      // but according to the prompt it goes into the overall scan score calculation.
    } catch (e) {
      console.error(`Failed to check ${ip}:`, e);
    }

    // Slight delay to avoid ratelimits if many IPs
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("Backfill complete.");
}

backfill();
