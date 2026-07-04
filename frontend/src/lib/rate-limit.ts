// In-memory per-key rate limiter + fetch-with-retry helper.
// Note: workers are stateless across regions; this is best-effort throttling
// for the common case where the same user hits the same worker repeatedly.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (b.count >= limit) {
    const wait = Math.ceil((b.resetAt - now) / 1000);
    throw new Error(`Rate limit exceeded — try again in ${wait}s`);
  }
  b.count += 1;
}

export interface RetryOpts {
  retries?: number;
  baseMs?: number;
  timeoutMs?: number;
  retryOn?: (res: Response) => boolean;
}

export async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  opts: RetryOpts = {},
): Promise<Response> {
  const { retries = 2, baseMs = 400, timeoutMs = 15_000 } = opts;
  const retryOn = opts.retryOn ?? ((r) => r.status === 429 || r.status >= 500);

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: ctl.signal });
      clearTimeout(t);
      if (!retryOn(res) || attempt === retries) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      clearTimeout(t);
      lastErr = e;
      if (attempt === retries) throw e;
    }
    const jitter = Math.floor(Math.random() * 150);
    await new Promise((r) => setTimeout(r, baseMs * 2 ** attempt + jitter));
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
