export interface RiskScoreResult {
  overall: number;
  confidence: number;
  severity: "Minimal" | "Low" | "Moderate" | "High" | "Critical";
  components: {
    exposure: { score: number; confidence: number; dataSources: string[] };
    vulnerability: { score: number; confidence: number; dataSources: string[] };
    reputation: { score: number; confidence: number; dataSources: string[] };
    credential: { score: number; confidence: number; dataSources: string[] };
  };
  missingData: string[];
  recommendations: string[];
}

export class RiskScoringService {
  public calculateRisk(
    shodanData: any,
    vtData: any,
    crtData: any,
    ghData: any,
    threatFeeds: any,
    shodanSuccess: boolean,
    vtSuccess: boolean,
    crtSuccess: boolean,
    ghSuccess: boolean,
    threatSuccess: boolean,
  ): RiskScoreResult {
    const missingData: string[] = [];
    const recommendations: string[] = [];

    // Base confidence calculations
    const exposureConf = (shodanSuccess ? 0.7 : 0) + (crtSuccess ? 0.3 : 0);
    const vulnConf = shodanSuccess ? 1.0 : 0;
    const repConf = (vtSuccess ? 0.7 : 0) + (threatSuccess ? 0.3 : 0);
    const credConf = ghSuccess ? 1.0 : 0;

    if (!shodanSuccess) missingData.push("Shodan");
    if (!vtSuccess) missingData.push("VirusTotal");
    if (!crtSuccess) missingData.push("crt.sh");
    if (!ghSuccess) missingData.push("GitHub");
    if (!threatSuccess) missingData.push("ThreatFeeds");

    // Exposure calculation
    let exposureScore = 0;
    const expSources = [];
    if (shodanSuccess && shodanData?.ports) {
      expSources.push("Shodan");
      exposureScore += Math.min(100, shodanData.ports.length * 5);
      if (shodanData.ports.some((p: number) => [22, 3389, 3306].includes(p))) {
        exposureScore += 30;
      }
    }
    if (crtSuccess && crtData?.length) {
      expSources.push("crt.sh");
      exposureScore += Math.min(40, crtData.length * 0.5);
    }
    exposureScore = Math.min(100, exposureScore);

    // Vulnerability calculation
    let vulnScore = 0;
    const vulnSources = [];
    if (shodanSuccess && shodanData?.vulns) {
      vulnSources.push("Shodan/NVD");
      vulnScore += Math.min(100, shodanData.vulns.length * 15);
    }

    // Reputation calculation
    let repScore = 0;
    const repSources = [];
    if (vtSuccess && vtData?.last_analysis_stats) {
      repSources.push("VirusTotal");
      const malicious = vtData.last_analysis_stats.malicious || 0;
      repScore += Math.min(100, malicious * 25);
    }
    if (threatSuccess && threatFeeds?.abuseIPDB) {
      repSources.push("ThreatFeeds");
    }

    // Credential calculation
    let credScore = 0;
    const credSources = [];
    if (ghSuccess && ghData?.hits?.length) {
      credSources.push("GitHub");
      credScore += Math.min(100, ghData.hits.length * 20);
    }

    // Apply confidence weights
    if (exposureConf < 0.5)
      recommendations.push("Exposure data is limited. Verify ports manually.");
    if (vulnConf < 0.5)
      recommendations.push("Vulnerability scanning failed. Run manual network scan.");
    if (repConf < 0.5) recommendations.push("Reputation checks failed. Re-run scan later.");

    // Overall confidence
    const overallConf = (exposureConf + vulnConf + repConf + credConf) / 4;

    // Overall Score Calculation (Weighted)
    let overallScore =
      exposureScore * 0.25 * exposureConf +
      vulnScore * 0.4 * vulnConf +
      repScore * 0.2 * repConf +
      credScore * 0.15 * credConf;

    // Normalize overall score if some confidence is missing
    overallScore =
      overallScore /
      Math.max(0.1, 0.25 * exposureConf + 0.4 * vulnConf + 0.2 * repConf + 0.15 * credConf);
    overallScore = Math.round(Math.min(100, Math.max(0, overallScore)));

    let severity: "Minimal" | "Low" | "Moderate" | "High" | "Critical" = "Minimal";
    if (overallScore >= 80) severity = "Critical";
    else if (overallScore >= 60) severity = "High";
    else if (overallScore >= 40) severity = "Moderate";
    else if (overallScore >= 20) severity = "Low";

    return {
      overall: overallScore,
      confidence: overallConf,
      severity,
      components: {
        exposure: {
          score: Math.round(exposureScore),
          confidence: exposureConf,
          dataSources: expSources,
        },
        vulnerability: {
          score: Math.round(vulnScore),
          confidence: vulnConf,
          dataSources: vulnSources,
        },
        reputation: { score: Math.round(repScore), confidence: repConf, dataSources: repSources },
        credential: {
          score: Math.round(credScore),
          confidence: credConf,
          dataSources: credSources,
        },
      },
      missingData,
      recommendations,
    };
  }
}
