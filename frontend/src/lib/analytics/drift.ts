// src/lib/analytics/drift.ts
import type { AggregatedScan, DriftDetails } from "../osint-types";

/**
 * Enterprise Attack Surface Drift Detection
 * Compares current telemetry with historical scan data to identify surface changes,
 * newly exposed ports, growing certificate sprawl, and unpatched CVEs.
 */
export function detectDrift(
  current: AggregatedScan,
  previous: any | null,
  currentRiskScore: number,
): DriftDetails {
  const new_services: string[] = [];
  const new_ports: number[] = [];
  const new_certificates: string[] = [];
  const new_assets: string[] = [];
  const new_vulnerabilities: string[] = [];
  let new_leaks = 0;

  const currentPorts = current.shodan?.ports || [];
  const currentVulns = current.shodan?.vulns || [];
  const currentCerts = (current.crt_sh || []).map((c) => c.common_name).filter(Boolean);
  const currentLeaks = current.github?.hits?.length ?? 0;

  if (previous) {
    const prevPorts = previous.shodan_data?.ports || [];
    const prevVulns = previous.shodan_data?.vulns || [];
    const prevCerts = (previous.crt_sh_data || []).map((c: any) => c.common_name).filter(Boolean);
    const prevLeaks = previous.github_data?.hits?.length ?? 0;

    // Detect new elements
    currentPorts.forEach((p) => {
      if (!prevPorts.includes(p)) {
        new_ports.push(p);
        new_services.push(`Port ${p}`);
      }
    });

    currentVulns.forEach((v) => {
      if (!prevVulns.includes(v)) {
        new_vulnerabilities.push(v);
      }
    });

    currentCerts.forEach((c) => {
      if (!prevCerts.includes(c)) {
        new_certificates.push(c);
      }
    });

    if (currentLeaks > prevLeaks) {
      new_leaks = currentLeaks - prevLeaks;
    }
  } else {
    // Baseline scenario: treat all current items as new
    currentPorts.forEach((p) => {
      new_ports.push(p);
      new_services.push(`Port ${p}`);
    });
    currentVulns.forEach((v) => new_vulnerabilities.push(v));
    currentCerts.slice(0, 10).forEach((c) => new_certificates.push(c));
    new_leaks = currentLeaks;
  }

  // Calculate Growth and Risk Delta
  const prevCount = previous ? previous.shodan_data?.ports?.length || 0 : 0;
  const attack_surface_growth_pct =
    prevCount > 0
      ? Math.round(((currentPorts.length - prevCount) / prevCount) * 100)
      : currentPorts.length * 100;

  const prevScore = previous ? previous.risk_score || 0 : 0;
  const risk_delta_pct = previous ? Math.round(currentRiskScore - prevScore) : 0;

  // Drift Severity
  let drift_severity: "Minimal" | "Low" | "Moderate" | "High" | "Critical" = "Minimal";
  if (new_vulnerabilities.length > 0 || new_leaks > 0) {
    drift_severity = "High";
  } else if (new_ports.length > 0 || risk_delta_pct > 15) {
    drift_severity = "Moderate";
  } else if (new_certificates.length > 0) {
    drift_severity = "Low";
  }

  const explanation = previous
    ? `Attack surface drift analysis detected ${new_ports.length} new ports, ${new_vulnerabilities.length} new CVEs, and ${new_leaks} new code leaks. Attack surface has grown by ${attack_surface_growth_pct}%. Drift severity is evaluated as ${drift_severity}. Risk score delta is ${risk_delta_pct > 0 ? "+" : ""}${risk_delta_pct}.`
    : `Initial scan baseline established. Exposed surface includes ${currentPorts.length} open ports and ${currentVulns.length} vulnerabilities.`;

  return {
    new_services,
    new_ports,
    new_certificates,
    new_assets,
    new_vulnerabilities,
    new_leaks,
    attack_surface_growth_pct,
    risk_delta_pct,
    drift_severity,
    explanation,
  };
}
