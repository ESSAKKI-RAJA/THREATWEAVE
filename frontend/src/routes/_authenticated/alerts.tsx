import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAlerts, type Alert } from "@/api/alerts.api";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/alerts")({
  component: AlertsDashboard,
});

function AlertsDashboard() {
  const fetchAlerts = useServerFn(getAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => fetchAlerts(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Live Alerts</h1>
        <p className="text-slate-400 mt-1">
          Consolidated security event correlation from integrated sensors.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  alert.severity === "critical"
                    ? "bg-red-900/20 text-red-500"
                    : alert.severity === "high"
                      ? "bg-orange-900/20 text-orange-500"
                      : "bg-yellow-900/20 text-yellow-500"
                }`}
              >
                {alert.severity === "critical" ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <ShieldAlert className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-500">{alert.id}</span>
                  <span className="text-xs font-semibold text-teal-500 uppercase tracking-wider">
                    {alert.source}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-200">{alert.title}</h3>
                <p className="text-sm text-slate-400">{alert.time}</p>
              </div>
            </div>
            <div>
              <button
                onClick={() => setSelectedAlert(alert)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              Alert Details: {selectedAlert?.id}
            </DialogTitle>
            <DialogDescription className="text-slate-400">{selectedAlert?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 font-mono text-xs">Source</span>
                <p className="font-semibold">{selectedAlert?.source}</p>
              </div>
              <div>
                <span className="text-slate-500 font-mono text-xs">Severity</span>
                <p className="font-semibold uppercase">{selectedAlert?.severity}</p>
              </div>
              <div>
                <span className="text-slate-500 font-mono text-xs">Status</span>
                <p className="font-semibold capitalize">{selectedAlert?.status}</p>
              </div>
              <div>
                <span className="text-slate-500 font-mono text-xs">Vendor</span>
                <p className="font-semibold font-mono text-primary">{selectedAlert?.vendor}</p>
              </div>
              <div>
                <span className="text-slate-500 font-mono text-xs">Time</span>
                <p className="font-semibold">{selectedAlert?.time}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition-colors border border-slate-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
