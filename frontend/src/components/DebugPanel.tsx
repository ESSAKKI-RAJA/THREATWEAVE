import { useEffect, useState } from "react";
import { Terminal, XCircle, CheckCircle, AlertTriangle, X } from "lucide-react";
import { checkHealth } from "../lib/health.functions";
import { Button } from "./ui/button";

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchHealth() {
    setLoading(true);
    try {
      const data = await checkHealth();
      setHealthData(data);
    } catch (e) {
      console.error("Failed to fetch health data", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur"
        onClick={() => setIsOpen(true)}
      >
        <Terminal className="h-4 w-4 mr-2" />
        Diagnostics
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-background border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">OSINT Diagnostics</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={fetchHealth}
            disabled={loading}
          >
            <span className="sr-only">Refresh</span>
            <div
              className={`h-3 w-3 rounded-full ${
                healthData?.status === "healthy"
                  ? "bg-green-500"
                  : healthData?.status === "degraded"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-sm text-muted-foreground animate-pulse">Running diagnostics...</div>
        ) : healthData ? (
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground mb-4">
              Environment: Node {healthData.environment.node} | APIs Configured:{" "}
              {healthData.environment.apis_configured}
            </div>

            <div className="space-y-3">
              {Object.entries(healthData.services).map(([key, value]: [string, any]) => (
                <div
                  key={key}
                  className="flex items-start justify-between bg-muted/20 p-2 rounded-md border border-border/50"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono font-medium capitalize flex items-center gap-2">
                      {key.replace("_", " ")}
                      {value.latency !== undefined && (
                        <span className="text-[10px] text-muted-foreground font-sans">
                          {value.latency}ms
                        </span>
                      )}
                    </span>
                    {value.error && <span className="text-[10px] text-red-400">{value.error}</span>}
                    {value.status === "failed" && !value.error && (
                      <span className="text-[10px] text-yellow-500">Using Mock Data Fallback</span>
                    )}
                  </div>
                  {value.status === "connected" ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                  )}
                </div>
              ))}
            </div>

            {healthData.status !== "healthy" && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-400 mt-0.5" />
                  <p className="text-xs text-blue-200">
                    <span className="font-semibold block mb-1">DEMO MODE ACTIVE</span>
                    Failed APIs will automatically fall back to realistic mock data to ensure the
                    dashboard remains functional.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-destructive">Failed to load diagnostics.</div>
        )}
      </div>
    </div>
  );
}
