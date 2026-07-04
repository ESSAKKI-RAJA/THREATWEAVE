import {
  ShodanInternetDbResponse,
  VirusTotalDomainAttributes,
  CrtShEntry,
  GithubLeakResult,
  ThreatFeedsResult,
} from "./osint-types";

export function getMockShodanData(ip: string): ShodanInternetDbResponse {
  return {
    ip,
    ports: [80, 443, 22, 3389, 8080],
    cpes: ["cpe:/a:apache:http_server:2.4.41", "cpe:/a:openbsd:openssh:8.2p1"],
    hostnames: [`host-${ip.replace(/\./g, "-")}.mock.infra.net`],
    tags: ["cloud"],
    // Simulate some real-world looking vulnerabilities
    vulns: [
      "CVE-2023-38408", // OpenSSH forwarded agent
      "CVE-2021-44228", // Log4Shell (for demonstration purposes)
      "CVE-2021-45046", // Log4j
      "CVE-2019-11043", // PHP-FPM
      "CVE-2024-3094", // XZ Utils
    ],
  };
}

export function getMockVirusTotalData(): VirusTotalDomainAttributes {
  return {
    last_analysis_stats: {
      malicious: 2,
      suspicious: 1,
      harmless: 85,
      undetected: 4,
      timeout: 0,
    },
    reputation: -15,
  };
}

export function getMockCrtShData(domain: string): CrtShEntry[] {
  return [
    {
      issuer_ca_id: 1,
      issuer_name: "C=US, O=Let's Encrypt, CN=R3",
      common_name: domain,
      name_value: `${domain}\nwww.${domain}`,
      id: 10000001,
      entry_timestamp: new Date().toISOString(),
      not_before: new Date().toISOString(),
      not_after: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      serial_number: "03:45:67:89:ab:cd:ef",
    },
    {
      issuer_ca_id: 1,
      issuer_name: "C=US, O=Let's Encrypt, CN=R3",
      common_name: `api.${domain}`,
      name_value: `api.${domain}`,
      id: 10000002,
      entry_timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      not_before: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      not_after: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      serial_number: "04:56:78:9a:bc:de:f0",
    },
  ];
}

export function getMockGithubData(domain: string): GithubLeakResult {
  return {
    total_count: 3,
    truncated: false,
    hits: [
      {
        repository: "MockOrg/backend-services",
        path: "config/production.yml",
        html_url: `https://github.com/MockOrg/backend-services/blob/main/config/production.yml`,
        score: 1.0,
      },
      {
        repository: "MockOrg/frontend-app",
        path: ".env.example",
        html_url: `https://github.com/MockOrg/frontend-app/blob/main/.env.example`,
        score: 0.8,
      },
    ],
  };
}

export function getMockThreatFeedsData(): ThreatFeedsResult {
  return {
    feeds_available: ["AbuseIPDB (Mock)", "GreyNoise (Mock)", "AlienVault (Mock)"],
    abuseipdb: {
      confidence: 85,
      countryCode: "RU",
      usageType: "Data Center/Web Hosting/Transit",
      isp: "Mock Hosting Provider",
      domain: "example.com",
      reports: [
        { category: "Brute-Force", count: 12 },
        { category: "Port Scan", count: 4 },
      ],
    },
    greynoise: {
      classification: "malicious",
      noise: true,
      riot: false,
      last_seen: new Date().toISOString(),
    },
    otx: {
      pulses: [
        {
          id: "602be1b8a974ea0b00000000",
          name: "Mock APT Campaign",
          description: "This is a mock pulse for demonstration purposes.",
          created: new Date().toISOString(),
          tags: ["apt", "mock", "demo"],
        },
      ],
    },
  };
}
