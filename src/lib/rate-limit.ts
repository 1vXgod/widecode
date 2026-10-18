/**
 * In-memory sliding-window rate limiter.
 *
 * State lives in the memory of one server instance, so on serverless hosting
 * (several short-lived instances) it is a best-effort limit, not a guarantee.
 * For a strict limit across instances, back it with a shared store such as
 * Redis, and enable the host's own rate limiting / firewall rules as well.
 */
export class RateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    /** Upper bound on tracked keys, so spoofed keys cannot grow memory without limit. */
    private readonly maxKeys = 10_000,
  ) {}

  /** Records one attempt for `key`. Returns whether it is allowed, and if not, when to retry. */
  hit(key: string, now = Date.now()): { allowed: true } | { allowed: false; retryAfterMs: number } {
    const recent = (this.hits.get(key) ?? []).filter((time) => now - time < this.windowMs);

    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return { allowed: false, retryAfterMs: Math.max(this.windowMs - (now - recent[0]!), 1000) };
    }

    recent.push(now);
    // Re-insert so the Map's insertion order stays "least recently used first".
    this.hits.delete(key);
    this.hits.set(key, recent);
    // Over capacity: forget the least recently used keys.
    for (const oldest of this.hits.keys()) {
      if (this.hits.size <= this.maxKeys) break;
      this.hits.delete(oldest);
    }
    return { allowed: true };
  }
}

/**
 * Identifies a visitor for rate limiting. Hosts such as Vercel set
 * x-forwarded-for to the real client address; without a trusted proxy the
 * header can be spoofed, which the site-wide limit still bounds.
 */
export function visitorKey(headers: Pick<Headers, "get">): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headers.get("x-real-ip")?.trim() || "unknown";
  return ip.slice(0, 64);
}
