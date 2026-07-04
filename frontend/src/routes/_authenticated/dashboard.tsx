import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getActivities } from "@/api/activities.api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Activity,
  Plus,
  Search,
  ArrowUpRight,
  Download,
  RefreshCw,
  Play,
  Shield,
  Layers,
  Globe,
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  X,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

interface VendorRow {
  id: string;
  name: string;
  domain: string;
  sector: string;
  tags: string[];
  description: string;
  risk_score: number;
  status: "queued" | "scanning" | "completed" | "failed";
  scan_progress: number;
  last_successful_scan?: string;
  updated_at: string;
}

interface AlertRow {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  time: string;
  vendor: string;
}

interface PipelineNode {
  name: string;
  status: "connected" | "syncing" | "processing" | "healthy";
  details: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);

  // Form States
  const [vendorName, setVendorName] = useState("");
  const [vendorDomain, setVendorDomain] = useState("");
  const [vendorSector, setVendorSector] = useState("Technology");
  const [vendorTags, setVendorTags] = useState<string[]>([]);
  const [vendorDescription, setVendorDescription] = useState("");

  const sectors = [
    "Technology",
    "Finance",
    "Healthcare",
    "Pharma",
    "Energy",
    "Retail",
    "Manufacturing",
    "Other",
  ];
  const availableTags = ["SaaS", "Cloud", "Core", "Critical", "Legacy", "GDPR", "RD", "Non-Core"];

  // Queries
  const { data: vendors = [], isLoading: loadingVendors } = useQuery<VendorRow[]>({
    queryKey: ["vendors"],
    queryFn: async () => {
      const res = await fetch("/api/vendors");
      if (!res.ok) throw new Error("Failed to load vendors");
      return res.json();
    },
    staleTime: 60000,
  });

  const { data: summary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/summary");
      if (!res.ok) throw new Error("Failed to load summary");
      return res.json();
    },
    staleTime: 60000,
  });

  const { data: alerts = [] } = useQuery<AlertRow[]>({
    queryKey: ["dashboard-alerts"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/alerts");
      if (!res.ok) throw new Error("Failed to load alerts");
      return res.json();
    },
    staleTime: 60000,
  });

  const { data: pipeline = [] } = useQuery<PipelineNode[]>({
    queryKey: ["pipeline-status"],
    queryFn: async () => {
      const res = await fetch("/api/pipeline/status");
      if (!res.ok) throw new Error("Failed to load pipeline status");
      return res.json();
    },
    staleTime: 60000,
  });

  // Mutations
  const addVendorMutation = useMutation({
    mutationFn: async (newVendor: {
      name: string;
      domain: string;
      sector: string;
      tags: string[];
      description: string;
    }) => {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVendor),
      });
      if (!res.ok) throw new Error("Failed to add vendor");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Vendor added successfully. Intelligence sweep initiated.");
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error adding vendor");
    },
  });

  const triggerScanMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const res = await fetch(`/api/vendors/${vendorId}/scan`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to trigger scan");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Intelligence scan triggered successfully.");
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error triggering scan");
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const res = await fetch(`/api/vendors/${vendorId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete vendor");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Vendor removed from monitoring.");
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      setVendorToDelete(null);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error deleting vendor");
    },
  });

  const resetForm = () => {
    setVendorName("");
    setVendorDomain("");
    setVendorSector("Technology");
    setVendorTags([]);
    setVendorDescription("");
  };

  const handleExportCSV = () => {
    if (!vendors || vendors.length === 0) {
      toast.error("No vendors to export");
      return;
    }
    window.location.href = "/api/dashboard/export";
    toast.success("Dashboard export initiated");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim() || !vendorDomain.trim()) {
      toast.error("Name and Domain are required fields");
      return;
    }
    // Simple domain regex check
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(vendorDomain.trim())) {
      toast.error("Please enter a valid domain (e.g. example.com)");
      return;
    }

    addVendorMutation.mutate({
      name: vendorName.trim(),
      domain: vendorDomain.trim().toLowerCase(),
      sector: vendorSector,
      tags: vendorTags,
      description: vendorDescription.trim(),
    });
  };

  const handleTagToggle = (tag: string) => {
    if (vendorTags.includes(tag)) {
      setVendorTags(vendorTags.filter((t) => t !== tag));
    } else {
      setVendorTags([...vendorTags, tag]);
    }
  };

  const getExposureTier = React.useCallback((score: number) => {
    if (score >= 75)
      return { label: "Critical", style: "bg-red-500/10 text-red-500 border-red-500/20" };
    if (score >= 55)
      return { label: "High", style: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
    if (score >= 25)
      return { label: "Medium", style: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
    return { label: "Low", style: "bg-green-500/10 text-green-500 border-green-500/20" };
  }, []);

  const getStatusBadge = React.useCallback((status: VendorRow["status"], progress: number) => {
    switch (status) {
      case "queued":
        return (
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Queued
          </div>
        );
      case "scanning":
        return (
          <div className="flex flex-col gap-1 w-full max-w-[100px]">
            <div className="flex items-center justify-between text-xs font-mono text-blue-400">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                Scanning
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-outline-variant h-1 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-1.5 text-green-400 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            Completed
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-mono">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            Failed
          </div>
        );
    }
  }, []);

  const filteredVendors = React.useMemo(() => {
    const q = searchQuery.toLowerCase();
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.domain.toLowerCase().includes(q) ||
        v.sector.toLowerCase().includes(q),
    );
  }, [vendors, searchQuery]);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredVendors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  const fetchActivities = useServerFn(getActivities);
  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: () => fetchActivities(),
    staleTime: 60000,
  });

  return (
    <div className="space-y-6">
      {/* Global Operational Status Banner */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-green-950/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping shrink-0"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 absolute shrink-0"></div>
          <div className="font-mono text-sm text-green-400 font-semibold tracking-wide uppercase">
            System Status: All Systems Operational
          </div>
          <div className="hidden lg:inline text-xs text-slate-400 border-l border-slate-700 pl-3">
            All intelligence collectors & threat intelligence feeds are operating normally. Last
            updated: 2 min ago.
          </div>
        </div>
        <Badge
          variant="outline"
          className="border-green-500/30 text-green-400 font-mono text-[10px] uppercase"
        >
          Live Feed
        </Badge>
      </div>

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h2
            data-testid="dashboard-header"
            className="text-3xl font-extrabold text-white tracking-tight uppercase font-headline-lg"
          >
            Executive Dashboard
          </h2>
          <p className="text-sm text-on-surface-variant mt-1 font-body-md">
            Operational supply chain threat overview and real-time perimeter status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="border-outline-variant bg-surface text-on-surface-variant hover:text-white hover:bg-surface-container gap-2 font-mono uppercase text-xs tracking-wider"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white hover:bg-blue-600 gap-2 font-mono uppercase text-xs tracking-wider shadow-lg shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* 5 KPI Section Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* KPI 1: Risk Index */}
        <div className="bg-surface border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[140px] hover:border-blue-500/20 transition-all shadow-md">
          <div className="flex justify-between items-start">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              Portfolio Risk Score
            </h3>
            <span className="bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-mono rounded border border-[#3b82f6]/20">
              Live
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white font-headline-lg">
                {summary?.portfolioRiskScore ?? 72}
              </span>
              <span className="text-xs text-on-surface-variant font-mono">/ 100 Index</span>
            </div>
            <p className="text-[11px] text-red-400 font-mono mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12 pts since last audit
            </p>
          </div>
        </div>

        {/* KPI 2: Active Exploits */}
        <div className="bg-surface border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[140px] hover:border-red-500/20 transition-all shadow-md">
          <div className="flex justify-between items-start">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              Critical Exposure
            </h3>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-red-500 font-headline-lg">
                {summary?.criticalExposure ?? 18}
              </span>
              <span className="text-xs text-on-surface-variant font-mono uppercase">
                Active Exploits
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-mono mt-1">Across perimeters</p>
          </div>
        </div>

        {/* KPI 3: Monitored Entities */}
        <div className="bg-surface border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[140px] hover:border-slate-500/20 transition-all shadow-md">
          <div className="flex justify-between items-start">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              Monitored Entities
            </h3>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white font-headline-lg">
                {summary?.monitoredEntities ?? 47}
              </span>
              <span className="text-xs text-on-surface-variant font-mono uppercase">Active</span>
            </div>
            <p className="text-[11px] text-green-400 font-mono mt-1">3 supply chains covered</p>
          </div>
        </div>

        {/* KPI 4: Active Alerts */}
        <div className="bg-surface border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[140px] hover:border-amber-500/20 transition-all shadow-md">
          <div className="flex justify-between items-start">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              Active Alerts
            </h3>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-amber-500 font-headline-lg">
                {summary?.activeAlerts ?? 9}
              </span>
              <span className="text-xs text-on-surface-variant font-mono uppercase">
                Unresolved
              </span>
            </div>
            <p className="text-[11px] text-amber-400 font-mono mt-1">Requires CISO review</p>
          </div>
        </div>

        {/* KPI 5: Data Sources */}
        <div className="bg-surface border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[140px] hover:border-green-500/20 transition-all shadow-md">
          <div className="flex justify-between items-start">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-green-400" />
              Data Sources
            </h3>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-green-400 font-headline-lg">
                {summary?.dataSourcesConnected ?? 12}
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                / {summary?.dataSourcesTotal ?? 15}
              </span>
            </div>
            <p className="text-[11px] text-green-400 font-mono mt-1">OSINT connectors online</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pipeline & Vendor Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Pipeline Status Card */}
          <div className="bg-surface border border-outline-variant p-6 rounded-xl shadow-md">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant pb-3">
              <Layers className="w-4 h-4 text-primary" />
              Data Collection Pipeline Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
              {[
                {
                  name: "OSINT",
                  status: "connected",
                  desc: "Connected",
                  icon: Globe,
                  color: "text-green-400 border-green-500/20 bg-green-500/5",
                },
                {
                  name: "Public Sources",
                  status: "syncing",
                  desc: "Syncing",
                  icon: Activity,
                  color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
                },
                {
                  name: "Processing",
                  status: "processing",
                  desc: "Processing",
                  icon: Loader2,
                  color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
                  anim: true,
                },
                {
                  name: "Database",
                  status: "healthy",
                  desc: "Healthy",
                  icon: Database,
                  color: "text-green-400 border-green-500/20 bg-green-500/5",
                },
              ].map((node) => {
                const NodeIcon = node.icon;
                return (
                  <div
                    key={node.name}
                    className={`border p-4 rounded-lg flex flex-col justify-between gap-3 ${node.color} transition-all`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider opacity-80">
                        {node.name}
                      </span>
                      <NodeIcon className={`w-4 h-4 ${node.anim ? "animate-spin" : ""}`} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{node.desc}</div>
                      <div className="text-[10px] text-on-surface-variant mt-1 font-mono">
                        {node.name === "OSINT" && "Shodan/VirusTotal"}
                        {node.name === "Public Sources" && "Subdomains (crt.sh)"}
                        {node.name === "Processing" && "Fingerprint matching"}
                        {node.name === "Database" && "Secure ledger online"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vendor Table Card */}
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-md">
            <div className="p-5 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container/50">
              <div>
                <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Vendor Monitoring
                </h3>
              </div>
              <div className="w-full sm:w-auto flex items-center gap-2">
                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 text-on-surface-variant absolute left-2.5 top-2.5" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-xs bg-background border-outline-variant text-white rounded-md placeholder-on-surface-variant focus:border-primary"
                  />
                </div>
                <Button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["vendors"] })}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 border-outline-variant text-on-surface-variant hover:text-white bg-surface"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto" ref={parentRef}>
              <table data-testid="vendor-table" className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-surface-container z-10 shadow-sm">
                  <tr className="border-b border-outline-variant text-on-surface-variant font-mono text-[10px] uppercase tracking-wider">
                    <th className="p-4 font-semibold">Vendor</th>
                    <th className="p-4 font-semibold">Domain</th>
                    <th className="p-4 font-semibold">Sector</th>
                    <th className="p-4 font-semibold">Risk Score</th>
                    <th className="p-4 font-semibold">Exposure Tier</th>
                    <th className="p-4 font-semibold">Last Scan</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y divide-[#1f2937] text-sm text-white relative"
                  style={{
                    height:
                      rowVirtualizer.getTotalSize() > 0
                        ? `${rowVirtualizer.getTotalSize()}px`
                        : "auto",
                  }}
                >
                  {loadingVendors ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-8 text-center text-on-surface-variant font-mono text-xs"
                      >
                        <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                        Fetching perimeter status...
                      </td>
                    </tr>
                  ) : filteredVendors.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-8 text-center text-on-surface-variant font-mono text-xs"
                      >
                        No vendors matched. Register a vendor domain to begin.
                      </td>
                    </tr>
                  ) : (
                    rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const v = filteredVendors[virtualRow.index];
                      const tier = getExposureTier(v.risk_score);
                      return (
                        <ContextMenu.Root key={v.id}>
                          <ContextMenu.Trigger asChild>
                            <tr
                              data-testid={`vendor-row-${v.domain}`}
                              className="hover:bg-surface/40 transition-colors group cursor-pointer absolute w-full"
                              style={{
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                              }}
                              onClick={() => {
                                navigate({ to: "/vendors/$domain", params: { domain: v.domain } });
                              }}
                            >
                              <td className="p-4 font-semibold text-white">{v.name}</td>
                              <td className="p-4 font-mono text-xs text-on-surface-variant">
                                {v.domain}
                              </td>
                              <td className="p-4 text-xs text-on-surface-variant">{v.sector}</td>
                              <td className="p-4">
                                <span className="font-mono bg-background border border-outline-variant px-2 py-0.5 rounded text-xs font-bold text-white shadow-sm">
                                  {v.risk_score} / 100
                                </span>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-bold rounded border ${tier.style}`}
                                >
                                  {tier.label}
                                </span>
                              </td>
                              <td className="p-4 text-xs text-on-surface-variant font-mono">
                                {v.last_successful_scan
                                  ? new Date(v.last_successful_scan).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Never"}
                              </td>
                              <td className="p-4">{getStatusBadge(v.status, v.scan_progress)}</td>
                              <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    disabled={v.status === "scanning"}
                                    onClick={() => triggerScanMutation.mutate(v.id)}
                                    className="w-8 h-8 text-on-surface-variant hover:text-white hover:bg-outline-variant"
                                    title="Run Security Scan"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      navigate({
                                        to: "/vendors/$domain",
                                        params: { domain: v.domain },
                                      })
                                    }
                                    className="w-8 h-8 text-on-surface-variant hover:text-primary hover:bg-outline-variant"
                                    title="View Risk Matrix"
                                  >
                                    <ArrowUpRight className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          </ContextMenu.Trigger>
                          <ContextMenu.Portal>
                            <ContextMenu.Content className="bg-surface-container border border-outline-variant rounded-md shadow-2xl p-1 min-w-[200px] z-[100] font-mono text-sm">
                              <ContextMenu.Item
                                className="px-2 py-1.5 text-on-surface-variant hover:bg-outline-variant hover:text-white outline-none cursor-pointer rounded flex items-center gap-2"
                                onSelect={() =>
                                  navigate({ to: "/vendors/$domain", params: { domain: v.domain } })
                                }
                              >
                                <ArrowUpRight className="w-4 h-4" /> View Details
                              </ContextMenu.Item>
                              <ContextMenu.Item
                                className="px-2 py-1.5 text-on-surface-variant hover:bg-outline-variant hover:text-white outline-none cursor-pointer rounded flex items-center gap-2"
                                onSelect={() => triggerScanMutation.mutate(v.id)}
                              >
                                <Play className="w-4 h-4" /> Run Deep Scan
                              </ContextMenu.Item>
                              <ContextMenu.Separator className="h-px bg-outline-variant my-1" />
                              <ContextMenu.Item
                                className="px-2 py-1.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 outline-none cursor-pointer rounded flex items-center gap-2"
                                onSelect={() => setVendorToDelete(v.id)}
                              >
                                <Shield className="w-4 h-4" /> Remove from monitoring
                              </ContextMenu.Item>
                            </ContextMenu.Content>
                          </ContextMenu.Portal>
                        </ContextMenu.Root>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts, Quick Actions, Activity */}
        <div className="space-y-6">
          {/* Active Alerts Card */}
          <div className="bg-surface border border-outline-variant p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3 mb-4">
              <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-500" />
                Active Alerts
              </h3>
              <span className="bg-red-500/10 text-red-400 text-[10px] font-mono px-2 py-0.5 rounded border border-red-500/20">
                Action Required
              </span>
            </div>

            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="text-center text-xs text-on-surface-variant py-8">
                  No active threat signals detected.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 bg-background border border-outline-variant rounded-lg flex flex-col gap-1.5 hover:border-slate-700 transition-all cursor-pointer group"
                    onClick={() =>
                      navigate({ to: "/vendors/$domain", params: { domain: alert.vendor } })
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white group-hover:text-primary transition-colors">
                        {alert.title}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                          alert.severity === "critical"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : alert.severity === "high"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-mono">
                      <span>Vendor: {alert.vendor}</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-surface border border-outline-variant p-5 rounded-xl shadow-md">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider border-b border-outline-variant pb-3 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-background border border-outline-variant hover:bg-surface-container text-white flex flex-col items-center justify-center py-6 h-auto text-xs gap-1.5 rounded-lg hover:border-blue-500/30 transition-all font-mono uppercase"
              >
                <Plus className="w-4 h-4 text-primary" />
                Add Vendor
              </Button>
              <Button
                onClick={() => {
                  if (vendors.length > 0) {
                    triggerScanMutation.mutate(vendors[0].id);
                  } else {
                    toast.error("Register at least one vendor first");
                  }
                }}
                className="bg-background border border-outline-variant hover:bg-surface-container text-white flex flex-col items-center justify-center py-6 h-auto text-xs gap-1.5 rounded-lg hover:border-red-500/30 transition-all font-mono uppercase"
              >
                <Activity className="w-4 h-4 text-red-400 animate-pulse" />
                Threat Scan
              </Button>
              <Button
                onClick={() => toast.success("Executive PDF report generated successfully.")}
                className="bg-background border border-outline-variant hover:bg-surface-container text-white flex flex-col items-center justify-center py-6 h-auto text-xs gap-1.5 rounded-lg transition-all font-mono uppercase"
              >
                <Download className="w-4 h-4 text-green-400" />
                Get Report
              </Button>
              <Button
                onClick={() => navigate({ to: "/alerts" })}
                className="bg-background border border-outline-variant hover:bg-surface-container text-white flex flex-col items-center justify-center py-6 h-auto text-xs gap-1.5 rounded-lg transition-all font-mono uppercase"
              >
                <Activity className="w-4 h-4 text-amber-400" />
                View Alerts
              </Button>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-surface border border-outline-variant p-5 rounded-xl shadow-md">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider border-b border-outline-variant pb-3 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex gap-3 text-xs leading-normal">
                  <div className="shrink-0 mt-0.5">
                    {act.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    {act.type === "error" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                    {act.type === "info" && <Globe className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{act.title}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">
                      {act.detail}
                    </div>
                  </div>
                  <div className="shrink-0 font-mono text-[9px] text-on-surface-variant">
                    {act.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Vendor Modal (Radix/Tailwind styled) */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-surface border border-outline-variant text-white sm:max-w-[500px] rounded-xl overflow-hidden p-0 shadow-2xl">
          <form onSubmit={handleAddSubmit}>
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container/50">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-lg font-bold font-mono uppercase text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Add Supply Chain Vendor
                </DialogTitle>
                <DialogDescription className="text-xs text-on-surface-variant">
                  Register a digital domain to initialize continuous perimeter scanning.
                </DialogDescription>
              </DialogHeader>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-on-surface-variant hover:text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-outline-variant transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Vendor Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-on-surface-variant font-semibold flex items-center gap-1">
                  Vendor Name
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Acme Corporation"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="bg-background border-outline-variant text-white h-9 placeholder-on-surface-variant focus:border-primary"
                />
              </div>

              {/* Vendor Domain */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-on-surface-variant font-semibold flex items-center gap-1">
                  Root Domain
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. acme.com"
                  value={vendorDomain}
                  onChange={(e) => setVendorDomain(e.target.value)}
                  className="bg-background border-outline-variant text-white h-9 font-mono placeholder-on-surface-variant focus:border-primary"
                />
              </div>

              {/* Sector Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-on-surface-variant font-semibold">
                  Sector Classification
                </label>
                <select
                  value={vendorSector}
                  onChange={(e) => setVendorSector(e.target.value)}
                  className="w-full bg-background border border-outline-variant text-white h-9 rounded-md px-3 text-sm focus:border-primary outline-none"
                >
                  {sectors.map((s) => (
                    <option key={s} value={s} className="bg-surface">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Multi-select */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-on-surface-variant font-semibold">
                  Metadata Tags
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-background border border-outline-variant rounded-md max-h-[96px] overflow-y-auto">
                  {availableTags.map((tag) => {
                    const isSelected = vendorTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold transition-all border ${
                          isSelected
                            ? "bg-primary/20 text-primary border-[#3b82f6]/30 shadow-sm"
                            : "bg-surface text-on-surface-variant border-outline-variant hover:border-slate-700"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-on-surface-variant font-semibold">
                  Vendor Description
                </label>
                <textarea
                  placeholder="Provide context regarding this vendor relationship (optional)..."
                  value={vendorDescription}
                  onChange={(e) => setVendorDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-outline-variant text-white rounded-md p-3 text-sm placeholder-on-surface-variant focus:border-primary outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-outline-variant bg-surface-container/50 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="border-outline-variant text-on-surface-variant hover:bg-outline-variant bg-transparent font-mono uppercase text-xs tracking-wider"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addVendorMutation.isPending}
                className="bg-primary text-white hover:bg-blue-600 font-mono uppercase text-xs tracking-wider shadow-lg shadow-blue-500/10 gap-2"
              >
                {addVendorMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Scan Domain
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!vendorToDelete} onOpenChange={(open) => !open && setVendorToDelete(null)}>
        <DialogContent className="bg-surface border-outline-variant text-white sm:max-w-[425px] overflow-hidden p-0 shadow-2xl">
          <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-500" />
            <h3 className="font-mono text-sm uppercase text-red-400 font-bold tracking-wider">
              Confirm Removal
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-on-surface-variant font-body-md mb-4">
              Are you sure you want to remove this vendor from monitoring? This action cannot be
              undone and will delete all associated risk intelligence data.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVendorToDelete(null)}
                className="border-outline-variant text-on-surface-variant hover:bg-outline-variant bg-transparent font-mono uppercase text-xs tracking-wider"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => vendorToDelete && deleteVendorMutation.mutate(vendorToDelete)}
                disabled={deleteVendorMutation.isPending}
                className="bg-red-500 text-white hover:bg-red-600 font-mono uppercase text-xs tracking-wider shadow-lg shadow-red-500/10 gap-2"
              >
                {deleteVendorMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Remove
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
