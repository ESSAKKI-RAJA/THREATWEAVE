import { t as mockSupabase } from "./mock-db-C-6DjlUL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-diYsDuuj.js
var supabase = new Proxy({}, { get(_, prop, receiver) {
	return Reflect.get(mockSupabase, prop, receiver);
} });
//#endregion
export { supabase as t };
