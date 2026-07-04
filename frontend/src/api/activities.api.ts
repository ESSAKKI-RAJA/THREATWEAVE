import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { readMockDb, writeMockDb } from "./dashboard.api";

export type ActivityLog = {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: string;
};

export const getActivities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const db = readMockDb();
    if (!db.activities || db.activities.length === 0) {
      db.activities = [
        {
          id: "1",
          title: "Scan completed for Globex Inc.",
          detail: "Composite risk score recalculated.",
          time: "2026-07-03T18:00:00Z",
          type: "success",
        },
        {
          id: "2",
          title: "New vulnerability detected",
          detail: "Exposed database service found in Initech perimeter.",
          time: "2026-07-03T17:55:00Z",
          type: "error",
        },
        {
          id: "3",
          title: "Data sync completed",
          detail: "Synchronized Let's Encrypt certificate feeds.",
          time: "2026-07-03T17:50:00Z",
          type: "info",
        },
        {
          id: "4",
          title: "New vendor added",
          detail: "Registered Umbrella Corp. into critical monitoring.",
          time: "2026-07-03T17:45:00Z",
          type: "info",
        },
      ];
      writeMockDb(db);
    }
    // Return sorted by time descending (newest first)
    return db.activities.sort(
      (a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    ) as ActivityLog[];
  });
