import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getIOCs } from "@/api/intelligence.api";
import { Loader2, Shield, AlertTriangle, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/intelligence")({
  component: IntelligenceDashboard,
});

const SEVERITY_STYLE: Record<string, string> = {
  critical: "bg-red-900/30 text-red-400 border border-red-800/50",
  high: "bg-orange-900/30 text-orange-400 border border-orange-800/50",
  medium: "bg-yellow-900/30 text-yellow-400 border border-yellow-800/50",
  low: "bg-green-900/30 text-green-400 border border-green-800/50",
};

const STATUS_DOT: Record<string, string> = {
  active: "bg-red-500",
  blocked: "bg-teal-500",
  analyzing: "bg-yellow-500 animate-pulse",
};

function IntelligenceDashboard() {
  const fetchIOCs = useServerFn(getIOCs);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const {
    data: iocs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["iocs"],
    queryFn: () => fetchIOCs(),
    staleTime: 60_000,
  });

  const filtered = iocs.filter((ioc) => {
    const q = search.toLowerCase();
    const matchSearch =
      ioc.value.toLowerCase().includes(q) ||
      ioc.actor.toLowerCase().includes(q) ||
      ioc.type.toLowerCase().includes(q) ||
      ioc.id.toLowerCase().includes(q);
    const matchSeverity = severityFilter === "all" || ioc.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const criticalCount = iocs.filter((i) => i.severity === "critical").length;
  const activeCount = iocs.filter((i) => i.status === "active").length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="font-mono text-sm">Loading threat intelligence feed...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-400 bg-red-900/10 border border-red-800/30 rounded-xl">
        <AlertTriangle className="w-8 h-8" />
        <p className="font-mono text-sm">
          {error instanceof Error ? error.message : "Failed to load threat intelligence."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Threat Intelligence
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            IOC tracking, CVE analysis, and Threat Actor attribution.
          </p>
        </div>
        <div className="flex gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-red-900/20 border border-red-800/30 text-red-400">
            {criticalCount} Critical
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-orange-900/20 border border-orange-800/30 text-orange-400">
            {activeCount} Active
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by IOC value, actor, type..."
            className="pl-8 h-9 text-xs bg-surface-container border-outline-variant text-white placeholder-slate-500 focus:border-primary"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="h-9 px-3 text-xs rounded-md bg-surface-container border border-outline-variant text-slate-300 focus:outline-none focus:border-primary"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950/50 text-xs uppercase font-semibold text-slate-300 border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Indicator Value</th>
                <th className="px-5 py-4">Severity</th>
                <th className="px-5 py-4">Threat Actor</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-mono text-xs">
                    No indicators match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ioc) => (
                  <tr
                    key={ioc.id}
                    className="hover:bg-slate-800/50 transition-colors group cursor-default"
                    title={ioc.description}
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{ioc.id}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-200">{ioc.type}</td>
                    <td className="px-5 py-3.5 font-mono text-teal-400 max-w-[220px] truncate">
                      {ioc.value}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${SEVERITY_STYLE[ioc.severity] ?? ""}`}
                      >
                        {ioc.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{ioc.actor}</td>
                    <td className="px-5 py-3.5">
                      <span className="capitalize text-slate-300 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${STATUS_DOT[ioc.status] ?? "bg-slate-500"}`}
                        />
                        {ioc.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">
                      {ioc.last_seen}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
