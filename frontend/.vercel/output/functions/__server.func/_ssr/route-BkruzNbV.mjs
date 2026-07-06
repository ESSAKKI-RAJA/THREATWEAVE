import { i as __toESM } from "../_runtime.mjs";
import { _ as Link, f as Outlet, l as useLocation, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { $ as BellRing, C as Network, M as Globe, O as LayoutDashboard, P as FileText, _ as Search, f as Shield, h as Settings, k as Layers, p as ShieldAlert, rt as Activity, v as SearchCode, w as Menu } from "../_libs/lucide-react.mjs";
import { a as dist_exports } from "./dist-hQ4tG-g_.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BkruzNbV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function CommandPalette() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);
	const runCommand = import_react.useCallback((command) => {
		setOpen(false);
		command();
	}, []);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-2xl bg-surface-container border border-outline-variant rounded-xl shadow-2xl overflow-hidden shadow-black/50 animate-in fade-in zoom-in-95 duration-200",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e, {
				label: "Global Command Palette",
				className: "w-full flex flex-col overflow-hidden",
				onKeyDown: (e) => {
					if (e.key === "Escape") {
						e.preventDefault();
						setOpen(false);
					}
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center border-b border-outline-variant px-3 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5 text-slate-400 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
							autoFocus: true,
							className: "flex-1 bg-transparent outline-none border-none text-white px-3 placeholder-slate-500 font-mono text-sm",
							placeholder: "Type a command or search (e.g., 'scan vendor')"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "hidden md:inline-flex items-center gap-1 rounded border border-outline-variant bg-background px-2 font-mono text-[10px] font-medium text-slate-400 opacity-100",
							children: "ESC"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, {
					className: "max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#1f2937] scrollbar-track-transparent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
							className: "py-6 text-center text-sm text-slate-400 font-mono",
							children: "No results found."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
							heading: "Navigation",
							className: "px-2 py-2 text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => runCommand(() => navigate({ to: "/dashboard" })),
									className: "flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dashboard" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => runCommand(() => navigate({ to: "/threats" })),
									className: "flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Threat Intelligence" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => runCommand(() => navigate({ to: "/supply-chain" })),
									className: "flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Supply Chain" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => runCommand(() => navigate({ to: "/intelligence" })),
									className: "flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Threat Intelligence (IOC)" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => runCommand(() => navigate({ to: "/alerts" })),
									className: "flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Alerts" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => runCommand(() => navigate({ to: "/investigations" })),
									className: "flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Active Investigations" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
							heading: "Quick Actions",
							className: "px-2 py-2 text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider border-t border-outline-variant mt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => runCommand(() => navigate({ to: "/dashboard" })),
									className: "flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Launch Global Scan" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => runCommand(() => navigate({ to: "/dashboard" })),
									className: "flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-green-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Generate Executive Report" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => runCommand(() => navigate({ to: "/settings" })),
									className: "flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-4 h-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Organization Settings" })]
								})
							]
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[-1]",
			onClick: () => setOpen(false)
		})]
	});
}
var useUIStore = create((set) => ({
	sidebarOpen: true,
	toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
	setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen })
}));
function Sidebar() {
	const location = useLocation();
	const { sidebarOpen, toggleSidebar } = useUIStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Main Navigation",
		className: `fixed left-0 top-0 h-full z-40 bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out shadow-xl ${sidebarOpen ? "w-64" : "w-20"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-slate-800 flex items-center p-4 h-16 shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center space-x-3 overflow-hidden w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:bg-teal-500/20 hover:border-teal-500/40 transition-colors",
						onClick: toggleSidebar,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "text-teal-400 w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex flex-col whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-bold uppercase tracking-tight text-[15px] text-slate-100 leading-none",
							children: "THREATWEAVE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-teal-500 uppercase tracking-widest font-semibold mt-0.5 leading-none",
							children: "Enterprise"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto custom-scrollbar",
				children: [
					{
						name: "Dashboard",
						to: "/dashboard",
						icon: LayoutDashboard
					},
					{
						name: "Threat Intel",
						to: "/intelligence",
						icon: ShieldAlert
					},
					{
						name: "Supply Chain",
						to: "/supply-chain",
						icon: Network
					},
					{
						name: "Investigations",
						to: "/investigations",
						icon: SearchCode
					},
					{
						name: "Live Alerts",
						to: "/alerts",
						icon: BellRing
					},
					{
						name: "Settings",
						to: "/settings",
						icon: Settings
					}
				].map((item) => {
					const isActive = location.pathname.startsWith(item.to);
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group overflow-hidden ${isActive ? "bg-teal-500/15 text-teal-400 font-semibold shadow-sm border border-teal-500/20" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent"} ${sidebarOpen ? "justify-start gap-3" : "justify-center"}`,
						title: !sidebarOpen ? item.name : void 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 flex items-center justify-center w-6 h-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: `w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`,
								strokeWidth: isActive ? 2.5 : 2
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-sm tracking-wide whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 hidden"}`,
							children: item.name
						})]
					}, item.name);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `p-4 border-t border-slate-800 bg-slate-950/50 flex items-center shrink-0 transition-all duration-300 ${sidebarOpen ? "gap-3" : "justify-center"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-3 overflow-hidden ${sidebarOpen ? "w-full opacity-100" : "w-0 opacity-0 hidden"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm shadow-inner shrink-0",
						children: "AD"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-slate-100 truncate leading-tight",
							children: "Admin User"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-400 font-mono truncate leading-tight mt-0.5",
							children: "Administrator"
						})]
					})]
				}), false]
			})
		]
	});
}
function AppShell() {
	const location = useLocation();
	const { sidebarOpen, toggleSidebar } = useUIStore();
	const isVendorDetail = location.pathname.match(/^\/vendors\/[^/]+$/);
	const isBypass = true;
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col md:flex-row antialiased selection:bg-teal-900 selection:text-teal-100",
		children: [!isVendorDetail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex-1 flex flex-col min-h-screen bg-slate-950 relative transition-all duration-300 ${!isVendorDetail ? sidebarOpen ? "md:ml-64" : "md:ml-20" : "ml-0"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between px-6 z-30 sticky top-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold tracking-tighter text-teal-500 md:hidden uppercase",
						children: "THREATWEAVE"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "md:hidden p-2 text-on-surface-variant hover:text-white transition-colors",
						onClick: toggleSidebar,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-6 h-6" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-teal-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-mono text-slate-400 uppercase",
							children: "OPERATIONAL MODE"
						})]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 p-6 md:p-8 w-full max-w-[1600px] mx-auto relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
			})]
		})]
	});
	const { isSignedIn, isLoaded } = (0, dist_exports.useAuth)();
	const navigate = useNavigate();
	import_react.useEffect(() => {}, [
		isLoaded,
		isSignedIn,
		isBypass,
		navigate
	]);
	if (!isLoaded) return null;
	return content;
}
var SplitComponent = AppShell;
//#endregion
export { SplitComponent as component };
