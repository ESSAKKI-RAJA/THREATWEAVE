import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Alert = {
  id: string;
  title: string;
  severity: string;
  time: string;
  vendor: string;
  source: string;
  status: string;
};

export const getAlerts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    // Return mock alerts exactly as dashboard.api.ts does, or fetch them if running via HTTP
    return [
      {
        id: "AL-1092",
        source: "CrowdStrike",
        title: "Suspicious PowerShell Execution",
        time: "10m ago",
        severity: "high",
        status: "new",
        vendor: "acme.com",
      },
      {
        id: "AL-1091",
        source: "Palo Alto",
        title: "Beaconing to Known C2 IP",
        time: "45m ago",
        severity: "critical",
        status: "investigating",
        vendor: "globex.com",
      },
      {
        id: "AL-1090",
        source: "Azure AD",
        title: "Impossible Travel Detected",
        time: "2h ago",
        severity: "medium",
        status: "resolved",
        vendor: "acme.com",
      },
    ] as Alert[];
  });
