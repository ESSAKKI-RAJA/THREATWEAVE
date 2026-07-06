import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { C as Network, D as Link, r as Waypoints } from "../_libs/lucide-react.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BJIlZY-x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supply-chain-CYC7fYny.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function SupplyChainPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-headline-md font-bold tracking-tight text-on-surface uppercase",
				children: "Supply Chain Analytics"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-on-surface-variant font-body-lg",
				children: "Visualize 3rd and Nth-party dependencies, monitor transitive risk, and analyze blast radius."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "bento-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between space-y-0 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm font-label-lg font-medium text-on-surface uppercase tracking-widest",
								children: "Total Monitored Vendors"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waypoints, { className: "h-4 w-4 text-primary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold text-on-surface font-display-sm",
							children: "18"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-on-surface-variant mt-1",
							children: "Directly contracted entities"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "bento-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between space-y-0 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm font-label-lg font-medium text-on-surface uppercase tracking-widest",
								children: "Nth-Party Connections"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "h-4 w-4 text-tertiary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold text-on-surface font-display-sm",
							children: "342"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-on-surface-variant mt-1",
							children: "Discovered transitive links"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "bento-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between space-y-0 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm font-label-lg font-medium text-on-surface uppercase tracking-widest",
								children: "Avg Network Depth"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-4 w-4 text-secondary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold text-on-surface font-display-sm",
							children: "2.4 Layers"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-on-surface-variant mt-1",
							children: "Average blast radius"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "bento-card min-h-[400px] flex flex-col items-center justify-center text-center p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-12 w-12 text-primary/40 mb-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-headline-sm font-bold text-on-surface",
						children: "Global Supply Chain Graph"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-on-surface-variant max-w-lg mt-2",
						children: "The global supply chain topology is currently being analyzed. Please select a specific vendor from the Dashboard to trace its unique upstream dependencies."
					})
				]
			})
		]
	});
}
//#endregion
export { SupplyChainPage as component };
