import { syncRecentCVEs } from "../services/nvdSync";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { AbuseIPDBConnector } from "../connectors/AbuseIPDB";
import { AlienVaultOTXConnector } from "../connectors/AlienVaultOTX";
import { GreyNoiseConnector } from "../connectors/GreyNoise";
import { logger } from "@/lib/logger";

const ONE_HOUR = 60 * 60 * 1000;
const TWO_HOURS = 2 * 60 * 60 * 1000;
const SIX_HOURS = 6 * 60 * 60 * 1000;

export function startScheduler() {
  if (typeof window !== "undefined") return;

  // Threat Intelligence Ecosystem Unified Ingestion
  setInterval(async () => {
    const startTime = performance.now();
    logger.info("Starting unified intelligence ingestion cycle", { job: "intelligence_ingestion" });
    try {
      const abuseIpdb = new AbuseIPDBConnector();
      const otx = new AlienVaultOTXConnector();
      const greynoise = new GreyNoiseConnector();

      abuseIpdb.initialize();
      otx.initialize();
      greynoise.initialize();

      const { data: targets, error } = await supabaseAdmin
        .from("infrastructure_assets")
        .select("ip_address, domain_name")
        .limit(100);

      if (error) throw error;
      if (!targets || targets.length === 0) {
        logger.info(
          "No infrastructure targets found for ingestion.",
          { job: "intelligence_ingestion" },
          performance.now() - startTime,
        );
        return;
      }

      for (const target of targets) {
        if (target.ip_address) {
          await Promise.allSettled([
            abuseIpdb.checkIp(target.ip_address),
            greynoise.checkIp(target.ip_address),
            otx.checkIp(target.ip_address),
          ]);
        }
        if (target.domain_name) {
          await Promise.allSettled([otx.checkDomain(target.domain_name)]);
        }
      }
      logger.info(
        "Intelligence ingestion cycle complete",
        { job: "intelligence_ingestion" },
        performance.now() - startTime,
      );
    } catch (err) {
      logger.error("Failed to run ingestion cycle", err, { job: "intelligence_ingestion" });
    }
  }, ONE_HOUR);

  // NVD Sync
  setInterval(async () => {
    const startTime = performance.now();
    logger.info("Starting NVD Sync", { job: "nvd_sync" });
    try {
      await syncRecentCVEs();
      logger.info("NVD Sync complete", { job: "nvd_sync" }, performance.now() - startTime);
    } catch (err) {
      logger.error("NVD Sync failed", err, { job: "nvd_sync" });
    }
  }, TWO_HOURS);

  // Materialized View Refresh
  setInterval(async () => {
    const startTime = performance.now();
    logger.info("Refreshing supply_chain_risk_scores materialized view", {
      job: "mat_view_refresh",
    });
    try {
      const { error } = await supabaseAdmin.rpc("refresh_materialized_view", {
        view_name: "supply_chain_risk_scores",
      });
      if (error) throw error;
      logger.info(
        "Materialized view refresh complete",
        { job: "mat_view_refresh" },
        performance.now() - startTime,
      );
    } catch (e) {
      logger.error("Refresh Mat View Error", e, { job: "mat_view_refresh" });
    }
  }, SIX_HOURS);
}
