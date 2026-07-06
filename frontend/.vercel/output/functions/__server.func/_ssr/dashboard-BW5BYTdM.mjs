import { i as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D_heCM3C.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { E as LoaderCircle, H as CircleX, M as Globe, R as Download, S as Play, U as CircleCheck, _ as Search, et as ArrowUpRight, f as Shield, k as Layers, n as X, o as TriangleAlert, rt as Activity, s as TrendingUp, x as Plus, y as RefreshCw, z as Database } from "../_libs/lucide-react.mjs";
import { a as Separator2, i as Root2, n as Item2, o as Trigger, r as Portal2, t as Content2 } from "../_libs/@radix-ui/react-context-menu+[...].mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-B5SRUUUO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useVirtualizer } from "../_libs/@tanstack/react-virtual+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BW5BYTdM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var getActivities = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ef1863e280ebd1dd0867f763e2bb1a53ec6aa6f06b0940ac0ef3a4fc67671769"));
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Dashboard() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [isAddModalOpen, setIsAddModalOpen] = (0, import_react.useState)(false);
	const [vendorToDelete, setVendorToDelete] = (0, import_react.useState)(null);
	const [vendorName, setVendorName] = (0, import_react.useState)("");
	const [vendorDomain, setVendorDomain] = (0, import_react.useState)("");
	const [vendorSector, setVendorSector] = (0, import_react.useState)("Technology");
	const [vendorTags, setVendorTags] = (0, import_react.useState)([]);
	const [vendorDescription, setVendorDescription] = (0, import_react.useState)("");
	const sectors = [
		"Technology",
		"Finance",
		"Healthcare",
		"Pharma",
		"Energy",
		"Retail",
		"Manufacturing",
		"Other"
	];
	const availableTags = [
		"SaaS",
		"Cloud",
		"Core",
		"Critical",
		"Legacy",
		"GDPR",
		"RD",
		"Non-Core"
	];
	const { data: vendors = [], isLoading: loadingVendors } = useQuery({
		queryKey: ["vendors"],
		queryFn: async () => {
			const res = await fetch("/api/vendors");
			if (!res.ok) throw new Error("Failed to load vendors");
			return res.json();
		},
		staleTime: 6e4
	});
	const { data: summary } = useQuery({
		queryKey: ["dashboard-summary"],
		queryFn: async () => {
			const res = await fetch("/api/dashboard/summary");
			if (!res.ok) throw new Error("Failed to load summary");
			return res.json();
		},
		staleTime: 6e4
	});
	const { data: alerts = [] } = useQuery({
		queryKey: ["dashboard-alerts"],
		queryFn: async () => {
			const res = await fetch("/api/dashboard/alerts");
			if (!res.ok) throw new Error("Failed to load alerts");
			return res.json();
		},
		staleTime: 6e4
	});
	const { data: pipeline = [] } = useQuery({
		queryKey: ["pipeline-status"],
		queryFn: async () => {
			const res = await fetch("/api/pipeline/status");
			if (!res.ok) throw new Error("Failed to load pipeline status");
			return res.json();
		},
		staleTime: 6e4
	});
	const addVendorMutation = useMutation({
		mutationFn: async (newVendor) => {
			const res = await fetch("/api/vendors", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newVendor)
			});
			if (!res.ok) throw new Error("Failed to add vendor");
			return res.json();
		},
		onSuccess: () => {
			toast.success("Vendor added successfully. Intelligence sweep initiated.");
			queryClient.invalidateQueries({ queryKey: ["vendors"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
			setIsAddModalOpen(false);
			resetForm();
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Error adding vendor");
		}
	});
	const triggerScanMutation = useMutation({
		mutationFn: async (vendorId) => {
			const res = await fetch(`/api/vendors/${vendorId}/scan`, { method: "POST" });
			if (!res.ok) throw new Error("Failed to trigger scan");
			return res.json();
		},
		onSuccess: () => {
			toast.success("Intelligence scan triggered successfully.");
			queryClient.invalidateQueries({ queryKey: ["vendors"] });
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Error triggering scan");
		}
	});
	const deleteVendorMutation = useMutation({
		mutationFn: async (vendorId) => {
			const res = await fetch(`/api/vendors/${vendorId}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to delete vendor");
			return res.json();
		},
		onSuccess: () => {
			toast.success("Vendor removed");
			queryClient.invalidateQueries({ queryKey: ["vendors"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
			setVendorToDelete(null);
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Error deleting vendor");
		}
	});
	const resetForm = () => {
		setVendorName("");
		setVendorDomain("");
		setVendorSector("Technology");
		setVendorTags([]);
		setVendorDescription("");
	};
	const handleExportCSV = () => {
		try {
			const a = document.createElement("a");
			a.href = "/api/dashboard/export";
			a.setAttribute("download", "");
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			toast.success("Export initiated successfully");
		} catch (err) {
			console.error(err);
			toast.error("Failed to initiate export");
		}
	};
	const handleAddSubmit = (e) => {
		e.preventDefault();
		if (!vendorName.trim() || !vendorDomain.trim()) {
			toast.error("Name and Domain are required fields");
			return;
		}
		if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(vendorDomain.trim())) {
			toast.error("Please enter a valid domain (e.g. example.com)");
			return;
		}
		addVendorMutation.mutate({
			name: vendorName.trim(),
			domain: vendorDomain.trim().toLowerCase(),
			sector: vendorSector,
			tags: vendorTags,
			description: vendorDescription.trim()
		});
	};
	const handleTagToggle = (tag) => {
		if (vendorTags.includes(tag)) setVendorTags(vendorTags.filter((t) => t !== tag));
		else setVendorTags([...vendorTags, tag]);
	};
	const getExposureTier = import_react.useCallback((score) => {
		if (score >= 75) return {
			label: "Critical",
			style: "bg-red-500/10 text-red-400 border-red-500/20"
		};
		if (score >= 55) return {
			label: "High",
			style: "bg-amber-500/10 text-amber-400 border-amber-500/20"
		};
		if (score >= 25) return {
			label: "Medium",
			style: "bg-blue-500/10 text-blue-400 border-blue-500/20"
		};
		return {
			label: "Low",
			style: "bg-green-500/10 text-green-400 border-green-500/20"
		};
	}, []);
	const getStatusBadge = import_react.useCallback((status, progress) => {
		switch (status) {
			case "queued": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-slate-400 text-xs font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400" }), "Queued"]
			});
			case "scanning": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1 w-full max-w-[100px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs font-mono text-blue-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin text-blue-400" }), "Scanning"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [progress, "%"] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full bg-outline-variant h-1 rounded-full overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-blue-500 h-full transition-all duration-300",
						style: { width: `${progress}%` }
					})
				})]
			});
			case "completed": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-green-400 text-xs font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-green-400" }), "Completed"]
			});
			case "failed": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-red-400 text-xs font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-3.5 h-3.5 text-red-400" }), "Failed"]
			});
		}
	}, []);
	const filteredVendors = import_react.useMemo(() => {
		const q = searchQuery.toLowerCase();
		return vendors.filter((v) => v.name.toLowerCase().includes(q) || v.domain.toLowerCase().includes(q) || v.sector.toLowerCase().includes(q));
	}, [vendors, searchQuery]);
	const parentRef = (0, import_react.useRef)(null);
	const rowVirtualizer = useVirtualizer({
		count: filteredVendors.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 64,
		overscan: 5
	});
	const fetchActivities = useServerFn(getActivities);
	const { data: activities = [] } = useQuery({
		queryKey: ["activities"],
		queryFn: () => fetchActivities(),
		staleTime: 6e4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-green-950/5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-green-500 animate-ping shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-green-500 absolute shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-sm text-green-400 font-semibold tracking-wide uppercase",
							children: "System Status: All Systems Operational"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden lg:inline text-xs text-slate-400 border-l border-slate-700 pl-3",
							children: "All intelligence collectors & threat intelligence feeds are operating normally. Last updated: 2 min ago."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "border-green-500/30 text-green-400 font-mono text-[10px] uppercase",
					children: "Live Feed"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					"data-testid": "dashboard-header",
					className: "text-3xl font-extrabold text-white tracking-tight uppercase font-headline-lg",
					children: "Executive Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-on-surface-variant mt-1 font-body-md",
					children: "Operational supply chain threat overview and real-time perimeter status."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: handleExportCSV,
						className: "border-outline-variant bg-surface text-on-surface-variant hover:text-white hover:bg-surface-container gap-2 font-mono uppercase text-xs tracking-wider",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), "Export Report"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setIsAddModalOpen(true),
						className: "bg-blue-600 text-white hover:bg-blue-700 gap-2 font-mono uppercase text-xs tracking-wider shadow-lg shadow-blue-500/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), "Add Vendor"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[140px] hover:border-blue-500/20 transition-all shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-3.5 h-3.5 text-primary" }), "Portfolio Risk Score"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-mono rounded border border-[#3b82f6]/20",
								children: "Live"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-white font-headline-lg",
									children: summary?.portfolioRiskScore ?? 72
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-on-surface-variant font-mono",
									children: "/ 100 Index"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-red-400 font-mono mt-1 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3 h-3" }), "+12 pts since last audit"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[140px] hover:border-red-500/20 transition-all shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-between items-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5 text-red-500" }), "Critical Exposure"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-red-500 font-headline-lg",
									children: summary?.criticalExposure ?? 18
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-on-surface-variant font-mono uppercase",
									children: "Active Exploits"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-on-surface-variant font-mono mt-1",
								children: "Across perimeters"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[140px] hover:border-slate-500/20 transition-all shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-between items-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-3.5 h-3.5 text-amber-500" }), "Monitored Entities"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-white font-headline-lg",
									children: summary?.monitoredEntities ?? 47
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-on-surface-variant font-mono uppercase",
									children: "Active"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-green-400 font-mono mt-1",
								children: "3 supply chains covered"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[140px] hover:border-amber-500/20 transition-all shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-between items-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5 text-amber-500" }), "Active Alerts"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-amber-500 font-headline-lg",
									children: summary?.activeAlerts ?? 9
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-on-surface-variant font-mono uppercase",
									children: "Unresolved"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-amber-400 font-mono mt-1",
								children: "Requires CISO review"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface border border-outline-variant p-5 rounded-xl flex flex-col justify-between min-h-[140px] hover:border-green-500/20 transition-all shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-between items-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-3.5 h-3.5 text-green-400" }), "Data Sources"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-green-400 font-headline-lg",
									children: summary?.dataSourcesConnected ?? 12
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-on-surface-variant font-mono",
									children: ["/ ", summary?.dataSourcesTotal ?? 15]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-green-400 font-mono mt-1",
								children: "OSINT connectors online"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface border border-outline-variant p-6 rounded-xl shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-primary" }), "Data Collection Pipeline Status"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6",
							children: [
								{
									name: "OSINT",
									status: "connected",
									desc: "Connected",
									icon: Globe,
									color: "text-green-400 border-green-500/20 bg-green-500/5"
								},
								{
									name: "Public Sources",
									status: "syncing",
									desc: "Syncing",
									icon: Activity,
									color: "text-blue-400 border-blue-500/20 bg-blue-500/5"
								},
								{
									name: "Processing",
									status: "processing",
									desc: "Processing",
									icon: LoaderCircle,
									color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
									anim: true
								},
								{
									name: "Database",
									status: "healthy",
									desc: "Healthy",
									icon: Database,
									color: "text-green-400 border-green-500/20 bg-green-500/5"
								}
							].map((node) => {
								const NodeIcon = node.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `border p-4 rounded-lg flex flex-col justify-between gap-3 ${node.color} transition-all`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] uppercase font-bold tracking-wider opacity-80",
											children: node.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeIcon, { className: `w-4 h-4 ${node.anim ? "animate-spin" : ""}` })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-white leading-tight",
										children: node.desc
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-on-surface-variant mt-1 font-mono",
										children: [
											node.name === "OSINT" && "Shodan/VirusTotal",
											node.name === "Public Sources" && "Subdomains (crt.sh)",
											node.name === "Processing" && "Fingerprint matching",
											node.name === "Database" && "Secure ledger online"
										]
									})] })]
								}, node.name);
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-primary" }), "Vendor Monitoring"]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full sm:w-auto flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-full sm:w-48",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 text-on-surface-variant absolute left-2.5 top-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Search vendors...",
										value: searchQuery,
										onChange: (e) => setSearchQuery(e.target.value),
										className: "pl-8 h-8 text-xs bg-background border-outline-variant text-white rounded-md placeholder-on-surface-variant focus:border-primary"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									"aria-label": "Refresh vendors",
									onClick: () => queryClient.invalidateQueries({ queryKey: ["vendors"] }),
									variant: "outline",
									size: "icon",
									className: "w-8 h-8 border-outline-variant text-on-surface-variant hover:text-white bg-surface",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" })
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							tabIndex: 0,
							className: "overflow-x-auto max-h-[500px] overflow-y-auto focus:outline-none focus:ring-1 focus:ring-blue-500/50",
							ref: parentRef,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								"data-testid": "vendor-table",
								className: "w-full text-left border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "sticky top-0 bg-surface-container z-10 shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-outline-variant text-on-surface-variant font-mono text-[10px] uppercase tracking-wider",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold",
												children: "Vendor"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold",
												children: "Domain"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold",
												children: "Sector"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold",
												children: "Risk Score"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold",
												children: "Exposure Tier"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold",
												children: "Last Scan"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-4 font-semibold text-right",
												children: "Actions"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-[#1f2937] text-sm text-white relative",
									style: { height: rowVirtualizer.getTotalSize() > 0 ? `${rowVirtualizer.getTotalSize()}px` : "auto" },
									children: loadingVendors ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										colSpan: 8,
										className: "p-8 text-center text-on-surface-variant font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-5 h-5 animate-spin mx-auto text-primary mb-2" }), "Fetching perimeter status..."]
									}) }) : filteredVendors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 8,
										className: "p-8 text-center text-on-surface-variant font-mono text-xs",
										children: "No vendors matched. Register a vendor domain to begin."
									}) }) : rowVirtualizer.getVirtualItems().map((virtualRow) => {
										const v = filteredVendors[virtualRow.index];
										const tier = getExposureTier(v.risk_score);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												"data-testid": `vendor-row-${v.domain}`,
												className: "hover:bg-surface/40 transition-colors group cursor-pointer absolute w-full",
												style: {
													height: `${virtualRow.size}px`,
													transform: `translateY(${virtualRow.start}px)`
												},
												onClick: () => {
													navigate({
														to: "/vendors/$domain",
														params: { domain: v.domain }
													});
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-4 font-semibold text-white",
														children: v.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-4 font-mono text-xs text-on-surface-variant",
														children: v.domain
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-4 text-xs text-on-surface-variant",
														children: v.sector
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-4",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-mono bg-background border border-outline-variant px-2 py-0.5 rounded text-xs font-bold text-white shadow-sm",
															children: [v.risk_score, " / 100"]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-4",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `px-2 py-0.5 text-[10px] font-bold rounded border ${tier.style}`,
															children: tier.label
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-4 text-xs text-on-surface-variant font-mono",
														children: v.last_successful_scan ? new Date(v.last_successful_scan).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit"
														}) : "Never"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-4",
														children: getStatusBadge(v.status, v.scan_progress)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-4 text-right",
														onClick: (e) => e.stopPropagation(),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-end gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "icon",
																variant: "ghost",
																disabled: v.status === "scanning",
																onClick: () => triggerScanMutation.mutate(v.id),
																className: "w-8 h-8 text-on-surface-variant hover:text-white hover:bg-outline-variant",
																title: "Run Security Scan",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3.5 h-3.5" })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "icon",
																variant: "ghost",
																onClick: () => navigate({
																	to: "/vendors/$domain",
																	params: { domain: v.domain }
																}),
																className: "w-8 h-8 text-on-surface-variant hover:text-primary hover:bg-outline-variant",
																title: "View Risk Matrix",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" })
															})]
														})
													})
												]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
											className: "bg-surface-container border border-outline-variant rounded-md shadow-2xl p-1 min-w-[200px] z-[100] font-mono text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item2, {
													className: "px-2 py-1.5 text-on-surface-variant hover:bg-outline-variant hover:text-white outline-none cursor-pointer rounded flex items-center gap-2",
													onSelect: () => navigate({
														to: "/vendors/$domain",
														params: { domain: v.domain }
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" }), " View Details"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item2, {
													className: "px-2 py-1.5 text-on-surface-variant hover:bg-outline-variant hover:text-white outline-none cursor-pointer rounded flex items-center gap-2",
													onSelect: () => triggerScanMutation.mutate(v.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-4 h-4" }), " Run Deep Scan"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, { className: "h-px bg-outline-variant my-1" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item2, {
													className: "px-2 py-1.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 outline-none cursor-pointer rounded flex items-center gap-2",
													onSelect: () => setVendorToDelete(v.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4" }), " Remove from monitoring"]
												})
											]
										}) })] }, v.id);
									})
								})]
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-surface border border-outline-variant p-5 rounded-xl shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center border-b border-outline-variant pb-3 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-red-500" }), "Active Alerts"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-red-500/10 text-red-400 text-[10px] font-mono px-2 py-0.5 rounded border border-red-500/20",
									children: "Action Required"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								tabIndex: 0,
								className: "space-y-3 max-h-[260px] overflow-y-auto pr-1 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded",
								children: alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center text-xs text-on-surface-variant py-8",
									children: "No active threat signals detected."
								}) : alerts.map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-background border border-outline-variant rounded-lg flex flex-col gap-1.5 hover:border-slate-700 transition-all cursor-pointer group",
									onClick: () => navigate({
										to: "/vendors/$domain",
										params: { domain: alert.vendor }
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs text-white group-hover:text-primary transition-colors",
											children: alert.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${alert.severity === "critical" ? "bg-red-500/10 text-red-500 border border-red-500/20" : alert.severity === "high" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`,
											children: alert.severity
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center text-[10px] text-on-surface-variant font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Vendor: ", alert.vendor] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: alert.time })]
									})]
								}, alert.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-surface border border-outline-variant p-5 rounded-xl shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider border-b border-outline-variant pb-3 mb-4 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-primary" }), "Quick Actions"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => setIsAddModalOpen(true),
										className: "bg-background border border-outline-variant hover:bg-surface-container text-white flex flex-col items-center justify-center py-6 h-auto text-xs gap-1.5 rounded-lg hover:border-blue-500/30 transition-all font-mono uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 text-primary" }), "Add Vendor"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => {
											if (vendors.length > 0) triggerScanMutation.mutate(vendors[0].id);
											else toast.error("Register at least one vendor first");
										},
										className: "bg-background border border-outline-variant hover:bg-surface-container text-white flex flex-col items-center justify-center py-6 h-auto text-xs gap-1.5 rounded-lg hover:border-red-500/30 transition-all font-mono uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-red-400 animate-pulse" }), "Threat Scan"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleExportCSV,
										className: "bg-background border border-outline-variant hover:bg-surface-container text-white flex flex-col items-center justify-center py-6 h-auto text-xs gap-1.5 rounded-lg transition-all font-mono uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 text-green-400" }), "Get Report"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => navigate({ to: "/alerts" }),
										className: "bg-background border border-outline-variant hover:bg-surface-container text-white flex flex-col items-center justify-center py-6 h-auto text-xs gap-1.5 rounded-lg transition-all font-mono uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-amber-400" }), "View Alerts"]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-surface border border-outline-variant p-5 rounded-xl shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-xs text-on-surface-variant uppercase tracking-wider border-b border-outline-variant pb-3 mb-4 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-primary" }), "Recent Activity"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: activities.map((act, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3 text-xs leading-normal",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "shrink-0 mt-0.5",
											children: [
												act.type === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-green-400" }),
												act.type === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-red-400" }),
												act.type === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-primary" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-white",
												children: act.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-on-surface-variant font-mono mt-0.5",
												children: act.detail
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0 font-mono text-[9px] text-on-surface-variant",
											children: act.time
										})
									]
								}, i))
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isAddModalOpen,
				onOpenChange: setIsAddModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "bg-surface border border-outline-variant text-white sm:max-w-[500px] rounded-xl overflow-hidden p-0 shadow-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddSubmit,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
										className: "text-lg font-bold font-mono uppercase text-white flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-5 h-5 text-primary" }), "Add Supply Chain Vendor"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
										className: "text-xs text-on-surface-variant",
										children: "Register a digital domain to initialize continuous perimeter scanning."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Close",
									onClick: () => setIsAddModalOpen(false),
									className: "text-on-surface-variant hover:text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-outline-variant transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-mono uppercase text-on-surface-variant font-semibold flex items-center gap-1",
											children: ["Vendor Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											placeholder: "e.g. Acme Corporation",
											value: vendorName,
											onChange: (e) => setVendorName(e.target.value),
											className: "bg-background border-outline-variant text-white h-9 placeholder-on-surface-variant focus:border-primary"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs font-mono uppercase text-on-surface-variant font-semibold flex items-center gap-1",
											children: ["Root Domain", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											placeholder: "e.g. acme.com",
											value: vendorDomain,
											onChange: (e) => setVendorDomain(e.target.value),
											className: "bg-background border-outline-variant text-white h-9 font-mono placeholder-on-surface-variant focus:border-primary"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-mono uppercase text-on-surface-variant font-semibold",
											children: "Sector Classification"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: vendorSector,
											onChange: (e) => setVendorSector(e.target.value),
											className: "w-full bg-background border border-outline-variant text-white h-9 rounded-md px-3 text-sm focus:border-primary outline-none",
											children: sectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: s,
												className: "bg-surface",
												children: s
											}, s))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-mono uppercase text-on-surface-variant font-semibold",
											children: "Metadata Tags"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											tabIndex: 0,
											className: "flex flex-wrap gap-2 p-3 bg-background border border-outline-variant rounded-md max-h-[96px] overflow-y-auto focus:outline-none focus:ring-1 focus:ring-blue-500/50",
											children: availableTags.map((tag) => {
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleTagToggle(tag),
													className: `px-2 py-0.5 text-[10px] font-mono rounded font-bold transition-all border ${vendorTags.includes(tag) ? "bg-primary/20 text-primary border-[#3b82f6]/30 shadow-sm" : "bg-surface text-on-surface-variant border-outline-variant hover:border-slate-700"}`,
													children: tag
												}, tag);
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-mono uppercase text-on-surface-variant font-semibold",
											children: "Vendor Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											placeholder: "Provide context regarding this vendor relationship (optional)...",
											value: vendorDescription,
											onChange: (e) => setVendorDescription(e.target.value),
											rows: 3,
											className: "w-full bg-background border border-outline-variant text-white rounded-md p-3 text-sm placeholder-on-surface-variant focus:border-primary outline-none resize-none"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 border-t border-outline-variant bg-surface-container/50 flex justify-end gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => {
										setIsAddModalOpen(false);
										resetForm();
									},
									className: "border-outline-variant text-on-surface-variant hover:bg-outline-variant bg-transparent font-mono uppercase text-xs tracking-wider",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: addVendorMutation.isPending,
									className: "bg-primary text-white hover:bg-blue-600 font-mono uppercase text-xs tracking-wider shadow-lg shadow-blue-500/10 gap-2",
									children: [addVendorMutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), "Scan Domain"]
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!vendorToDelete,
				onOpenChange: (open) => !open && setVendorToDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "bg-surface border-outline-variant text-white sm:max-w-[425px] overflow-hidden p-0 shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-red-500/10 p-4 border-b border-red-500/20 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-6 h-6 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-mono text-sm uppercase text-red-400 font-bold tracking-wider",
							children: "Confirm Removal"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-on-surface-variant font-body-md mb-4",
							children: "Are you sure you want to remove this vendor from monitoring? This action cannot be undone and will delete all associated risk intelligence data."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-3 mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setVendorToDelete(null),
								className: "border-outline-variant text-on-surface-variant hover:bg-outline-variant bg-transparent font-mono uppercase text-xs tracking-wider",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								onClick: () => vendorToDelete && deleteVendorMutation.mutate(vendorToDelete),
								disabled: deleteVendorMutation.isPending,
								className: "bg-red-500 text-white hover:bg-red-600 font-mono uppercase text-xs tracking-wider shadow-lg shadow-red-500/10 gap-2",
								children: [deleteVendorMutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), "Confirm Remove"]
							})]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { Dashboard as component };
