import { ShodanConnector } from "../connectors/shodan.connector";
import { VirusTotalConnector } from "../connectors/virustotal.connector";
import { CrtShConnector } from "../connectors/crtsh.connector";
import { GithubConnector } from "../connectors/github.connector";
import { ThreatFeedsConnector } from "../connectors/threatfeeds.connector";
import { RiskScoringService, RiskScoreResult } from "./risk-scoring.service";
import { resolveIpWithFallback } from "./dns.service";

export interface ScanResult {
  domain: string;
  timestamp: string;
  status: "COMPLETE" | "PARTIAL" | "FAILED";
  riskScore: RiskScoreResult;
  dataSources: {
    shodan: { success: boolean; fallbackUsed: boolean; error?: string };
    virustotal: { success: boolean; fallbackUsed: boolean; error?: string };
    crtsh: { success: boolean; fallbackUsed: boolean; error?: string };
    github: { success: boolean; fallbackUsed: boolean; error?: string };
    threatFeeds: { success: boolean; fallbackUsed: boolean; error?: string };
  };
  summary: string;
  rawData: {
    shodan: any;
    virustotal: any;
    crtsh: any;
    github: any;
    threatFeeds: any;
  };
  resolved_ip: string | null;
}

export class ScanOrchestratorService {
  private shodan = new ShodanConnector();
  private vt = new VirusTotalConnector();
  private crt = new CrtShConnector();
  private gh = new GithubConnector();
  private threatFeeds = new ThreatFeedsConnector();
  private riskScorer = new RiskScoringService();

  async orchestrateScan(domain: string): Promise<ScanResult> {
    // 1. Resolve DNS with fallbacks
    const dnsResult = await resolveIpWithFallback(domain);
    const ip = dnsResult.ip;

    // 2. Run all OSINT connectors in parallel with Promise.allSettled
    const [shodanRes, vtRes, crtRes, ghRes, threatRes] = await Promise.allSettled([
      this.shodan.execute(domain, ip || undefined),
      this.vt.execute(domain),
      this.crt.execute(domain),
      this.gh.execute(domain),
      this.threatFeeds.execute(domain, ip || undefined),
    ]);

    // 3. Aggregate results
    const getResult = (res: PromiseSettledResult<any>) => {
      if (res.status === "fulfilled") {
        return { success: !res.value.fallbackUsed, ...res.value };
      } else {
        return {
          success: false,
          data: null,
          error: res.reason?.message || "Unknown error",
          fallbackUsed: false,
        };
      }
    };

    const sData = getResult(shodanRes);
    const vData = getResult(vtRes);
    const cData = getResult(crtRes);
    const gData = getResult(ghRes);
    const tData = getResult(threatRes);

    const dataSources = {
      shodan: { success: sData.success, fallbackUsed: sData.fallbackUsed, error: sData.error },
      virustotal: { success: vData.success, fallbackUsed: vData.fallbackUsed, error: vData.error },
      crtsh: { success: cData.success, fallbackUsed: cData.fallbackUsed, error: cData.error },
      github: { success: gData.success, fallbackUsed: gData.fallbackUsed, error: gData.error },
      threatFeeds: { success: tData.success, fallbackUsed: tData.fallbackUsed, error: tData.error },
    };

    const successCount = Object.values(dataSources).filter((ds) => ds.success).length;
    let status: "COMPLETE" | "PARTIAL" | "FAILED" = "COMPLETE";
    if (successCount === 0) status = "FAILED";
    else if (successCount < 5) status = "PARTIAL";

    // 4. Calculate Risk Score
    const riskScore = this.riskScorer.calculateRisk(
      sData.data,
      vData.data,
      cData.data,
      gData.data,
      tData.data,
      sData.success,
      vData.success,
      cData.success,
      gData.success,
      tData.success,
    );

    // 5. Generate summary
    const summary = `Attributed Overall Risk Score of ${riskScore.overall} (${riskScore.severity}) with ${(riskScore.confidence * 100).toFixed(0)}% intelligence confidence.`;

    return {
      domain,
      timestamp: new Date().toISOString(),
      status,
      riskScore,
      dataSources,
      summary,
      rawData: {
        shodan: sData.data,
        virustotal: vData.data,
        crtsh: cData.data,
        github: gData.data,
        threatFeeds: tData.data,
      },
      resolved_ip: ip,
    };
  }
}
