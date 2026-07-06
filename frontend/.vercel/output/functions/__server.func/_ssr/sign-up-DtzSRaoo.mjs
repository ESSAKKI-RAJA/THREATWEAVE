import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { r as SignUp$1 } from "./dist-hQ4tG-g_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sign-up-DtzSRaoo.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function SignUpComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-slate-950 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-slate-100 uppercase tracking-widest",
					children: "THREATWEAVE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-teal-500 tracking-[0.2em] uppercase mt-1",
					children: "Enterprise"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignUp$1, {
				appearance: { elements: {
					card: "bg-slate-900 border border-slate-800 shadow-2xl",
					headerTitle: "text-slate-100",
					headerSubtitle: "text-slate-400",
					formButtonPrimary: "bg-teal-600 hover:bg-teal-500 text-white",
					formFieldLabel: "text-slate-300",
					formFieldInput: "bg-slate-950 border-slate-800 text-slate-100 focus:ring-teal-500 focus:border-teal-500",
					footerActionText: "text-slate-400",
					footerActionLink: "text-teal-500 hover:text-teal-400",
					identityPreviewText: "text-slate-300",
					identityPreviewEditButton: "text-teal-500 hover:text-teal-400",
					dividerLine: "bg-slate-800",
					dividerText: "text-slate-500"
				} },
				routing: "path",
				path: "/sign-up",
				signInUrl: "/login",
				fallbackRedirectUrl: "/onboarding"
			})]
		})
	});
}
//#endregion
export { SignUpComponent as component };
