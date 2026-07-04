// src/lib/intelligence/epss-client.ts

/**
 * EPSS (Exploit Prediction Scoring System) API Client
 * Used to fetch the probability of a CVE being exploited in the wild.
 * Source: FIRST.org
 */

export interface EpssResponseItem {
  cve: string;
  epss: string;
  percentile: string;
  date: string;
}

export interface EpssApiResponse {
  status: string;
  "status-code": number;
  version: string;
  access: string;
  total: number;
  offset: number;
  limit: number;
  data: EpssResponseItem[];
}

/**
 * Fetches EPSS scores for a list of CVE IDs.
 * The API supports querying multiple CVEs separated by commas.
 */
export async function fetchEpssScores(cveIds: string[]): Promise<Map<string, number>> {
  const scoreMap = new Map<string, number>();

  if (!cveIds || cveIds.length === 0) {
    return scoreMap;
  }

  // The EPSS API allows up to hundreds of CVEs in a single query via the 'cve' parameter
  // but to be safe, we'll chunk them into groups of 50.
  const chunkSize = 50;
  for (let i = 0; i < cveIds.length; i += chunkSize) {
    const chunk = cveIds.slice(i, i + chunkSize);
    try {
      const url = new URL("https://api.first.org/data/v1/epss");
      url.searchParams.append("cve", chunk.join(","));

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`EPSS API error: ${response.statusText}`);
      }

      const data = (await response.json()) as EpssApiResponse;

      if (data.data) {
        for (const item of data.data) {
          scoreMap.set(item.cve, parseFloat(item.epss));
        }
      }
    } catch (error) {
      console.error(`[EPSS Client] Error fetching EPSS scores:`, error);
    }
  }

  return scoreMap;
}
