# WideCode project checklist

Legend: `[x]` done · `[ ]` open · `[~]` partial / placeholder

## Sprint 0: Discovery ✅

- [x] Inspected repository, Git state, remote, toolchain and assets
- [x] Cloned existing repo `1vXgod/widecode` (empty) and set branch `main`
- [x] No existing logo or brand assets found

## Sprint 1: Foundation and design system ✅

- [x] Next.js 16 + TypeScript (strict) + Tailwind CSS 4 scaffold
- [x] Stricter compiler options (`noUncheckedIndexedAccess`, `noImplicitOverride`, …)
- [x] Design tokens: colors, typography, spacing, layout widths, breakpoints, motion (`src/styles/theme.css`)
- [x] Automated WCAG AA contrast test for color tokens
- [x] Fonts with Albanian characters (Geist, Sora)
- [x] UI primitives: Button / ButtonLink, Container, Section, SectionHeading, Badge, Card
- [x] Root layout: `lang="sq"`, metadata defaults, viewport theme color, skip link
- [x] Header with desktop nav (`aria-current`) and accessible mobile menu (native `<dialog>`)
- [x] Footer (no invented contact details)
- [x] Albanian 404 page
- [x] Placeholder pages for all main routes (`noindex`)
- [x] Favicon / apple icon (replaced with official assets, see Brand assets)
- [x] Typed content dictionary (`src/content/sq`), ready for English later
- [x] Reduced-motion support and global focus styles
- [x] Unit tests (Vitest) and e2e tests (Playwright + axe)
- [x] `.env.example`, `.gitattributes`, `.gitignore` for env files and test output
- [x] README with setup commands and structure

## Sprint 2: Shared layout, header, navigation and footer ✅

- [x] Main nav: Ballina, Shërbimet, Projektet, Çmimet, Rreth nesh, Kontakti (portfolio route renamed to `/projektet`)
- [x] Primary CTA "Merr një ofertë" in header, mobile menu, footer and home page
- [x] Scroll-aware sticky header (transparent at top, blurred surface + border when scrolled)
- [x] Consistent active (`aria-current`), hover, focus and open states
- [x] Mobile menu: all items, CTA, open animation, configured contact/social links only
- [x] Footer: CTA band, two navigation groups, contact block, social links only for configured https URLs, `© {year}` copyright
- [x] Typed `contact` / `social` config with validation; nothing invented (empty by default)
- [x] Dead-link crawler e2e test; header, footer and navigation e2e tests on mobile and desktop
- [x] Screenshot review at 360, 768, 1024 and 1280px

## Brand assets ✅ (between Sprint 2 and Sprint 3)

- [x] Evaluated all 9 files in `WIDE_CODE_LOGO_PACK` on the site background (originals unchanged, SHA-256 verified)
- [x] Primary logo: `wide-code-dark.png` → `public/brand/wide-code-logo-dark.png` (transparent margin removed only); used in header (44px), mobile menu (44px) and footer (52px)
- [x] Favicon: `wide-code-app-icon-gradient.png` → `src/app/icon.png` (96×96)
- [x] Apple touch icon: `wide-code-app-icon-gradient.png` → `src/app/apple-icon.png` (180×180 on `#07070a`)
- [x] Removed the temporary hand-made logo, `icon.svg` and generated `apple-icon.tsx`
- [x] Tests: logo aspect ratio (unit); logo loads in header, menu and footer without stretching, and icons are served as PNGs (e2e)
- [ ] Not used yet (light-background versions): `wide-code-primary.png`, `wide-code-horizontal.png`, `wide-code-divider-tagline.png`, `wide-code-stacked.png`, `wide-code-app-icon-light.png`, `wide-code-app-icon-dark.png`, `wide-code-w-symbol.png`. Candidates for future light contexts (e.g. Open Graph images, documents).

## Sprint 3: Home page ✅

- [x] Hero: headline, supporting text, "Merr një ofertë" and "Shiko projektet" CTAs, lowest starting price from config
- [x] Interactive showcase (Dizajni → Kodi → Gati): ARIA tabs, auto-advance with pause/play, pauses on hover/focus, no auto-advance with reduced motion, fixed aspect ratio (no layout shift)
- [x] Services overview (4 services)
- [x] Demo projects (3), each labelled "Projekt demonstrues"; CSS-only previews, no stock imagery (`src/config/projects.ts`)
- [x] Pricing preview from the central config (`src/config/pricing.ts`), with the "indicative prices" disclaimer
- [x] Process (5 steps, anchor `#procesi`), "Pse WideCode" (no fabricated claims), FAQ preview (native `<details>`)
- [x] Shared closing CTA section (moved out of the footer); compact use on inner pages
- [x] Motion: lightweight scroll reveals and CSS transitions. Decision: **no Motion/Framer Motion dependency** (reveal mechanism revised in Sprint 4, see below)
- [x] Tests: pricing config and formatting (unit); home sections, CTAs, demo labels, prices, FAQ keyboard, showcase keyboard/autoplay/pause/reduced motion, zero console errors on all routes, CLS < 0.1 on mobile and desktop (e2e)
- [ ] **Needs review by owner:** package feature lists in `src/content/sq/pricing.ts` (e.g. "Deri në 5 faqe") are proposed defaults

## Sprint 4: Services and About ✅

- [x] Services page (`/sherbimet`): intro, in-page navigation, one anchored section per service (who it suits, what is included, matching packages with prices from config), price disclaimer, "Çfarë përfshin çdo projekt" standards, link to the process, FAQ subset, shared CTA
- [x] Every quote link pre-selects its package (`/kontakt?paketa=<id>`, via `src/lib/quote.ts`); service ↔ package mapping in `src/config/services.ts`
- [x] About page (`/rreth-nesh`): mission (with the official logo), values, services overview with deep links, process (`#procesi`), market focus, shared CTA. No founding year, team, clients, statistics or technologies
- [x] Home service cards deep-link to their section on the services page
- [x] Both pages indexable with real titles and descriptions
- [x] Fix: anchors now clear the sticky header for client-side hash navigation too (`[id]` scroll margin)
- [x] Fix: scroll reveal replaced. The CSS scroll-driven version left content that was partly on screen at load semi-transparent (found by axe on mobile). Now a small IntersectionObserver reveal (`src/components/layout/scroll-reveal.tsx`): on-screen content is never hidden, the rest fades in once; nothing hidden without JS or with reduced motion
- [x] Fix: FAQ list no longer stretches to the height of its intro column
- [x] Tests: services/pricing mapping and copy (unit); services and about pages, package pre-selection, anchors clear of the header, home deep links, no unverifiable claims, reveal visibility (incl. no-JS and reduced motion), crawler now verifies #anchors on their target page, axe on both pages, CLS on both pages (e2e)

## Sprint 5: Pricing and estimator ✅

- [x] Central pricing config (Starter 199 €, Business 399 €, Professional 699 €, E-commerce 999 €, Custom: quote)
- [x] Estimator rules in `src/config/estimator.ts`: pages included per package, extra-page price, add-ons (price, availability, included-in)
- [x] Estimator logic as pure functions (`src/lib/estimator.ts`): normalization of any input, itemised breakdown, total, "quote" result for Custom (never a number)
- [x] Pricing page (`/cmimet`): package cards from config (quote link + "Llogarit me këtë paketë"), Custom band, add-on prices generated from the estimator config, price factors, disclaimers, price FAQs, CTA
- [x] Estimator page (`/llogarit-cmimin`): native radio/checkbox/number controls, live total with screen-reader announcement, itemised summary, "indicative estimate, not a quote" notice, reset, sticky mobile total
- [x] Estimate carries over: shareable URL and quote link use `?paketa=…&faqe=…&shtesa=…` (read by the contact form in Sprint 7)
- [x] Shared `PackageGrid` / `CustomPackageBand` / `PricingDisclaimer` used by home and pricing page
- [x] Fix: price formatting no longer uses `Intl` (Chromium renders `sq` currency as "€399", Node as "399 €"; would mismatch server/client); deterministic `formatPrice` and `formatList`
- [x] Tests: calculations, edge cases (invalid/out-of-range/duplicate input, malicious URL values), package ↔ estimator ↔ copy consistency, formatting (unit); pricing links, add-on prices, full estimator flow incl. keyboard, Custom, URL restore, reset, live announcement (e2e); axe, CLS and overflow on both pages
- [x] Add-on and extra-page prices confirmed by the owner (2026-10-18) as indicative prices for standard implementations; payment-provider transaction fees and third-party subscriptions are stated as not included

## Sprint 6: Projects (portfolio) ✅

- [x] Six demo projects (all `demo: true`), with categories that mirror the services and a matching package per project
- [x] `/projektet`: intro, "Pse projekte demonstruese?" notice, category filter (toggle buttons with counts, keyboard accessible, result count announced, kept in `?kategoria=`), project grid
- [x] `/projektet/[slug]`: demo badge and banner, CSS-only preview, concept, goals (aims, not results), features, page structure, matching service and package with starting price, pre-selected quote and estimator links, related demo projects
- [x] Real 404 for unknown project slugs via `src/proxy.ts` (with Cache Components the page alone would send a "soft 404" with status 200 on first request)
- [x] Home project cards link to detail pages; shared `ProjectCard`
- [x] Fix: two-column grids hardened with `grid-cols-1` (implicit grid columns could grow past the screen on 360px phones); long button labels allowed to wrap
- [x] Tests: demo flags, config/copy consistency, no claim-like numbers or testimonial wording, filters and related projects (unit); filters incl. keyboard and URL, demo labels everywhere, detail links, first-request 404, home deep links, axe, CLS and overflow (e2e)
- [ ] Real client projects can be added later; each needs explicit client approval and its own entry (not `kind: "concept"`)

## Portfolio upgrade: premium website concepts ✅ (between Sprint 6 and Sprint 7)

- [x] Six realistic first-screen homepage concepts (desktop + mobile), each with its own navigation, hero, typography, UI elements and real photography: photography studio, restaurant, dental clinic, clothing shop, local-products shop, gym management dashboard
- [x] Scaled "live screenshot" rendering via `.concept-canvas` (pure CSS, no JS); concept display fonts loaded only where used, without preload
- [x] 11 photos from Unsplash (free licence verified per photo, Unsplash+ excluded, metadata stripped, self-hosted, served via `next/image`); credits in `docs/IMAGE_CREDITS.md`
- [x] Visible "Projekt demonstrues" badges, the demo notice and the demo banner removed; work presented as "Koncepte website" ("Koncept website" label), with no claim of client work
- [x] Internal config/docs state these are concepts with fictional brands (`kind: "concept"`)
- [x] Categories, filters, pricing, package and estimator links, accessibility (previews are `role="img"` with descriptions) and responsiveness preserved
- [x] Tests: concept framing, no demo wording, no client-work implications, no ratings/reviews/percentages in preview copy (unit); concept labels, preview images load and stay inside their frames, desktop and mobile previews on detail pages (e2e)

## Sprint 7: Contact and quote request

- [ ] Shared zod schema, with client and server validation
- [ ] Server Action, honeypot and rate limiting
- [ ] Configurable delivery (Resend once the API key and receiving address are provided)
- [ ] Honest success and error states (never a fake success)

## Sprint 8: FAQ, SEO and deployment docs

- [ ] FAQ page
- [ ] Per-page metadata, canonical URLs, Open Graph images, JSON-LD
- [ ] `sitemap.ts`, `robots.ts`
- [ ] `docs/DEPLOYMENT.md` (Vercel)

## Sprint 9: Quality pass

- [ ] Accessibility and keyboard audit across all pages
- [ ] Lighthouse / performance review
- [ ] Security headers (CSP etc.)
- [ ] Full e2e journeys

## Open decisions and inputs needed

- [x] Official logo and brand assets (WIDE_CODE_LOGO_PACK, integrated)
- [ ] Production domain (`NEXT_PUBLIC_SITE_URL`)
- [ ] Real contact details (email, phone, location) and social profile URLs → `src/config/site.ts`
- [ ] Resend API key and receiving email address
- [ ] Deployment approval (Vercel)

## Known issues

- `npm audit` reports 5 high-severity advisories in **development-only** dependencies (`braces`, via `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob`). Production dependencies have 0 advisories (`npm audit --omit=dev`). npm's suggested fix would downgrade `eslint-config-next` to v14, so it was not applied. Revisit when an upstream fix ships.
