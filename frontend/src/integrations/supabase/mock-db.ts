import { executeMockDbRequest } from "@/lib/mock-db.functions";

export const mockUser = {
  id: "demo-user",
  email: "demo@threatweave.local",
  role: "admin",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: { role: "admin" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

export const mockSession = {
  access_token: "mock-access-token",
  token_type: "bearer",
  expires_in: 3600,
  refresh_token: "mock-refresh-token",
  user: mockUser,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
};

class MockQueryBuilder {
  private table: string;
  private filters: Array<{ field: string; val: any; type: string }> = [];
  private orderByField: string | null = null;
  private orderByAscending = true;
  private limitCount: number | null = null;
  private pendingAction: "select" | "insert" | "upsert" | "update" | "delete" | null = null;
  private pendingData: any = undefined;
  private wantSingle = false;
  private wantMaybeSingle = false;

  constructor(table: string) {
    this.table = table;
  }

  select(_fields?: string) {
    // If no pending write action, this is a read query
    if (!this.pendingAction) {
      this.pendingAction = "select";
    }
    // If there IS a pending write (insert/upsert/update), .select() just
    // marks that we want the written data back — the write executes in the terminal method
    return this;
  }

  eq(field: string, val: any) {
    this.filters.push({ field, val, type: "eq" });
    return this;
  }

  neq(field: string, val: any) {
    this.filters.push({ field, val, type: "neq" });
    return this;
  }

  gte(field: string, val: any) {
    this.filters.push({ field, val, type: "gte" });
    return this;
  }

  lte(field: string, val: any) {
    this.filters.push({ field, val, type: "lte" });
    return this;
  }

  in(field: string, val: any[]) {
    this.filters.push({ field, val, type: "in" });
    return this;
  }

  not(field: string, operator: string, val: any) {
    this.filters.push({ field, val: { operator, val }, type: "not" });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderByField = field;
    this.orderByAscending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  private async execute() {
    const action = this.pendingAction || "select";
    const payload = {
      table: this.table,
      action,
      filters: this.filters,
      orderByField: this.orderByField,
      orderByAscending: this.orderByAscending,
      limitCount: this.limitCount,
      data: this.pendingData,
    };
    try {
      const response = await executeMockDbRequest({ data: payload });
      return response;
    } catch (e) {
      return {
        data: null,
        error: { message: e instanceof Error ? e.message : String(e) },
      };
    }
  }

  // --- Write methods: SYNCHRONOUS, store intent for later execution ---

  insert(data: any) {
    this.pendingAction = "insert";
    this.pendingData = data;
    return this;
  }

  upsert(data: any, _options?: any) {
    this.pendingAction = "upsert";
    this.pendingData = data;
    return this;
  }

  update(data: any) {
    this.pendingAction = "update";
    this.pendingData = data;
    return this;
  }

  delete() {
    this.pendingAction = "delete";
    return this;
  }

  // --- Terminal methods that actually execute the query ---

  maybeSingle() {
    this.wantMaybeSingle = true;
    // Return a thenable so `await builder.maybeSingle()` works
    const promise = this.execute().then((res) => {
      if (res.error) return res;
      const d = res.data;
      // Normalize: select returns array, insert/upsert returns single object
      if (Array.isArray(d)) {
        return { data: d.length > 0 ? d[0] : null, error: null };
      }
      // Already a single object (from insert/upsert)
      return { data: d ?? null, error: null };
    });
    return promise;
  }

  single() {
    this.wantSingle = true;
    const promise = this.execute().then((res) => {
      if (res.error) return res;
      const d = res.data;
      // Normalize: select returns array, insert/upsert returns single object
      if (Array.isArray(d)) {
        return { data: d[0] ?? null, error: null };
      }
      // Already a single object (from insert/upsert)
      return { data: d, error: null };
    });
    return promise;
  }

  // Make the builder thenable so `await supabase.from(...).select(...)` works
  // without an explicit terminal like single()/maybeSingle()
  then(onfulfilled?: ((value: any) => any) | null, onrejected?: ((reason: any) => any) | null) {
    const p = this.execute().then(
      (res) => (onfulfilled ? onfulfilled(res) : res),
      (err) => (onrejected ? onrejected(err) : Promise.reject(err)),
    );
    return p;
  }

  catch(onrejected?: ((reason: any) => any) | null) {
    return this.then(null, onrejected);
  }
}

export const mockSupabase = {
  auth: {
    async getSession() {
      return { data: { session: mockSession }, error: null };
    },
    async getUser() {
      return { data: { user: mockUser }, error: null };
    },
    async signOut() {
      return { error: null };
    },
    onAuthStateChange(callback: (event: string, session: any) => void) {
      setTimeout(() => {
        callback("SIGNED_IN", mockSession);
      }, 0);
      return {
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      };
    },
  },
  from(table: string) {
    return new MockQueryBuilder(table);
  },
  async rpc(name: string, args: any) {
    try {
      const payload = {
        action: "rpc",
        rpcName: name,
        data: args,
      };
      const response = await executeMockDbRequest({ data: payload } as any);
      return response;
    } catch (e) {
      return { data: null, error: { message: e instanceof Error ? e.message : String(e) } };
    }
  },
};
