import { fetchWithRetry } from "../rate-limit";

export interface DNSResult {
  ip: string | null;
  resolved: boolean;
  fallbackUsed: boolean;
  error?: string;
}

const cache = new Map<string, { ip: string; timestamp: number }>();
const CACHE_TTL = 3600 * 1000; // 1 hour

export async function resolveIpWithFallback(domain: string): Promise<DNSResult> {
  // Check cache
  const cached = cache.get(domain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { ip: cached.ip, resolved: true, fallbackUsed: false };
  }

  const timeoutMs = 5000; // 5 seconds per resolver

  // 1. Google DNS over HTTPS
  try {
    const res = await fetchWithRetry(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`,
      { headers: { Accept: "application/dns-json" } },
      { timeoutMs },
    );
    if (res.ok) {
      const body = (await res.json()) as { Answer?: Array<{ type: number; data: string }> };
      const ip = body.Answer?.find((r) => r.type === 1)?.data;
      if (ip) {
        cache.set(domain, { ip, timestamp: Date.now() });
        return { ip, resolved: true, fallbackUsed: false };
      }
    }
  } catch (e) {
    // Proceed to fallback
  }

  // 2. Cloudflare DNS over HTTPS
  try {
    const res = await fetchWithRetry(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`,
      { headers: { Accept: "application/dns-json" } },
      { timeoutMs },
    );
    if (res.ok) {
      const body = (await res.json()) as { Answer?: Array<{ type: number; data: string }> };
      const ip = body.Answer?.find((r) => r.type === 1)?.data;
      if (ip) {
        cache.set(domain, { ip, timestamp: Date.now() });
        return { ip, resolved: true, fallbackUsed: true };
      }
    }
  } catch (e) {
    // Proceed to fallback
  }

  // 3. Fallback: System DNS (simulated in edge environment by returning null since we can't reliably resolve natively in all edge workers)
  return {
    ip: null,
    resolved: false,
    fallbackUsed: true,
    error: "All DNS resolvers failed to find an A record",
  };
}
