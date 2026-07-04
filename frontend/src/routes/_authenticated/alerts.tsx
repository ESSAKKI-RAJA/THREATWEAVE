import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAlerts } from "@/api/alerts.api";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/alerts")({
  component: AlertsDashboard,
});

function AlertsDashboard() {
  const fetchAlerts = useServerFn(getAlerts);
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
                <span className="material-symbols-outlined font-bold">
                  {alert.severity === "critical" ? "warning" : "gpp_maybe"}
                </span>
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
                onClick={() => toast.info(`Viewing details for alert ${alert.id}`)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
