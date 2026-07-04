// src/lib/analytics/benchmarks.ts
import type { BenchmarkMetrics } from "../osint-types";
import { mean, quantile } from "simple-statistics";

/**
 * Enterprise Benchmarking Engine
 * Calculates dynamic peer averages and percentile ranks against the database.
 */
export async function computeEnterpriseBenchmarks(
  supabase: any,
  organizationId: string,
  industryCode: string,
  region: string,
  currentScore: number,
): Promise<BenchmarkMetrics> {
  try {
    // Fetch all vendors in the same industry to calculate the industry average
    const { data: industryPeers } = await supabase
      .from("vendors")
      .select("risk_score, organizations!inner(industry_code)")
      .eq("organizations.industry_code", industryCode);

    // Fetch all vendors in the same region to calculate the regional average
    const { data: regionalPeers } = await supabase
      .from("vendors")
      .select("risk_score, organizations!inner(region)")
      .eq("organizations.region", region);

    // Extract scores
    const industryScores = (industryPeers || [])
      .map((p: any) => p.risk_score)
      .filter((s: number) => typeof s === "number");
    const regionalScores = (regionalPeers || [])
      .map((p: any) => p.risk_score)
      .filter((s: number) => typeof s === "number");

    // We must include the current score in the datasets
    industryScores.push(currentScore);
    regionalScores.push(currentScore);

    // Calculate Averages using simple-statistics
    const industry_average = parseFloat(mean(industryScores).toFixed(2));
    const regional_average = parseFloat(mean(regionalScores).toFixed(2));

    // Calculate Percentile Rank
    // A higher risk score is WORSE. A 99th percentile means you have a higher score (more risk) than 99% of peers.
    // Let's sort the array ascending.
    industryScores.sort((a: number, b: number) => a - b);

    // Find the index of the current score to calculate rank
    const index = industryScores.lastIndexOf(currentScore);
    const percentile_rank = parseFloat(
      ((index / (industryScores.length - 1 || 1)) * 100).toFixed(2),
    );

    // Determine relative risk position
    let relative_risk_position = "In Line with Industry";
    if (currentScore > industry_average + 15) {
      relative_risk_position = "Outlier - Significantly Higher Risk";
    } else if (currentScore < industry_average - 15) {
      relative_risk_position = "Leader - Significantly Lower Risk";
    } else if (currentScore > industry_average) {
      relative_risk_position = "Slightly Above Industry Average";
    } else {
      relative_risk_position = "Slightly Below Industry Average";
    }

    // Name resolution for the peer group
    const industryNames: Record<string, string> = {
      "9999": "Global Multi-Sector",
      "5200": "Financial Services",
      "6200": "Healthcare",
      "5112": "Software & Tech",
    };

    return {
      industry_average,
      regional_average,
      percentile_rank,
      relative_risk_position,
      peer_group_name: industryNames[industryCode] || "General Industry Peers",
    };
  } catch (error) {
    console.error("[Benchmark Engine] Error computing benchmarks:", error);
    // Fallback to static if db fails
    return {
      industry_average: 50.0,
      regional_average: 50.0,
      percentile_rank: 50.0,
      relative_risk_position: "Unknown due to missing data",
      peer_group_name: "Fallback Peers",
    };
  }
}
