import { createFileRoute } from "@tanstack/react-router";
import { Waypoints, Link as LinkIcon, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/supply-chain")({
  component: SupplyChainPage,
});

function SupplyChainPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline-md font-bold tracking-tight text-on-surface uppercase">
          Supply Chain Analytics
        </h1>
        <p className="text-on-surface-variant font-body-lg">
          Visualize 3rd and Nth-party dependencies, monitor transitive risk, and analyze blast
          radius.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bento-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-label-lg font-medium text-on-surface uppercase tracking-widest">
              Total Monitored Vendors
            </CardTitle>
            <Waypoints className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface font-display-sm">18</div>
            <p className="text-xs text-on-surface-variant mt-1">Directly contracted entities</p>
          </CardContent>
        </Card>
        <Card className="bento-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-label-lg font-medium text-on-surface uppercase tracking-widest">
              Nth-Party Connections
            </CardTitle>
            <LinkIcon className="h-4 w-4 text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface font-display-sm">342</div>
            <p className="text-xs text-on-surface-variant mt-1">Discovered transitive links</p>
          </CardContent>
        </Card>
        <Card className="bento-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-label-lg font-medium text-on-surface uppercase tracking-widest">
              Avg Network Depth
            </CardTitle>
            <Network className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface font-display-sm">2.4 Layers</div>
            <p className="text-xs text-on-surface-variant mt-1">Average blast radius</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bento-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <Network className="h-12 w-12 text-primary/40 mb-4" />
        <h3 className="text-xl font-headline-sm font-bold text-on-surface">
          Global Supply Chain Graph
        </h3>
        <p className="text-on-surface-variant max-w-lg mt-2">
          The global supply chain topology is currently being analyzed. Please select a specific
          vendor from the Dashboard to trace its unique upstream dependencies.
        </p>
      </Card>
    </div>
  );
}
