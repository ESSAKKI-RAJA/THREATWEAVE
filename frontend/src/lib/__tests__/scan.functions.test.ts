import { describe, it, expect } from "vitest";
import { RiskScoringService } from "../services/risk-scoring.service";

describe("Unified Risk Score Engine", () => {
  const riskService = new RiskScoringService();

  it("should calculate a high risk score for a malicious vendor with critical vulnerabilities", () => {
    const shodanData = {
      ports: [3389, 443, 3306, 5432, 27017, 6379, 1433, 1521, 5900, 21, 23, 110, 143],
      vulns: ["CVE-2023-1234", "CVE-2023-1235", "CVE-2023-1236", "CVE-2023-1237", "CVE-2023-1238"],
    };
    const vtData = {
      last_analysis_stats: { malicious: 15, suspicious: 5, harmless: 0, undetected: 0, timeout: 0 },
    };

    const result = riskService.calculateRisk(
      shodanData,
      vtData,
      [],
      { hits: [1, 2, 3, 4, 5] },
      { abuseIPDB: { confidence: 80 } },
      true,
      true,
      true,
      true,
      true,
    );

    expect(result.overall).toBeGreaterThan(80);
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it("should calculate a low risk score for a benign vendor with no issues", () => {
    const shodanData = { ports: [443, 80], vulns: [] };
    const vtData = {
      last_analysis_stats: {
        malicious: 0,
        suspicious: 0,
        harmless: 50,
        undetected: 20,
        timeout: 0,
      },
    };

    const result = riskService.calculateRisk(
      shodanData,
      vtData,
      [],
      { total_count: 0 },
      { abuseipdb: { confidence: 0 } },
      true,
      true,
      true,
      true,
      true,
    );

    expect(result.overall).toBeLessThan(40);
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it("should handle missing data gracefully and reflect lower confidence", () => {
    const result = riskService.calculateRisk(
      null,
      null,
      null,
      null,
      null,
      false,
      false,
      false,
      false,
      false,
    );

    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThan(0.4);
    expect(result.missingData.length).toBe(5);
  });
});
