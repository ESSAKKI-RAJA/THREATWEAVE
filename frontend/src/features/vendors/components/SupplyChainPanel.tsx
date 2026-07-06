import React, { useState } from "react";
import { Share2 } from "lucide-react";
import { useSupplyChainRisk, useSupplyChainDepth } from "../hooks/useVendorIntelligence";
import { SupplyChainGraph } from "./SupplyChainGraph";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { DataModule } from "@/components/DataModule";
import { SeverityBadge } from "@/components/SeverityBadge";

export const SupplyChainPanel = ({
  vendorId,
  suppressColdStartMessage,
}: {
  vendorId: string | undefined;
  suppressColdStartMessage?: boolean;
}) => {
  const [viewMode, setViewMode] = useState<"list" | "graph">("graph");
  const { data, isLoading, error, refetch } = useSupplyChainRisk(vendorId);
  const { data: depthData } = useSupplyChainDepth(vendorId);

  const getStatus = () => {
    if (isLoading || (!data && !error)) return "cold-start";
    if (error || !data) return "error";
    return "populated";
  };

  const status = getStatus();
  const cascade = (data as any)?.cascade_metrics || {};
  const deps = (data as any)?.dependencies || [];

  return (
    <DataModule
      title="Supply Chain Cascade"
      icon={<Share2 className="w-5 h-5" />}
      status={status}
      onRetry={() => refetch()}
      skeletonType="graph"
      suppressColdStartMessage={suppressColdStartMessage}
      themeTone="default"
      headerRight={
        status === "populated" ? (
          <div className="flex bg-surface border border-outline-variant rounded-sm overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 text-xs font-label-md uppercase tracking-wider transition-colors ${viewMode === "list" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-variant"}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("graph")}
              className={`px-3 py-1 text-xs font-label-md uppercase tracking-wider transition-colors ${viewMode === "graph" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-variant"}`}
            >
              Graph
            </button>
          </div>
        ) : undefined
      }
    >
      {!!data && (
        <div className="flex flex-col h-full space-y-6">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Downstream Count
              </span>
              <span className="font-display-lg text-display-lg text-on-surface">
                {cascade.downstream_count || 0}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Avg Cascade Risk
              </span>
              <span className="font-display-lg text-display-lg text-tertiary">
                {Math.round(cascade.avg_downstream_risk || 0)}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-[300px]">
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-2 border-b border-outline-variant pb-2">
              Dependencies Mapping
            </h4>
            {deps.length === 0 ? (
              <p className="text-sm font-data-mono text-on-surface-variant py-4 text-center">
                No dependencies mapped.
              </p>
            ) : viewMode === "list" ? (
              <ul className="space-y-2 overflow-y-auto flex-1">
                {deps.map((d: any, i: number) => {
                  const riskScore = d.vendors?.risk_score || 0;
                  return (
                    <li
                      key={i}
                      className="flex items-center justify-between p-3 rounded-sm bg-surface-variant border border-outline-variant text-sm"
                    >
                      <span className="font-data-mono text-on-surface">
                        {d.vendors?.domain || d.target_vendor_id}
                      </span>
                      <SeverityBadge
                        severity={riskScore > 70 ? "critical" : riskScore > 50 ? "high" : "low"}
                        showIcon={false}
                        label={`Risk: ${riskScore}`}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="border border-outline-variant rounded-sm overflow-hidden bg-surface-variant flex-1 min-h-[300px]">
                <SupplyChainGraph vendorId={vendorId!} dependencies={deps} />
              </div>
            )}
          </div>

          {depthData && depthData.maxDepth > 0 && (
            <div className="pt-6 border-t border-outline-variant">
              <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-4">
                Risk By Depth Level
              </h4>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(depthData.depths).map(([d, stat]) => ({
                      depth: `Depth ${d}`,
                      risk: (stat as any).avgRisk,
                    }))}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.2}
                      vertical={false}
                      stroke="currentColor"
                      className="text-outline-variant"
                    />
                    <XAxis
                      dataKey="depth"
                      tick={{
                        fontSize: 12,
                        fill: "var(--on-surface-variant)",
                        fontFamily: "var(--font-data-mono)",
                      }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{
                        fontSize: 12,
                        fill: "var(--on-surface-variant)",
                        fontFamily: "var(--font-data-mono)",
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--surface-variant)", opacity: 0.5 }}
                      contentStyle={{
                        backgroundColor: "var(--surface-container-high)",
                        borderColor: "var(--outline)",
                        color: "var(--on-surface)",
                      }}
                    />
                    <Bar dataKey="risk" fill="var(--primary)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </DataModule>
  );
};
