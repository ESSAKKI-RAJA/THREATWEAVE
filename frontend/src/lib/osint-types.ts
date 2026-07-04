// Strict TypeScript interfaces for OSINT source responses.

export interface CrtShEntry {
  issuer_ca_id: number;
  issuer_name: string;
  common_name: string;
  name_value: string;
  id: number;
  entry_timestamp: string;
  not_before: string;
  not_after: string;
  serial_number: string;
}

export interface ShodanInternetDbResponse {
  ip: string;
  ports: number[];
  cpes: string[];
  hostnames: string[];
  tags: string[];
  vulns: string[];
}

export interface VirusTotalDomainAttributes {
  reputation?: number;
  last_analysis_stats?: {
    harmless: number;
    malicious: number;
    suspicious: number;
    undetected: number;
    timeout: number;
  };
  last_analysis_results?: Record<
    string,
    { category: string; result: string | null; method: string; engine_name: string }
  >;
  categories?: Record<string, string>;
  total_votes?: { harmless: number; malicious: number };
}

export interface VirusTotalDomainResponse {
  data: { id: string; type: string; attributes: VirusTotalDomainAttributes };
}

export interface GithubLeakHit {
  repository: string;
  path: string;
  html_url: string;
  score: number;
}

export interface GithubLeakResult {
  total_count: number;
  truncated: boolean;
  hits: GithubLeakHit[];
}

export interface ThreatFeedsResult {
  feeds_available?: string[];
  abuseipdb?: {
    confidence: number;
    countryCode?: string;
    usageType?: string;
    isp?: string;
    domain?: string;
    reports?: Array<{ category: string; count: number }>;
  };
  greynoise?: {
    classification: string;
    noise: boolean;
    riot: boolean;
    last_seen?: string;
  };
  otx?: {
    pulses: Array<{
      id: string;
      name: string;
      description: string;
      created: string;
      modified?: string;
      tags?: string[];
    }>;
  };
}

export interface ScanError {
  source: "crt_sh" | "shodan" | "virustotal" | "dns" | "github";
  message: string;
}

export interface RiskBreakdown {
  factor: string;
  points: number;
}

export interface ProviderHealth {
  crt_sh: "success" | "timeout" | "error" | "skipped";
  shodan: "success" | "timeout" | "error" | "skipped";
  virustotal: "success" | "timeout" | "error" | "skipped";
  github: "success" | "timeout" | "error" | "skipped";
}

export interface ScanMetadata {
  duration_ms: number;
  version: string;
}

export interface AggregatedScan {
  domain: string;
  crt_sh: CrtShEntry[] | null;
  shodan: ShodanInternetDbResponse | null;
  virustotal: VirusTotalDomainAttributes | null;
  github: GithubLeakResult | null;
  errors: ScanError[];
  resolved_ip: string | null;
  provider_health: ProviderHealth;
  scan_metadata: ScanMetadata;
}

// ============== ENTERPRISE ARCHITECTURE INTEGRATIONS ==============

export interface DetailedRiskScoring {
  overall_score: number;
  confidence_score: number;
  severity: "Minimal" | "Low" | "Moderate" | "High" | "Critical";
  confidence_level: "High" | "Moderate" | "Limited" | "Low";
  evidence_mapping: Record<string, string[]>;
  breakdown: {
    exposure_risk: { score: number; details: string[] };
    vulnerability_risk: { score: number; details: string[] };
    reputation_risk: { score: number; details: string[] };
    credential_exposure_risk: { score: number; details: string[] };
    confidence: { score: number; details: string[] };
  };
  analyst_explanation: string;
}

export interface ThreatFingerprint {
  port_pattern: number[];
  service_pattern: string[];
  cpes: string[];
  cert_issuers: string[];
  cves: string[];
  known_exploited_cves: string[];
  high_epss_cves: string[];
  reputation_score: number;
  credential_leak_count: number;
  hosting_provider: string;
  confidence_score: number;
  drift_severity?: string;
}

export interface ThreatAttributionMatch {
  id: string;
  apt_group_name: string;
  description: string;
  similarity_score: number;
  risk_correlation: string;
  analyst_explanation: string;
}

export interface DriftDetails {
  new_services: string[];
  new_ports: number[];
  new_certificates: string[];
  new_assets: string[];
  new_vulnerabilities: string[];
  new_leaks: number;
  attack_surface_growth_pct: number;
  risk_delta_pct: number;
  drift_severity: "Minimal" | "Low" | "Moderate" | "High" | "Critical";
  explanation: string;
}

export interface BenchmarkMetrics {
  industry_average: number;
  regional_average: number;
  percentile_rank: number;
  relative_risk_position: string;
  peer_group_name: string;
}

export interface RiskForecasting {
  predicted_risk_30d: number;
  predicted_risk_90d: number;
  predicted_risk_180d: number;
  confidence_interval_low: number;
  confidence_interval_high: number;
  exposure_probability_90d: number;
  leak_probability_90d: number;
  vuln_growth_probability_90d: number;
  overall_security_deterioration_prob: number;
}

export interface SupplyChainDependency {
  vendor_id: string;
  vendor_name: string;
  vendor_domain: string;
  depth: number;
  dependency_weight: number;
  risk_score: number;
}

// Unified Narrative Payload for CISO Reports
export interface NarrativePayload {
  executive_summary: string;
  analyst_summary: string;
  compliance_summary: string;
  recommended_actions: string[];
  risk_score: number;
  confidence: "low" | "medium" | "high";
  top_indicators: Array<{
    title: string;
    detail: string;
    severity: "low" | "medium" | "high" | "critical";
  }>;
  benchmark_summary?: string;
  historical_trend_summary?: string;
  threat_similarity_summary?: string;
  risk_forecasting_summary?: string;
  provider?: string;
}
