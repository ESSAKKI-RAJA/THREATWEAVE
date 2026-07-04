import { cn } from "@/lib/utils";

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
        return "warning";
      case "medium":
      case "low":
        return "info";
      default:
        return "check_circle";
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
      {showIcon && (
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}
        >
          {getIcon()}
        </span>
      )}
      {label || severity.toUpperCase()}
    </span>
  );
}
