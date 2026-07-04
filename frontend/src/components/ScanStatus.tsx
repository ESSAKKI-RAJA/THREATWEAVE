import { CheckCircle2, Loader2, XCircle, Clock, AlertTriangle } from "lucide-react";

export interface ScanPhase {
  name: "DNS" | "Shodan" | "VirusTotal" | "crt.sh" | "GitHub" | "Threat Feeds" | "Risk Scoring";
  status: "pending" | "running" | "success" | "failed" | "skipped" | "fallback";
  error?: string;
  durationMs?: number;
}

export function ScanStatus({ phases }: { phases: ScanPhase[] }) {
  return (
    <div className="flex flex-col gap-3 py-4">
      {phases.map((phase) => (
        <div
          key={phase.name}
          className={`flex items-center gap-3 text-sm transition-opacity ${
            phase.status === "pending"
              ? "text-muted-foreground opacity-30"
              : phase.status === "running"
                ? "text-primary font-medium"
                : "text-foreground"
          }`}
        >
          {phase.status === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : phase.status === "fallback" ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : phase.status === "failed" ? (
            <XCircle className="h-4 w-4 text-destructive" />
          ) : phase.status === "running" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : phase.status === "skipped" ? (
            <Clock className="h-4 w-4 text-muted-foreground" />
          ) : (
            <div className="h-4 w-4 rounded-full border-2 border-muted" />
          )}

          <div className="flex-1 flex justify-between items-center">
            <span>
              {phase.name}
              {phase.status === "running" && " scanning..."}
              {phase.status === "success" && " complete"}
              {phase.status === "fallback" && " used fallback"}
              {phase.status === "failed" && " failed"}
              {phase.status === "skipped" && " skipped"}
            </span>
            {phase.durationMs !== undefined &&
              phase.status !== "pending" &&
              phase.status !== "running" && (
                <span className="text-xs text-muted-foreground">
                  (
                  {phase.durationMs < 1000
                    ? `${phase.durationMs}ms`
                    : `${(phase.durationMs / 1000).toFixed(1)}s`}
                  )
                </span>
              )}
          </div>

          {phase.error && phase.status === "failed" && (
            <span
              className="text-xs text-destructive ml-2 max-w-[200px] truncate"
              title={phase.error}
            >
              - {phase.error}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
