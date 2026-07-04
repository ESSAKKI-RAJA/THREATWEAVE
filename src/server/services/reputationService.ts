import { fetchWithRetry } from "@/lib/rate-limit";

export interface ReputationResult {
  abuseConfidenceScore: number;
  greyNoiseClassification: string;
  otxPulseCount: number;
  aggregatedRisk: number;
}

export async function getIpReputation(ip: string, supabase: any): Promise<ReputationResult> {
  let abuseScore = 0;
  let gnClassification = "benign";
  let otxCount = 0;

  // AbuseIPDB
  const abuseKey = process.env.ABUSEIPDB_API_KEY;
  if (abuseKey) {
    try {
      const res = await fetchWithRetry(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {
        headers: { Key: abuseKey, Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        abuseScore = data.data.abuseConfidenceScore || 0;

        await supabase.from("abuseipdb_reports").upsert(
          {
            ip_address: ip,
            abuse_confidence_score: abuseScore,
            total_reports: data.data.totalReports || 0,
            country: data.data.countryCode,
            isp: data.data.isp,
            domain: data.data.domain,
            full_response: data,
          },
          { onConflict: "ip_address" },
        );
      }
    } catch (e) {
      console.warn(`AbuseIPDB error for ${ip}:`, e);
    }
  }

  // GreyNoise
  const gnKey = process.env.GREYNOISE_API_KEY;
  if (gnKey) {
    try {
      const res = await fetchWithRetry(`https://api.greynoise.io/v3/community/ip/${ip}`, {
        headers: { key: gnKey, Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        gnClassification = data.classification || "benign";

        await supabase.from("greynoise_ip_context").upsert(
          {
            ip_address: ip,
            classification: gnClassification,
            name: data.name,
            metadata: data,
          },
          { onConflict: "ip_address" },
        );
      }
    } catch (e) {
      console.warn(`GreyNoise error for ${ip}:`, e);
    }
  }

  // AlienVault OTX
  const otxKey = process.env.OTX_API_KEY;
  if (otxKey) {
    try {
      const res = await fetchWithRetry(
        `https://otx.alienvault.com/api/v1/indicators/IPv4/${ip}/general`,
        {
          headers: { "X-OTX-API-KEY": otxKey, Accept: "application/json" },
        },
      );
      if (res.ok) {
        const data = await res.json();
        otxCount = data.pulse_info?.count || 0;

        if (otxCount > 0 && data.pulse_info?.pulses) {
          for (const pulse of data.pulse_info.pulses) {
            await supabase.from("otx_pulses").upsert(
              {
                indicator: ip,
                indicator_type: "IPv4",
                pulse_id: pulse.id,
                pulse_name: pulse.name,
                tags: pulse.tags,
                full_data: pulse,
              },
              { onConflict: "indicator,pulse_id" },
            );
          }
        }
      }
    } catch (e) {
      console.warn(`OTX error for ${ip}:`, e);
    }
  }

  // Calculate aggregated risk (0-100)
  let risk = abuseScore * 0.4;
  risk += gnClassification === "malicious" ? 60 : gnClassification === "unknown" ? 20 : 0;
  risk += otxCount > 0 ? 20 : 0;

  risk = Math.max(0, Math.min(100, Math.round(risk)));

  return {
    abuseConfidenceScore: abuseScore,
    greyNoiseClassification: gnClassification,
    otxPulseCount: otxCount,
    aggregatedRisk: risk,
  };
}
