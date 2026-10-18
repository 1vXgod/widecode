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
| `npm run test:e2e`   | End-to-end tests (Playwright) against the production build. Run `npm run build` first. |
| `npm run check`      | lint, typecheck, unit tests, build and e2e tests, in that order     |

## Environment variables

Copy `.env.example` to `.env.local`. **Never commit real `.env` files.** They are git-ignored.

| Variable               | Required | Purpose                                                                    |
| ---------------------- | -------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Canonical site URL, e.g. `https://example.com`. Falls back to the Vercel production URL on Vercel, or `http://localhost:3000` locally. |

The production domain has not been decided, so no domain is hardcoded.

## Project structure

```
src/
  app/                 Routes (App Router), root layout, icons, 404
  components/
    brand/             Logo
    layout/            Header, footer, navigation, mobile menu, skip link
    sections/          Page-level building blocks
    ui/                Primitives: Button, Container, Section, SectionHeading, Badge, Card
  config/              Site config and routes (single source of truth)
  content/<locale>/    All user-facing copy, typed by src/types/content.ts
  i18n/                Locale configuration
  lib/                 Utilities (cn, site URL resolution)
  styles/theme.css     Design tokens (colors, type scale, spacing, layout widths, motion)
  types/               Shared TypeScript types
tests/
  unit/                Vitest tests
  e2e/                 Playwright tests (routes, keyboard, accessibility, responsive)
docs/                  Project checklist and documentation
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

### Prices and projects

- **Prices:** [`src/config/pricing.ts`](src/config/pricing.ts) holds every starting price (whole euros; `null` = custom quote) and the recommended package. Package names, summaries and feature lists are in `src/content/sq/pricing.ts`. Prices are formatted with the Albanian locale (`199 €`). All prices are indicative starting prices, and the disclaimer must stay next to them.
- **Projects:** [`src/config/projects.ts`](src/config/projects.ts) lists portfolio entries. Every current entry is a **demonstration** (`demo: true`) and is shown with a "Projekt demonstrues" badge. Never present them as client work.

### Services and quote links

- **Services:** [`src/config/services.ts`](src/config/services.ts) lists the services in order, each with its section anchor on `/sherbimet` and the pricing packages that fit it. Text is in `src/content/sq/services.ts` and `src/content/sq/services-page.ts`.
- **Quote links:** always build them with `quoteHref(packageId)` from `src/lib/quote.ts`. It returns `/kontakt?paketa=<id>`, which the contact form will use to pre-select the package.

### Contact details and social links

Public contact details (`email`, `phone`, `location`) and social profile URLs are configured in [`src/config/site.ts`](src/config/site.ts). They are empty by default:

- Each contact field is rendered in the footer and mobile menu only when it is set and valid (emails become `mailto:` links, phones become `tel:` links).
- Social links are rendered only for absolute `https://` URLs and open in a new tab with `rel="noopener noreferrer"`.
- While nothing is configured, the footer shows a short "details coming soon" note and links to the contact page.

`tests/unit/contact.test.ts` asserts that the shipped config is empty. Update that test when real details are added.

## Deployment

Vercel is the intended host. Nothing is deployed yet, and deployment needs explicit approval. Full deployment documentation will be added in a later sprint.
