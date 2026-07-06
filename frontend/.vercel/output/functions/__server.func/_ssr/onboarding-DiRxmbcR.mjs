import { i as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { E as LoaderCircle, h as Settings, i as Users, p as ShieldAlert } from "../_libs/lucide-react.mjs";
import { a as dist_exports } from "./dist-hQ4tG-g_.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-DiRxmbcR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function OnboardingPage() {
	const { user } = (0, dist_exports.useUser)();
	const { organization, isLoaded } = (0, dist_exports.useOrganization)();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [isProvisioning, setIsProvisioning] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isLoaded && organization && step === 1) setStep(2);
	}, [
		organization,
		isLoaded,
		step
	]);
	const handleComplete = () => {
		setIsProvisioning(true);
		setTimeout(() => {
			navigate({ to: "/dashboard" });
		}, 3e3);
	};
	if (!isLoaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-950 flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-teal-500" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-950 text-slate-50 flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-slate-800 bg-slate-900/50 py-4 px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-4xl mx-auto flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6 text-teal-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-bold tracking-widest uppercase",
					children: "THREATWEAVE Enterprise"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 flex flex-col items-center justify-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 top-1/2 w-full h-0.5 bg-slate-800 -z-10" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-10 w-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-teal-500 bg-teal-500/20 text-teal-400" : "border-slate-700 bg-slate-900 text-slate-500"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-semibold uppercase tracking-wider ${step >= 1 ? "text-teal-400" : "text-slate-500"}`,
									children: "Organization"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-10 w-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-teal-500 bg-teal-500/20 text-teal-400" : "border-slate-700 bg-slate-900 text-slate-500"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-semibold uppercase tracking-wider ${step >= 2 ? "text-teal-400" : "text-slate-500"}`,
									children: "Team"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-10 w-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-teal-500 bg-teal-500/20 text-teal-400" : "border-slate-700 bg-slate-900 text-slate-500"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-semibold uppercase tracking-wider ${step >= 3 ? "text-teal-400" : "text-slate-500"}`,
									children: "Provision"
								})]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl",
					children: [
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center mb-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-2xl font-bold text-white mb-2",
									children: ["Welcome, ", user?.firstName]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-400",
									children: "Create your enterprise organization to get started."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(dist_exports.CreateOrganization, {
								appearance: { elements: {
									card: "bg-transparent border-0 shadow-none",
									headerTitle: "hidden",
									headerSubtitle: "hidden",
									formButtonPrimary: "bg-teal-600 hover:bg-teal-500 text-white w-full",
									formFieldLabel: "text-slate-300",
									formFieldInput: "bg-slate-950 border-slate-800 text-slate-100 focus:ring-teal-500",
									logoImage: "border border-slate-800",
									logoImageDropzone: "bg-slate-950 border-slate-800"
								} },
								routing: "hash"
							})]
						}),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center mb-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-bold text-white mb-2",
										children: "Invite your team"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-400",
										children: "Add analysts, SOC managers, and administrators."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-950/50 border border-slate-800 rounded-lg p-6 mb-8 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-12 w-12 text-slate-500 mx-auto mb-4" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-slate-400 mb-4",
											children: "You can skip this step and invite team members later from the Settings console."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											className: "border-slate-700 text-slate-300 hover:bg-slate-800",
											onClick: () => setStep(3),
											children: "Skip for now"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setStep(3),
										className: "bg-teal-600 hover:bg-teal-500 text-white",
										children: "Continue to Provisioning"
									})
								})
							]
						}),
						step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col items-center text-center py-8",
							children: isProvisioning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-16 w-16 text-teal-500 animate-spin mb-6" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold text-white mb-2",
									children: "Provisioning Workspace"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-400 max-w-sm",
									children: "Initializing threat intelligence engines, generating encryption keys, and provisioning your isolated enterprise environment..."
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-16 w-16 text-teal-500 mb-6" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold text-white mb-2",
									children: "Ready to Launch"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-400 mb-8 max-w-sm",
									children: "Your organization structure is ready. We will now provision your dedicated Threatweave Enterprise workspace."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									onClick: handleComplete,
									className: "bg-teal-600 hover:bg-teal-500 text-white px-8",
									children: "Provision Environment"
								})
							] })
						})
					]
				})]
			})
		})]
	});
}
//#endregion
export { OnboardingPage as component };
