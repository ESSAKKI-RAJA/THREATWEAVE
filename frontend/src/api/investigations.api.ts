import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { readMockDb, writeMockDb } from "./dashboard.api";

export type Investigation = {
  id: string;
  title: string;
  assignee: string;
  status: string;
  priority: string;
  date: string;
};

export const getInvestigations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    try {
      const db = readMockDb();
      return (db.investigations || []) as Investigation[];
    } catch (e) {
      console.error("Failed to get investigations:", e);
      return [] as Investigation[];
    }
  });

export const createInvestigation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: Omit<Investigation, "id" | "date">) => data)
  .handler(async ({ data }) => {
    const db = readMockDb();
    if (!db.investigations) db.investigations = [];
    
    const newCase: Investigation = {
      id: `CAS-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      date: new Date().toISOString().split("T")[0],
      ...data,
    };
    
    db.investigations.push(newCase);
    writeMockDb(db);
    return newCase;
  });
