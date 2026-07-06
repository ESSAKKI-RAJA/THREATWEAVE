import { i as __toESM } from "../_runtime.mjs";
import { l as createServerFn } from "./esm-DhkbgPqS.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cfk-4N5w.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D_heCM3C.mjs";
import { a as User, x as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-B5SRUUUO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/investigations-PpNLdqv9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var getInvestigations = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("f4e27d44dfeb09cf759d8ffcee0b3def5d46031102322aed8534ba847cefbfc7"));
var createInvestigation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => data).handler(createSsrRpc("2138eafa429613569ef15b6524507378036a4cec9b58e38b6c36e0feec9ec06e"));
function InvestigationsDashboard() {
	const fetchInvestigations = useServerFn(getInvestigations);
	const createFn = useServerFn(createInvestigation);
	const { data: cases = [], isLoading } = useQuery({
		queryKey: ["investigations"],
		queryFn: () => fetchInvestigations()
	});
	const queryClient = useQueryClient();
	const [isModalOpen, setIsModalOpen] = import_react.useState(false);
	const [title, setTitle] = import_react.useState("");
	const [assignee, setAssignee] = import_react.useState("");
	const [priority, setPriority] = import_react.useState("Medium");
	const createMutation = useMutation({
		mutationFn: async (data) => {
			return createFn({ data });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["investigations"] });
			toast.success("New investigation case created.");
			setIsModalOpen(false);
			setTitle("");
			setAssignee("");
			setPriority("Medium");
		},
		onError: (err) => toast.error("Error creating investigation: " + String(err))
	});
	const handleCreate = (e) => {
		e.preventDefault();
		if (!title || !assignee) return toast.error("Please fill all required fields");
		createMutation.mutate({
			title,
			assignee,
			priority,
			status: "Open"
		});
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-pulse",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 bg-slate-800 rounded" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
			children: [
				1,
				2,
				3
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-slate-900 border border-slate-800 rounded-xl h-48" }, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-slate-100 tracking-tight",
					children: "Active Investigations"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-400 mt-1",
					children: "Card-based case management UI for collaborative forensic analysis."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setIsModalOpen(true),
					className: "px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), "New Case"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
				children: cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 border-b border-slate-800 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-start mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded",
									children: c.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-semibold px-2 py-1 rounded-full ${c.priority === "Critical" ? "bg-red-900/30 text-red-400" : c.priority === "High" ? "bg-orange-900/30 text-orange-400" : "bg-yellow-900/30 text-yellow-400"}`,
									children: c.priority
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-slate-100 mb-2",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-slate-400 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4" }), c.assignee]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-slate-950/50 flex justify-between items-center text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-500",
							children: c.date
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `flex items-center gap-1.5 font-medium ${c.status === "In Progress" ? "text-teal-400" : c.status === "Closed" ? "text-slate-500" : "text-blue-400"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${c.status === "In Progress" ? "bg-teal-400" : c.status === "Closed" ? "bg-slate-500" : "bg-blue-400"}` }), c.status]
						})]
					})]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isModalOpen,
				onOpenChange: setIsModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "bg-slate-900 border-slate-800 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create New Investigation Case" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-slate-400",
						children: "Enter details for the new forensic investigation."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreate,
						className: "space-y-4 pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Case Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: title,
									onChange: (e) => setTitle(e.target.value),
									required: true,
									className: "bg-slate-950 border-slate-800 text-white",
									placeholder: "e.g. Compromised S3 Bucket"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assignee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: assignee,
									onChange: (e) => setAssignee(e.target.value),
									required: true,
									className: "bg-slate-950 border-slate-800 text-white",
									placeholder: "e.g. jdoe@example.com"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: priority,
									onChange: (e) => setPriority(e.target.value),
									className: "w-full h-10 px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Low",
											children: "Low"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Medium",
											children: "Medium"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "High",
											children: "High"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Critical",
											children: "Critical"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsModalOpen(false),
									className: "bg-slate-950 text-white border-slate-800 hover:bg-slate-800",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "bg-teal-600 text-white hover:bg-teal-500",
									disabled: createMutation.isPending,
									children: createMutation.isPending ? "Creating..." : "Create Case"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { InvestigationsDashboard as component };
