const LOCAL_URL = "http://localhost:3000";

type Env = Record<string, string | undefined>;

function toOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Resolves the origin the site runs on, without inventing a production domain:
 * 1. NEXT_PUBLIC_SITE_URL (explicit configuration)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (set automatically on Vercel)
 * 3. http://localhost:3000 (local development)
 *
 * Used for absolute asset URLs (metadataBase). Canonical URLs, the sitemap and
 * indexing use resolveCanonicalOrigin() instead, which never falls back.
 */
export function resolveSiteUrl(env: Env = process.env): URL {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const origin = toOrigin(explicit);
    if (!origin) {
      throw new Error(`NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL, received "${explicit}".`);
    }
    return new URL(origin);
  }

  const vercelHost = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) {
    const origin = toOrigin(`https://${vercelHost}`);
    if (origin) return new URL(origin);
  }

  return new URL(LOCAL_URL);
}

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "0.0.0.0"]);

/** Whether an origin is public and served over HTTPS, i.e. fit to publish as the canonical address. */
export function isPublicOrigin(url: URL): boolean {
  return url.protocol === "https:" && !LOOPBACK_HOSTS.has(url.hostname) && !url.hostname.endsWith(".localhost");
}

/**
 * The production origin search engines should see: only an explicit, public
 * HTTPS NEXT_PUBLIC_SITE_URL. Returns null until the domain is configured, so
 * neither localhost nor a temporary *.vercel.app address is ever published as
 * canonical, listed in the sitemap or opened for indexing.
 */
export function resolveCanonicalOrigin(env: Env = process.env): URL | null {
  if (!env.NEXT_PUBLIC_SITE_URL?.trim()) return null;
  const url = resolveSiteUrl(env);
  return isPublicOrigin(url) ? url : null;
}
