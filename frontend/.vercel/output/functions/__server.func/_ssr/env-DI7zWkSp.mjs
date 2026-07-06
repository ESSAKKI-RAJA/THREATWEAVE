import { M as isTruthy, N as getEnvVariable, P as buildErrorThrower } from "../_libs/clerk__backend+clerk__shared.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/env-DI7zWkSp.js
var isClient = () => typeof window !== "undefined";
var errorThrower = buildErrorThrower({ packageName: "@clerk/tanstack-react-start" });
var getPublicEnvVariables = () => {
	const getValue = (name) => {
		return getEnvVariable(`VITE_${name}`) || getEnvVariable(name);
	};
	return {
		publishableKey: getValue("CLERK_PUBLISHABLE_KEY"),
		domain: getValue("CLERK_DOMAIN"),
		isSatellite: isTruthy(getValue("CLERK_IS_SATELLITE")),
		proxyUrl: getValue("CLERK_PROXY_URL"),
		signInUrl: getValue("CLERK_SIGN_IN_URL"),
		signUpUrl: getValue("CLERK_SIGN_UP_URL"),
		clerkJsUrl: getValue("CLERK_JS_URL") || getValue("CLERK_JS"),
		clerkJsVersion: getValue("CLERK_JS_VERSION"),
		clerkUIUrl: getValue("CLERK_UI_URL"),
		clerkUIVersion: getValue("CLERK_UI_VERSION"),
		prefetchUI: getValue("CLERK_PREFETCH_UI") === "false" ? false : void 0,
		telemetryDisabled: isTruthy(getValue("CLERK_TELEMETRY_DISABLED")),
		telemetryDebug: isTruthy(getValue("CLERK_TELEMETRY_DEBUG")),
		unsafeDisableDevelopmentModeConsoleWarning: isTruthy(getValue("CLERK_UNSAFE_DISABLE_DEVELOPMENT_MODE_CONSOLE_WARNING")),
		afterSignInUrl: getValue("CLERK_AFTER_SIGN_IN_URL"),
		afterSignUpUrl: getValue("CLERK_AFTER_SIGN_UP_URL"),
		newSubscriptionRedirectUrl: getValue("CLERK_CHECKOUT_CONTINUE_URL")
	};
};
//#endregion
export { getPublicEnvVariables as n, isClient as r, errorThrower as t };
