import type { ThreatFeedConnector } from "./ThreatFeed";

export class AbuseIPDBConnector implements ThreatFeedConnector {
  private apiKey: string | undefined;
  private baseUrl = "https://api.abuseipdb.com/api/v2";

  initialize(): void {
    this.apiKey = process.env.ABUSEIPDB_API_KEY;
    if (!this.apiKey) {
      console.warn("AbuseIPDB_API_KEY is not set. Connector will return nulls or fail.");
    }
  }

  async checkIp(ip: string): Promise<any> {
    if (!this.apiKey) return null;
    try {
      const response = await fetch(
        `${this.baseUrl}/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90`,
        {
          headers: {
            Key: this.apiKey,
            Accept: "application/json",
          },
        },
      );
      if (!response.ok) {
        console.error(`AbuseIPDB HTTP ${response.status}`);
        return null;
      }
      const data = await response.json();
      return data.data;
    } catch (e) {
      console.error("AbuseIPDB connector error:", e);
      return null;
    }
  }

  async checkDomain(domain: string): Promise<any> {
    // AbuseIPDB doesn't have a direct /check for domains in the same way, but it's an IP centric DB.
    return null;
  }
}
