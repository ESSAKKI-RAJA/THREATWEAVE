import type { RiskBreakdown } from "./osint-types";

export function exportJSON(domain: string, scan: any, vendor: any) {
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scan, null, 2));
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `vendor_scan_${domain}_${new Date().getTime()}.json`);
  dlAnchorElem.click();
}

export function exportCSV(domain: string, scan: any, vendor: any, score: number) {
  let csvContent = "data:text/csv;charset=utf-8,Metric,Value\r\n";
  csvContent += `Domain,${vendor?.domain ?? domain}\r\n`;
  csvContent += `Risk Score,${score}\r\n`;
  csvContent += `Confidence,${scan.confidence ?? 100}%\r\n`;
  csvContent += `Duration (s),${scan.scan_metadata?.duration_ms ? (scan.scan_metadata.duration_ms / 1000).toFixed(1) : "Unknown"}\r\n`;
  csvContent += `Shodan Ports,${scan.shodan_data?.ports.length ?? 0}\r\n`;
  csvContent += `Shodan CVEs,${scan.shodan_data?.vulns.length ?? 0}\r\n`;
  csvContent += `Certificates,${scan.crt_sh_data?.length ?? 0}\r\n`;
  csvContent += `GitHub Leaks,${scan.github_data?.total_count ?? 0}\r\n`;

  if (scan.risk_breakdown) {
    csvContent += `\r\nRisk Factor,Points\r\n`;
    scan.risk_breakdown.forEach((b: RiskBreakdown) => {
      csvContent += `"${b.factor.replace(/"/g, '""')}",${b.points}\r\n`;
    });
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `vendor_summary_${domain}_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportPDF() {
  window.print();
}
