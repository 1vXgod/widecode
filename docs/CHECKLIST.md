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
- [~] Favicon / apple icon: temporary mark until official logo is provided
- [x] Typed content dictionary (`src/content/sq`), ready for English later
- [x] Reduced-motion support and global focus styles
- [x] Unit tests (Vitest) and e2e tests (Playwright + axe)
- [x] `.env.example`, `.gitattributes`, `.gitignore` for env files and test output
- [x] README with setup commands and structure

## Sprint 2: Home page and interactive hero

- [ ] Original interactive hero (reduced-motion fallback)
- [ ] Services overview, process, pricing teaser, CTA sections
- [ ] Decide on Motion library usage

## Sprint 3: Services and About

- [ ] Services page
- [ ] About page (no fabricated history, team or statistics)

## Sprint 4: Pricing and estimator

- [ ] Central pricing config (Starter €199, Business €399, Professional €699, E-commerce €999, Custom: quote)
- [ ] Pricing page with configurable packages and an "indicative prices" disclaimer
- [ ] Estimator logic as pure functions, with full unit tests
- [ ] Estimator UI (keyboard accessible)

## Sprint 5: Portfolio

- [ ] Portfolio grid with category filters
- [ ] Project detail pages
- [ ] Every demo project clearly labelled as a demonstration

## Sprint 6: Contact and quote request

- [ ] Shared zod schema, with client and server validation
- [ ] Server Action, honeypot and rate limiting
- [ ] Configurable delivery (Resend once the API key and receiving address are provided)
- [ ] Honest success and error states (never a fake success)

## Sprint 7: FAQ, SEO and deployment docs

- [ ] FAQ page
- [ ] Per-page metadata, canonical URLs, Open Graph images, JSON-LD
- [ ] `sitemap.ts`, `robots.ts`
- [ ] `docs/DEPLOYMENT.md` (Vercel)

## Sprint 8: Quality pass

- [ ] Accessibility and keyboard audit across all pages
- [ ] Lighthouse / performance review
- [ ] Security headers (CSP etc.)
- [ ] Full e2e journeys

## Open decisions and inputs needed

- [ ] Official logo and brand assets
- [ ] Production domain (`NEXT_PUBLIC_SITE_URL`)
- [ ] Real contact details (email, phone)
- [ ] Resend API key and receiving email address
- [ ] Deployment approval (Vercel)

## Known issues

- `npm audit` reports 5 high-severity advisories in **development-only** dependencies (`braces`, via `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob`). Production dependencies have 0 advisories (`npm audit --omit=dev`). npm's suggested fix would downgrade `eslint-config-next` to v14, so it was not applied. Revisit when an upstream fix ships.
