import { OSINTConnector } from "./base.connector";
import { fetchWithRetry } from "../rate-limit";
import type { VirusTotalDomainAttributes, VirusTotalDomainResponse } from "../osint-types";
import { getMockVirusTotalData } from "../mock-data";
import { MissingKeyError } from "../errors";

export class VirusTotalConnector extends OSINTConnector<VirusTotalDomainAttributes> {
  name = "VirusTotal";
  timeout = 8000;

  async fetch(domain: string): Promise<VirusTotalDomainAttributes> {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ [VirusTotal] VIRUSTOTAL_API_KEY not configured — using mock fallback");
      throw new MissingKeyError("VIRUSTOTAL");
    }

    const res = await fetchWithRetry(
      `https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`,
      { headers: { "x-apikey": apiKey, Accept: "application/json" } },
      { timeoutMs: this.timeout },
    );

    if (res.status === 429) {
      throw new Error("VirusTotal rate limit exceeded (quota)");
    }

    if (!res.ok) {
      throw new Error(`VirusTotal API HTTP ${res.status}`);
    }

    const body = (await res.json()) as VirusTotalDomainResponse;
    return body.data.attributes;
  }

  parse(raw: unknown): VirusTotalDomainAttributes {
    return raw as VirusTotalDomainAttributes;
  }

  protected async handleFallback(
    domain: string,
    error: Error,
  ): Promise<{ data: VirusTotalDomainAttributes; fallbackUsed: boolean; error?: string }> {
    return {
      data: getMockVirusTotalData(),
      fallbackUsed: true,
      error: `VirusTotal failed (${error.message}). Using neutral fallback data.`,
    };
  }
}
