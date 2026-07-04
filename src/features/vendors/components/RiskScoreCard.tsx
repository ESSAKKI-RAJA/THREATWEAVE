import React from "react";
import { Badge } from "@/components/ui/badge";
import { useVendorRiskDetails } from "../hooks/useVendorIntelligence";
import { DataModule } from "@/components/DataModule";

export const RiskScoreCard = ({
  vendorId,
  suppressColdStartMessage,
}: {
  vendorId: string | undefined;
  suppressColdStartMessage?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useVendorRiskDetails(vendorId);

  const getStatus = () => {
    if (isLoading || (!data && !error)) return "cold-start";
    if (error || !data) return "error";
    return "populated";
  };

  const status = getStatus();
  const vulns = (data as any)?.vulnerabilities || [];

  return (
    <DataModule
      title="Risk Details"
      icon="warning"
      status={status}
      onRetry={() => refetch()}
      skeletonType="list"
      suppressColdStartMessage={suppressColdStartMessage}
      themeTone="error"
    >
      {!!data && (
        <div className="space-y-4">
          <div>
            <h3 className="font-label-md text-label-md mb-2 text-on-surface">
              Active Vulnerabilities ({vulns.length})
            </h3>
            {vulns.length === 0 ? (
              <p className="text-sm text-on-surface-variant font-data-mono">
                No active vulnerabilities detected.
              </p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {vulns.map((v: any, i: number) => (
                  <li
                    key={i}
                    className="flex flex-col p-3 bg-surface-variant rounded-md border border-outline-variant text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-data-mono font-medium text-on-surface">{v.cve_id}</span>
                      <div className="flex gap-2">
                        {v.known_exploited && (
                          <span className="bg-error-container text-on-error-container text-[10px] uppercase px-1.5 py-0.5 rounded-sm">
                            CISA KEV
                          </span>
                        )}
                        <span className="border border-outline-variant text-on-surface text-[10px] uppercase px-1.5 py-0.5 rounded-sm">
                          CVSS: {v.cvss_score}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-on-surface-variant mt-1 font-data-mono">
                      EPSS: {(v.epss_score * 100).toFixed(1)}% Likelihood
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </DataModule>
  );
};
