import { i as __toESM } from "../_runtime.mjs";
import { j as isRedirect, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as require_react } from "../_libs/@clerk/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useServerFn-BqzygRuj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
//#endregion
export { useServerFn as t };
