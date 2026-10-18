# Deploying WideCode

This guide takes the site from this repository to a live deployment on **Vercel**, the intended host. Nothing has been deployed yet: deploying, connecting a domain and adding credentials all need the owner's go-ahead.

- [1. Before you deploy](#1-before-you-deploy)
- [2. Create the Vercel project](#2-create-the-vercel-project)
- [3. Environment variables](#3-environment-variables)
- [4. Connect the domain](#4-connect-the-domain)
- [5. Activate the quote form (Resend)](#5-activate-the-quote-form-resend)
- [6. Search engines](#6-search-engines)
- [7. Check the live site](#7-check-the-live-site)
- [8. Operations and security](#8-operations-and-security)
- [9. Self-hosting instead of Vercel](#9-self-hosting-instead-of-vercel)

## 1. Before you deploy

Decisions and inputs that only the owner can provide (also tracked in [`CHECKLIST.md`](CHECKLIST.md)):

| Item | Where it goes | Without it |
| --- | --- | --- |
| Production domain | `NEXT_PUBLIC_SITE_URL` + Vercel domain settings | Canonical URLs, sitemap and social previews use the `*.vercel.app` address |
| Resend API key, receiving address, verified sending domain | `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL` | The contact page shows "Formulari është përkohësisht i padisponueshëm" instead of the form |
| Public email, phone, location, social profiles | [`src/config/site.ts`](../src/config/site.ts) (then update `tests/unit/contact.test.ts`) | Footer says contact details follow soon; nothing is shown |
| Review of proposed copy | Package features, FAQ answers on payment, domain/hosting and changes after launch, budget ranges, privacy line under the form | Proposed wording stays live |

Run the full check locally first; it must be green:

```bash
npm ci
npm run check   # lint, typecheck, unit tests, build, e2e
```

## 2. Create the Vercel project

1. In Vercel, **Add New → Project** and import `github.com/1vXgod/widecode`.
2. Vercel detects Next.js. Keep the defaults: install `npm install` (or `npm ci`), build `npm run build`, output managed by Vercel.
3. **Settings → General → Node.js Version:** 22.x or newer (`package.json` requires Node ≥ 22.12).
4. Add the environment variables (next section) **before** the first production deployment.
5. Deploy. Every push to `main` then deploys to production, and every other branch or pull request gets a preview deployment.

## 3. Environment variables

Set them in **Settings → Environment Variables**. Values are secrets: never put them in `.env.example` or any committed file (the repository is public, and GitHub push protection will block keys). Redeploy after changing any variable.

| Variable | Production | Preview | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-domain>` | leave unset | Inlined at build time. Without it, production falls back to the Vercel production URL. No trailing slash |
| `RESEND_API_KEY` | Resend key | optional | Server-only. A key restricted to sending from your domain is enough |
| `QUOTE_TO_EMAIL` | receiving address | optional | One address, or up to 5 comma-separated |
| `QUOTE_FROM_EMAIL` | `WideCode <ofertat@<your-domain>>` | optional | Must be on the domain verified in Resend |
| `QUOTE_DELIVERY` | **never set** | **never set** | Developer aid only; `log` is refused on production |
| `RESEND_API_URL` | **never set** | **never set** | Automated tests only; accepted only for `localhost` |

If the three Resend variables are missing on a preview, the preview simply shows the "temporarily unavailable" message, which is safe. Setting them on previews means test submissions from previews send real emails.

## 4. Connect the domain

1. **Settings → Domains → Add** your domain (for example `example.com` and `www.example.com`).
2. Add the DNS records Vercel shows at your domain registrar. Choose one primary host and let Vercel redirect the other (`www` → apex or the reverse). HTTPS certificates are issued automatically.
3. Set `NEXT_PUBLIC_SITE_URL` to the primary host (for example `https://example.com`) for **Production**, then redeploy. Canonical URLs, `sitemap.xml`, `robots.txt` and social previews all use it.

## 5. Activate the quote form (Resend)

The form only confirms a request after Resend has accepted the email, so this step is required before the contact page can take requests.

1. Create a Resend account and **add your domain** (a subdomain such as `mail.example.com` keeps email DNS separate from the website).
2. Add the DNS records Resend shows (SPF and DKIM; DMARC is recommended) and wait until the domain is **verified**.
3. Create an API key with **sending access** (restrict it to that domain).
4. In Vercel set `RESEND_API_KEY`, `QUOTE_TO_EMAIL` and `QUOTE_FROM_EMAIL` for Production and redeploy.
5. Send a test request from the live contact page. Check that:
   - the confirmation "Faleminderit, kërkesa juaj u dërgua!" appears;
   - the email arrives at `QUOTE_TO_EMAIL` with all fields;
   - replying to it addresses the visitor (the visitor's address is the `Reply-To`).

If something is wrong, the visitor sees an error and keeps their data; Vercel's **Runtime Logs** show a `[quote]` line naming the problem (missing or invalid variable names, or Resend's HTTP status), never the key or the visitor's data.

Before the domain is verified, Resend allows `QUOTE_FROM_EMAIL=WideCode <onboarding@resend.dev>`, but it then only delivers to the email address of the Resend account itself. Use this for a quick local test in `.env.local` only.

## 6. Search engines

- **Production is indexable; previews are not.** On Vercel preview and development deployments, `robots.txt` disallows everything and every page carries `noindex` ([`src/lib/seo.ts`](../src/lib/seo.ts)).
- `/sitemap.xml` lists every page and website concept; `/robots.txt` points to it.
- Each page has a canonical URL without query parameters, Open Graph and X metadata, and the shared social image `/opengraph-image` (1200×630, generated at build time).
- Structured data: Organization and WebSite on the home page, FAQPage on `/pyetje-te-shpeshta`. Contact details and social profiles appear there only once configured.

After the domain is live:

1. Add the domain in **Google Search Console** (DNS verification) and submit `https://<your-domain>/sitemap.xml`. Optionally do the same in **Bing Webmaster Tools**.
2. Check a page with the [Rich Results Test](https://search.google.com/test/rich-results) or the [Schema Markup Validator](https://validator.schema.org/).
3. Check the social preview by sharing the home page link in a messaging app, or with the Facebook Sharing Debugger.

## 7. Check the live site

- [ ] Every page in the main navigation loads; `/nuk-ekziston` and `/projektet/nuk-ekziston` return the Albanian 404 page with status 404
- [ ] `https://<your-domain>/robots.txt` shows `Allow: /` and the sitemap on **your domain** (not `localhost` or `vercel.app`)
- [ ] `https://<your-domain>/sitemap.xml` lists only URLs on your domain
- [ ] Page source has `<link rel="canonical" href="https://<your-domain>/…">`
- [ ] Contact form: a real test request arrives (section 5); without Resend the page shows the "temporarily unavailable" message, never a confirmation
- [ ] Links from pricing, estimator and project pages pre-fill the form
- [ ] Mobile check on a real phone; Lighthouse in Chrome DevTools for performance and accessibility

## 8. Operations and security

- **Secrets** live only in Vercel environment variables (or a local, git-ignored `.env.local`). Rotate the Resend key in Resend and Vercel if it was ever exposed.
- **Rate limiting** of the quote form is in memory and therefore per server instance on Vercel (best effort). For a strict limit, add a Vercel Firewall rate-limit rule for `POST` requests to `/kontakt`, or back the limiter with a shared store such as Redis.
- **Rollback:** in **Deployments**, promote a previous deployment (Instant Rollback) if a release misbehaves.
- **Server Actions encryption key:** not needed on Vercel. When self-hosting on several instances, set the same `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` everywhere.
- Security headers (Content Security Policy and others) are planned for the quality sprint (see `CHECKLIST.md`).

## 9. Self-hosting instead of Vercel

```bash
npm ci
npm run build
NEXT_PUBLIC_SITE_URL=https://<your-domain> npm start   # port 3000 by default
```

- Set the same environment variables as in section 3 (`NEXT_PUBLIC_SITE_URL` must be present at **build** time).
- Run behind a reverse proxy that terminates HTTPS and sets `X-Forwarded-For` to the real client address (the quote form's rate limit relies on it), and does not pass through client-supplied values.
- Without `VERCEL_ENV`, the site is treated as production and is indexable.
