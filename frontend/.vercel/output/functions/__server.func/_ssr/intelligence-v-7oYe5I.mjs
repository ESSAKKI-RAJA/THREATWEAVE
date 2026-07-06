import { i as __toESM } from "../_runtime.mjs";
import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D_heCM3C.mjs";
import { E as LoaderCircle, N as Funnel, f as Shield, o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intelligence-v-7oYe5I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var getIOCs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("59781a883b240e37043844df027a979aaa84534c9a5c6db3c0d306c834a44a3c"));
var SEVERITY_STYLE = {
	critical: "bg-red-900/30 text-red-400 border border-red-800/50",
	high: "bg-orange-900/30 text-orange-400 border border-orange-800/50",
	medium: "bg-yellow-900/30 text-yellow-400 border border-yellow-800/50",
	low: "bg-green-900/30 text-green-400 border border-green-800/50"
};
var STATUS_DOT = {
	active: "bg-red-500",
	blocked: "bg-teal-500",
	analyzing: "bg-yellow-500 animate-pulse"
};
function IntelligenceDashboard() {
	const fetchIOCs = useServerFn(getIOCs);
	const [search, setSearch] = (0, import_react.useState)("");
	const [severityFilter, setSeverityFilter] = (0, import_react.useState)("all");
	const { data: iocs = [], isLoading, isError, error } = useQuery({
		queryKey: ["iocs"],
		queryFn: () => fetchIOCs(),
		staleTime: 6e4
	});
	const filtered = iocs.filter((ioc) => {
		const q = search.toLowerCase();
		const matchSearch = ioc.value.toLowerCase().includes(q) || ioc.actor.toLowerCase().includes(q) || ioc.type.toLowerCase().includes(q) || ioc.id.toLowerCase().includes(q);
		const matchSeverity = severityFilter === "all" || ioc.severity === severityFilter;
		return matchSearch && matchSeverity;
	});
	const criticalCount = iocs.filter((i) => i.severity === "critical").length;
	const activeCount = iocs.filter((i) => i.status === "active").length;
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center h-64 gap-3 text-slate-400",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-sm",
			children: "Loading threat intelligence feed..."
		})]
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center h-64 gap-3 text-red-400 bg-red-900/10 border border-red-800/30 rounded-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-8 h-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-sm",
			children: error instanceof Error ? error.message : "Failed to load threat intelligence."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-6 h-6 text-primary" }), "Threat Intelligence"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-400 mt-1 text-sm",
					children: "IOC tracking, CVE analysis, and Threat Actor attribution."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 text-xs font-mono",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-3 py-1.5 rounded-lg bg-red-900/20 border border-red-800/30 text-red-400",
						children: [criticalCount, " Critical"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-3 py-1.5 rounded-lg bg-orange-900/20 border border-orange-800/30 text-orange-400",
						children: [activeCount, " Active"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search by IOC value, actor, type...",
						className: "pl-8 h-9 text-xs bg-surface-container border-outline-variant text-white placeholder-slate-500 focus:border-primary"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: severityFilter,
					onChange: (e) => setSeverityFilter(e.target.value),
					className: "h-9 px-3 text-xs rounded-md bg-surface-container border border-outline-variant text-slate-300 focus:outline-none focus:border-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All Severities"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "critical",
							children: "Critical"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "high",
							children: "High"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "medium",
							children: "Medium"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "low",
							children: "Low"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-slate-950/50 text-xs uppercase font-semibold text-slate-300 border-b border-slate-800",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Indicator Value"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Severity"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Threat Actor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Last Seen"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-800",
							children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "text-center py-12 text-slate-500 font-mono text-xs",
								children: "No indicators match the current filter criteria."
							}) }) : filtered.map((ioc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-slate-800/50 transition-colors group cursor-default",
								title: ioc.description,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5 font-mono text-xs text-slate-500",
										children: ioc.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5 font-medium text-slate-200",
										children: ioc.type
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5 font-mono text-teal-400 max-w-[220px] truncate",
										children: ioc.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2.5 py-1 rounded-full text-xs font-semibold ${SEVERITY_STYLE[ioc.severity] ?? ""}`,
											children: ioc.severity.toUpperCase()
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5 text-slate-300",
										children: ioc.actor
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "capitalize text-slate-300 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${STATUS_DOT[ioc.status] ?? "bg-slate-500"}` }), ioc.status]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5 text-slate-400 text-xs font-mono",
										children: ioc.last_seen
									})
								]
							}, ioc.id))
						})]
					})
				})
			})
		]
	});
}
//#endregion
export { IntelligenceDashboard as component };
