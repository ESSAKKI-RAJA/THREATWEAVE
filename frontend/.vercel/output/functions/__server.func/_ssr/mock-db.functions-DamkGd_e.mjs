import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as createServerRpc } from "./createServerRpc-4C8DKW8q.mjs";
import { a as numberType, i as enumType, n as arrayType, o as objectType, r as booleanType, s as stringType, t as anyType } from "../_libs/zod.mjs";
import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/mock-db.functions-DamkGd_e.js
var MOCK_DB_PATH = path.resolve(process.cwd(), "src/integrations/supabase/mock-db.json");
function readMockDb() {
	if (!fs.existsSync(MOCK_DB_PATH)) {
		const defaultDb = {
			vendors: [],
			scans: [],
			threat_signatures: []
		};
		fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(defaultDb, null, 2), "utf-8");
		return defaultDb;
	}
	const raw = fs.readFileSync(MOCK_DB_PATH, "utf-8");
	return JSON.parse(raw);
}
function writeMockDb(db) {
	fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}
var MockDbInput = objectType({
	table: stringType().optional(),
	action: enumType([
		"select",
		"insert",
		"upsert",
		"update",
		"delete",
		"rpc"
	]),
	rpcName: stringType().optional(),
	filters: arrayType(objectType({
		field: stringType(),
		val: anyType(),
		type: stringType()
	})).optional(),
	orderByField: stringType().nullable().optional(),
	orderByAscending: booleanType().optional(),
	limitCount: numberType().nullable().optional(),
	data: anyType().optional()
});
var executeMockDbRequest_createServerFn_handler = createServerRpc({
	id: "c3ed8a96e48e61137269cf14bd41eb8b8783ae61636e7352cbe1bc9148b386cc",
	name: "executeMockDbRequest",
	filename: "src/lib/mock-db.functions.ts"
}, (opts) => executeMockDbRequest.__executeServer(opts));
var executeMockDbRequest = createServerFn({ method: "POST" }).validator((input) => MockDbInput.parse(input)).handler(executeMockDbRequest_createServerFn_handler, async ({ data: input }) => {
	const { table, action, rpcName, filters, orderByField, orderByAscending, limitCount, data } = input;
	const db = readMockDb();
	if (action === "rpc") {
		if (rpcName === "match_threat_signatures") {
			const signatures = db.threat_signatures || [];
			const mockScores = [
				.88,
				.74,
				.59,
				.42,
				.31
			];
			return {
				data: signatures.map((sig, index) => ({
					id: sig.id,
					apt_group_name: sig.apt_group_name,
					description: sig.description,
					similarity: mockScores[index] || .25
				})),
				error: null
			};
		}
		if (rpcName === "has_role") return {
			data: true,
			error: null
		};
		return {
			data: null,
			error: { message: `Unsupported RPC: ${rpcName}` }
		};
	}
	if (!table) return {
		data: null,
		error: { message: "Table parameter is required" }
	};
	const list = db[table] || [];
	switch (action) {
		case "select": {
			let filtered = [...list];
			if (filters && filters.length > 0) filtered = filtered.filter((row) => {
				return filters.every((f) => {
					if (f.type === "eq") return row[f.field] === f.val;
					if (f.type === "neq") return row[f.field] !== f.val;
					if (f.type === "gte") return row[f.field] >= f.val;
					if (f.type === "lte") return row[f.field] <= f.val;
					if (f.type === "in") return Array.isArray(f.val) && f.val.includes(row[f.field]);
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
			if (table === "scans") filtered = filtered.map((scan) => {
				const scanCopy = { ...scan };
				const vendor = db.vendors.find((v) => v.id === scan.vendor_id);
				scanCopy.vendors = vendor ? { domain: vendor.domain } : null;
				return scanCopy;
			});
			if (orderByField) filtered.sort((a, b) => {
				const valA = a[orderByField];
				const valB = b[orderByField];
				if ([
					"updated_at",
					"created_at",
					"scan_date",
					"last_seen",
					"first_seen",
					"date"
				].includes(orderByField) && valA && valB) {
					const timeA = new Date(valA).getTime();
					const timeB = new Date(valB).getTime();
					return orderByAscending ? timeA - timeB : timeB - timeA;
				}
				if (typeof valA === "string") return orderByAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
				return orderByAscending ? valA - valB : valB - valA;
			});
			if (limitCount && limitCount > 0) filtered = filtered.slice(0, limitCount);
			return {
				data: filtered,
				error: null
			};
		}
		case "insert": {
			const row = {
				id: data.id || crypto.randomUUID(),
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString(),
				...data
			};
			list.push(row);
			db[table] = list;
			writeMockDb(db);
			return {
				data: row,
				error: null
			};
		}
		case "upsert": {
			let row;
			if (table === "vendors") {
				const existingIdx = list.findIndex((v) => v.user_id === data.user_id && v.domain === data.domain);
				if (existingIdx !== -1) {
					row = {
						...list[existingIdx],
						...data,
						updated_at: (/* @__PURE__ */ new Date()).toISOString()
					};
					list[existingIdx] = row;
				} else {
					row = {
						id: crypto.randomUUID(),
						created_at: (/* @__PURE__ */ new Date()).toISOString(),
						updated_at: (/* @__PURE__ */ new Date()).toISOString(),
						...data
					};
					list.push(row);
				}
			} else {
				const existingIdx = list.findIndex((x) => x.id === data.id);
				if (existingIdx !== -1) {
					row = {
						...list[existingIdx],
						...data,
						updated_at: (/* @__PURE__ */ new Date()).toISOString()
					};
					list[existingIdx] = row;
				} else {
					row = {
						id: data.id || crypto.randomUUID(),
						created_at: (/* @__PURE__ */ new Date()).toISOString(),
						updated_at: (/* @__PURE__ */ new Date()).toISOString(),
						...data
					};
					list.push(row);
				}
			}
			db[table] = list;
			writeMockDb(db);
			return {
				data: row,
				error: null
			};
		}
		case "update": {
			let updatedCount = 0;
			db[table] = list.map((row) => {
				if (filters && filters.length > 0 ? filters.every((f) => f.type === "eq" && row[f.field] === f.val) : false) {
					updatedCount++;
					return {
						...row,
						...data,
						updated_at: (/* @__PURE__ */ new Date()).toISOString()
					};
				}
				return row;
			});
			writeMockDb(db);
			return {
				data: updatedCount,
				error: null
			};
		}
		case "delete":
			if (!filters || filters.length === 0) return {
				data: null,
				error: { message: "Delete requires filters" }
			};
			db[table] = list.filter((row) => {
				return !filters.every((f) => f.type === "eq" && row[f.field] === f.val);
			});
			writeMockDb(db);
			return {
				data: null,
				error: null
			};
		default: return {
			data: null,
			error: { message: `Unsupported action: ${action}` }
		};
	}
});
//#endregion
export { executeMockDbRequest_createServerFn_handler };
