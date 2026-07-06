import { i as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { E as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-diYsDuuj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.callback-DxbAYwRa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function AuthCallback() {
	const navigate = useNavigate();
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data, error }) => {
			if (error) setError(error.message);
			else if (data.session) navigate({
				to: "/dashboard",
				replace: true
			});
			else navigate({
				to: "/login",
				replace: true
			});
		});
	}, [navigate]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center p-4 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-destructive mb-4 text-sm font-medium",
			children: error
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => navigate({
				to: "/login",
				replace: true
			}),
			className: "text-primary text-sm hover:underline",
			children: "Return to login"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-4 text-sm text-muted-foreground",
			children: "Completing sign in..."
		})]
	});
}
//#endregion
export { AuthCallback as component };
