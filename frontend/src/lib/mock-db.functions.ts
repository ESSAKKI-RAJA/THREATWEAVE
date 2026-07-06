import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

const MOCK_DB_PATH = path.resolve(process.cwd(), "src/integrations/supabase/mock-db.json");

function readMockDb() {
  if (!fs.existsSync(MOCK_DB_PATH)) {
    const defaultDb = {
      vendors: [],
      scans: [],
      threat_signatures: [],
    };
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(defaultDb, null, 2), "utf-8");
    return defaultDb;
  }
  const raw = fs.readFileSync(MOCK_DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeMockDb(db: any) {
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

const MockDbInput = z.object({
  table: z.string().optional(),
  action: z.enum(["select", "insert", "upsert", "update", "delete", "rpc"]),
  rpcName: z.string().optional(),
  filters: z
    .array(
      z.object({
        field: z.string(),
        val: z.any(),
        type: z.string(),
      }),
    )
    .optional(),
  orderByField: z.string().nullable().optional(),
  orderByAscending: z.boolean().optional(),
  limitCount: z.number().nullable().optional(),
  data: z.any().optional(),
});

export const executeMockDbRequest = createServerFn({ method: "POST" })
  .validator((input: unknown) => MockDbInput.parse(input))
  .handler(async ({ data: input }) => {
    const { table, action, rpcName, filters, orderByField, orderByAscending, limitCount, data } =
      input;
    const db = readMockDb();

    if (action === "rpc") {
      if (rpcName === "match_threat_signatures") {
        // Return signatures with simulated similarity scores
        const signatures = db.threat_signatures || [];
        const mockScores = [0.88, 0.74, 0.59, 0.42, 0.31];
        const matches = signatures.map((sig: any, index: number) => ({
          id: sig.id,
          apt_group_name: sig.apt_group_name,
          description: sig.description,
          similarity: mockScores[index] || 0.25,
        }));
        return { data: matches, error: null };
      }
      if (rpcName === "has_role") {
        return { data: true, error: null };
      }
      return { data: null, error: { message: `Unsupported RPC: ${rpcName}` } };
    }

    if (!table) {
      return { data: null, error: { message: "Table parameter is required" } };
    }

    const list = db[table] || [];

    switch (action) {
      case "select": {
        let filtered = [...list];

        // Apply filters
        if (filters && filters.length > 0) {
          filtered = filtered.filter((row: any) => {
            return filters.every((f) => {
              if (f.type === "eq") {
                return row[f.field] === f.val;
              }
              if (f.type === "neq") {
                return row[f.field] !== f.val;
              }
              if (f.type === "gte") {
                return row[f.field] >= f.val;
              }
              if (f.type === "lte") {
                return row[f.field] <= f.val;
              }
              if (f.type === "in") {
                return Array.isArray(f.val) && f.val.includes(row[f.field]);
              }
              if (f.type === "not") {
                const op = f.val?.operator;
                const v = f.val?.val;
                if (op === "is") {
                  if (v === null) return row[f.field] !== null;
                }
                return row[f.field] !== v;
              }
              return true;
            });
          });
        }

        // Apply joins
        if (table === "scans") {
          filtered = filtered.map((scan: any) => {
            const scanCopy = { ...scan };
            const vendor = db.vendors.find((v: any) => v.id === scan.vendor_id);
            scanCopy.vendors = vendor ? { domain: vendor.domain } : null;
            return scanCopy;
          });
        }

        // Apply sorting
        if (orderByField) {
          filtered.sort((a: any, b: any) => {
            const valA = a[orderByField];
            const valB = b[orderByField];

            // Handle date parsing for any ISO-date-like field
            const dateFields = [
              "updated_at",
              "created_at",
              "scan_date",
              "last_seen",
              "first_seen",
              "date",
            ];
            if (dateFields.includes(orderByField) && valA && valB) {
              const timeA = new Date(valA).getTime();
              const timeB = new Date(valB).getTime();
              return orderByAscending ? timeA - timeB : timeB - timeA;
            }

            if (typeof valA === "string") {
              return orderByAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return orderByAscending ? valA - valB : valB - valA;
          });
        }

        // Apply limit
        if (limitCount && limitCount > 0) {
          filtered = filtered.slice(0, limitCount);
        }

        return { data: filtered, error: null };
      }

      case "insert": {
        const row = {
          id: data.id || crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        };
        list.push(row);
        db[table] = list;
        writeMockDb(db);
        return { data: row, error: null };
      }

      case "upsert": {
        let row: any;
        if (table === "vendors") {
          // Vendor conflict key: user_id, domain
          const existingIdx = list.findIndex(
            (v: any) => v.user_id === data.user_id && v.domain === data.domain,
          );

          if (existingIdx !== -1) {
            row = {
              ...list[existingIdx],
              ...data,
              updated_at: new Date().toISOString(),
            };
            list[existingIdx] = row;
          } else {
            row = {
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              ...data,
            };
            list.push(row);
          }
        } else {
          // General upsert by ID
          const existingIdx = list.findIndex((x: any) => x.id === data.id);
          if (existingIdx !== -1) {
            row = {
              ...list[existingIdx],
              ...data,
              updated_at: new Date().toISOString(),
            };
            list[existingIdx] = row;
          } else {
            row = {
              id: data.id || crypto.randomUUID(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              ...data,
            };
            list.push(row);
          }
        }

        db[table] = list;
        writeMockDb(db);
        return { data: row, error: null };
      }

      case "update": {
        let updatedCount = 0;
        const updatedList = list.map((row: any) => {
          const match =
            filters && filters.length > 0
              ? filters.every((f) => f.type === "eq" && row[f.field] === f.val)
              : false;

          if (match) {
            updatedCount++;
            return {
              ...row,
              ...data,
              updated_at: new Date().toISOString(),
            };
          }
          return row;
        });

        db[table] = updatedList;
        writeMockDb(db);
        return { data: updatedCount, error: null };
      }

      case "delete": {
        if (!filters || filters.length === 0) {
          return { data: null, error: { message: "Delete requires filters" } };
        }
        const remaining = list.filter((row: any) => {
          return !filters.every((f) => f.type === "eq" && row[f.field] === f.val);
        });
        db[table] = remaining;
        writeMockDb(db);
        return { data: null, error: null };
      }

      default:
        return { data: null, error: { message: `Unsupported action: ${action}` } };
    }
  });
