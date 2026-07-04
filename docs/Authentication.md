# Authentication

- Provider: Clerk
- Integration: `@clerk/tanstack-react-start`
- Middleware: Protects routes and APIs. Redirects unauthenticated users to `/login`.
- JWT Tokens are verified server-side before processing any TanStack Server Function.
