import { n as createStart, t as createMiddleware } from "./createStart-Dt05N14y.mjs";
import { M as isTruthy, N as getEnvVariable, a as createClerkRequest, g as isDevelopmentEnvironment, h as isAutomatedEnvironment, i as constants, l as isHttpOrHttps, o as debugRequestState, r as AuthStatus, t as createClerkClient, u as isProxyUrlRelative, y as isDevelopmentFromSecretKey } from "../_libs/clerk__backend+clerk__shared.mjs";
import { n as getPublicEnvVariables, t as errorThrower } from "./env-DI7zWkSp.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
import { a as apiUrlFromPublishableKey, i as resolveKeysWithKeylessFallback, n as createKeylessService, r as createNodeFileStorage, t as handleNetlifyCacheInDevInstance } from "../_libs/clerk__shared.mjs";
import * as fs from "node:fs";
import * as path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/start-G9Qj_jWc.js
var attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
	return next({ headers: {} });
});
var commonEnvs = () => {
	const publicEnvs = getPublicEnvVariables();
	return {
		CLERK_JS_VERSION: publicEnvs.clerkJsVersion,
		CLERK_JS_URL: publicEnvs.clerkJsUrl,
		CLERK_UI_URL: publicEnvs.clerkUIUrl,
		CLERK_UI_VERSION: publicEnvs.clerkUIVersion,
		PREFETCH_UI: publicEnvs.prefetchUI,
		PUBLISHABLE_KEY: publicEnvs.publishableKey,
		DOMAIN: publicEnvs.domain,
		PROXY_URL: publicEnvs.proxyUrl,
		IS_SATELLITE: publicEnvs.isSatellite,
		SIGN_IN_URL: publicEnvs.signInUrl,
		SIGN_UP_URL: publicEnvs.signUpUrl,
		TELEMETRY_DISABLED: publicEnvs.telemetryDisabled,
		TELEMETRY_DEBUG: publicEnvs.telemetryDebug,
		API_VERSION: getEnvVariable("CLERK_API_VERSION") || "v1",
		SECRET_KEY: getEnvVariable("CLERK_SECRET_KEY"),
		MACHINE_SECRET_KEY: getEnvVariable("CLERK_MACHINE_SECRET_KEY"),
		ENCRYPTION_KEY: getEnvVariable("CLERK_ENCRYPTION_KEY"),
		CLERK_JWT_KEY: getEnvVariable("CLERK_JWT_KEY"),
		API_URL: getEnvVariable("CLERK_API_URL") || apiUrlFromPublishableKey(publicEnvs.publishableKey),
		SDK_METADATA: {
			name: "@clerk/tanstack-react-start",
			version: "1.4.9",
			environment: getEnvVariable("NODE_ENV")
		}
	};
};
var clerkClient = (options) => {
	const commonEnv = commonEnvs();
	return createClerkClient({
		secretKey: commonEnv.SECRET_KEY,
		machineSecretKey: commonEnv.MACHINE_SECRET_KEY,
		publishableKey: commonEnv.PUBLISHABLE_KEY,
		apiUrl: commonEnv.API_URL,
		apiVersion: commonEnv.API_VERSION,
		userAgent: `@clerk/tanstack-react-start@1.4.9`,
		proxyUrl: commonEnv.PROXY_URL,
		domain: commonEnv.DOMAIN,
		isSatellite: commonEnv.IS_SATELLITE,
		sdkMetadata: commonEnv.SDK_METADATA,
		telemetry: {
			disabled: commonEnv.TELEMETRY_DISABLED,
			debug: commonEnv.TELEMETRY_DEBUG
		},
		...options
	});
};
var KEYLESS_DISABLED = isTruthy(getEnvVariable("VITE_CLERK_KEYLESS_DISABLED")) || isTruthy(getEnvVariable("CLERK_KEYLESS_DISABLED")) || false;
/**
* Whether keyless mode can be used in the current environment.
* Keyless mode is only available in development, when not explicitly disabled,
* and when not running in an automated/CI environment.
*
* To disable keyless mode, set either:
* - `VITE_CLERK_KEYLESS_DISABLED=1` (for Vite-based projects)
* - `CLERK_KEYLESS_DISABLED=1` (generic)
*/
var canUseKeyless = isDevelopmentEnvironment() && !isAutomatedEnvironment() && !KEYLESS_DISABLED;
function createFileStorage(options = {}) {
	const { cwd = () => process.cwd() } = options;
	return createNodeFileStorage(fs, path, {
		cwd,
		frameworkPackageName: "@clerk/tanstack-react-start"
	});
}
var keylessServiceInstance = null;
function keyless() {
	if (!keylessServiceInstance) keylessServiceInstance = createKeylessService({
		storage: createFileStorage(),
		api: {
			async createAccountlessApplication(requestHeaders, source) {
				try {
					return await clerkClient().__experimental_accountlessApplications.createAccountlessApplication({
						requestHeaders,
						source
					});
				} catch {
					return null;
				}
			},
			async completeOnboarding(requestHeaders, source) {
				try {
					return await clerkClient().__experimental_accountlessApplications.completeAccountlessApplicationOnboarding({
						requestHeaders,
						source
					});
				} catch {
					return null;
				}
			}
		},
		framework: "tanstack-react-start"
	});
	return keylessServiceInstance;
}
/**
* Resolves Clerk keys, falling back to keyless mode in development if configured keys are missing.
*
* @param configuredPublishableKey - The publishable key from options or environment
* @param configuredSecretKey - The secret key from options or environment
* @returns The resolved keys (either configured or from keyless mode)
*/
function resolveKeysWithKeylessFallback$1(configuredPublishableKey, configuredSecretKey) {
	return resolveKeysWithKeylessFallback(configuredPublishableKey, configuredSecretKey, keyless(), canUseKeyless);
}
var loadOptions = (request, overrides = {}) => {
	const commonEnv = commonEnvs();
	const secretKey = overrides.secretKey || commonEnv.SECRET_KEY;
	const machineSecretKey = overrides.machineSecretKey || commonEnv.MACHINE_SECRET_KEY;
	const publishableKey = overrides.publishableKey || commonEnv.PUBLISHABLE_KEY;
	const jwtKey = overrides.jwtKey || commonEnv.CLERK_JWT_KEY;
	const apiUrl = getEnvVariable("CLERK_API_URL") || apiUrlFromPublishableKey(publishableKey);
	const domain = overrides.domain || commonEnv.DOMAIN;
	const isSatellite = overrides.isSatellite || commonEnv.IS_SATELLITE;
	const relativeOrAbsoluteProxyUrl = overrides.proxyUrl || commonEnv.PROXY_URL;
	const signInUrl = overrides.signInUrl || commonEnv.SIGN_IN_URL;
	const signUpUrl = overrides.signUpUrl || commonEnv.SIGN_UP_URL;
	const satelliteAutoSync = overrides.satelliteAutoSync;
	let proxyUrl;
	if (!!relativeOrAbsoluteProxyUrl && isProxyUrlRelative(relativeOrAbsoluteProxyUrl)) proxyUrl = new URL(relativeOrAbsoluteProxyUrl, request.clerkUrl).toString();
	else proxyUrl = relativeOrAbsoluteProxyUrl;
	if (!secretKey && !canUseKeyless) throw errorThrower.throw("Clerk: no secret key provided");
	if (isSatellite && !proxyUrl && !domain) throw errorThrower.throw("Clerk: satellite mode requires a proxy URL or domain");
	if (isSatellite && secretKey && !isHttpOrHttps(signInUrl) && isDevelopmentFromSecretKey(secretKey)) throw errorThrower.throw("Clerk: satellite mode requires a sign-in URL in production");
	return {
		...overrides,
		secretKey,
		machineSecretKey,
		publishableKey,
		jwtKey,
		apiUrl,
		domain,
		isSatellite,
		proxyUrl,
		signInUrl,
		signUpUrl,
		satelliteAutoSync
	};
};
/**
* Wraps obscured clerk internals with a readable `clerkState` key.
* This is intended to be passed into <ClerkProvider>
*
* @internal
*/
var wrapWithClerkState = (data) => {
	return { __internal_clerk_state: { ...data } };
};
/**
* Returns the prefetchUI config from environment variables.
*
* @internal
*/
function getPrefetchUIFromEnv() {
	if (getEnvVariable("CLERK_PREFETCH_UI") === "false") return false;
}
function getUnsafeDisableDevelopmentModeConsoleWarningFromEnv() {
	const value = getEnvVariable("VITE_CLERK_UNSAFE_DISABLE_DEVELOPMENT_MODE_CONSOLE_WARNING") || getEnvVariable("CLERK_UNSAFE_DISABLE_DEVELOPMENT_MODE_CONSOLE_WARNING");
	return value ? isTruthy(value) : void 0;
}
function getResponseClerkState(requestState, additionalStateOptions = {}) {
	const { reason, message, isSignedIn, ...rest } = requestState;
	return wrapWithClerkState({
		__clerk_ssr_state: rest.toAuth(),
		__publishableKey: requestState.publishableKey,
		__proxyUrl: requestState.proxyUrl,
		__domain: requestState.domain,
		__isSatellite: requestState.isSatellite,
		__signInUrl: requestState.signInUrl,
		__signUpUrl: requestState.signUpUrl,
		__afterSignInUrl: requestState.afterSignInUrl,
		__afterSignUpUrl: requestState.afterSignUpUrl,
		__clerk_debug: debugRequestState(requestState),
		__clerkJSUrl: getEnvVariable("CLERK_JS") || getEnvVariable("CLERK_JS_URL"),
		__clerkJSVersion: getEnvVariable("CLERK_JS_VERSION"),
		__clerkUIUrl: getEnvVariable("CLERK_UI_URL"),
		__clerkUIVersion: getEnvVariable("CLERK_UI_VERSION"),
		__prefetchUI: getPrefetchUIFromEnv(),
		__telemetryDisabled: isTruthy(getEnvVariable("CLERK_TELEMETRY_DISABLED")),
		__telemetryDebug: isTruthy(getEnvVariable("CLERK_TELEMETRY_DEBUG")),
		__unsafeDisableDevelopmentModeConsoleWarning: getUnsafeDisableDevelopmentModeConsoleWarningFromEnv(),
		__signInForceRedirectUrl: additionalStateOptions.signInForceRedirectUrl || getEnvVariable("CLERK_SIGN_IN_FORCE_REDIRECT_URL") || "",
		__signUpForceRedirectUrl: additionalStateOptions.signUpForceRedirectUrl || getEnvVariable("CLERK_SIGN_UP_FORCE_REDIRECT_URL") || "",
		__signInFallbackRedirectUrl: additionalStateOptions.signInFallbackRedirectUrl || getEnvVariable("CLERK_SIGN_IN_FALLBACK_REDIRECT_URL") || "",
		__signUpFallbackRedirectUrl: additionalStateOptions.signUpFallbackRedirectUrl || getEnvVariable("CLERK_SIGN_UP_FALLBACK_REDIRECT_URL") || ""
	});
}
/**
* Patches request to avoid duplex issues with unidici
* For more information, see:
* https://github.com/nodejs/node/issues/46221
* https://github.com/whatwg/fetch/pull/1457
* @internal
*/
var patchRequest = (request) => {
	const clonedRequest = new Request(request.url, {
		headers: request.headers,
		method: request.method,
		redirect: request.redirect,
		cache: request.cache
	});
	if (clonedRequest.method !== "GET" && clonedRequest.body !== null && !("duplex" in clonedRequest)) clonedRequest.duplex = "half";
	return clonedRequest;
};
var clerkMiddleware = (options) => {
	return createMiddleware().server(async ({ request, next }) => {
		const clerkRequest = createClerkRequest(patchRequest(request));
		const resolvedOptions = typeof options === "function" ? await options({ url: clerkRequest.clerkUrl }) : options;
		const loadedOptions = loadOptions(clerkRequest, {
			...resolvedOptions,
			publishableKey: resolvedOptions?.publishableKey,
			secretKey: resolvedOptions?.secretKey
		});
		const { publishableKey, secretKey, claimUrl: keylessClaimUrl, apiKeysUrl: keylessApiKeysUrl } = await resolveKeysWithKeylessFallback$1(loadedOptions.publishableKey, loadedOptions.secretKey);
		if (publishableKey) loadedOptions.publishableKey = publishableKey;
		if (secretKey) loadedOptions.secretKey = secretKey;
		const requestState = await clerkClient().authenticateRequest(clerkRequest, {
			...loadedOptions,
			acceptsToken: "any"
		});
		const locationHeader = requestState.headers.get(constants.Headers.Location);
		if (locationHeader) {
			handleNetlifyCacheInDevInstance({
				locationHeader,
				requestStateHeaders: requestState.headers,
				publishableKey: requestState.publishableKey
			});
			throw new Response(null, {
				status: 307,
				headers: requestState.headers
			});
		}
		if (requestState.status === AuthStatus.Handshake) throw new Error("Clerk: handshake status without redirect");
		const clerkInitialState = getResponseClerkState(requestState, loadedOptions);
		if (canUseKeyless && keylessClaimUrl) clerkInitialState.__internal_clerk_state = {
			...clerkInitialState.__internal_clerk_state,
			__keylessClaimUrl: keylessClaimUrl,
			__keylessApiKeysUrl: keylessApiKeysUrl
		};
		const result = await next({ context: {
			clerkInitialState,
			auth: (opts) => requestState.toAuth(opts)
		} });
		if (requestState.headers) requestState.headers.forEach((value, key) => {
			result.response.headers.append(key, value);
		});
		return result;
	});
};
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var requestMiddleware = [clerkMiddleware(), errorMiddleware];
var startInstance = createStart(() => ({
	functionMiddleware: [attachSupabaseAuth],
	requestMiddleware
}));
//#endregion
export { startInstance };
