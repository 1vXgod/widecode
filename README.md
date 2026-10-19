# WideCode

Official website of **WideCode**, a web development company serving Kosovo and international clients.
The site is in Albanian (Kosovo) at launch, with content structured so English can be added later.

> Status: in development, built sprint by sprint. See [docs/CHECKLIST.md](docs/CHECKLIST.md).

## Tech stack

| Area      | Choice                                                                 |
| --------- | ---------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Cache Components, Turbopack)                   |
| Language  | TypeScript (strict, plus `noUncheckedIndexedAccess`)                   |
| Styling   | Tailwind CSS 4 with brand design tokens                                |
| Icons     | lucide-react                                                           |
| Tests     | Vitest + Testing Library (unit), Playwright + axe-core (end-to-end)    |

## Requirements

- Node.js **22.12 or newer** (developed on Node 24)
- npm (the lockfile is `package-lock.json`)

## Getting started

```bash
npm install
npx playwright install chromium   # one-time, for end-to-end tests
cp .env.example .env.local        # optional; see "Environment variables"
npm run dev                       # http://localhost:3000
```

## Scripts

| Command              | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `npm run dev`        | Start the development server                                        |
| `npm run build`      | Production build                                                    |
| `npm run start`      | Serve the production build                                          |
| `npm run lint`       | ESLint (Next.js core-web-vitals + TypeScript rules)                 |
| `npm run typecheck`  | Generate route types and run `tsc --noEmit`                         |
| `npm test`           | Unit tests (Vitest)                                                 |
| `npm run test:watch` | Unit tests in watch mode                                            |
| `npm run test:e2e`   | End-to-end tests (Playwright). Builds its own production build in `.next-e2e`, configured like a live site (test domain `https://widecode.example`, quote form on a mock Resend API), then runs it. |
| `npm run check`      | lint, typecheck, unit tests, build and e2e tests, in that order     |

## Environment variables

Copy `.env.example` to `.env.local`. **Never commit real `.env` files.** They are git-ignored.

| Variable               | Required | Purpose                                                                    |
| ---------------------- | -------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Canonical site URL, e.g. `https://example.com`. Falls back to the Vercel production URL on Vercel, or `http://localhost:3000` locally. |
| `RESEND_API_KEY`       | For the quote form | Resend API key (server-only secret). |
| `QUOTE_TO_EMAIL`       | For the quote form | Address that receives quote requests (or up to 5, comma-separated). |
| `QUOTE_FROM_EMAIL`     | For the quote form | Sender, e.g. `WideCode <ofertat@your-domain>`. The domain must be verified in Resend. |
| `QUOTE_DELIVERY`       | No       | Developer aid: `log` validates requests and prints them to the server console instead of emailing (visitors only see "not sent"). Not allowed on Vercel production. |
| `RESEND_API_URL`       | No       | Tests only: replaces the Resend endpoint. Accepted only for `localhost` / `127.0.0.1`; the e2e tests point it at a local mock. Leave unset everywhere else. |

The production domain has not been decided, so no domain is hardcoded.

### Quote form delivery

The quote form on `/kontakt` sends requests through a Server Action ([`src/app/kontakt/actions.ts`](src/app/kontakt/actions.ts)). The delivery mode is decided from server-side variables only ([`src/lib/quote-delivery.ts`](src/lib/quote-delivery.ts)), and the form always tells visitors the truth about it:

| Situation | Mode | What visitors see |
| --- | --- | --- |
| `RESEND_API_KEY`, `QUOTE_TO_EMAIL` and `QUOTE_FROM_EMAIL` set and valid | `resend` | The confirmation, **only** after Resend accepted the email; an error (with their data kept) if it did not |
| `next dev` without complete Resend settings, or `QUOTE_DELIVERY=log` | `log` | The normal form. Requests are validated and printed to the server console for the developer; the visitor gets the "not sent, temporarily unavailable" message, never a confirmation |
| Anything else (e.g. production without Resend) | `disabled` | "Formulari është përkohësisht i padisponueshëm" in place of the form, with links to pricing and the estimator; the server refuses requests. The server log names the missing variables (never their values) |

Visitors never see testing or configuration details, and the browser only learns whether the form is available, never the mode. The e2e tests run the real `resend` path against a local mock of the Resend API ([`tests/e2e/mock-resend.mjs`](tests/e2e/mock-resend.mjs)), so they check the confirmation and the email content without sending anything.

To activate it: create a Resend account, verify the sending domain, create an API key, then set the three variables in `.env.local` (locally) or in the Vercel project settings (production). For a quick local test before the domain is verified, Resend accepts `QUOTE_FROM_EMAIL=WideCode <onboarding@resend.dev>`, but only delivers to the email address of the Resend account itself.

Protection: the same validation runs in the browser and on the server ([`src/lib/quote-request.ts`](src/lib/quote-request.ts)), inputs are length-limited and stripped of control and bidi characters, every value is HTML-escaped in the email, estimate prices are always recalculated on the server, and the visitor's address is used only as `reply_to`. Spam checks: a hidden honeypot field and a minimum fill time. Rate limits (in [`src/config/quote.ts`](src/config/quote.ts)): 5 requests per visitor per 10 minutes and 50 emails per hour site-wide. The limiter is in-memory, so on Vercel it is per instance (best effort); for strict limits, back it with a shared store or enable Vercel's firewall rate limiting. Retries reuse an idempotency key, so Resend never sends the same request twice.

## Project structure

```
src/
  app/                 Routes (App Router), root layout, icons, 404, sitemap.ts, robots.ts, opengraph-image.tsx
  components/
    brand/             Logo
    layout/            Header, footer, navigation, mobile menu, skip link
    quote/             Quote request form
    sections/          Page-level building blocks (intro, CTA, FAQ list)
    seo/               JSON-LD structured data
    ui/                Primitives: Button, Container, Section, SectionHeading, Badge, Card
  config/              Site config and routes (single source of truth)
  content/<locale>/    All user-facing copy, typed by src/types/content.ts
  i18n/                Locale configuration
  lib/                 Logic and utilities (estimator, quote form, SEO metadata, site URL, ...)
  styles/theme.css     Design tokens (colors, type scale, spacing, layout widths, motion)
  types/               Shared TypeScript types
tests/
  unit/                Vitest tests
  e2e/                 Playwright tests (routes, keyboard, accessibility, responsive)
docs/                  Checklist, deployment guide, image credits
```

## Design system

All tokens live in [`src/styles/theme.css`](src/styles/theme.css).

- **Colors:** brand colors are defined once as `--wc-*` custom properties on `:root`, then mapped to Tailwind utilities such as `bg-bg`, `bg-surface`, `text-fg`, `text-fg-muted`, `bg-accent` and `text-accent-text`. Tailwind's default palette is disabled, so only brand colors are available. To re-theme, edit the `--wc-*` values and run `npm test`. `tests/unit/theme-contrast.test.ts` fails if any text color drops below WCAG AA contrast.
- **Typography:** Geist for body text and Sora for headings, loaded with `next/font`. Both include ë and ç. Fluid sizes: `text-display`, `text-title`, `text-heading`, `text-lead`.
- **Layout:** `max-w-narrow` (48rem), `max-w-content` (76rem), `max-w-wide` (90rem); spacing `px-gutter`, `py-section`, `h-header`.
- **Breakpoints:** Tailwind defaults (`sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem), plus `xs` (30rem).
- **Motion:** `ease-out-expo` and `animate-fade-up`. Add the `reveal` class to fade a block in once when it scrolls into view (`src/components/layout/scroll-reveal.tsx`); content on screen at load and content for visitors without JavaScript is never hidden. All animations and transitions are effectively disabled for visitors with `prefers-reduced-motion: reduce`.
- **Focus:** a single, high-contrast `:focus-visible` outline for every focusable element.

### Logo and icons

The official logo comes from the `WIDE_CODE_LOGO_PACK` folder. The original files are never modified. The site uses derived copies, made by removing fully transparent margin pixels only, with no recolouring, cropping of visible pixels or stretching:

| Site file | Source in pack | Used for |
| --------- | -------------- | -------- |
| `public/brand/wide-code-logo-dark.png` (688×174) | `wide-code-dark.png` | Header, mobile menu and footer, rendered by `src/components/brand/logo.tsx` via `next/image` at quality 90 |
| `src/app/icon.png` (96×96, transparent) | `wide-code-app-icon-gradient.png` | Browser favicon |
| `src/app/apple-icon.png` (180×180) | `wide-code-app-icon-gradient.png`, on the site background `#07070a` | iOS home-screen icon |

`wide-code-dark.png` is the pack's dark-background version and the only full logo whose "WIDE" wordmark is legible on the near-black theme. The other lockups (`primary`, `horizontal`, `divider-tagline`, `stacked`) use a dark navy wordmark intended for light backgrounds. To change the logo size, pass `height` to `<Logo />`; the width always follows the file's aspect ratio.

## Content and localization

All copy lives in `src/content/sq/` and must satisfy the `Dictionary` type. To add English later:

1. Add `"en"` to `locales` in `src/i18n/config.ts`.
2. Create `src/content/en/` that satisfies the same type, and register it in `src/content/index.ts`.
3. Add locale-aware routing.

Content rules: natural Kosovo Albanian with correct **ë** and **ç**; no invented clients, testimonials, statistics or contact details; prices are indicative starting prices only.

**Terminology:** use modern wording that businesses in Kosovo actually use, not literal translations. `tests/unit/content.test.ts` guards the most common slips.

| Use | Instead of |
| --- | --- |
| website (e.g. "website-i", "website-in" only where grammar needs it), or *faqja* | uebfaqe |
| Web Development | zhvillim uebi |
| Online Shop (titles), online shop (text) | dyqan online |
| Custom Development (service), Custom (package), aplikacione web | platforma me porosi, aplikacione ueb |
| SEO bazë | optimizim bazë për motorët e kërkimit |
| responsive, template | i përshtatur për çdo pajisje (as a feature), shabllone |
| Starter, Business, Professional, E-commerce, Custom (package names) | Biznes, Profesional |

"Website" is masculine: *website profesional*, *një website i qartë*.

### Prices and projects

- **Prices:** [`src/config/pricing.ts`](src/config/pricing.ts) holds every starting price (whole euros; `null` = custom quote) and the recommended package. Package names, summaries and feature lists are in `src/content/sq/pricing.ts`. Always format prices with `formatPrice()` (`199 €`, `12 500 €`). It deliberately avoids `Intl`, whose Albanian data differs between Node and browsers. All prices are indicative starting prices, and the disclaimer must stay next to them.
- **Estimator:** [`src/config/estimator.ts`](src/config/estimator.ts) defines the pages included per package, the extra-page price and the add-ons (price, which packages can add them, which already include them). The calculation lives in `src/lib/estimator.ts` as pure, unit-tested functions. The pricing page's add-on list is generated from the same config, so the two cannot disagree. Custom work never gets a number.
- **Estimate in URLs:** `?paketa=<package>&faqe=<pages>&shtesa=<addon,addon>`, used by the estimator's shareable URL and by `quoteHrefForEstimate()` for the quote link. Parse it with `parseEstimateParams()`, which ignores invalid values.
- **Projects:** [`src/config/projects.ts`](src/config/projects.ts) lists portfolio entries (category = service, matching package). Every current entry is a **website concept** designed by WideCode (`kind: "concept"`), not client work. The site presents them as "Koncepte website" and labels each one "Koncept website". The brand names inside the previews (Dritëhije, Oxhaku, Aura, ELARA, Bleta & Toka, Ritmi) are fictional. Never claim the concepts were built for real clients, and never add client names, results, ratings or testimonials. A real client project may only be added with the client's explicit approval. Text: `src/content/sq/projects.ts`; text inside the previews: `src/content/sq/concepts.ts`. The filter URL uses readable values (`/projektet?kategoria=online-shop`).
- **Concept previews:** each concept is a real first-screen homepage design (desktop and mobile) in `src/components/projects/concepts/`. It's designed at a fixed width (1280 / 390) and scaled with its frame by the `.concept-canvas` CSS in `globals.css`, which is pure CSS with no layout shift. Photos are in `public/projects/<concept>/`, with sources and licences in [`docs/IMAGE_CREDITS.md`](docs/IMAGE_CREDITS.md).
- **Unknown project URLs:** [`src/proxy.ts`](src/proxy.ts) returns a real 404 for slugs not listed in `projectSlugs`. Keep that list in sync when adding projects; the unit tests check it.

### Services and quote links

- **Services:** [`src/config/services.ts`](src/config/services.ts) lists the services in order, each with its section anchor on `/sherbimet` and the pricing packages that fit it. Text is in `src/content/sq/services.ts` and `src/content/sq/services-page.ts`.
- **Quote links:** always build them with `quoteHref(packageId, projectSlug?)` or `quoteHrefForEstimate(input)` from `src/lib/quote.ts`. The contact form reads `?paketa=…&faqe=…&shtesa=…&projekti=…` with `parseQuotePrefill()`, which ignores anything unknown: the package (and the matching project type) is pre-selected, an estimate from the estimator is shown and sent with the request, and a referenced website concept is named in it.

### Contact details and social links

Public contact details (`email`, `phone`, `location`) and social profile URLs are configured in [`src/config/site.ts`](src/config/site.ts). They are empty by default:

- Each contact field is rendered in the footer and mobile menu only when it is set and valid (emails become `mailto:` links, phones become `tel:` links).
- Social links are rendered only for absolute `https://` URLs and open in a new tab with `rel="noopener noreferrer"`.
- While nothing is configured, the footer shows a short "details coming soon" note and links to the contact page.

`tests/unit/contact.test.ts` asserts that the shipped config is empty. Update that test when real details are added.

## Deployment

Vercel is the intended host. Nothing is deployed yet, and deployment needs explicit approval. Step-by-step instructions (project setup, environment variables, domain, Resend, search engines and a go-live checklist) are in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

### SEO

- **Production domain:** canonical URLs, `og:url`, the sitemap, `robots.txt` and structured data with URLs use only `NEXT_PUBLIC_SITE_URL`, and only when it is a public `https://` domain (`resolveCanonicalOrigin()` in [`src/lib/site-url.ts`](src/lib/site-url.ts)). Until then the site is `noindex`, `robots.txt` disallows crawling, the sitemap is empty and no canonical URL is published, so `localhost` or a temporary `*.vercel.app` address is never indexed. Vercel previews are never indexed (`isIndexable()` in [`src/lib/seo.ts`](src/lib/seo.ts)).
- Page metadata comes from the dictionary through `pageMetadata()` / `seoMetadata()` / `homeMetadata()` in [`src/lib/metadata.ts`](src/lib/metadata.ts): title, description, canonical URL (always without query parameters), Open Graph and X cards with the shared image from [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx). Pages that set `openGraph` themselves must spread `baseOpenGraph()`, because Next.js merges metadata shallowly. Search titles and descriptions live in `pages` / `meta` of `src/content/sq/common.ts` (only used in metadata); tests keep them unique and of a sensible length.
- [`src/app/sitemap.ts`](src/app/sitemap.ts) lists every route in `src/config/routes.ts` and every project; [`src/app/robots.ts`](src/app/robots.ts) points to it. There are no admin, login or private routes to exclude.
- Structured data (JSON-LD via `<JsonLd>`): Organization and WebSite on the home page, Service entries (with published starting prices) on the services page, FAQPage on the FAQ page. Configured contact details and social profiles are added automatically; no address, ratings, reviews or other facts are.
- Google Search Console and Bing setup: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md#6-search-engines).
- FAQ: the full page uses `src/content/sq/faq-page.ts` (topics keyed by `src/config/faq.ts`); the questions shown on other pages come from `src/content/sq/faq.ts` and are reused word for word. Prices in answers are placeholders filled from the pricing config (`src/lib/faq.ts`).
