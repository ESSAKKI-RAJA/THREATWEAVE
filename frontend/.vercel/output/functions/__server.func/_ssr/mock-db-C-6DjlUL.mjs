import { n as __exportAll } from "../_runtime.mjs";
import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D_heCM3C.mjs";
import { i as __exportAll$1 } from "./dist-hQ4tG-g_.mjs";
import { a as numberType, i as enumType, n as arrayType, o as objectType, r as booleanType, s as stringType, t as anyType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mock-db-C-6DjlUL.js
var mock_db_C_6DjlUL_exports = /* @__PURE__ */ __exportAll({
	n: () => mock_db_exports,
	t: () => mockSupabase
});
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
var executeMockDbRequest = createServerFn({ method: "POST" }).validator((input) => MockDbInput.parse(input)).handler(createSsrRpc("c3ed8a96e48e61137269cf14bd41eb8b8783ae61636e7352cbe1bc9148b386cc"));
var mock_db_exports = /* @__PURE__ */ __exportAll$1({
	mockSession: () => mockSession,
	mockSupabase: () => mockSupabase,
	mockUser: () => mockUser
});
var mockUser = {
	id: "demo-user",
	email: "demo@threatweave.local",
	role: "admin",
	app_metadata: {
		provider: "email",
		providers: ["email"]
	},
	user_metadata: { role: "admin" },
	aud: "authenticated",
	created_at: (/* @__PURE__ */ new Date()).toISOString()
};
var mockSession = {
	access_token: "mock-access-token",
	token_type: "bearer",
	expires_in: 3600,
	refresh_token: "mock-refresh-token",
	user: mockUser,
	expires_at: Math.floor(Date.now() / 1e3) + 3600
};
var MockQueryBuilder = class {
	table;
	filters = [];
	orderByField = null;
	orderByAscending = true;
	limitCount = null;
	pendingAction = null;
	pendingData = void 0;
	wantSingle = false;
	wantMaybeSingle = false;
	constructor(table) {
		this.table = table;
	}
	select(_fields) {
		if (!this.pendingAction) this.pendingAction = "select";
		return this;
	}
	eq(field, val) {
		this.filters.push({
			field,
			val,
			type: "eq"
		});
		return this;
	}
	neq(field, val) {
		this.filters.push({
			field,
			val,
			type: "neq"
		});
		return this;
	}
	gte(field, val) {
		this.filters.push({
			field,
			val,
			type: "gte"
		});
		return this;
	}
	lte(field, val) {
		this.filters.push({
			field,
			val,
			type: "lte"
		});
		return this;
	}
	in(field, val) {
		this.filters.push({
			field,
			val,
			type: "in"
		});
		return this;
	}
	not(field, operator, val) {
		this.filters.push({
			field,
			val: {
				operator,
				val
			},
			type: "not"
		});
		return this;
	}
	order(field, options) {
		this.orderByField = field;
		this.orderByAscending = options?.ascending ?? true;
		return this;
	}
	limit(count) {
		this.limitCount = count;
		return this;
	}
	async execute() {
		const action = this.pendingAction || "select";
		const payload = {
			table: this.table,
			action,
			filters: this.filters,
			orderByField: this.orderByField,
			orderByAscending: this.orderByAscending,
			limitCount: this.limitCount,
			data: this.pendingData
		};
		try {
			return await executeMockDbRequest({ data: payload });
		} catch (e) {
			return {
				data: null,
				error: { message: e instanceof Error ? e.message : String(e) }
			};
		}
	}
	insert(data) {
		this.pendingAction = "insert";
		this.pendingData = data;
		return this;
	}
	upsert(data, _options) {
		this.pendingAction = "upsert";
		this.pendingData = data;
		return this;
	}
	update(data) {
		this.pendingAction = "update";
		this.pendingData = data;
		return this;
	}
	delete() {
		this.pendingAction = "delete";
		return this;
	}
	maybeSingle() {
		this.wantMaybeSingle = true;
		return this.execute().then((res) => {
			if (res.error) return res;
			const d = res.data;
			if (Array.isArray(d)) return {
				data: d.length > 0 ? d[0] : null,
				error: null
			};
			return {
				data: d ?? null,
				error: null
			};
		});
	}
	single() {
		this.wantSingle = true;
		return this.execute().then((res) => {
			if (res.error) return res;
			const d = res.data;
			if (Array.isArray(d)) return {
				data: d[0] ?? null,
				error: null
			};
			return {
				data: d,
				error: null
			};
		});
	}
	then(onfulfilled, onrejected) {
		return this.execute().then((res) => onfulfilled ? onfulfilled(res) : res, (err) => onrejected ? onrejected(err) : Promise.reject(err));
	}
	catch(onrejected) {
		return this.then(null, onrejected);
	}
};
var mockSupabase = {
	auth: {
		async getSession() {
			return {
				data: { session: mockSession },
				error: null
			};
		},
		async getUser() {
			return {
				data: { user: mockUser },
				error: null
			};
		},
		async signOut() {
			return { error: null };
		},
		onAuthStateChange(callback) {
			setTimeout(() => {
				callback("SIGNED_IN", mockSession);
			}, 0);
			return { data: { subscription: { unsubscribe() {} } } };
		}
	},
	from(table) {
		return new MockQueryBuilder(table);
	},
	async rpc(name, args) {
		try {
			return await executeMockDbRequest({ data: {
				action: "rpc",
				rpcName: name,
				data: args
			} });
		} catch (e) {
			return {
				data: null,
				error: { message: e instanceof Error ? e.message : String(e) }
			};
		}
	}
};
//#endregion
export { mock_db_C_6DjlUL_exports as n, mockSupabase as t };
