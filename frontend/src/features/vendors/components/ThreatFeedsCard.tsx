import React from "react";
import { Shield } from "lucide-react";
import { useVendorThreatFeeds } from "../hooks/useVendorIntelligence";
import { DataModule } from "@/components/DataModule";

export const ThreatFeedsCard = ({
  vendorId,
  suppressColdStartMessage,
}: {
  vendorId: string | undefined;
  suppressColdStartMessage?: boolean;
}) => {
  const { data, isLoading, error, refetch } = useVendorThreatFeeds(vendorId);

  const getStatus = () => {
    if (isLoading || (!data && !error)) return "cold-start";
    if (error || !data) return "error";
    return "populated";
  };

  const status = getStatus();

  return (
    <DataModule
      title="Threat Feeds"
      icon={<Shield className="w-5 h-5" />}
      status={status}
      onRetry={() => refetch()}
      skeletonType="list"
      suppressColdStartMessage={suppressColdStartMessage}
      themeTone="default"
    >
      {data && (
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-outline-variant">
            <div className="font-label-md text-label-md text-on-surface">AbuseIPDB Confidence</div>
            <div className="font-data-mono text-xs">
              <span className="bg-error-container text-on-error-container px-2 py-1 rounded-sm border border-error/20">
                {data.abuseipdb?.maliciousIps || 0} IPs flagged
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-outline-variant">
            <div className="font-label-md text-label-md text-on-surface">GreyNoise</div>
            <div className="font-data-mono text-xs capitalize">
              <span
                className={`px-2 py-1 rounded-sm border ${
                  data.greynoise?.classification === "malicious"
                    ? "bg-error-container text-on-error-container border-error/20"
                    : "bg-surface-variant text-on-surface border-outline-variant"
                }`}
              >
                {data.greynoise?.classification === "malicious" ? "Malicious IPs" : "Clean"}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-outline-variant">
            <div className="font-label-md text-label-md text-on-surface">AlienVault OTX</div>
            <div className="font-data-mono text-xs">
              <span className="bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded-sm border border-tertiary/20">
                {data.otx?.pulseCount || 0} related pulses
              </span>
            </div>
          </div>
        </div>
      )}
    </DataModule>
  );
};
