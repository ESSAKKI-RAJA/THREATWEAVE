import { i as TSS_SERVER_FUNCTION } from "./esm-DhkbgPqS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createServerRpc-4C8DKW8q.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createServerRpc as t };
