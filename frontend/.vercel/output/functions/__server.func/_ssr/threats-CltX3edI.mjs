import { i as __toESM } from "../_runtime.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { L as Eye, M as Globe, N as Funnel, X as Bug, Z as BookOpen, _ as Search, f as Shield, l as Terminal, p as ShieldAlert, rt as Activity, t as Zap } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { t as useVirtualizer } from "../_libs/@tanstack/react-virtual+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/threats-CltX3edI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var mockCVEs = Array.from({ length: 500 }).map((_, i) => ({
	id: `CVE-2026-${String(Math.floor(Math.random() * 9e4) + 1e4)}`,
	severity: Math.random() > .8 ? "CRITICAL" : Math.random() > .4 ? "HIGH" : "MEDIUM",
	score: (Math.random() * 5 + 5).toFixed(1),
	component: [
		"Nginx",
		"Apache Struts",
		"Log4j",
		"OpenSSL",
		"Linux Kernel",
		"Active Directory"
	][Math.floor(Math.random() * 6)],
	description: "A vulnerability was discovered allowing remote code execution under specific unauthenticated conditions.",
	date: (/* @__PURE__ */ new Date(Date.now() - Math.random() * 1e10)).toISOString().split("T")[0],
	status: Math.random() > .7 ? "Exploited in wild" : "PoC available"
}));
var getSeverityColor = (severity) => {
	switch (severity) {
		case "CRITICAL": return "text-red-500 bg-red-500/10 border-red-500/20";
		case "HIGH": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
		case "MEDIUM": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
		default: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
	}
};
function ThreatsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const parentRef = import_react.useRef(null);
	const filteredCVEs = import_react.useMemo(() => {
		return mockCVEs.filter((cve) => cve.id.toLowerCase().includes(search.toLowerCase()) || cve.component.toLowerCase().includes(search.toLowerCase()));
	}, [search]);
	const rowVirtualizer = useVirtualizer({
		count: filteredCVEs.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 64,
		overscan: 5
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-3xl font-headline-md font-bold tracking-tight text-on-surface uppercase flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-8 h-8 text-primary" }), "Global Threat Intelligence"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-on-surface-variant font-body-lg mt-2",
					children: "Real-time tracking of CVEs, APT campaigns, and zero-day vulnerabilities affecting your supply chain ecosystem."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "border-outline-variant bg-surface text-on-surface-variant hover:text-white font-mono uppercase text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 mr-2" }), "Live Sync"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "bg-primary text-primary-foreground font-mono uppercase text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 mr-2" }), "Threat Hunting"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 md:grid-cols-4",
				children: [
					{
						title: "Monitored CVEs",
						val: "14,092",
						trend: "+124 this week",
						icon: Bug,
						color: "text-blue-400"
					},
					{
						title: "Critical Exploits",
						val: "24",
						trend: "5 requiring action",
						icon: Zap,
						color: "text-red-500"
					},
					{
						title: "Active Campaigns",
						val: "12",
						trend: "Tracking APT29, Lazarus",
						icon: Globe,
						color: "text-purple-400"
					},
					{
						title: "Dark Web Mentions",
						val: "842",
						trend: "+12% vs last month",
						icon: Eye,
						color: "text-green-400"
					}
				].map((kpi, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface border border-outline-variant rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-primary/50 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-${kpi.color.split("-")[1]}-500/5 -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-110` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider",
								children: kpi.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(kpi.icon, { className: `w-4 h-4 ${kpi.color}` })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl font-black text-white font-headline-lg",
							children: kpi.val
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-on-surface-variant mt-2 font-mono",
							children: kpi.trend
						})
					]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2 space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface border border-outline-variant rounded-xl shadow-md overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 border-b border-outline-variant bg-surface-container flex flex-col sm:flex-row justify-between items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-sm text-white uppercase tracking-wider flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "w-4 h-4 text-primary" }), "Vulnerability Database"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 w-full sm:w-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1 sm:w-64",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: search,
										onChange: (e) => setSearch(e.target.value),
										placeholder: "Search CVE or Component...",
										className: "pl-9 bg-background border-outline-variant text-white font-mono text-xs h-9"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									className: "w-9 h-9 bg-background border-outline-variant text-on-surface-variant shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-4 h-4" })
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto max-h-[600px] overflow-y-auto relative",
							ref: parentRef,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left border-collapse min-w-[800px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "sticky top-0 bg-surface-container z-10 shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-outline-variant text-on-surface-variant font-mono text-[10px] uppercase tracking-wider",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold w-[150px]",
												children: "CVE ID"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold w-[120px]",
												children: "Severity"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold w-[80px]",
												children: "Score"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold w-[150px]",
												children: "Component"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold",
												children: "Description"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold w-[120px]",
												children: "Published"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-outline-variant text-sm text-white relative",
									style: { height: rowVirtualizer.getTotalSize() > 0 ? `${rowVirtualizer.getTotalSize()}px` : "auto" },
									children: rowVirtualizer.getVirtualItems().map((virtualRow) => {
										const cve = filteredCVEs[virtualRow.index];
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-surface-container/40 transition-colors absolute w-full group cursor-pointer",
											style: {
												height: `${virtualRow.size}px`,
												transform: `translateY(${virtualRow.start}px)`
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-4 font-mono text-xs text-primary group-hover:underline",
													children: cve.id
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `px-2 py-1 text-[10px] font-bold rounded border uppercase ${getSeverityColor(cve.severity)}`,
														children: cve.severity
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-4 font-mono font-bold text-white",
													children: cve.score
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-4 text-xs text-on-surface-variant",
													children: cve.component
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-4 text-xs text-on-surface-variant truncate max-w-[250px]",
													title: cve.description,
													children: cve.description
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-4 text-xs font-mono text-on-surface-variant",
													children: cve.date
												})
											]
										}, cve.id);
									})
								})]
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface border border-outline-variant rounded-xl shadow-md p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant pb-3 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4 text-green-400" }), "Intelligence Feeds Status"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: [
									{
										name: "NVD (National Vulnerability Database)",
										status: "Synced 2m ago",
										ok: true
									},
									{
										name: "CISA KEV (Known Exploited)",
										status: "Synced 5m ago",
										ok: true
									},
									{
										name: "AlienVault OTX",
										status: "Synced 12m ago",
										ok: true
									},
									{
										name: "Dark Web Scraper",
										status: "Degraded - Reconnecting",
										ok: false
									}
								].map((feed, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center p-3 rounded-lg border border-outline-variant bg-background",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-white mb-1",
										children: feed.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono text-on-surface-variant",
										children: feed.status
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-2 h-2 rounded-full ${feed.ok ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"}` })]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => window.location.href = "/settings",
								className: "w-full mt-4 bg-background border border-outline-variant hover:bg-surface-container text-xs font-mono text-white",
								children: "Manage Feeds"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface border border-outline-variant rounded-xl shadow-md p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant pb-3 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4 text-orange-400" }), "MITRE ATT&CK Matrix"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-on-surface-variant mb-4 leading-relaxed",
								children: "Analyze TTPs (Tactics, Techniques, and Procedures) observed across your vendor ecosystem."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									"Initial Access",
									"Execution",
									"Persistence",
									"Privilege Escalation",
									"Defense Evasion",
									"Credential Access"
								].map((tactic) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-background border border-outline-variant p-2 rounded text-[10px] font-mono text-center flex items-center justify-center text-on-surface hover:border-primary cursor-pointer transition-colors",
									children: tactic
								}, tactic))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => window.open("https://attack.mitre.org/", "_blank"),
								className: "w-full mt-4 bg-primary text-primary-foreground text-xs font-mono",
								children: "Open Interactive Matrix"
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
export { ThreatsPage as component };
