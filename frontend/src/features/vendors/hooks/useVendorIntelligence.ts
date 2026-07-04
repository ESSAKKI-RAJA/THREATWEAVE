import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getVendorRiskDetails,
  getSupplyChainRisk,
  getVendorAttck,
  getForecast,
  getVendorThreatFeeds,
} from "@/lib/vendor-intelligence.functions";
import { getSupplyChainDepthRisk } from "@/lib/supplyChainDepth.functions";

export function useVendorRiskDetails(vendorId: string | undefined) {
  const fetchRiskDetails = useServerFn(getVendorRiskDetails);
  return useQuery({
    queryKey: ["vendor-risk-details", vendorId],
    queryFn: () => {
      if (typeof window !== "undefined" && (window as any).__MOCK_RISK_ERROR)
        throw new Error("Mock error");
      if (typeof window !== "undefined" && (window as any).__MOCK_RISK_LOADING)
        return new Promise(() => {});
      return fetchRiskDetails({ data: { vendorId: vendorId! } });
    },
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSupplyChainRisk(vendorId: string | undefined) {
  const fetchSupplyChainRisk = useServerFn(getSupplyChainRisk);
  return useQuery({
    queryKey: ["vendor-supply-chain", vendorId],
    queryFn: () => {
      if (typeof window !== "undefined" && (window as any).__MOCK_SUPPLY_ERROR)
        throw new Error("Mock error");
      if (typeof window !== "undefined" && (window as any).__MOCK_SUPPLY_LOADING)
        return new Promise(() => {});
      return fetchSupplyChainRisk({ data: { vendorId: vendorId! } });
    },
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useForecast(
  vendorId: string | undefined,
  periods = 30,
  model: "arima" | "prophet" | "lstm" = "arima",
) {
  const fetchForecast = useServerFn(getForecast);
  return useQuery({
    queryKey: ["vendor-forecast", vendorId, periods, model],
    queryFn: () => {
      if (typeof window !== "undefined" && (window as any).__MOCK_FORECAST_ERROR)
        throw new Error("Mock error");
      if (typeof window !== "undefined" && (window as any).__MOCK_FORECAST_LOADING)
        return new Promise(() => {});
      return fetchForecast({ data: { vendorId: vendorId!, periods, model } });
    },
    enabled: !!vendorId,
    staleTime: 60 * 60 * 1000,
  });
}

export function useVendorAttck(vendorId: string | undefined) {
  const fetchAttck = useServerFn(getVendorAttck);
  return useQuery({
    queryKey: ["vendor-attck", vendorId],
    queryFn: () => fetchAttck({ data: { vendorId: vendorId! } }),
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVendorThreatFeeds(vendorId: string | undefined) {
  const fetchThreatFeeds = useServerFn(getVendorThreatFeeds);
  return useQuery({
    queryKey: ["vendor-threat-feeds", vendorId],
    queryFn: () => fetchThreatFeeds({ data: { vendorId: vendorId! } }),
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSupplyChainDepth(vendorId: string | undefined) {
  const fetchDepth = useServerFn(getSupplyChainDepthRisk);
  return useQuery({
    queryKey: ["vendor-supply-chain-depth", vendorId],
    queryFn: () => fetchDepth({ data: { vendorId: vendorId! } }),
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000,
  });
}
