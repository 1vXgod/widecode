import { defaultLocale } from "@/i18n/config";
import { resolveSiteUrl } from "@/lib/site-url";

export const siteConfig = {
  name: "WideCode",
  locale: defaultLocale,
  url: resolveSiteUrl(),
  /** Matches --wc-bg in src/styles/theme.css; used for the browser UI color. */
  themeColor: "#07070a",
  /**
   * Public contact details. Left undefined until real details are provided —
   * never fill these with placeholders that look real.
   */
  contact: {
    email: undefined as string | undefined,
    phone: undefined as string | undefined,
  },
} as const;
