# WideCode

Official website of **WideCode**, a web development company serving Kosovo and international clients.
The site is in Albanian (Kosovo, the default language), English and German.

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

The quote form on `/kontakt` sends requests through a Server Action ([`src/app/[lang]/kontakt/actions.ts`](src/app/[lang]/kontakt/actions.ts)). The delivery mode is decided from server-side variables only ([`src/lib/quote-delivery.ts`](src/lib/quote-delivery.ts)), and the form always tells visitors the truth about it:

| Situation | Mode | What visitors see |
| --- | --- | --- |
| `RESEND_API_KEY`, `QUOTE_TO_EMAIL` and `QUOTE_FROM_EMAIL` set and valid | `resend` | The confirmation, **only** after Resend accepted the email; an error (with their data kept) if it did not |
| `next dev` without complete Resend settings, or `QUOTE_DELIVERY=log` | `log` | The normal form. Requests are validated and printed to the server console for the developer; the visitor gets the "not sent, temporarily unavailable" message, never a confirmation |
| Anything else (e.g. production without Resend) | `disabled` | "Formulari është përkohësisht i padisponueshëm" in place of the form, with links to pricing and the estimator; the server refuses requests. The server log names the missing variables (never their values) |

Visitors never see testing or configuration details, and the browser only learns whether the form is available, never the mode. The e2e tests run the real `resend` path against a local mock of the Resend API ([`tests/e2e/mock-resend.mjs`](tests/e2e/mock-resend.mjs)), so they check the confirmation and the email content without sending anything.

To activate it: create a Resend account, verify the sending domain, create an API key, then set the three variables in `.env.local` (locally) or in the Vercel project settings (production). For a quick local test before the domain is verified, Resend accepts `QUOTE_FROM_EMAIL=WideCode <onboarding@resend.dev>`, but only delivers to the email address of the Resend account itself.

Protection: the same validation runs in the browser and on the server ([`src/lib/quote-request.ts`](src/lib/quote-request.ts)), inputs are length-limited and stripped of control and bidi characters, every value is HTML-escaped in the email, estimate prices are always recalculated on the server, and the visitor's address is used only as `reply_to`. Spam checks: a hidden honeypot field and a minimum fill time. Rate limits (in [`src/config/quote.ts`](src/config/quote.ts)): 5 requests per visitor per 10 minutes and 50 emails per hour site-wide. The limiter is in-memory, so on Vercel it is per instance (best effort); for strict limits, back it with a shared store or enable Vercel's firewall rate limiting. Each email carries an idempotency key made of the form's reference and a hash of its content, so retrying an unchanged request (e.g. after a lost connection) never sends it twice, while a corrected request goes out as a new email.

## Project structure

```
src/
  app/                 Icons, global 404 and error pages, sitemap.ts, robots.ts, fonts
    [lang]/            Every page, the root layout and the social image, once per language (see URLs and languages)
  components/
    brand/             Logo
    layout/            Header, footer, navigation, mobile menu, language switcher, theme toggle, back-to-top, skip link
    quote/             Quote request form
    sections/          Page-level building blocks (intro, CTA, FAQ list)
    seo/               JSON-LD structured data
    ui/                Primitives: Button, Container, Section, SectionHeading, Badge, Card
  config/              Site config and routes (single source of truth)
  content/<locale>/    All user-facing copy, typed by src/types/content.ts
  i18n/                Locale configuration and the public URL ↔ route mapping (routing.ts)
  lib/                 Logic and utilities (estimator, quote form, SEO metadata, theme, site URL, ...)
  styles/theme.css     Design tokens (colors, type scale, spacing, layout widths, motion)
  types/               Shared TypeScript types
tests/
  unit/                Vitest tests
  e2e/                 Playwright tests (routes, languages, themes, keyboard, accessibility, responsive)
docs/                  Checklist, deployment guide, image credits, content for owner review
```

## Design system

All tokens live in [`src/styles/theme.css`](src/styles/theme.css).

- **Colors:** brand colors are defined once as `--wc-*` custom properties, then mapped to Tailwind utilities such as `bg-bg`, `bg-surface`, `text-fg`, `text-fg-muted`, `bg-accent` and `text-accent-text`. Tailwind's default palette is disabled, so only brand colors are available. The accent is the logo's royal blue `#1034f8` in both themes. Overlays use the text color (`bg-fg/5`, `hover:border-fg/25`) and shadows `shadow-shadow/…`, so they work in both themes; never use fixed colors outside the concept previews. To re-theme, edit the `--wc-*` values of both themes and run `npm test`. `tests/unit/theme-contrast.test.ts` fails if any text color drops below WCAG AA contrast in either theme.
- **Dark and light theme** ([`src/lib/theme.ts`](src/lib/theme.ts), toggle in the header): the system setting until the visitor chooses, then their choice (saved in `localStorage`). An inline script in `<head>` adds `<meta name="widecode-theme" content="dark|light">` before the first paint, and `theme.css` swaps the tokens from it. `<html>` and every other element React renders stay unchanged, so pages stay prerendered and hydrate cleanly. Use the `light:` variant (e.g. `light:hidden`) for anything else that differs, as the logo does: the dark logo in the dark theme, `wide-code-logo-light.png` in the light one. Without JavaScript, the dark theme is shown. The social image is the same dark brand image in both themes.
- **Typography:** Geist for body text and Sora for headings, loaded with `next/font`. Both include ë and ç. Fluid sizes: `text-display`, `text-title`, `text-heading`, `text-lead`.
- **Layout:** `max-w-narrow` (48rem), `max-w-content` (76rem), `max-w-wide` (90rem); spacing `px-gutter`, `py-section`, `h-header`.
- **Breakpoints:** Tailwind defaults (`sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem), plus `xs` (30rem).
- **Motion:** `ease-out-expo` and `animate-fade-up`. Add the `reveal` class to fade a block in once when it scrolls into view (`src/components/layout/scroll-reveal.tsx`); content on screen at load and content for visitors without JavaScript is never hidden. All animations and transitions are effectively disabled for visitors with `prefers-reduced-motion: reduce`.
- **Focus:** a single, high-contrast `:focus-visible` outline for every focusable element.
- **Back to top** (`src/components/layout/back-to-top.tsx`, in the footer of every page and language): a 44 px round button in the bottom-right corner, at the page gutter from both edges, shown after 400 px of scrolling. It scrolls back smoothly (instantly with reduced motion); from the keyboard, focus continues at the top of the page. While hidden it is `inert`. A fixed bar at the bottom of the screen marks itself with `data-bottom-bar="shown"` and the button rises above it (see `globals.css`), as for the price calculator's compact total on small screens.

### Logo and icons

The official logo comes from the `WIDE_CODE_LOGO_PACK` folder. The original files are never modified. The site uses derived copies, made by removing fully transparent margin pixels only, with no recolouring, cropping of visible pixels or stretching:

| Site file | Source in pack | Used for |
| --------- | -------------- | -------- |
| `public/brand/wide-code-logo-on-dark.png` (562×102, transparent) | `wide-code-dark.png`, without its baked-in navy pill | Header, mobile menu, footer and the About page in the dark theme, rendered by `src/components/brand/logo.tsx` via `next/image` at quality 90 |
| `public/brand/wide-code-logo-light.png` (694×139, transparent) | `wide-code-horizontal.png` | The same places in the light theme (navy "WIDE", blue "CODE"), at the same height |
| `src/app/icon.png` (96×96, transparent) | `wide-code-app-icon-gradient.png` | Browser favicon |
| `src/app/apple-icon.png` (180×180) | `wide-code-app-icon-gradient.png`, on the site background `#07070a` | iOS home-screen icon |

`wide-code-dark.png` is the pack's dark-background version and the only full logo whose "WIDE" wordmark is legible on the dark theme, but it comes on a navy pill (with a rim and a shadow) that showed as a dark box on every surface. The site file is that artwork without the pill: pixels at least 60 % artwork keep their exact original color (fully opaque); only anti-aliased edge pixels are partly transparent, with the color that reproduces the original exactly over the pill. Nothing was redrawn or recolored. The other lockups (`primary`, `horizontal`, `divider-tagline`, `stacked`) use a dark navy wordmark intended for light backgrounds; `horizontal` (transparent, one line) is used in the light theme. Both site files are cropped to the artwork, so `<Logo height={…} />` renders the same size in both themes (26 px in the header and menu, 32 px in the footer and on the About page); the width follows each file's aspect ratio. A new file name was used for the transparent version, because optimized images are cached by URL (4 hours).

## Content and localization

The site is published in **Albanian** (default), **English** and **German** (see `docs/CHECKLIST.md`). All copy lives in `src/content/<locale>/` and must satisfy the `Dictionary` type, so a missing translation is a type error; `tests/unit/i18n.test.ts` also checks that every dictionary has the same entries and placeholders as the Albanian one, that the English and German ones contain no Albanian text, and that only reviewed shared terms (brand, package and product names) are left as they are. German addresses visitors with "Sie" and keeps its terminology consistent (listed at the top of `src/content/de/common.ts`). The concept previews (`src/content/sq/concepts.ts`) show websites for fictional Kosovo businesses and stay in Albanian in every language.

- **Server Components** get the page's language from the `[lang]` segment: `getLocale()` / `getPageDictionary()` in [`src/i18n/server.ts`](src/i18n/server.ts). Components that receive the whole dictionary use `dict.locale`.
- **Client Components** use `useLocale()` ([`src/i18n/locale-context.tsx`](src/i18n/locale-context.tsx)), set by `SiteShell` from the route, so server HTML and browser always agree.
- **Links** are written with the Albanian routes (`src/config/routes.ts`) and the `Link` from [`src/i18n/link.tsx`](src/i18n/link.tsx) (also inside `ButtonLink`) translates them into the current language, keeping query strings and anchors.
- **Prices and lists:** `formatPrice(amount, locale)` (`199 €` in Albanian and German, `€199` in English; thousands `1299 €`, `1.299 €`, `€1,299`) and `formatList(items, locale)`; deterministic, never `Intl`. Amounts and rules are the same in every language.
- **Language switcher** (`src/components/layout/language-switcher.tsx`): header (from `sm`) and mobile menu; opens the same page in the chosen language with the current query string and anchor (estimator choices, filters, pre-filled form); the quote form's draft carries over through `sessionStorage`. No automatic redirects by browser language or location.
- **Quote requests** send the page's language with the form; the server accepts only a supported locale (anything else counts as Albanian). The notification email to WideCode stays in Albanian and has a "Gjuha e klientit" row. No confirmation email is sent to customers.

**URLs and languages:** every page lives under `src/app/[lang]/` (folder names are the Albanian slugs), prerendered once per locale in `src/i18n/config.ts`. Public URLs are mapped by [`src/i18n/routing.ts`](src/i18n/routing.ts), applied by [`src/proxy.ts`](src/proxy.ts) on every page request:

- Albanian URLs have no prefix and are unchanged: `/sherbimet` is served by `/sq/sherbimet`; query strings and anchors pass through.
- `/sq` and `/sq/...` redirect (308) to the unprefixed URL, so every page has one address.
- English and German URLs have their prefix and their own slugs (`localizedRoutes` in `routing.ts`): `/en/services`, `/en/projects/<slug>`, `/en/pricing`, `/en/price-calculator`, `/en/about`, `/en/faq`, `/en/contact`, and `/de/leistungen`, `/de/projekte/<slug>`, `/de/preise`, `/de/preisrechner`, `/de/ueber-uns`, `/de/faq`, `/de/kontakt`. The internal Albanian slugs under `/en` and `/de` (e.g. `/en/sherbimet`) redirect to them. Project slugs, section anchors and query parameter names are the same in every language.
- Each language has its own social image: `/opengraph-image`, `/en/opengraph-image` and `/de/opengraph-image` (`src/app/[lang]/opengraph-image.tsx`).
- Anything that is not a page (unknown paths, project slugs or languages) is sent to a path without a route, which Next.js answers with [`src/app/global-not-found.tsx`](src/app/global-not-found.tsx): the complete 404 page, status 404 (`experimental.globalNotFound`; a `notFound()` thrown inside the prerendered app would only give a client-rendered error shell with Cache Components). It has no route params, so the proxy passes the URL's language in a request header (`x-widecode-locale`, always overwritten) and the page renders on the server per request (`export const instant = false`): complete HTML in the URL's language (`/en/...` English, `/de/...` German, anything else Albanian), with its own `<html lang>`, also without JavaScript. It is the only page that is not prerendered; it is not cached (`private, no-store`).
- **SEO per language:** titles, descriptions, canonical URL, `hreflang` alternates (all languages + `x-default` = Albanian), `og:locale` (+ alternates), social image and JSON-LD (`inLanguage`) come from the page's language; the sitemap lists every page in every language with its alternates. As before, all of this is published only on the configured production domain.

Content rules: natural Kosovo Albanian with correct **ë** and **ç**; no invented clients, testimonials, statistics or contact details; prices are indicative starting prices only. Statements about WideCode (languages spoken, market, privacy) and the German copy are listed for the owner's review in [docs/CONTENT_REVIEW.md](docs/CONTENT_REVIEW.md).

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
- **Unknown project URLs:** [`src/i18n/routing.ts`](src/i18n/routing.ts) (via `src/proxy.ts`) returns a real 404 for slugs not listed in `projectSlugs`. Keep that list in sync when adding projects; the unit tests check it.

### Services and quote links

- **Services:** [`src/config/services.ts`](src/config/services.ts) lists the services in order, each with its section anchor on `/sherbimet` and the pricing packages that fit it. Text is in `src/content/sq/services.ts` and `src/content/sq/services-page.ts`.
- **Quote links:** always build them with `quoteHref(packageId, projectSlug?)` or `quoteHrefForEstimate(input)` from `src/lib/quote.ts`. The contact form reads `?paketa=…&faqe=…&shtesa=…&vleresim=1&projekti=…` with `parseQuotePrefill()`, which ignores anything unknown: the package (and the matching project type) is pre-selected, an estimate from the estimator is shown (pages, included features, add-ons, indicative total) and sent with the request, and a referenced website concept is named in it. `vleresim=1` marks estimator links, so an estimate without pages or add-ons in the URL (Starter, E-commerce) is still shown; a pricing card's link to the same package has no marker. The URL is read in the browser (`QuoteFormFromUrl`), so after the estimator's link the form is complete at once; the server only streams whether delivery is available. Coming back with a changed estimate updates the form without touching the contact details, and an unsent draft is kept in `sessionStorage` (this tab only, cleared once sent) so a refresh or a detour loses nothing. The server recalculates every estimate from `src/config/estimator.ts`; prices in the URL or the request are never used.

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
- Page metadata comes from the dictionary through `pageMetadata()` / `seoMetadata()` / `homeMetadata()` in [`src/lib/metadata.ts`](src/lib/metadata.ts): title, description, canonical URL (always without query parameters), Open Graph and X cards with the language's image from [`src/app/[lang]/opengraph-image.tsx`](src/app/[lang]/opengraph-image.tsx). Pages that set `openGraph` themselves must spread `baseOpenGraph()`, because Next.js merges metadata shallowly. Search titles and descriptions live in `pages` / `meta` of `src/content/sq/common.ts` (only used in metadata); tests keep them unique and of a sensible length.
- [`src/app/sitemap.ts`](src/app/sitemap.ts) lists every route in `src/config/routes.ts` and every project; [`src/app/robots.ts`](src/app/robots.ts) points to it. There are no admin, login or private routes to exclude.
- Structured data (JSON-LD via `<JsonLd>`): Organization and WebSite on the home page, Service entries (with published starting prices) on the services page, FAQPage on the FAQ page. Configured contact details and social profiles are added automatically; no address, ratings, reviews or other facts are.
- Google Search Console and Bing setup: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md#6-search-engines).
- FAQ: the full page uses `src/content/sq/faq-page.ts` (topics keyed by `src/config/faq.ts`); the questions shown on other pages come from `src/content/sq/faq.ts` and are reused word for word. Prices in answers are placeholders filled from the pricing config (`src/lib/faq.ts`).
