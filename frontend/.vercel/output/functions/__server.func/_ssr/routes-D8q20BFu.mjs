import { i as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { C as Network, J as ChartColumn, M as Globe, f as Shield, p as ShieldAlert, rt as Activity, tt as ArrowRight, z as Database } from "../_libs/lucide-react.mjs";
import { a as dist_exports } from "./dist-hQ4tG-g_.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D8q20BFu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function Landing() {
	const navigate = useNavigate();
	const { isSignedIn, isLoaded } = (0, dist_exports.useAuth)();
	(0, import_react.useEffect)(() => {
		navigate({ to: "/dashboard" });
	}, [
		navigate,
		isLoaded,
		isSignedIn,
		true
	]);
	const destRoute = "/login";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-950 text-slate-50 selection:bg-teal-500/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-bold tracking-widest text-slate-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6 text-teal-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "uppercase",
								children: "THREATWEAVE"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden md:flex items-center gap-8 text-sm font-medium text-slate-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#platform",
									className: "hover:text-teal-400 transition-colors",
									children: "Platform"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#solutions",
									className: "hover:text-teal-400 transition-colors",
									children: "Solutions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#pricing",
									className: "hover:text-teal-400 transition-colors",
									children: "Pricing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#docs",
									className: "hover:text-teal-400 transition-colors",
									children: "Documentation"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: destRoute,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									className: "text-slate-300 hover:text-white hover:bg-slate-800",
									children: "Sign In"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: destRoute,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "bg-teal-600 hover:bg-teal-500 text-white border-0 shadow-[0_0_15px_rgba(13,148,136,0.5)]",
									children: "Start Free Trial"
								})
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-400 mb-8 backdrop-blur-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse" }), "THREATWEAVE Enterprise v2.0 is now available"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl",
							children: [
								"See the threats ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600",
									children: "already inside"
								}),
								" your supply chain."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400",
							children: "Enterprise-grade cyber risk intelligence. We map structural fingerprints, expose Nth-party vendor vulnerabilities, and generate CISO-ready narratives in seconds."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex items-center justify-center gap-x-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: destRoute,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									className: "bg-teal-600 hover:bg-teal-500 text-white px-8 h-12 text-base",
									children: ["Start Free Trial ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								className: "border-slate-700 text-slate-300 hover:bg-slate-800 px-8 h-12 text-base bg-slate-900/50",
								children: "Book a Demo"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-slate-800/60 bg-slate-900/30 py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm font-semibold uppercase tracking-wider text-slate-500 mb-8",
						children: "Trusted by security teams at leading enterprises"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap justify-center gap-12 opacity-50 grayscale transition-all hover:grayscale-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xl font-bold text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-6 w-6" }), " SECURECORP"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xl font-bold text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-6 w-6" }), " GLOBALDEFENSE"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xl font-bold text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-6 w-6" }), " DATAVAULT"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xl font-bold text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-6 w-6" }), " CYBERMETRICS"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xl font-bold text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-6 w-6" }), " NETGUARD"]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "platform",
				className: "py-24 sm:py-32",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl lg:text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-semibold leading-7 text-teal-400",
								children: "Mission Control"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl",
								children: "Everything you need to secure your ecosystem"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-lg leading-8 text-slate-400",
								children: "THREATWEAVE fuses petabytes of OSINT data with predictive AI to deliver actionable intelligence before a breach occurs."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col bg-slate-900/50 rounded-2xl p-8 border border-slate-800 transition-all hover:border-teal-500/50 hover:bg-slate-800/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
										className: "flex items-center gap-x-3 text-xl font-semibold leading-7 text-white",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5 text-teal-400" })
										}), "Cyber Threat Intelligence"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "flex-auto",
											children: "Continuous monitoring of Dark Web chatter, leaked credentials, exposed infrastructure, and emerging CVEs correlated directly to your assets."
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col bg-slate-900/50 rounded-2xl p-8 border border-slate-800 transition-all hover:border-teal-500/50 hover:bg-slate-800/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
										className: "flex items-center gap-x-3 text-xl font-semibold leading-7 text-white",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-5 w-5 text-teal-400" })
										}), "Supply Chain Risk"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "flex-auto",
											children: "Interactive Nth-party dependency mapping. Visualize blast radius, uncover shadow IT, and assess vendor risk scores dynamically."
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col bg-slate-900/50 rounded-2xl p-8 border border-slate-800 transition-all hover:border-teal-500/50 hover:bg-slate-800/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
										className: "flex items-center gap-x-3 text-xl font-semibold leading-7 text-white",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5 text-teal-400" })
										}), "Executive Intelligence"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "flex-auto",
											children: "AI-generated CISO narratives that translate technical vulnerabilities into business risk. Instantly export boardroom-ready reports."
										})
									})]
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.teal.900),theme(colors.slate.950))] opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold tracking-tight text-white sm:text-4xl",
								children: "Ready to secure your enterprise?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300",
								children: "Join the organizations using THREATWEAVE to proactively manage vendor risk and stop supply chain attacks."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 flex items-center justify-center gap-x-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: destRoute,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										className: "bg-teal-600 hover:bg-teal-500 text-white h-12 px-8",
										children: "Start Free Trial"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: destRoute,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "link",
										className: "text-teal-400 hover:text-teal-300",
										children: ["Contact Sales ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											children: "→"
										})]
									})
								})]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-slate-800 bg-slate-950 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-bold tracking-widest text-slate-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5 text-teal-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "uppercase text-sm",
								children: "THREATWEAVE"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-slate-500",
							children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" Threatweave Enterprise. All rights reserved."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-6 text-sm text-slate-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: "hover:text-teal-400",
								children: "Privacy Policy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: "hover:text-teal-400",
								children: "Terms of Service"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
