import { i as __toESM } from "../_runtime.mjs";
import { P as redirect, _ as Link, c as HeadContent, d as createRouter, f as Outlet, g as createRootRouteWithContext, h as createFileRoute, m as lazyRouteComponent, s as Scripts, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as require_react, S as require_jsx_runtime, d as QueryClient } from "../_libs/@clerk/react+[...].mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as ClerkProvider } from "./dist-hQ4tG-g_.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$14 } from "./vendors._domain-C1Oz3kXq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D-NIfeHG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var styles_default = "/assets/styles-BgbF7Bjw.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$13 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "THREATWEAVE — Executive Intelligence Dashboard" },
			{
				name: "description",
				content: "OSINT-powered vendor risk intelligence platform"
			},
			{
				name: "author",
				content: "THREATWEAVE"
			},
			{
				property: "og:title",
				content: "THREATWEAVE"
			},
			{
				property: "og:description",
				content: "OSINT-powered vendor risk intelligence platform"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClerkProvider, {
		publishableKey: "pk_test_ZGlzdGluY3QtZWdyZXQtOTguY2xlcmsuYWNjb3VudHMuZGV2JA",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
			lang: "en",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
		})
	});
}
function RootComponent() {
	const { queryClient } = Route$13.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			theme: "dark",
			position: "bottom-right",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$12 = () => import("./sign-up-DtzSRaoo.mjs");
var Route$12 = createFileRoute("/sign-up")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./login-CmyC3Ozd.mjs");
var Route$11 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./route-BkruzNbV.mjs");
var Route$10 = createFileRoute("/_authenticated")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./routes-D8q20BFu.mjs");
var Route$9 = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/dashboard" });
	},
	head: () => ({ meta: [{ title: "THREATWEAVE Enterprise | Supply Chain Cyber Risk Intelligence" }, {
		name: "description",
		content: "Enterprise-grade supply chain contamination detection and threat intelligence platform."
	}] }),
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./auth.callback-DxbAYwRa.mjs");
var Route$8 = createFileRoute("/auth/callback")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./threats-CltX3edI.mjs");
var Route$7 = createFileRoute("/_authenticated/threats")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./supply-chain-CYC7fYny.mjs");
var Route$6 = createFileRoute("/_authenticated/supply-chain")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./settings-DNxTRcLO.mjs");
var Route$5 = createFileRoute("/_authenticated/settings")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./onboarding-DiRxmbcR.mjs");
var Route$4 = createFileRoute("/_authenticated/onboarding")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./investigations-PpNLdqv9.mjs");
var Route$3 = createFileRoute("/_authenticated/investigations")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./intelligence-v-7oYe5I.mjs");
var Route$2 = createFileRoute("/_authenticated/intelligence")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./dashboard-BW5BYTdM.mjs");
var Route$1 = createFileRoute("/_authenticated/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./alerts-D0a0s6Tq.mjs");
var Route = createFileRoute("/_authenticated/alerts")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var SignUpRoute = Route$12.update({
	id: "/sign-up",
	path: "/sign-up",
	getParentRoute: () => Route$13
});
var LoginRoute = Route$11.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$13
});
var AuthenticatedRouteRoute = Route$10.update({
	id: "/_authenticated",
	getParentRoute: () => Route$13
});
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var AuthCallbackRoute = Route$8.update({
	id: "/auth/callback",
	path: "/auth/callback",
	getParentRoute: () => Route$13
});
var AuthenticatedThreatsRoute = Route$7.update({
	id: "/threats",
	path: "/threats",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSupplyChainRoute = Route$6.update({
	id: "/supply-chain",
	path: "/supply-chain",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$5.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOnboardingRoute = Route$4.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInvestigationsRoute = Route$3.update({
	id: "/investigations",
	path: "/investigations",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedIntelligenceRoute = Route$2.update({
	id: "/intelligence",
	path: "/intelligence",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$1.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAlertsRoute: Route.update({
		id: "/alerts",
		path: "/alerts",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedDashboardRoute,
	AuthenticatedIntelligenceRoute,
	AuthenticatedInvestigationsRoute,
	AuthenticatedOnboardingRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedSupplyChainRoute,
	AuthenticatedThreatsRoute,
	AuthenticatedVendorsDomainRoute: Route$14.update({
		id: "/vendors/$domain",
		path: "/vendors/$domain",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	LoginRoute,
	SignUpRoute,
	AuthCallbackRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
function GlobalPendingComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-background min-h-screen flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground text-sm font-mono animate-pulse",
			children: "Loading THREATWEAVE Interface..."
		})
	});
}
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			retry: 2,
			retryDelay: (attemptIndex) => Math.min(1e3 * 2 ** attemptIndex, 3e4),
			staleTime: 300 * 1e3,
			refetchOnWindowFocus: false
		} } }) },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		defaultPendingComponent: GlobalPendingComponent
	});
};
//#endregion
export { getRouter };
