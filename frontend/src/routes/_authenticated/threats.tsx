import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  Search,
  Filter,
  Shield,
  Terminal,
  BookOpen,
  Bug,
  Zap,
  Eye,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export const Route = createFileRoute("/_authenticated/threats")({
  component: ThreatsPage,
});

// Mock CVE Data
const mockCVEs = Array.from({ length: 500 }).map((_, i) => ({
  id: `CVE-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`,
  severity: Math.random() > 0.8 ? "CRITICAL" : Math.random() > 0.4 ? "HIGH" : "MEDIUM",
  score: (Math.random() * 5 + 5).toFixed(1),
  component: ["Nginx", "Apache Struts", "Log4j", "OpenSSL", "Linux Kernel", "Active Directory"][
    Math.floor(Math.random() * 6)
  ],
  description:
    "A vulnerability was discovered allowing remote code execution under specific unauthenticated conditions.",
  date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split("T")[0],
  status: Math.random() > 0.7 ? "Exploited in wild" : "PoC available",
}));

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "CRITICAL":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "HIGH":
      return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    case "MEDIUM":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    default:
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  }
};

function ThreatsPage() {
  const [search, setSearch] = useState("");
  const parentRef = React.useRef<HTMLDivElement>(null);

  const filteredCVEs = React.useMemo(() => {
    return mockCVEs.filter(
      (cve) =>
        cve.id.toLowerCase().includes(search.toLowerCase()) ||
        cve.component.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const rowVirtualizer = useVirtualizer({
    count: filteredCVEs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="text-3xl font-headline-md font-bold tracking-tight text-on-surface uppercase flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-primary" />
            Global Threat Intelligence
          </h1>
          <p className="text-on-surface-variant font-body-lg mt-2">
            Real-time tracking of CVEs, APT campaigns, and zero-day vulnerabilities affecting your
            supply chain ecosystem.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-outline-variant bg-surface text-on-surface-variant hover:text-white font-mono uppercase text-xs"
          >
            <Activity className="w-4 h-4 mr-2" />
            Live Sync
          </Button>
          <Button className="bg-primary text-primary-foreground font-mono uppercase text-xs">
            <Search className="w-4 h-4 mr-2" />
            Threat Hunting
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Monitored CVEs",
            val: "14,092",
            trend: "+124 this week",
            icon: Bug,
            color: "text-blue-400",
          },
          {
            title: "Critical Exploits",
            val: "24",
            trend: "5 requiring action",
            icon: Zap,
            color: "text-red-500",
          },
          {
            title: "Active Campaigns",
            val: "12",
            trend: "Tracking APT29, Lazarus",
            icon: Globe,
            color: "text-purple-400",
          },
          {
            title: "Dark Web Mentions",
            val: "842",
            trend: "+12% vs last month",
            icon: Eye,
            color: "text-green-400",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="bg-surface border border-outline-variant rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-${kpi.color.split("-")[1]}-500/5 -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-110`}
            />
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                {kpi.title}
              </h3>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <div className="text-3xl font-black text-white font-headline-lg">{kpi.val}</div>
            <p className="text-xs text-on-surface-variant mt-2 font-mono">{kpi.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b border-outline-variant bg-surface-container flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-mono text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Vulnerability Database
              </h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search CVE or Component..."
                    className="pl-9 bg-background border-outline-variant text-white font-mono text-xs h-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 bg-background border-outline-variant text-on-surface-variant shrink-0"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto relative" ref={parentRef}>
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="sticky top-0 bg-surface-container z-10 shadow-md">
                  <tr className="border-b border-outline-variant text-on-surface-variant font-mono text-[10px] uppercase tracking-wider">
                    <th className="p-4 font-semibold w-[150px]">CVE ID</th>
                    <th className="p-4 font-semibold w-[120px]">Severity</th>
                    <th className="p-4 font-semibold w-[80px]">Score</th>
                    <th className="p-4 font-semibold w-[150px]">Component</th>
                    <th className="p-4 font-semibold">Description</th>
                    <th className="p-4 font-semibold w-[120px]">Published</th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y divide-outline-variant text-sm text-white relative"
                  style={{
                    height:
                      rowVirtualizer.getTotalSize() > 0
                        ? `${rowVirtualizer.getTotalSize()}px`
                        : "auto",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const cve = filteredCVEs[virtualRow.index];
                    return (
                      <tr
                        key={cve.id}
                        className="hover:bg-surface-container/40 transition-colors absolute w-full group cursor-pointer"
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <td className="p-4 font-mono text-xs text-primary group-hover:underline">
                          {cve.id}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-[10px] font-bold rounded border uppercase ${getSeverityColor(cve.severity)}`}
                          >
                            {cve.severity}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-white">{cve.score}</td>
                        <td className="p-4 text-xs text-on-surface-variant">{cve.component}</td>
                        <td
                          className="p-4 text-xs text-on-surface-variant truncate max-w-[250px]"
                          title={cve.description}
                        >
                          {cve.description}
                        </td>
                        <td className="p-4 text-xs font-mono text-on-surface-variant">
                          {cve.date}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-md p-5">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant pb-3 mb-4">
              <Shield className="w-4 h-4 text-green-400" />
              Intelligence Feeds Status
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: "NVD (National Vulnerability Database)",
                  status: "Synced 2m ago",
                  ok: true,
                },
                { name: "CISA KEV (Known Exploited)", status: "Synced 5m ago", ok: true },
                { name: "AlienVault OTX", status: "Synced 12m ago", ok: true },
                { name: "Dark Web Scraper", status: "Degraded - Reconnecting", ok: false },
              ].map((feed, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-lg border border-outline-variant bg-background"
                >
                  <div>
                    <div className="text-xs font-bold text-white mb-1">{feed.name}</div>
                    <div className="text-[10px] font-mono text-on-surface-variant">
                      {feed.status}
                    </div>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${feed.ok ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"}`}
                  />
                </div>
              ))}
            </div>
            <Button
              onClick={() => (window.location.href = "/settings")}
              className="w-full mt-4 bg-background border border-outline-variant hover:bg-surface-container text-xs font-mono text-white"
            >
              Manage Feeds
            </Button>
          </div>

          <div className="bg-surface border border-outline-variant rounded-xl shadow-md p-5">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant pb-3 mb-4">
              <BookOpen className="w-4 h-4 text-orange-400" />
              MITRE ATT&CK Matrix
            </h3>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Analyze TTPs (Tactics, Techniques, and Procedures) observed across your vendor
              ecosystem.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                "Initial Access",
                "Execution",
                "Persistence",
                "Privilege Escalation",
                "Defense Evasion",
                "Credential Access",
              ].map((tactic) => (
                <div
                  key={tactic}
                  className="bg-background border border-outline-variant p-2 rounded text-[10px] font-mono text-center flex items-center justify-center text-on-surface hover:border-primary cursor-pointer transition-colors"
                >
                  {tactic}
                </div>
              ))}
            </div>
            <Button
              onClick={() => window.open("https://attack.mitre.org/", "_blank")}
              className="w-full mt-4 bg-primary text-primary-foreground text-xs font-mono"
            >
              Open Interactive Matrix
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
