import type { ThreatFeedConnector } from "./ThreatFeed";

export class AlienVaultOTXConnector implements ThreatFeedConnector {
  private apiKey: string | undefined;
  private baseUrl = "https://otx.alienvault.com/api/v1/indicators";

  initialize(): void {
    this.apiKey = process.env.OTX_API_KEY;
    if (!this.apiKey) {
      console.warn("OTX_API_KEY is not set. Connector will return nulls or fail.");
    }
  }

  async checkIp(ip: string): Promise<any> {
    if (!this.apiKey) return null;
    try {
      const response = await fetch(`${this.baseUrl}/IPv4/${ip}/general`, {
        headers: {
          "X-OTX-API-KEY": this.apiKey,
          Accept: "application/json",
        },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error("OTX connector error (IP):", e);
      return null;
    }
  }

  async checkDomain(domain: string): Promise<any> {
    if (!this.apiKey) return null;
    try {
      const response = await fetch(`${this.baseUrl}/domain/${domain}/general`, {
        headers: {
          "X-OTX-API-KEY": this.apiKey,
          Accept: "application/json",
        },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error("OTX connector error (Domain):", e);
      return null;
    }
  }
}
