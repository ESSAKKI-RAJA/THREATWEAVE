import React, { useState } from "react";
import { useForecast } from "../hooks/useVendorIntelligence";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { DataModule } from "@/components/DataModule";

export const ForecastChart = ({
  vendorId,
  suppressColdStartMessage,
}: {
  vendorId: string | undefined;
  suppressColdStartMessage?: boolean;
}) => {
  const [model, setModel] = useState<"arima" | "prophet" | "lstm">("prophet");
  const { data, isLoading, error, refetch } = useForecast(vendorId, 30, model);

  const getStatus = () => {
    if (isLoading || (!data && !error)) return "cold-start";
    if (error || !data || !data.dates) return "error";
    return "populated";
  };

  const status = getStatus();

  const chartData = data?.dates
    ? data.dates.map((date: string, i: number) => ({
        date,
        score: data.predictions[i],
        lower: data.confidence_lower[i],
        upper: data.confidence_upper[i],
      }))
    : [];

  return (
    <DataModule
      title="30-Day Risk Forecast"
      icon="trending_up"
      status={status}
      onRetry={() => refetch()}
      skeletonType="chart"
      suppressColdStartMessage={suppressColdStartMessage}
      themeTone="default"
      headerRight={
        status === "populated" ? (
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as any)}
            className="bg-surface border border-outline-variant text-on-surface font-label-md text-xs px-2 py-1 uppercase tracking-wider focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="arima">ARIMA</option>
            <option value="prophet">Prophet</option>
            <option value="lstm">LSTM</option>
          </select>
        ) : undefined
      }
    >
      {data && (
        <div className="h-[250px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.2}
                stroke="currentColor"
                className="text-outline-variant"
              />
              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 10,
                  fill: "var(--on-surface-variant)",
                  fontFamily: "var(--font-data-mono)",
                }}
                minTickGap={30}
              />
              <YAxis
                domain={[0, 100]}
                tick={{
                  fontSize: 10,
                  fill: "var(--on-surface-variant)",
                  fontFamily: "var(--font-data-mono)",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-container-high)",
                  borderColor: "var(--outline)",
                  fontFamily: "var(--font-data-mono)",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "var(--on-surface)" }}
                itemStyle={{ color: "var(--on-surface)" }}
              />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="var(--primary)"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="var(--surface-container)"
                fillOpacity={1}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DataModule>
  );
};
