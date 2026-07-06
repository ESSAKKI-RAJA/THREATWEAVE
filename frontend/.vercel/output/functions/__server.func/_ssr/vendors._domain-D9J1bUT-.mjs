import { i as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D_heCM3C.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { A as Info, B as Crosshair, C as Network, E as LoaderCircle, F as FileSpreadsheet, G as ChevronRight, I as FileBraces, K as Check, P as FileText, R as Download, U as CircleCheck, V as Circle, W as CircleAlert, b as Radar, c as Trash2, f as Shield, m as Share2, nt as ArrowLeft, o as TriangleAlert, p as ShieldAlert, q as ChartLine, s as TrendingUp, u as Sparkles, y as RefreshCw } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as numberType, i as enumType, o as objectType, s as stringType } from "../_libs/zod.mjs";
import { t as supabase } from "./client-diYsDuuj.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./vendors._domain-C1Oz3kXq.mjs";
import { t as isValidDomain } from "./domain.utils-xh5LRKnC.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BJIlZY-x.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as Controls, r as index, t as Background } from "../_libs/@xyflow/react+[...].mjs";
import { a as Area, c as Bar, i as XAxis, l as ResponsiveContainer, n as BarChart, o as Line, r as YAxis, s as CartesianGrid, t as AreaChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendors._domain-D9J1bUT-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var ScanInput = objectType({
	domain: stringType().trim().toLowerCase().min(3).max(253).refine(isValidDomain, "Invalid domain"),
	name: stringType().trim().max(120).optional()
});
var runScan = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => ScanInput.parse(input)).handler(createSsrRpc("fa8336d1481611070fd84160b87a6d6d362b4d6bd6b5c4f6b107f76e6f70d307"));
var NarrativeInput = objectType({ scan_id: stringType().min(1) });
var generateNarrative = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => NarrativeInput.parse(input)).handler(createSsrRpc("4038762dec7b6fb04f3424f73b3d464608171c652fa14cc3cb48d25e53225dba"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("689e656e803db218ca7f44bb40e37cbf788050a9f82a2cf6a68dd5efc2cd2ea6"));
var MatchInput = objectType({ scan_id: stringType().min(1) });
var matchThreats = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => MatchInput.parse(input)).handler(createSsrRpc("7a4867f9118a791d654edd689bb83a0043d19a50844deee0b334e67909674ada"));
var useVendor = (domain) => {
	return useQuery({
		queryKey: ["vendor", domain],
		queryFn: async () => {
			const res = await fetch("/api/vendors");
			if (!res.ok) throw new Error("Failed to fetch vendors");
			const vendor = (await res.json()).find((v) => v.domain === domain);
			if (!vendor) throw new Error("Vendor not found");
			return vendor;
		},
		enabled: !!domain
	});
};
var useVendorScan = (vendorId) => {
	return useQuery({
		queryKey: ["vendorScan", vendorId],
		queryFn: async () => {
			const { data, error } = await supabase.from("scans").select("*").eq("vendor_id", vendorId).order("scan_date", { ascending: false }).limit(1).maybeSingle();
			if (error && error.code !== "PGRST116") throw error;
			return data;
		},
		enabled: !!vendorId
	});
};
var useVendorActions = () => {
	const queryClient = useQueryClient();
	return {
		rescanMutation: useMutation({
			mutationFn: async (domain) => {
				const res = await runScan({ data: { domain } });
				if (!res) throw new Error("Scan failed to complete");
				return res;
			},
			onSuccess: (_, domain) => {
				queryClient.invalidateQueries({ queryKey: ["vendor", domain] });
				queryClient.invalidateQueries({ queryKey: ["vendorScan"] });
				toast.success("Intelligence scan complete");
			},
			onError: () => {
				toast.error("Error running scan");
			}
		}),
		narrateMutation: useMutation({
			mutationFn: async (scanId) => {
				const res = await generateNarrative({ data: { scanId } });
				if (!res) throw new Error("Failed to generate report");
				return res;
			},
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["vendorScan"] });
				toast.success("Analyst report generated");
			},
			onError: () => {
				toast.error("Error generating narrative");
			}
		}),
		matchMutation: useMutation({
			mutationFn: async (scanId) => {
				await matchThreats({ data: { scanId } });
			},
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["vendorScan"] });
				toast.success("Threat matching complete");
			},
			onError: () => {
				toast.error("Threat match failed");
			}
		}),
		deleteVendorMutation: useMutation({
			mutationFn: async (vendorId) => {
				const { error } = await supabase.from("vendors").delete().eq("id", vendorId);
				if (error) throw error;
			},
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["vendors"] });
				toast.success("Vendor deleted");
			}
		})
	};
};
var getVendorRiskDetails = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(objectType({ vendorId: stringType() })).handler(createSsrRpc("ac9c060df86146d48b893ffdcc8aa54038ee39019a3000eb7a37d965406dfc64"));
var getSupplyChainRisk = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(objectType({ vendorId: stringType() })).handler(createSsrRpc("80028d9fe868ccadaf7661bdcc04a1964b761225a7eb88a6f0a25740339859a3"));
var getVendorAttck = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(objectType({ vendorId: stringType() })).handler(createSsrRpc("5f1b36128167df7a834c5d5f598810f5c337cedf21d4b61d836aec159270c414"));
var getForecast = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator(objectType({
	vendorId: stringType(),
	periods: numberType().optional().default(30),
	model: enumType([
		"arima",
		"prophet",
		"lstm"
	]).optional().default("arima")
})).handler(createSsrRpc("ea4a9d869b97cce1b6c9bb0b76881ef3461611c6e6693ee9415d4c564f8d0d1b"));
var getVendorThreatFeeds = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(objectType({ vendorId: stringType() })).handler(createSsrRpc("0702012d759db3beb18f2e9e909ee3590fa506123079218498411296e782a399"));
var getSupplyChainDepthRisk = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(objectType({ vendorId: stringType().uuid() })).handler(createSsrRpc("4284751539db0f8ad5084fe09419a992658134c858b5a3e59ff4c21bc344e77c"));
function useVendorRiskDetails(vendorId) {
	const fetchRiskDetails = useServerFn(getVendorRiskDetails);
	return useQuery({
		queryKey: ["vendor-risk-details", vendorId],
		queryFn: () => {
			if (typeof window !== "undefined" && window.__MOCK_RISK_ERROR) throw new Error("Mock error");
			if (typeof window !== "undefined" && window.__MOCK_RISK_LOADING) return new Promise(() => {});
			return fetchRiskDetails({ data: { vendorId } });
		},
		enabled: !!vendorId,
		staleTime: 300 * 1e3
	});
}
function useSupplyChainRisk(vendorId) {
	const fetchSupplyChainRisk = useServerFn(getSupplyChainRisk);
	return useQuery({
		queryKey: ["vendor-supply-chain", vendorId],
		queryFn: () => {
			if (typeof window !== "undefined" && window.__MOCK_SUPPLY_ERROR) throw new Error("Mock error");
			if (typeof window !== "undefined" && window.__MOCK_SUPPLY_LOADING) return new Promise(() => {});
			return fetchSupplyChainRisk({ data: { vendorId } });
		},
		enabled: !!vendorId,
		staleTime: 300 * 1e3
	});
}
function useForecast(vendorId, periods = 30, model = "arima") {
	const fetchForecast = useServerFn(getForecast);
	return useQuery({
		queryKey: [
			"vendor-forecast",
			vendorId,
			periods,
			model
		],
		queryFn: () => {
			if (typeof window !== "undefined" && window.__MOCK_FORECAST_ERROR) throw new Error("Mock error");
			if (typeof window !== "undefined" && window.__MOCK_FORECAST_LOADING) return new Promise(() => {});
			return fetchForecast({ data: {
				vendorId,
				periods,
				model
			} });
		},
		enabled: !!vendorId,
		staleTime: 3600 * 1e3
	});
}
function useVendorAttck(vendorId) {
	const fetchAttck = useServerFn(getVendorAttck);
	return useQuery({
		queryKey: ["vendor-attck", vendorId],
		queryFn: () => fetchAttck({ data: { vendorId } }),
		enabled: !!vendorId,
		staleTime: 300 * 1e3
	});
}
function useVendorThreatFeeds(vendorId) {
	const fetchThreatFeeds = useServerFn(getVendorThreatFeeds);
	return useQuery({
		queryKey: ["vendor-threat-feeds", vendorId],
		queryFn: () => fetchThreatFeeds({ data: { vendorId } }),
		enabled: !!vendorId,
		staleTime: 300 * 1e3
	});
}
function useSupplyChainDepth(vendorId) {
	const fetchDepth = useServerFn(getSupplyChainDepthRisk);
	return useQuery({
		queryKey: ["vendor-supply-chain-depth", vendorId],
		queryFn: () => fetchDepth({ data: { vendorId } }),
		enabled: !!vendorId,
		staleTime: 300 * 1e3
	});
}
/**
* Reusable error boundary that wraps individual widgets.
* Catches render errors and shows a recovery card instead of crashing the whole page.
*/
var ErrorBoundary = class extends import_react.Component {
	state = {
		hasError: false,
		error: null
	};
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error(`[ErrorBoundary${this.props.label ? ` — ${this.props.label}` : ""}]`, error, errorInfo);
	}
	handleRetry = () => {
		this.setState({
			hasError: false,
			error: null
		});
	};
	render() {
		if (this.state.hasError) {
			if (this.props.fallback) return this.props.fallback;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-destructive/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm flex items-center gap-2 text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), this.props.label ? `${this.props.label} Error` : "Something went wrong"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: this.state.error?.message || "An unexpected error occurred while rendering this section."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: this.handleRetry,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3 mr-1.5" }), " Retry"]
					})]
				})]
			});
		}
		return this.props.children;
	}
};
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function exportJSON(domain, scan, vendor) {
	const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scan, null, 2));
	const dlAnchorElem = document.createElement("a");
	dlAnchorElem.setAttribute("href", dataStr);
	dlAnchorElem.setAttribute("download", `vendor_scan_${domain}_${(/* @__PURE__ */ new Date()).getTime()}.json`);
	dlAnchorElem.click();
}
function exportCSV(domain, scan, vendor, score) {
	let csvContent = "data:text/csv;charset=utf-8,Metric,Value\r\n";
	csvContent += `Domain,${vendor?.domain ?? domain}\r\n`;
	csvContent += `Risk Score,${score}\r\n`;
	csvContent += `Confidence,${scan.confidence ?? 100}%\r\n`;
	csvContent += `Duration (s),${scan.scan_metadata?.duration_ms ? (scan.scan_metadata.duration_ms / 1e3).toFixed(1) : "Unknown"}\r\n`;
	csvContent += `Shodan Ports,${scan.shodan_data?.ports.length ?? 0}\r\n`;
	csvContent += `Shodan CVEs,${scan.shodan_data?.vulns.length ?? 0}\r\n`;
	csvContent += `Certificates,${scan.crt_sh_data?.length ?? 0}\r\n`;
	csvContent += `GitHub Leaks,${scan.github_data?.total_count ?? 0}\r\n`;
	if (scan.risk_breakdown) {
		csvContent += `\r\nRisk Factor,Points\r\n`;
		scan.risk_breakdown.forEach((b) => {
			csvContent += `"${b.factor.replace(/"/g, "\"\"")}",${b.points}\r\n`;
		});
	}
	const encodedUri = encodeURI(csvContent);
	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", `vendor_summary_${domain}_${(/* @__PURE__ */ new Date()).getTime()}.csv`);
	document.body.appendChild(link);
	link.click();
	link.remove();
}
function exportPDF() {
	window.print();
}
var VendorHeader = ({ vendor, scan, domain }) => {
	const navigate = useNavigate();
	const { rescanMutation, narrateMutation, matchMutation, deleteVendorMutation } = useVendorActions();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const onRescan = async () => {
		setBusy("scan");
		try {
			await rescanMutation.mutateAsync(vendor.domain);
		} finally {
			setBusy(null);
		}
	};
	const onNarrate = async () => {
		if (!scan) return;
		setBusy("ai");
		try {
			await narrateMutation.mutateAsync(scan.id);
		} finally {
			setBusy(null);
		}
	};
	const onMatch = async () => {
		if (!scan) return;
		setBusy("match");
		try {
			await matchMutation.mutateAsync(scan.id);
		} finally {
			setBusy(null);
		}
	};
	const onDelete = async () => {
		if (!confirm("Are you sure you want to permanently delete this vendor and all associated intelligence?")) return;
		setBusy("delete");
		try {
			await deleteVendorMutation.mutateAsync(vendor.id);
			navigate({ to: "/dashboard" });
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-gutter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/dashboard",
			className: "text-sm font-label-md uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center mb-4 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), "Back to Intelligence Dashboard"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4 mt-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display-lg text-display-lg uppercase tracking-tighter text-on-surface",
				children: vendor.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-data-mono text-data-mono text-on-surface-variant bg-surface-variant px-3 py-1 border border-outline-variant",
				children: vendor.domain
			})]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onRescan,
					disabled: busy !== null,
					className: "bg-surface-variant text-on-surface-variant font-label-md text-label-md uppercase px-4 py-2 border border-outline-variant hover:bg-surface hover:text-on-surface transition-colors flex items-center gap-2 disabled:opacity-50",
					children: [busy === "scan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), "Refresh Intelligence"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onMatch,
					disabled: busy !== null || !scan,
					className: "bg-surface-variant text-on-surface-variant font-label-md text-label-md uppercase px-4 py-2 border border-outline-variant hover:bg-surface hover:text-on-surface transition-colors flex items-center gap-2 disabled:opacity-50",
					children: [busy === "match" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "w-4 h-4" }), "Run Threat Match"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onNarrate,
					disabled: busy !== null || !scan,
					className: "bg-primary text-on-primary font-label-md text-label-md uppercase px-4 py-2 hover:bg-surface-tint transition-colors flex items-center gap-2 disabled:opacity-50",
					children: [busy === "ai" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), "Synthesize Report"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "bg-surface-variant text-on-surface-variant font-label-md text-label-md uppercase px-4 py-2 border border-outline-variant hover:bg-surface hover:text-on-surface transition-colors flex items-center gap-2 disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), "Export Data"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					className: "w-48 bg-surface-container-high border-outline-variant font-data-mono text-on-surface",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: exportPDF,
							className: "hover:bg-surface-variant cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 mr-2" }), " PDF Report (Print)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => {
								if (scan) exportCSV(domain, scan, vendor, vendor.risk_score);
							},
							className: "hover:bg-surface-variant cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-4 h-4 mr-2" }), " CSV Metrics"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => {
								if (scan) exportJSON(domain, scan, vendor);
							},
							className: "hover:bg-surface-variant cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBraces, { className: "w-4 h-4 mr-2" }), " Raw OSINT JSON"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: onDelete,
							className: "text-error focus:text-error hover:bg-error-container hover:text-on-error-container cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 mr-2" }), " Delete Vendor"]
						})
					]
				})] })
			]
		})]
	});
};
function SkeletonViz({ type, className }) {
	if (type === "chart") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("absolute inset-0 opacity-20 pointer-events-none flex items-end justify-between px-6 pb-6 pt-16", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1/12 h-[20%] bg-outline" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1/12 h-[35%] bg-outline" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1/12 h-[30%] bg-outline" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1/12 h-[50%] bg-outline" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1/12 h-[45%] bg-outline" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1/12 h-[80%] bg-outline" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1/12 h-[75%] bg-outline" })
		]
	});
	if (type === "matrix") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("grid grid-cols-4 gap-1 h-full opacity-30", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline h-8 mb-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline h-8 mb-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline h-8 mb-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline h-8 mb-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6 opacity-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6 opacity-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6 opacity-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-outline-variant h-6" })
		]
	});
	if (type === "graph") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("absolute inset-0 opacity-20 flex items-center justify-center", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full h-full text-outline-variant",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "absolute inset-0 w-full h-full",
					xmlns: "http://www.w3.org/2000/svg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "20%",
							y1: "50%",
							x2: "50%",
							y2: "30%",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeDasharray: "4 4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "20%",
							y1: "50%",
							x2: "50%",
							y2: "70%",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeDasharray: "4 4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "50%",
							y1: "30%",
							x2: "80%",
							y2: "50%",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeDasharray: "4 4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "50%",
							y1: "70%",
							x2: "80%",
							y2: "50%",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeDasharray: "4 4"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[50%] left-[20%] w-6 h-6 -ml-3 -mt-3 bg-outline rounded-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[30%] left-[50%] w-8 h-8 -ml-4 -mt-4 bg-outline-variant rounded-md" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[70%] left-[50%] w-8 h-8 -ml-4 -mt-4 bg-outline-variant rounded-md" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[50%] left-[80%] w-10 h-10 -ml-5 -mt-5 bg-outline rounded-full border-4 border-surface" })
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col gap-2 w-full opacity-30", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-full skeleton-shimmer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-3/4 skeleton-shimmer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-1/2 skeleton-shimmer" })
		]
	});
}
function DataModule({ title, icon, status, errorReason, onRetry, skeletonType = "chart", suppressColdStartMessage = false, themeTone = "default", children, className, headerRight }) {
	const getBentoToneClass = () => {
		switch (themeTone) {
			case "primary": return "bento-card-primary";
			case "error": return "bento-card-error";
			case "warning": return "bento-card-warning";
			default: return "";
		}
	};
	const renderColdStart = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 ml-1 flex-1 flex flex-col gap-2 relative min-h-[250px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonViz, {
			type: skeletonType,
			className: "absolute inset-0 p-6"
		}), !suppressColdStartMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 flex items-center justify-center bg-surface-container/60 backdrop-blur-[2px] z-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-data-mono text-data-mono text-on-surface-variant uppercase tracking-widest text-center px-4",
				children: "Awaiting Initial Scan"
			})
		})]
	});
	const renderError = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 ml-1 flex-1 flex flex-col items-center justify-center text-center gap-4 min-h-[250px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-12 h-12 rounded bg-tertiary-container/10 flex items-center justify-center mb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-8 h-8 text-tertiary-container" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-headline-sm text-headline-sm text-on-surface",
					children: "Data Unavailable"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-body-md text-body-md text-on-surface-variant max-w-sm",
					children: errorReason || "Failed to retrieve this intelligence module."
				})]
			}),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onRetry,
				className: "mt-2 bg-surface-variant hover:bg-surface text-on-surface-variant hover:text-on-surface border border-outline-variant px-4 py-2 rounded-sm font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), "Retry Module"]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("bento-card bg-surface-container border border-outline-variant flex flex-col relative", getBentoToneClass(), className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex justify-between items-center px-4 py-3 border-b border-outline-variant bg-surface-container-high ml-1 z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-headline-sm text-headline-sm text-on-surface-variant flex items-center gap-2 uppercase",
					children: [icon, title]
				}), headerRight ? headerRight : status === "cold-start" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 text-on-surface-variant animate-spin" }) : status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 text-tertiary-container" }) : null]
			}),
			status === "cold-start" && renderColdStart(),
			status === "error" && renderError(),
			status === "populated" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-6 ml-1 flex-1 flex flex-col relative h-full",
				children
			})
		]
	});
}
var RiskScoreCard = ({ vendorId, suppressColdStartMessage }) => {
	const { data, isLoading, error, refetch } = useVendorRiskDetails(vendorId);
	const getStatus = () => {
		if (isLoading || !data && !error) return "cold-start";
		if (error || !data) return "error";
		return "populated";
	};
	const status = getStatus();
	const vulns = data?.vulnerabilities || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataModule, {
		title: "Risk Details",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5" }),
		status,
		onRetry: () => refetch(),
		skeletonType: "list",
		suppressColdStartMessage,
		themeTone: "error",
		children: !!data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "font-label-md text-label-md mb-2 text-on-surface",
				children: [
					"Active Vulnerabilities (",
					vulns.length,
					")"
				]
			}), vulns.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-on-surface-variant font-data-mono",
				children: "No active vulnerabilities detected."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 max-h-48 overflow-y-auto pr-2",
				children: vulns.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col p-3 bg-surface-variant rounded-md border border-outline-variant text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-data-mono font-medium text-on-surface",
							children: v.cve_id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [v.known_exploited && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-error-container text-on-error-container text-[10px] uppercase px-1.5 py-0.5 rounded-sm",
								children: "CISA KEV"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "border border-outline-variant text-on-surface text-[10px] uppercase px-1.5 py-0.5 rounded-sm",
								children: ["CVSS: ", v.cvss_score]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-on-surface-variant mt-1 font-data-mono",
						children: [
							"EPSS: ",
							(v.epss_score * 100).toFixed(1),
							"% Likelihood"
						]
					})]
				}, i))
			})] })
		})
	});
};
function SupplyChainGraph({ vendorId, dependencies }) {
	const { nodes, edges } = (0, import_react.useMemo)(() => {
		const initialNodes = [{
			id: vendorId,
			position: {
				x: 250,
				y: 50
			},
			data: { label: "Root Vendor" },
			style: {
				background: "#1e1e2d",
				color: "#fff",
				border: "1px solid #333"
			}
		}];
		const initialEdges = [];
		dependencies.forEach((dep, index) => {
			const risk = dep.vendors?.risk_score || 0;
			let bgColor = "#1e1e2d";
			if (risk >= 70) bgColor = "#ef4444";
			else if (risk >= 40) bgColor = "#f59e0b";
			else if (risk > 0) bgColor = "#10b981";
			const targetId = dep.target_vendor_id;
			initialNodes.push({
				id: targetId,
				position: {
					x: 100 + index * 200,
					y: 200
				},
				data: { label: dep.vendors?.domain || targetId.slice(0, 8) },
				style: {
					background: bgColor,
					color: "#fff",
					border: "1px solid #333",
					borderRadius: "5px",
					padding: "10px"
				}
			});
			initialEdges.push({
				id: `e-${vendorId}-${targetId}`,
				source: vendorId,
				target: targetId,
				animated: true,
				style: { stroke: "#888" }
			});
		});
		return {
			nodes: initialNodes,
			edges: initialEdges
		};
	}, [vendorId, dependencies]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			width: "100%",
			height: "300px"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(index, {
			nodes,
			edges,
			fitView: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controls, {})]
		})
	});
}
function SeverityBadge({ severity, label, className, showIcon = true }) {
	const getStyles = () => {
		switch (severity) {
			case "critical": return "bg-error-container text-on-error-container border-error/20";
			case "high": return "bg-error-container text-on-error-container border-error/20";
			case "medium":
			case "low": return "bg-tertiary-container text-on-tertiary-container border-tertiary/20";
			case "baseline": return "bg-surface-variant text-on-surface border-outline-variant";
			default: return "bg-surface-variant text-on-surface border-outline-variant";
		}
	};
	const getIcon = () => {
		switch (severity) {
			case "critical":
			case "high": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5" });
			case "medium":
			case "low": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3.5 h-3.5" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("px-2 py-0.5 font-data-mono text-data-mono font-bold rounded-sm border flex items-center gap-1", getStyles(), className),
		children: [showIcon && getIcon(), label || severity.toUpperCase()]
	});
}
var SupplyChainPanel = ({ vendorId, suppressColdStartMessage }) => {
	const [viewMode, setViewMode] = (0, import_react.useState)("graph");
	const { data, isLoading, error, refetch } = useSupplyChainRisk(vendorId);
	const { data: depthData } = useSupplyChainDepth(vendorId);
	const getStatus = () => {
		if (isLoading || !data && !error) return "cold-start";
		if (error || !data) return "error";
		return "populated";
	};
	const status = getStatus();
	const cascade = data?.cascade_metrics || {};
	const deps = data?.dependencies || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataModule, {
		title: "Supply Chain Cascade",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-5 h-5" }),
		status,
		onRetry: () => refetch(),
		skeletonType: "graph",
		suppressColdStartMessage,
		themeTone: "default",
		headerRight: status === "populated" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex bg-surface border border-outline-variant rounded-sm overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setViewMode("list"),
				className: `px-3 py-1 text-xs font-label-md uppercase tracking-wider transition-colors ${viewMode === "list" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-variant"}`,
				children: "List"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setViewMode("graph"),
				className: `px-3 py-1 text-xs font-label-md uppercase tracking-wider transition-colors ${viewMode === "graph" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-variant"}`,
				children: "Graph"
			})]
		}) : void 0,
		children: !!data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col h-full space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-label-md text-label-md text-on-surface-variant uppercase tracking-widest",
							children: "Downstream Count"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display-lg text-display-lg text-on-surface",
							children: cascade.downstream_count || 0
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-label-md text-label-md text-on-surface-variant uppercase tracking-widest",
							children: "Avg Cascade Risk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display-lg text-display-lg text-tertiary",
							children: Math.round(cascade.avg_downstream_risk || 0)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col min-h-[300px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-2 border-b border-outline-variant pb-2",
						children: "Dependencies Mapping"
					}), deps.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-data-mono text-on-surface-variant py-4 text-center",
						children: "No dependencies mapped."
					}) : viewMode === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 overflow-y-auto flex-1",
						children: deps.map((d, i) => {
							const riskScore = d.vendors?.risk_score || 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between p-3 rounded-sm bg-surface-variant border border-outline-variant text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-data-mono text-on-surface",
									children: d.vendors?.domain || d.target_vendor_id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
									severity: riskScore > 70 ? "critical" : riskScore > 50 ? "high" : "low",
									showIcon: false,
									label: `Risk: ${riskScore}`
								})]
							}, i);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border border-outline-variant rounded-sm overflow-hidden bg-surface-variant flex-1 min-h-[300px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplyChainGraph, {
							vendorId,
							dependencies: deps
						})
					})]
				}),
				depthData && depthData.maxDepth > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-6 border-t border-outline-variant",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-4",
						children: "Risk By Depth Level"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-40 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: Object.entries(depthData.depths).map(([d, stat]) => ({
									depth: `Depth ${d}`,
									risk: stat.avgRisk
								})),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .2,
										vertical: false,
										stroke: "currentColor",
										className: "text-outline-variant"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "depth",
										tick: {
											fontSize: 12,
											fill: "var(--on-surface-variant)",
											fontFamily: "var(--font-data-mono)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: [0, 100],
										tick: {
											fontSize: 12,
											fill: "var(--on-surface-variant)",
											fontFamily: "var(--font-data-mono)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: {
											fill: "var(--surface-variant)",
											opacity: .5
										},
										contentStyle: {
											backgroundColor: "var(--surface-container-high)",
											borderColor: "var(--outline)",
											color: "var(--on-surface)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "risk",
										fill: "var(--primary)",
										radius: [
											2,
											2,
											0,
											0
										]
									})
								]
							})
						})
					})]
				})
			]
		})
	});
};
var ForecastChart = ({ vendorId, suppressColdStartMessage }) => {
	const [model, setModel] = (0, import_react.useState)("prophet");
	const { data, isLoading, error, refetch } = useForecast(vendorId, 30, model);
	const getStatus = () => {
		if (isLoading || !data && !error) return "cold-start";
		if (error || !data || !data.dates) return "error";
		return "populated";
	};
	const status = getStatus();
	const chartData = data?.dates ? data.dates.map((date, i) => ({
		date,
		score: data.predictions[i],
		lower: data.confidence_lower[i],
		upper: data.confidence_upper[i]
	})) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataModule, {
		title: "30-Day Risk Forecast",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5" }),
		status,
		onRetry: () => refetch(),
		skeletonType: "chart",
		suppressColdStartMessage,
		themeTone: "default",
		headerRight: status === "populated" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: model,
			onChange: (e) => setModel(e.target.value),
			className: "bg-surface border border-outline-variant text-on-surface font-label-md text-xs px-2 py-1 uppercase tracking-wider focus:ring-1 focus:ring-primary focus:outline-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "arima",
					children: "ARIMA"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "prophet",
					children: "Prophet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "lstm",
					children: "LSTM"
				})
			]
		}) : void 0,
		children: data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[250px] w-full mt-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data: chartData,
					margin: {
						top: 10,
						right: 0,
						left: -20,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							opacity: .2,
							stroke: "currentColor",
							className: "text-outline-variant"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "date",
							tick: {
								fontSize: 10,
								fill: "var(--on-surface-variant)",
								fontFamily: "var(--font-data-mono)"
							},
							minTickGap: 30
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							domain: [0, 100],
							tick: {
								fontSize: 10,
								fill: "var(--on-surface-variant)",
								fontFamily: "var(--font-data-mono)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: {
								backgroundColor: "var(--surface-container-high)",
								borderColor: "var(--outline)",
								fontFamily: "var(--font-data-mono)",
								fontSize: "12px"
							},
							labelStyle: { color: "var(--on-surface)" },
							itemStyle: { color: "var(--on-surface)" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "upper",
							stroke: "none",
							fill: "var(--primary)",
							fillOpacity: .1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "lower",
							stroke: "none",
							fill: "var(--surface-container)",
							fillOpacity: 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: "score",
							stroke: "var(--primary)",
							strokeWidth: 2,
							dot: false
						})
					]
				})
			})
		})
	});
};
var AttckMatrix = ({ vendorId, suppressColdStartMessage }) => {
	const { data, isLoading, error, refetch } = useVendorAttck(vendorId);
	const getStatus = () => {
		if (isLoading || !data && !error) return "cold-start";
		if (error || !data) return "error";
		return "populated";
	};
	const status = getStatus();
	const techniques = data?.techniques || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataModule, {
		title: "MITRE ATT&CK Intelligence",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-5 h-5" }),
		status,
		onRetry: () => refetch(),
		skeletonType: "matrix",
		suppressColdStartMessage,
		themeTone: "default",
		children: !!data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full",
			children: techniques.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-data-mono text-on-surface-variant",
				children: "No ATT&CK techniques mapped to current vulnerabilities."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2",
				children: techniques.map((t, i) => {
					const maxCount = Math.max(...techniques.map((t) => t.count));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center p-2 rounded-sm text-xs font-data-mono font-bold text-white transition-all hover:scale-105 border border-error/20",
						style: { backgroundColor: `rgba(239, 68, 68, ${maxCount > 0 ? Math.max(.2, t.count / maxCount) : .2})` },
						title: `${t.technique_id}: ${t.count} related CVEs`,
						children: t.technique_id
					}, i);
				})
			})
		})
	});
};
var ThreatFeedsCard = ({ vendorId, suppressColdStartMessage }) => {
	const { data, isLoading, error, refetch } = useVendorThreatFeeds(vendorId);
	const getStatus = () => {
		if (isLoading || !data && !error) return "cold-start";
		if (error || !data) return "error";
		return "populated";
	};
	const status = getStatus();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataModule, {
		title: "Threat Feeds",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-5 h-5" }),
		status,
		onRetry: () => refetch(),
		skeletonType: "list",
		suppressColdStartMessage,
		themeTone: "default",
		children: data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-outline-variant",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-label-md text-label-md text-on-surface",
						children: "AbuseIPDB Confidence"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-data-mono text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "bg-error-container text-on-error-container px-2 py-1 rounded-sm border border-error/20",
							children: [data.abuseipdb?.maliciousIps || 0, " IPs flagged"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-outline-variant",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-label-md text-label-md text-on-surface",
						children: "GreyNoise"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-data-mono text-xs capitalize",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-2 py-1 rounded-sm border ${data.greynoise?.classification === "malicious" ? "bg-error-container text-on-error-container border-error/20" : "bg-surface-variant text-on-surface border-outline-variant"}`,
							children: data.greynoise?.classification === "malicious" ? "Malicious IPs" : "Clean"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-outline-variant",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-label-md text-label-md text-on-surface",
						children: "AlienVault OTX"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-data-mono text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded-sm border border-tertiary/20",
							children: [data.otx?.pulseCount || 0, " related pulses"]
						})
					})]
				})
			]
		})
	});
};
function VendorDetail() {
	const { domain } = Route.useParams();
	const { data: vendor, isLoading: vendorLoading } = useVendor(domain);
	const { data: scan, isLoading: scanLoading } = useVendorScan(vendor?.id);
	const risk = useVendorRiskDetails(vendor?.id);
	const supply = useSupplyChainRisk(vendor?.id);
	const forecast = useForecast(vendor?.id);
	const threat = useVendorThreatFeeds(vendor?.id);
	const attck = useVendorAttck(vendor?.id);
	const getStatus = (q) => {
		if (q.isLoading || !q.data && !q.error) return "cold-start";
		if (q.error || !q.data) return "error";
		return "populated";
	};
	const suppressColdStart = [
		getStatus(risk),
		getStatus(supply),
		getStatus(forecast),
		getStatus(threat),
		getStatus(attck)
	].filter((s) => s === "cold-start").length >= 3;
	if (vendorLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-margin-mobile md:p-margin-desktop w-full mx-auto space-y-gutter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 bg-surface-variant rounded-sm animate-pulse border border-outline-variant" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-bento-gap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-80 bg-surface-variant rounded-sm animate-pulse border border-outline-variant" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-80 bg-surface-variant rounded-sm animate-pulse border border-outline-variant" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-80 bg-surface-variant rounded-sm animate-pulse border border-outline-variant" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-80 bg-surface-variant rounded-sm animate-pulse border border-outline-variant" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-96 bg-surface-variant rounded-sm animate-pulse border border-outline-variant" })
		]
	});
	if (!vendor) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-12 text-center font-data-mono text-on-surface-variant",
		children: "Vendor not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [suppressColdStart && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface-container-high border-b border-tertiary-container flex items-center px-margin-mobile md:px-margin-desktop py-2 gap-3 shrink-0 z-10 relative",
		role: "alert",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, { className: "w-5 h-5 text-tertiary-container animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-data-mono text-data-mono text-on-surface-variant flex-1 truncate",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "text-tertiary-container",
					children: "System Status: Awaiting Initial Scan"
				}),
				" ",
				"— Intelligence modules are pending data collection. Run a scan to populate."
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-margin-mobile md:p-margin-desktop w-full mx-auto space-y-gutter animate-in fade-in duration-500 overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
			label: "Vendor Header",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorHeader, {
				vendor,
				scan,
				domain
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full mt-6 space-y-12 pb-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-xl font-bold font-display-lg text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "w-6 h-6 text-primary" }), "Overview"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-bento-gap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
							label: "Risk Score",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskScoreCard, {
								vendorId: vendor.id,
								suppressColdStartMessage: suppressColdStart
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
							label: "Forecast",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForecastChart, {
								vendorId: vendor.id,
								suppressColdStartMessage: suppressColdStart
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-xl font-bold font-display-lg text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-6 h-6 text-error" }), "Vulnerabilities"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-bento-gap",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
								label: "Threat Feeds",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreatFeedsCard, {
									vendorId: vendor.id,
									suppressColdStartMessage: suppressColdStart
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-outline-variant border border-outline-variant rounded-md overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
								label: "ATT&CK Matrix",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttckMatrix, {
									vendorId: vendor.id,
									suppressColdStartMessage: suppressColdStart
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-xl font-bold font-display-lg text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "w-6 h-6 text-tertiary" }), "Supply Chain"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
						label: "Supply Chain",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplyChainPanel, {
							vendorId: vendor.id,
							suppressColdStartMessage: suppressColdStart
						})
					})]
				})
			]
		})]
	})] });
}
//#endregion
export { VendorDetail as component };
