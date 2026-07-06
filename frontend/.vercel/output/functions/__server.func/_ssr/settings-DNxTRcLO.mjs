import { i as __toESM } from "../_runtime.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { D as Link, E as LoaderCircle, Q as Bell, T as Lock, U as CircleCheck, Y as Building, d as SlidersVertical, f as Shield, g as Server, i as Users, j as History, rt as Activity } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DNxTRcLO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var localSettings = {
	shodan: "gbnJo1VQl1kv2vYWKrUsUiR0mp0rfnKU",
	virustotal: "e7e17464d665491f51e5c54595b1b254ea6f8ac173d25d1f748ebc056fea702d",
	greynoise: "7e522856cb2f91ff6449c145edd8c17d22447a8f09a0a21620d83095805027a3",
	security_strict_ip: false,
	webhook_url: ""
};
async function fetchOrganizationSettings() {
	try {
		const res = await fetch("/api/v1/settings");
		if (res.ok) return await res.json();
	} catch (e) {
		console.warn("Backend unavailable, using local settings cache.");
	}
	return { ...localSettings };
}
async function updateOrganizationSettings(newSettings) {
	try {
		if ((await fetch("/api/v1/settings", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newSettings)
		})).ok) {
			localSettings = {
				...localSettings,
				...newSettings
			};
			return true;
		}
	} catch (e) {
		console.warn("Backend unavailable, updating local settings cache.");
	}
	localSettings = {
		...localSettings,
		...newSettings
	};
	return true;
}
function SettingsPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("organization");
	const queryClient = useQueryClient();
	const { data: settingsData, isLoading } = useQuery({
		queryKey: ["settings"],
		queryFn: fetchOrganizationSettings
	});
	const [apiKeys, setApiKeys] = (0, import_react.useState)({
		shodan: "",
		virustotal: "",
		greynoise: "",
		censys: "",
		abuseipdb: "",
		alienvault: "",
		opencti: "",
		misp: "",
		sentinel: "",
		splunk: "",
		qradar: "",
		elastic: "",
		crowdstrike: "",
		defender: ""
	});
	const [org, setOrg] = (0, import_react.useState)({
		name: "Acme Corporation",
		timezone: "UTC",
		language: "en-US",
		primaryColor: "#0d9488",
		webhookUrl: ""
	});
	const [security, setSecurity] = (0, import_react.useState)({
		strictIp: false,
		mfaRequired: true,
		ssoEnabled: false,
		scimEnabled: false,
		sessionTimeout: "60",
		passwordLength: "12"
	});
	const [notifications, setNotifications] = (0, import_react.useState)({
		email: true,
		slack: true,
		teams: false,
		discord: false,
		pagerduty: true,
		alertsOnly: false
	});
	(0, import_react.useEffect)(() => {
		if (settingsData) {
			setApiKeys((prev) => ({
				...prev,
				shodan: settingsData.shodan || "",
				virustotal: settingsData.virustotal || "",
				greynoise: settingsData.greynoise || ""
			}));
			setSecurity((prev) => ({
				...prev,
				strictIp: settingsData.security_strict_ip || false
			}));
			setOrg((prev) => ({
				...prev,
				webhookUrl: settingsData.webhook_url || ""
			}));
		}
	}, [settingsData]);
	const updateSettingsMutation = useMutation({
		mutationFn: async (section) => {
			await new Promise((resolve) => setTimeout(resolve, 800));
			return updateOrganizationSettings({
				shodan: apiKeys.shodan,
				virustotal: apiKeys.virustotal,
				greynoise: apiKeys.greynoise,
				security_strict_ip: security.strictIp,
				webhook_url: org.webhookUrl
			});
		},
		onSuccess: (success, section) => {
			if (success) {
				toast.success(`${section} settings saved successfully.`);
				queryClient.invalidateQueries({ queryKey: ["settings"] });
			} else toast.error(`Failed to save ${section} settings.`);
		},
		onError: (err, section) => {
			toast.error(`Error saving ${section} settings: ${err}`);
		}
	});
	const handleSave = (section) => {
		updateSettingsMutation.mutate(section);
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 flex items-center justify-center p-8 bg-slate-950 min-h-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 text-teal-500 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-slate-400 font-mono text-sm uppercase tracking-wider",
				children: "Loading Enterprise Console..."
			})]
		})
	});
	const tabs = [
		{
			id: "organization",
			label: "Organization",
			icon: Building
		},
		{
			id: "profile",
			label: "Identity & Access",
			icon: Users
		},
		{
			id: "security",
			label: "Platform Security",
			icon: Shield
		},
		{
			id: "integrations",
			label: "Connectors & API",
			icon: Link
		},
		{
			id: "notifications",
			label: "Alerts & Webhooks",
			icon: Bell
		},
		{
			id: "appearance",
			label: "Appearance",
			icon: SlidersVertical
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 w-full bg-slate-950 min-h-screen text-slate-50 selection:bg-teal-500/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-[1600px] mx-auto w-full p-4 md:p-8 flex flex-col md:flex-row gap-8 items-start h-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full md:w-72 flex flex-col gap-1 shrink-0 bg-slate-900/50 border border-slate-800 rounded-xl p-3 h-[calc(100vh-8rem)] sticky top-24 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-3 mb-2 border-b border-slate-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-bold text-slate-400 font-mono uppercase tracking-widest",
						children: "Control Center"
					})
				}), tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab(tab.id),
					className: `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: `w-4 h-4 ${activeTab === tab.id ? "text-teal-400" : "text-slate-500"}` }), tab.label]
				}, tab.id))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 w-full space-y-6 min-h-[600px] pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-slate-800 pb-6 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold text-white tracking-tight",
							children: tabs.find((t) => t.id === activeTab)?.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-400 text-sm mt-2 max-w-2xl",
							children: "Configure global settings and security policies for your enterprise workspace."
						})] }), activeTab !== "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => handleSave(tabs.find((t) => t.id === activeTab)?.label || "Settings"),
							disabled: updateSettingsMutation.isPending,
							className: "bg-teal-600 hover:bg-teal-500 text-white font-medium min-w-[140px]",
							children: [updateSettingsMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 mr-2" }), "Save Configuration"]
						})]
					}),
					activeTab === "organization" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6 animate-in fade-in duration-300",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-slate-800/50 px-6 py-4 border-b border-slate-800",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-lg font-medium text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "w-5 h-5 text-teal-500" }), "General Information"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 space-y-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-slate-300",
										children: "Organization Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: org.name,
										onChange: (e) => setOrg({
											...org,
											name: e.target.value
										}),
										className: "bg-slate-950 border-slate-800 text-slate-100 focus:border-teal-500 focus:ring-teal-500"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-slate-300",
											children: "Timezone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: org.timezone,
											onChange: (e) => setOrg({
												...org,
												timezone: e.target.value
											}),
											className: "w-full bg-slate-950 border border-slate-800 rounded-md h-10 px-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "UTC",
													children: "UTC (Coordinated Universal Time)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "EST",
													children: "EST (Eastern Standard Time)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "PST",
													children: "PST (Pacific Standard Time)"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-slate-300",
											children: "Language"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: org.language,
											onChange: (e) => setOrg({
												...org,
												language: e.target.value
											}),
											className: "w-full bg-slate-950 border border-slate-800 rounded-md h-10 px-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "en-US",
													children: "English (US)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "es-ES",
													children: "Spanish (ES)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "fr-FR",
													children: "French (FR)"
												})
											]
										})]
									})]
								})]
							})]
						})
					}),
					activeTab === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-slate-800/50 px-6 py-4 border-b border-slate-800",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-lg font-medium text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-5 h-5 text-teal-500" }), "Enterprise Policies"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-6 border-b border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-medium text-slate-100",
											children: "Require Multi-Factor Authentication (MFA)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-slate-400 mt-1",
											children: "Enforce TOTP or WebAuthn for all user logins across the organization."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "relative inline-flex items-center cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: security.mfaRequired,
												onChange: (e) => setSecurity({
													...security,
													mfaRequired: e.target.checked
												}),
												className: "sr-only peer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500 border border-slate-700" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-6 border-b border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-medium text-slate-100",
											children: "IP Allowlisting (Strict Mode)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-slate-400 mt-1",
											children: "Restrict dashboard access to approved corporate IP ranges only."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "relative inline-flex items-center cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: security.strictIp,
												onChange: (e) => setSecurity({
													...security,
													strictIp: e.target.checked
												}),
												className: "sr-only peer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500 border border-slate-700" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-slate-300",
												children: "Session Timeout (Minutes)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: security.sessionTimeout,
												onChange: (e) => setSecurity({
													...security,
													sessionTimeout: e.target.value
												}),
												className: "bg-slate-950 border-slate-800 text-slate-100 focus:border-teal-500 focus:ring-teal-500"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-slate-300",
												children: "Minimum Password Length"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: security.passwordLength,
												onChange: (e) => setSecurity({
													...security,
													passwordLength: e.target.value
												}),
												className: "bg-slate-950 border-slate-800 text-slate-100 focus:border-teal-500 focus:ring-teal-500"
											})]
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-900 border border-slate-800 rounded-xl overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-lg font-medium text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-5 h-5 text-teal-500" }), "Audit Logs"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									className: "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white",
									children: "Export CSV"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "divide-y divide-slate-800",
									children: [
										{
											action: "Policy Updated",
											detail: "MFA Enforced globally",
											time: "2 hours ago",
											user: "admin@threatweave.com"
										},
										{
											action: "API Key Generated",
											detail: "CI/CD Pipeline Service Account",
											time: "1 day ago",
											user: "system"
										},
										{
											action: "Vendor Removed",
											detail: "acme.com deleted from monitoring",
											time: "3 days ago",
											user: "admin@threatweave.com"
										}
									].map((log, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center p-6 hover:bg-slate-800/30 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium text-slate-100",
											children: log.action
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400 mt-1 font-mono",
											children: log.detail
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-400",
												children: log.time
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-teal-500 mt-1",
												children: log.user
											})]
										})]
									}, i))
								})
							})]
						})]
					}),
					activeTab === "integrations" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-teal-500/10 border border-teal-500/20 rounded-lg p-4 flex gap-3 text-sm text-teal-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-5 h-5 text-teal-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Connect external intelligence databases for enriched scan data. Without these connectors, THREATWEAVE relies on passive collection." })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
							children: [
								{
									id: "shodan",
									label: "Shodan",
									icon: Server,
									desc: "Port and service footprinting.",
									connected: !!apiKeys.shodan
								},
								{
									id: "virustotal",
									label: "VirusTotal",
									icon: Activity,
									desc: "Malware and file hash reputation.",
									connected: !!apiKeys.virustotal
								},
								{
									id: "greynoise",
									label: "GreyNoise",
									icon: Activity,
									desc: "Internet background noise filtering.",
									connected: !!apiKeys.greynoise
								},
								{
									id: "crowdstrike",
									label: "CrowdStrike Falcon",
									icon: Shield,
									desc: "Endpoint detection and response (EDR).",
									connected: !!apiKeys.crowdstrike
								}
							].map((integration) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `bg-slate-900 border rounded-xl p-6 transition-all ${integration.connected ? "border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.1)]" : "border-slate-800 hover:border-slate-700"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `p-2 rounded-lg ${integration.connected ? "bg-teal-500/20 text-teal-400" : "bg-slate-800 text-slate-400"}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(integration.icon, { className: "w-6 h-6" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-medium text-slate-100",
												children: integration.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 mt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "relative flex h-2 w-2",
													children: [integration.connected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `relative inline-flex rounded-full h-2 w-2 ${integration.connected ? "bg-teal-500" : "bg-slate-600"}` })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-mono uppercase tracking-widest text-slate-400",
													children: integration.connected ? "Connected" : "Disconnected"
												})]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											className: "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white",
											children: integration.connected ? "Manage" : "Connect"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-400 mb-4",
										children: integration.desc
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs text-slate-500 uppercase font-mono tracking-wider",
											children: "API Key"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "password",
												value: apiKeys[integration.id],
												onChange: (e) => setApiKeys({
													...apiKeys,
													[integration.id]: e.target.value
												}),
												className: "bg-slate-950 border-slate-800 text-slate-100 focus:border-teal-500 focus:ring-teal-500 font-mono pr-10",
												placeholder: `Enter ${integration.label} API Key`
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" })]
										})]
									})
								]
							}, integration.id))
						})]
					}),
					[
						"profile",
						"notifications",
						"appearance"
					].includes(activeTab) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6 animate-in fade-in duration-300",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-12 h-12 text-slate-600 mb-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-medium text-slate-200",
									children: "Standardizing Configuration"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-400 mt-2 max-w-md",
									children: "This section is currently being updated to match the new Enterprise Control Center standards."
								})
							]
						})
					})
				]
			})]
		})
	});
}
//#endregion
export { SettingsPage as component };
