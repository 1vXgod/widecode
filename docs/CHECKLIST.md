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
- [x] Motion: CSS scroll-driven reveals only where supported and motion is allowed. Decision: **no Motion/Framer Motion dependency**, as CSS covers the needs with zero JS cost
- [x] Tests: pricing config and formatting (unit); home sections, CTAs, demo labels, prices, FAQ keyboard, showcase keyboard/autoplay/pause/reduced motion, zero console errors on all routes, CLS < 0.1 on mobile and desktop (e2e)
- [ ] **Needs review by owner:** package feature lists in `src/content/sq/pricing.ts` (e.g. "Deri në 5 faqe") are proposed defaults

## Sprint 4: Services and About

- [ ] Services page
- [ ] About page (no fabricated history, team or statistics)

## Sprint 5: Pricing and estimator

- [ ] Central pricing config (Starter €199, Business €399, Professional €699, E-commerce €999, Custom: quote)
- [ ] Pricing page with configurable packages and an "indicative prices" disclaimer
- [ ] Estimator logic as pure functions, with full unit tests
- [ ] Estimator UI (keyboard accessible)

## Sprint 6: Projects (portfolio)

- [ ] Portfolio grid with category filters
- [ ] Project detail pages
- [ ] Every demo project clearly labelled as a demonstration

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
