declare module "@tanstack/react-start/api" {
  export interface APIRequestContext {
    request: Request;
    params: Record<string, string>;
  }

  export interface APIFileRouteConfig {
    GET?: (ctx: APIRequestContext) => Promise<Response> | Response;
    POST?: (ctx: APIRequestContext) => Promise<Response> | Response;
    PUT?: (ctx: APIRequestContext) => Promise<Response> | Response;
    DELETE?: (ctx: APIRequestContext) => Promise<Response> | Response;
    PATCH?: (ctx: APIRequestContext) => Promise<Response> | Response;
    OPTIONS?: (ctx: APIRequestContext) => Promise<Response> | Response;
  }

  export function createAPIFileRoute(path: string): (config: APIFileRouteConfig) => any;
}
