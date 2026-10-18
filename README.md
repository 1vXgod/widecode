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
- **Motion:** `ease-out-expo` and `animate-fade-up`. All animations and transitions are effectively disabled for visitors with `prefers-reduced-motion: reduce`.
- **Focus:** a single, high-contrast `:focus-visible` outline for every focusable element.

The current logo is a **temporary** mark (`src/components/brand/logo.tsx`, `src/app/icon.svg`, `src/app/apple-icon.tsx`). Replace it when official brand assets are available.

## Content and localization

All copy lives in `src/content/sq/` and must satisfy the `Dictionary` type. To add English later:

1. Add `"en"` to `locales` in `src/i18n/config.ts`.
2. Create `src/content/en/` that satisfies the same type, and register it in `src/content/index.ts`.
3. Add locale-aware routing.

Content rules: natural Kosovo Albanian with correct **ë** and **ç**; no invented clients, testimonials, statistics or contact details; prices are indicative starting prices only.

## Deployment

Vercel is the intended host. Nothing is deployed yet, and deployment needs explicit approval. Full deployment documentation will be added in a later sprint.
