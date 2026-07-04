import type { ThreatFeedConnector } from "./ThreatFeed";

export class GreyNoiseConnector implements ThreatFeedConnector {
  private apiKey: string | undefined;
  private baseUrl = "https://api.greynoise.io/v3/community"; // Using community API

  initialize(): void {
    this.apiKey = process.env.GREYNOISE_API_KEY;
    if (!this.apiKey) {
      console.warn("GREYNOISE_API_KEY is not set. Connector will return nulls or fail.");
    }
  }

  async checkIp(ip: string): Promise<any> {
    if (!this.apiKey) return null;
    try {
      const response = await fetch(`${this.baseUrl}/${ip}`, {
        headers: {
          key: this.apiKey,
          Accept: "application/json",
        },
      });
      if (response.status === 404) {
        // Not found in GreyNoise dataset
        return { classification: "unknown", name: "unknown" };
      }
      if (!response.ok) {
        console.error(`GreyNoise HTTP ${response.status}`);
        return null;
      }
      return await response.json();
    } catch (e) {
      console.error("GreyNoise connector error:", e);
      return null;
    }
  }

  async checkDomain(domain: string): Promise<any> {
    return null;
  }
}
