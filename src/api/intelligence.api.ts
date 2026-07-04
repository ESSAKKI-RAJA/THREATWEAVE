import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs";
import * as path from "node:path";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type IOC = {
  id: string;
  type: string;
  value: string;
  severity: string;
  actor: string;
  status: string;
  first_seen: string;
  last_seen: string;
  description: string;
};

export const getIOCs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    try {
      const dbPath = path.resolve(process.cwd(), "src/integrations/supabase/mock-db.json");
      if (!fs.existsSync(dbPath)) {
        return [] as IOC[];
      }
      const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      const iocs: IOC[] = (db.iocs || []).sort(
        (a: IOC, b: IOC) => new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime(),
      );
      return iocs;
    } catch (e) {
      console.error("Failed to get IOCs:", e);
      return [] as IOC[];
    }
  });
