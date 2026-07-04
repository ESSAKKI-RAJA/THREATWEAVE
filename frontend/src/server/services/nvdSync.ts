// src/server/services/nvdSync.ts
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const NVD_BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function fetchWithBackoff(url: string, apiKey: string, retries = 3): Promise<any> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (apiKey) {
    headers["apiKey"] = apiKey;
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, { headers });
    if (res.ok) {
      return await res.json();
    } else if (res.status === 429 || res.status >= 500) {
      const waitTime = (attempt + 1) * 2000;
      console.warn(
        `NVD rate limited or server error (${res.status}). Retrying in ${waitTime}ms...`,
      );
      await delay(waitTime);
    } else {
      throw new Error(`NVD API error: ${res.statusText}`);
    }
  }
  throw new Error("Max retries exceeded for NVD API");
}

export async function fetchAllCVEs() {
  console.log("NVD bulk sync is intended for initial setup only. Use syncRecentCVEs instead.");
  // For safety and due to 200,000+ CVEs, this is a stub. A real bulk sync would paginate 200 at a time for hours.
}

export async function syncRecentCVEs(
  lastModifiedDate: Date = new Date(Date.now() - 24 * 60 * 60 * 1000),
) {
  const apiKey = process.env.NVD_API_KEY || "";

  // Format ISO string to expected NVD format (drop milliseconds)
  const pubStartDate = lastModifiedDate.toISOString().replace(/\.\d{3}/, "");
  const pubEndDate = new Date().toISOString().replace(/\.\d{3}/, "");

  const url = `${NVD_BASE_URL}?lastModStartDate=${pubStartDate}&lastModEndDate=${pubEndDate}`;

  try {
    const data = await fetchWithBackoff(url, apiKey);
    if (!data.vulnerabilities) return;

    for (const item of data.vulnerabilities) {
      const cve = item.cve;
      if (!cve) continue;

      const cveId = cve.id;
      const published = cve.published;
      const lastModified = cve.lastModified;

      // Extract CVSS v3.1 or v3.0
      const cvssV3 =
        cve.metrics?.cvssMetricV31?.[0]?.cvssData || cve.metrics?.cvssMetricV30?.[0]?.cvssData;

      let baseScore = null;
      let severity = null;
      let vectorString = null;

      if (cvssV3) {
        baseScore = cvssV3.baseScore;
        severity = cvssV3.baseSeverity;
        vectorString = cvssV3.vectorString;
      }

      const { error } = await supabaseAdmin.from("nvd_cves").upsert(
        {
          cve_id: cveId,
          cvss_v3_vector: vectorString,
          base_score: baseScore,
          severity: severity,
          published_date: published,
          last_modified: lastModified,
          full_json: cve as any,
        },
        { onConflict: "cve_id" },
      );

      if (error) {
        console.error("Failed to upsert NVD CVE:", cveId, error);
      }
    }
  } catch (error) {
    console.error("Error in syncRecentCVEs:", error);
  }
}
