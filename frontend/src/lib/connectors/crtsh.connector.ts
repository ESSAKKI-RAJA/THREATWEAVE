import { OSINTConnector } from "./base.connector";
import { fetchWithRetry } from "../rate-limit";
import type { CrtShEntry } from "../osint-types";
import { getMockCrtShData } from "../mock-data";

export class CrtShConnector extends OSINTConnector<CrtShEntry[]> {
  name = "crt.sh";
  timeout = 10000;

  async fetch(domain: string): Promise<CrtShEntry[]> {
    const url = `https://crt.sh/?q=${encodeURIComponent("%." + domain)}&output=json`;
    const res = await fetchWithRetry(
      url,
      { headers: { Accept: "application/json" } },
      { timeoutMs: this.timeout },
    );

    if (!res.ok) {
      throw new Error(`crt.sh API HTTP ${res.status}`);
    }

    const text = await res.text();
    const parsed = JSON.parse(text) as CrtShEntry[];

    // Deduplicate certificates based on ID
    const unique = new Map<number, CrtShEntry>();
    for (const cert of parsed) {
      if (cert.id && !unique.has(cert.id)) {
        unique.set(cert.id, cert);
      }
    }

    return Array.from(unique.values()).slice(0, 200);
  }

  parse(raw: unknown): CrtShEntry[] {
    return raw as CrtShEntry[];
  }

  protected async handleFallback(
    domain: string,
    error: Error,
  ): Promise<{ data: CrtShEntry[]; fallbackUsed: boolean; error?: string }> {
    return {
      data: getMockCrtShData(domain),
      fallbackUsed: true,
      error: `Certificate data unavailable (${error.message})`,
    };
  }
}
