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
 * Resolves the canonical site origin without inventing a production domain:
 * 1. NEXT_PUBLIC_SITE_URL (explicit configuration)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (set automatically on Vercel)
 * 3. http://localhost:3000 (local development)
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
