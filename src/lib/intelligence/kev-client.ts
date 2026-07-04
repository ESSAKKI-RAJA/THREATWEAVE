// src/lib/intelligence/kev-client.ts

/**
 * CISA KEV (Known Exploited Vulnerabilities) API Client
 * Used to identify if a given CVE is in the CISA KEV catalog.
 */

export interface KevCatalogItem {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate: string;
}

export interface KevCatalogResponse {
  title: string;
  catalogVersion: string;
  dateReleased: string;
  count: number;
  vulnerabilities: KevCatalogItem[];
}

let cachedKevSet: Set<string> | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Fetches the entire CISA KEV catalog and returns a Set of CVE IDs for fast lookup.
 */
export async function getKevCatalogSet(): Promise<Set<string>> {
  const now = Date.now();
  if (cachedKevSet && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedKevSet;
  }

  try {
    const url =
      "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`KEV API error: ${response.statusText}`);
    }

    const data = (await response.json()) as KevCatalogResponse;
    const cveSet = new Set<string>();

    if (data.vulnerabilities) {
      for (const item of data.vulnerabilities) {
        cveSet.add(item.cveID);
      }
    }

    cachedKevSet = cveSet;
    lastFetchTime = now;
    return cveSet;
  } catch (error) {
    console.error(`[KEV Client] Error fetching KEV catalog:`, error);
    // If it fails, return the stale cache if available, otherwise an empty set
    return cachedKevSet || new Set<string>();
  }
}
