import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { NarrativePayload } from "./osint-types";

const NarrativeInput = z.object({ scan_id: z.string().min(1) });

const SYSTEM_PROMPT = `You are THREATWEAVE, an AI cyber risk intelligence system.
Given raw OSINT data about a vendor domain (TLS certificates from crt.sh, Shodan
InternetDB port/CVE data, VirusTotal reputation, and GitHub leaks), produce a detailed,
multi-perspective threat intelligence report.

Return ONLY a valid JSON object — no prose, no markdown, no code fences — that
matches this exact shape:

{
  "executive_summary": string (3-4 sentences summarizing high-level business impact for a CISO/Board),
  "analyst_summary": string (3-4 sentences detailing the technical attack surface vectors and tactical posture),
  "compliance_summary": string (2-3 sentences mapping the findings to standard compliance frameworks like NIST CSF, SOC 2, or ISO 27001),
  "recommended_actions": string[] (4-6 concrete, prioritized mitigation actions),
  "confidence": "low"|"medium"|"high",
  "risk_score": number (0-100, your own risk intelligence calculation based on findings severity),
  "top_indicators": [
    { "title": string, "detail": string, "severity": "low"|"medium"|"high"|"critical" }
  ] (exactly 3 key threats, ranked by severity),
  "benchmark_summary": string (1-2 sentences comparing this vendor to industry averages),
  "historical_trend_summary": string (1-2 sentences explaining security posture evolution and attack surface expansion),
  "threat_similarity_summary": string (1-2 sentences outlining potential threat group/APT associations and infrastructure fingerprints),
  "risk_forecasting_summary": string (1-2 sentences forecasting the likelihood of security deterioration or credential leaks over 90 days)
}

Base every claim on the supplied data. If data is sparse, lower the confidence
and say so in the summary. Never invent indicators.`;

function buildUserPrompt(domain: string, aggregated: unknown): string {
  return `Vendor domain: ${domain}\n\nRaw OSINT payload (truncated JSON):\n${JSON.stringify(
    aggregated,
  ).slice(0, 30_000)}`;
}

function parseNarrative(text: string): NarrativePayload {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  const obj = JSON.parse(cleaned) as NarrativePayload;
  if (
    typeof obj.executive_summary !== "string" ||
    typeof obj.analyst_summary !== "string" ||
    typeof obj.compliance_summary !== "string" ||
    !Array.isArray(obj.top_indicators) ||
    !Array.isArray(obj.recommended_actions) ||
    typeof obj.risk_score !== "number"
  ) {
    throw new Error("Narrative JSON missing required fields");
  }
  return obj;
}

async function callClaude(domain: string, payload: unknown): Promise<NarrativePayload> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY missing");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(domain, payload) }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Claude HTTP ${res.status}: ${t.slice(0, 400)}`);
  }
  const body = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
  const text = body.content?.find((c) => c.type === "text")?.text ?? "";
  return parseNarrative(text);
}

async function callLovableAi(domain: string, payload: unknown): Promise<NarrativePayload> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Lovable-API-Key": key,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(domain, payload) },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Lovable AI HTTP ${res.status}: ${t.slice(0, 400)}`);
  }
  const body = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = body.choices?.[0]?.message?.content ?? "";
  return parseNarrative(text);
}

export const generateNarrative = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => NarrativeInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context as any;

    const { data: scan, error } = await supabase
      .from("scans")
      .select(
        "id, vendor_id, crt_sh_data, shodan_data, virustotal_data, github_data, errors, vendors(domain, risk_score)",
      )
      .eq("id", data.scan_id)
      .single();
    if (error || !scan) throw new Error(error?.message ?? "Scan not found");

    const domain = (scan.vendors as { domain?: string } | null)?.domain ?? "unknown";
    const payload = {
      crt_sh: scan.crt_sh_data,
      shodan: scan.shodan_data,
      virustotal: scan.virustotal_data,
      github: scan.github_data,
      errors: scan.errors,
    };

    let narrative: NarrativePayload;
    let provider: "claude" | "lovable-ai" | "mock-brief";

    const bypassAuth =
      process.env.BYPASS_AUTH === "true" || process.env.VITE_BYPASS_AUTH === "true";
    const hasKeys = !!(process.env.LOVABLE_API_KEY || process.env.ANTHROPIC_API_KEY);

    if (bypassAuth && !hasKeys) {
      // Build a detailed mockup matching the complete v1-v3 specification payload
      narrative = {
        executive_summary: `The threat intelligence briefing for ${domain} reveals a moderately complex external attack surface footprint. Standard web assets are online, but port mapping indicates database and administrative protocols are public-facing, exposing critical corporate data. Direct mitigation is recommended within the standard SLA period.`,
        analyst_summary: `Detailed technical analysis identified open ports 22 (SSH) and 5432 (PostgreSQL) active on public IP addresses. In addition, SSL Transparency Logs indicate Let's Encrypt certificates were generated in a short burst, which is a classic indicator of infrastructure staging. Vulnerability scanning flagged CVE-2023-3519 with high exploit scores.`,
        compliance_summary: `Observed vulnerabilities and credential exposures violate NIST CSF PR.IP-1 (Access control lists updated) and SOC 2 CC6.1 (Logical access controls to database assets). Core changes are required for compliance readiness.`,
        recommended_actions: [
          "Restrict public access on Ports 22 and 5432 using a strict network security firewall.",
          "Rotate all private API keys and tokens exposed in indexed GitHub public repositories.",
          "Patch Citrix ADC systems to remediate critical CVE-2023-3519 vulnerability.",
          "Configure standard DNSSEC and SPF/DKIM validation records across all subdomains.",
        ],
        confidence: "high",
        risk_score: scan.vendors?.risk_score ?? 48,
        top_indicators: [
          {
            title: "Public Database Exposure (PostgreSQL)",
            detail: "Active SQL database on Port 5432 exposed without perimeter authentication.",
            severity: "critical",
          },
          {
            title: "CISA KEV Exploit Path (CVE-2023-3519)",
            detail:
              "Active Citrix Gateway vulnerability with high EPSS probability detected on host.",
            severity: "high",
          },
          {
            title: "GitHub API Token Leak",
            detail:
              "Accidental code repository upload containing private domain secrets and SaaS passwords.",
            severity: "high",
          },
        ],
        benchmark_summary: `This vendor exhibits a risk score of ${scan.vendors?.risk_score ?? 48}, putting them in the 55th percentile, which represents higher risk than 45% of peer SaaS suppliers.`,
        historical_trend_summary: `Postures have declined over the past 30 days, showing an attack surface growth of 12% due to new port activations.`,
        threat_similarity_summary: `Vector fingerprint analysis correlation shows moderate overlap (74%) with Cozy Bear (APT29) staging methods.`,
        risk_forecasting_summary: `Based on active telemetry, there is a 65% probability of a secondary security event or credential leak within the next 90 days.`,
      };
      provider = "mock-brief";
    } else {
      try {
        narrative = await callClaude(domain, payload);
        provider = "claude";
      } catch (claudeErr) {
        console.warn("Claude failed, falling back to Lovable AI:", claudeErr);
        narrative = await callLovableAi(domain, payload);
        provider = "lovable-ai";
      }
    }

    // Persist narrative payload inside database scan record
    await supabase
      .from("scans")
      .update({ narrative: { ...narrative, provider } })
      .eq("id", data.scan_id);

    return { ...narrative, provider };
  });
