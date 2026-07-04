import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScanOrchestratorService } from "../../src/lib/services/scan-orchestrator.service";
import * as dnsService from "../../src/lib/services/dns.service";

describe("ScanOrchestratorService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return PARTIAL status and calculate risk score gracefully when some connectors fail", async () => {
    // Setup
    const orchestrator = new ScanOrchestratorService();

    // Mock the DNS resolution to succeed
    vi.spyOn(dnsService, "resolveIpWithFallback").mockResolvedValue({
      ip: "1.2.3.4",
      resolved: true,
      fallbackUsed: false,
    });

    // We can spy on the execute methods inside the orchestrator by using any cast
    const shodanSpy = vi.spyOn((orchestrator as any).shodan, "execute").mockResolvedValue({
      data: { ports: [80, 443], vulns: ["CVE-2021-1234"] },
      fallbackUsed: false,
    });

    // Simulate VirusTotal failing completely and falling back
    const vtSpy = vi.spyOn((orchestrator as any).vt, "execute").mockResolvedValue({
      data: {
        last_analysis_stats: {
          malicious: 0,
          suspicious: 0,
          harmless: 0,
          undetected: 0,
          timeout: 0,
        },
        reputation: 0,
      },
      fallbackUsed: true,
      error: "VirusTotal API rate limited",
    });

    const crtSpy = vi.spyOn((orchestrator as any).crt, "execute").mockResolvedValue({
      data: [{ id: 1, name_value: "test.com" }],
      fallbackUsed: false,
    });

    const ghSpy = vi.spyOn((orchestrator as any).gh, "execute").mockResolvedValue({
      data: { total_count: 0, truncated: false, hits: [] },
      fallbackUsed: true,
      error: "GitHub Token missing",
    });

    const threatSpy = vi.spyOn((orchestrator as any).threatFeeds, "execute").mockResolvedValue({
      data: { feeds_available: [] },
      fallbackUsed: false,
    });

    // Execute
    const result = await orchestrator.orchestrateScan("example.com");

    // Assertions
    expect(shodanSpy).toHaveBeenCalled();
    expect(vtSpy).toHaveBeenCalled();
    expect(crtSpy).toHaveBeenCalled();
    expect(ghSpy).toHaveBeenCalled();
    expect(threatSpy).toHaveBeenCalled();

    // With 2 failures (VT, GitHub fallback used), we expect status to be PARTIAL
    expect(result.status).toBe("PARTIAL");
    expect(result.riskScore.missingData).toContain("VirusTotal");
    expect(result.riskScore.missingData).toContain("GitHub");

    // The missing VT and GitHub should lower the overall confidence
    expect(result.riskScore.confidence).toBeLessThan(1.0);

    // However, the score should still exist based on Shodan (exposure and vuln)
    expect(result.riskScore.overall).toBeGreaterThan(0);
    expect(result.riskScore.components.exposure.score).toBeGreaterThan(0);

    // And error details should be recorded
    expect(result.dataSources.virustotal.success).toBe(false);
    expect(result.dataSources.virustotal.error).toBe("VirusTotal API rate limited");
    expect(result.dataSources.github.success).toBe(false);
    expect(result.dataSources.github.error).toBe("GitHub Token missing");

    // Shodan succeeded
    expect(result.dataSources.shodan.success).toBe(true);
  });
});
