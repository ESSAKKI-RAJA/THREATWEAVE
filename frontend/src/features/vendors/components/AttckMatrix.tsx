import React from "react";
import { useVendorAttck } from "../hooks/useVendorIntelligence";
import { DataModule } from "@/components/DataModule";

export const AttckMatrix = ({
  vendorId,
  suppressColdStartMessage,
}: {
  vendorId: string | undefined;
  suppressColdStartMessage?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useVendorAttck(vendorId);

  const getStatus = () => {
    if (isLoading || (!data && !error)) return "cold-start";
    if (error || !data) return "error";
    return "populated";
  };

  const status = getStatus();
  const techniques = data?.techniques || [];

  return (
    <DataModule
      title="MITRE ATT&CK Intelligence"
      icon="warning"
      status={status}
      onRetry={() => refetch()}
      skeletonType="matrix"
      suppressColdStartMessage={suppressColdStartMessage}
      themeTone="default"
    >
      {!!data && (
        <div className="w-full">
          {techniques.length === 0 ? (
            <p className="text-sm font-data-mono text-on-surface-variant">
              No ATT&CK techniques mapped to current vulnerabilities.
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {techniques.map((t: any, i: number) => {
                // Calculate opacity based on count (min 0.2, max 1.0)
                const maxCount = Math.max(...techniques.map((t: any) => t.count));
                const intensity = maxCount > 0 ? Math.max(0.2, t.count / maxCount) : 0.2;

                return (
                  <div
                    key={i}
                    className="flex items-center justify-center p-2 rounded-sm text-xs font-data-mono font-bold text-white transition-all hover:scale-105 border border-error/20"
                    style={{ backgroundColor: `rgba(239, 68, 68, ${intensity})` }}
                    title={`${t.technique_id}: ${t.count} related CVEs`}
                  >
                    {t.technique_id}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </DataModule>
  );
};
