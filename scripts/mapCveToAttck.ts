import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

// Very basic mapping for demo purposes. Real intelligence platforms
// map CPEs and CVE descriptions to ATT&CK via NLP or CISA KEV data.
const ATTCK_MAPPINGS: Record<string, string[]> = {
  "CVE-2021-44228": ["T1190", "T1059"], // Log4Shell -> Exploit Public-Facing App, Command and Scripting Interpreter
  "CVE-2023-23397": ["T1566", "T1114"], // Outlook EoP -> Phishing, Email Collection
  // Add fallback heuristics based on CVSS or severity
};

async function mapAttck() {
  console.log("Mapping CVEs to MITRE ATT&CK techniques...");

  const { data: cves, error } = await supabase.from("vulnerabilities").select("cve_id");
  if (error || !cves) {
    console.error("Failed to fetch vulnerabilities");
    return;
  }

  for (const v of cves) {
    const techniques = ATTCK_MAPPINGS[v.cve_id] || ["T1190"]; // Defaulting to T1190 Exploit Public-Facing App for external surface

    await supabase.from("cve_attck_mapping").upsert(
      {
        cve_id: v.cve_id,
        technique_ids: techniques,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "cve_id" },
    );
  }

  console.log(`Mapped ${cves.length} CVEs to ATT&CK tactics.`);
}

mapAttck();
