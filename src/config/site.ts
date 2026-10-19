import { defaultLocale } from "@/i18n/config";
import type { ContactConfig, SocialConfig } from "@/lib/contact";
import { resolveCanonicalOrigin, resolveSiteUrl } from "@/lib/site-url";

/**
 * Public contact details. Leave a field undefined until the real value is
 * confirmed: anything left empty is simply not rendered. Never fill these with
 * values that only look real.
 */
const contact: ContactConfig = {
  email: undefined,
  phone: undefined,
  location: undefined,
};

/**
 * Social profiles. Only absolute https URLs are rendered; add an entry only
 * once the profile actually exists, e.g. instagram: "https://www.instagram.com/<handle>".
 */
const social: SocialConfig = {};

export const siteConfig = {
  name: "WideCode",
  locale: defaultLocale,
  /** Where the site runs (for absolute asset URLs); may be localhost or *.vercel.app. */
  url: resolveSiteUrl(),
  /** The public production origin, or null until NEXT_PUBLIC_SITE_URL is set (see resolveCanonicalOrigin). */
  canonicalUrl: resolveCanonicalOrigin(),
  /** Matches --wc-bg in src/styles/theme.css; used for the browser UI color. */
  themeColor: "#07070a",
  contact,
  social,
} as const;
