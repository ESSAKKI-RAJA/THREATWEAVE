import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  RefreshCw,
  Crosshair,
  Sparkles,
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportJSON, exportCSV, exportPDF } from "@/lib/export.utils";
import { useVendorActions } from "@/hooks/useVendors";
import { useState } from "react";

interface VendorHeaderProps {
  vendor: any;
  scan: any;
  domain: string;
}

export const VendorHeader = ({ vendor, scan, domain }: VendorHeaderProps) => {
  const navigate = useNavigate();
  const { rescanMutation, narrateMutation, matchMutation, deleteVendorMutation } =
    useVendorActions();
  const [busy, setBusy] = useState<null | "scan" | "ai" | "match" | "delete">(null);

  const onRescan = async () => {
    setBusy("scan");
    try {
      await rescanMutation.mutateAsync(vendor.domain);
    } finally {
      setBusy(null);
    }
  };

  const onNarrate = async () => {
    if (!scan) return;
    setBusy("ai");
    try {
      await narrateMutation.mutateAsync(scan.id);
    } finally {
      setBusy(null);
    }
  };

  const onMatch = async () => {
    if (!scan) return;
    setBusy("match");
    try {
      await matchMutation.mutateAsync(scan.id);
    } finally {
      setBusy(null);
    }
  };

  const onDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this vendor and all associated intelligence?",
      )
    )
      return;
    setBusy("delete");
    try {
      await deleteVendorMutation.mutateAsync(vendor.id);
      navigate({ to: "/dashboard" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-gutter">
      <div>
        <Link
          to="/dashboard"
          className="text-sm font-label-md uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Intelligence Dashboard
        </Link>
        <div className="flex items-center gap-4 mt-1">
          <h1 className="font-display-lg text-display-lg uppercase tracking-tighter text-on-surface">
            {vendor.name}
          </h1>
          <span className="font-data-mono text-data-mono text-on-surface-variant bg-surface-variant px-3 py-1 border border-outline-variant">
            {vendor.domain}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onRescan}
          disabled={busy !== null}
          className="bg-surface-variant text-on-surface-variant font-label-md text-label-md uppercase px-4 py-2 border border-outline-variant hover:bg-surface hover:text-on-surface transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {busy === "scan" ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh Intelligence
        </button>
        <button
          onClick={onMatch}
          disabled={busy !== null || !scan}
          className="bg-surface-variant text-on-surface-variant font-label-md text-label-md uppercase px-4 py-2 border border-outline-variant hover:bg-surface hover:text-on-surface transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {busy === "match" ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Crosshair className="w-4 h-4" />
          )}
          Run Threat Match
        </button>
        <button
          onClick={onNarrate}
          disabled={busy !== null || !scan}
          className="bg-primary text-on-primary font-label-md text-label-md uppercase px-4 py-2 hover:bg-surface-tint transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {busy === "ai" ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Synthesize Report
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-surface-variant text-on-surface-variant font-label-md text-label-md uppercase px-4 py-2 border border-outline-variant hover:bg-surface hover:text-on-surface transition-colors flex items-center gap-2 disabled:opacity-50">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-surface-container-high border-outline-variant font-data-mono text-on-surface"
          >
            <DropdownMenuItem
              onClick={exportPDF}
              className="hover:bg-surface-variant cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2" /> PDF Report (Print)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (scan) exportCSV(domain, scan, vendor, vendor.risk_score);
              }}
              className="hover:bg-surface-variant cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV Metrics
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (scan) exportJSON(domain, scan, vendor);
              }}
              className="hover:bg-surface-variant cursor-pointer"
            >
              <FileJson className="w-4 h-4 mr-2" /> Raw OSINT JSON
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-error focus:text-error hover:bg-error-container hover:text-on-error-container cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Vendor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
