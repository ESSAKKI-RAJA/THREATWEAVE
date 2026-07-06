import { cn } from "@/lib/utils";
import React from "react";
import { SkeletonViz } from "./SkeletonViz";
import { AlertCircle, RefreshCw, Loader2, AlertTriangle } from "lucide-react";

interface DataModuleProps {
  title: string;
  icon: React.ReactNode;
  status: "cold-start" | "error" | "populated";
  errorReason?: string;
  onRetry?: () => void;
  skeletonType?: "chart" | "matrix" | "graph" | "table" | "list";
  suppressColdStartMessage?: boolean;
  themeTone?: "primary" | "error" | "warning" | "default";
  children?: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export function DataModule({
  title,
  icon,
  status,
  errorReason,
  onRetry,
  skeletonType = "chart",
  suppressColdStartMessage = false,
  themeTone = "default",
  children,
  className,
  headerRight,
}: DataModuleProps) {
  const getBentoToneClass = () => {
    switch (themeTone) {
      case "primary":
        return "bento-card-primary";
      case "error":
        return "bento-card-error";
      case "warning":
        return "bento-card-warning";
      default:
        return "";
    }
  };

  const renderColdStart = () => (
    <div className="p-6 ml-1 flex-1 flex flex-col gap-2 relative min-h-[250px]">
      <SkeletonViz type={skeletonType} className="absolute inset-0 p-6" />

      {!suppressColdStartMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container/60 backdrop-blur-[2px] z-10">
          <span className="font-data-mono text-data-mono text-on-surface-variant uppercase tracking-widest text-center px-4">
            Awaiting Initial Scan
          </span>
        </div>
      )}
    </div>
  );

  const renderError = () => (
    <div className="p-6 ml-1 flex-1 flex flex-col items-center justify-center text-center gap-4 min-h-[250px]">
      <div className="w-12 h-12 rounded bg-tertiary-container/10 flex items-center justify-center mb-2">
        <AlertTriangle className="w-8 h-8 text-tertiary-container" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Data Unavailable</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
          {errorReason || "Failed to retrieve this intelligence module."}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 bg-surface-variant hover:bg-surface text-on-surface-variant hover:text-on-surface border border-outline-variant px-4 py-2 rounded-sm font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Module
        </button>
      )}
    </div>
  );

  return (
    <section
      className={cn(
        "bento-card bg-surface-container border border-outline-variant flex flex-col relative",
        getBentoToneClass(),
        className,
      )}
    >
      <header className="flex justify-between items-center px-4 py-3 border-b border-outline-variant bg-surface-container-high ml-1 z-10">
        <h2 className="font-headline-sm text-headline-sm text-on-surface-variant flex items-center gap-2 uppercase">
          {icon}
          {title}
        </h2>
        {headerRight ? (
          headerRight
        ) : status === "cold-start" ? (
          <Loader2 className="w-4 h-4 text-on-surface-variant animate-spin" />
        ) : status === "error" ? (
          <AlertCircle className="w-4 h-4 text-tertiary-container" />
        ) : null}
      </header>

      {status === "cold-start" && renderColdStart()}
      {status === "error" && renderError()}
      {status === "populated" && (
        <div className="p-6 ml-1 flex-1 flex flex-col relative h-full">{children}</div>
      )}
    </section>
  );
}
