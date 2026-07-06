import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Radar, LineChart, AlertTriangle, Network } from "lucide-react";
import { useVendor, useVendorScan } from "@/hooks/useVendors";
import {
  useVendorRiskDetails,
  useSupplyChainRisk,
  useForecast,
  useVendorThreatFeeds,
  useVendorAttck,
} from "@/features/vendors/hooks/useVendorIntelligence";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Feature Components
import { VendorHeader } from "@/features/vendors/components/VendorHeader";
import { RiskScoreCard } from "@/features/vendors/components/RiskScoreCard";
import { SupplyChainPanel } from "@/features/vendors/components/SupplyChainPanel";
import { ForecastChart } from "@/features/vendors/components/ForecastChart";
import { AttckMatrix } from "@/features/vendors/components/AttckMatrix";
import { ThreatFeedsCard } from "@/features/vendors/components/ThreatFeedsCard";

export const Route = createFileRoute("/_authenticated/vendors/$domain")({
  component: VendorDetail,
});

function VendorDetail() {
  const { domain } = Route.useParams();

  const { data: vendor, isLoading: vendorLoading } = useVendor(domain);
  const { data: scan, isLoading: scanLoading } = useVendorScan(vendor?.id);

  // Hook into the same react-query cache keys to determine global module state
  const risk = useVendorRiskDetails(vendor?.id);
  const supply = useSupplyChainRisk(vendor?.id);
  const forecast = useForecast(vendor?.id);
  const threat = useVendorThreatFeeds(vendor?.id);
  const attck = useVendorAttck(vendor?.id);

  const getStatus = (q: any) => {
    if (q.isLoading || (!q.data && !q.error)) return "cold-start";
    if (q.error || !q.data) return "error";
    return "populated";
  };

  const statuses = [
    getStatus(risk),
    getStatus(supply),
    getStatus(forecast),
    getStatus(threat),
    getStatus(attck),
  ];

  const coldCount = statuses.filter((s) => s === "cold-start").length;
  const suppressColdStart = coldCount >= 3;

  if (vendorLoading) {
    return (
      <div className="p-margin-mobile md:p-margin-desktop w-full mx-auto space-y-gutter">
        {/* Header Skeleton */}
        <div className="h-32 bg-surface-variant rounded-sm animate-pulse border border-outline-variant"></div>
        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-bento-gap">
          <div className="h-80 bg-surface-variant rounded-sm animate-pulse border border-outline-variant"></div>
          <div className="h-80 bg-surface-variant rounded-sm animate-pulse border border-outline-variant"></div>
          <div className="h-80 bg-surface-variant rounded-sm animate-pulse border border-outline-variant"></div>
          <div className="h-80 bg-surface-variant rounded-sm animate-pulse border border-outline-variant"></div>
        </div>
        {/* Footer Skeleton */}
        <div className="h-96 bg-surface-variant rounded-sm animate-pulse border border-outline-variant"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-12 text-center font-data-mono text-on-surface-variant">
        Vendor not found.
      </div>
    );
  }

  return (
    <>
      {/* Global Status Banner */}
      {suppressColdStart && (
        <div
          className="bg-surface-container-high border-b border-tertiary-container flex items-center px-margin-mobile md:px-margin-desktop py-2 gap-3 shrink-0 z-10 relative"
          role="alert"
        >
          <Radar className="w-5 h-5 text-tertiary-container animate-pulse" />
          <p className="font-data-mono text-data-mono text-on-surface-variant flex-1 truncate">
            <strong className="text-tertiary-container">
              System Status: Awaiting Initial Scan
            </strong>{" "}
            — Intelligence modules are pending data collection. Run a scan to populate.
          </p>
        </div>
      )}

      <div className="p-margin-mobile md:p-margin-desktop w-full mx-auto space-y-gutter animate-in fade-in duration-500 overflow-y-auto">
        <ErrorBoundary label="Vendor Header">
          <VendorHeader vendor={vendor} scan={scan} domain={domain} />
        </ErrorBoundary>

        {/* Feature Grid - Single View */}
        <div className="w-full mt-6 space-y-12 pb-12">
          {/* Overview Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold font-display-lg text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <LineChart className="w-6 h-6 text-primary" />
              Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-bento-gap">
              <ErrorBoundary label="Risk Score">
                <RiskScoreCard vendorId={vendor.id} suppressColdStartMessage={suppressColdStart} />
              </ErrorBoundary>
              <ErrorBoundary label="Forecast">
                <ForecastChart vendorId={vendor.id} suppressColdStartMessage={suppressColdStart} />
              </ErrorBoundary>
            </div>
          </section>

          {/* Vulnerabilities Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold font-display-lg text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <AlertTriangle className="w-6 h-6 text-error" />
              Vulnerabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-bento-gap">
              <ErrorBoundary label="Threat Feeds">
                <ThreatFeedsCard
                  vendorId={vendor.id}
                  suppressColdStartMessage={suppressColdStart}
                />
              </ErrorBoundary>
            </div>
            <div className="bg-outline-variant border border-outline-variant rounded-md overflow-hidden">
              <ErrorBoundary label="ATT&CK Matrix">
                <AttckMatrix vendorId={vendor.id} suppressColdStartMessage={suppressColdStart} />
              </ErrorBoundary>
            </div>
          </section>

          {/* Supply Chain Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold font-display-lg text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <Network className="w-6 h-6 text-tertiary" />
              Supply Chain
            </h2>
            <ErrorBoundary label="Supply Chain">
              <SupplyChainPanel vendorId={vendor.id} suppressColdStartMessage={suppressColdStart} />
            </ErrorBoundary>
          </section>
        </div>
      </div>
    </>
  );
}
