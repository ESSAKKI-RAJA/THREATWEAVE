import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export type Severity = "critical" | "high" | "medium" | "low" | "baseline";

interface SeverityBadgeProps {
  severity: Severity;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function SeverityBadge({ severity, label, className, showIcon = true }: SeverityBadgeProps) {
  const getStyles = () => {
    switch (severity) {
      case "critical":
        return "bg-error-container text-on-error-container border-error/20";
      case "high":
        return "bg-error-container text-on-error-container border-error/20"; // HTML used same for HIGH and CRITICAL, but typically CRITICAL is more severe
      case "medium":
      case "low":
        return "bg-tertiary-container text-on-tertiary-container border-tertiary/20";
      case "baseline":
        return "bg-surface-variant text-on-surface border-outline-variant";
      default:
        return "bg-surface-variant text-on-surface border-outline-variant";
    }
  };

  const getIcon = () => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case "medium":
      case "low":
        return <Info className="w-3.5 h-3.5" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 font-data-mono text-data-mono font-bold rounded-sm border flex items-center gap-1",
        getStyles(),
        className,
      )}
    >
      {showIcon && getIcon()}
      {label || severity.toUpperCase()}
    </span>
  );
}
