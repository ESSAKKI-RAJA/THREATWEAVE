import { OSINTConnector } from "./base.connector";
import { fetchWithRetry } from "../rate-limit";
import type { ShodanInternetDbResponse } from "../osint-types";
import { getMockShodanData } from "../mock-data";

export class ShodanConnector extends OSINTConnector<ShodanInternetDbResponse> {
  name = "Shodan InternetDB";
  timeout = 8000;

  async fetch(domain: string, ip?: string): Promise<ShodanInternetDbResponse> {
    if (!ip) throw new Error("Shodan requires an IP address");

    const res = await fetchWithRetry(
      `https://internetdb.shodan.io/${ip}`,
      {
        headers: { Accept: "application/json" },
      },
      { timeoutMs: this.timeout },
    );

    if (res.status === 404) {
      // 404 just means no data in InternetDB for this IP
      return { ip, ports: [], cpes: [], hostnames: [], tags: [], vulns: [] };
    }

    if (!res.ok) {
      throw new Error(`Shodan API HTTP ${res.status}`);
    }

    return (await res.json()) as ShodanInternetDbResponse;
  }

  parse(raw: unknown): ShodanInternetDbResponse {
    return raw as ShodanInternetDbResponse;
  }

  protected async handleFallback(
    domain: string,
    error: Error,
  ): Promise<{ data: ShodanInternetDbResponse; fallbackUsed: boolean; error?: string }> {
    return {
      data: getMockShodanData(domain),
      fallbackUsed: true,
      error: `Shodan failed (${error.message}). Using simulated fallback data.`,
    };
  }
}
