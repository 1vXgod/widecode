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
| Production domain | `NEXT_PUBLIC_SITE_URL` + Vercel domain settings | The site works on its `*.vercel.app` address but stays out of search results: no canonical URLs, an empty sitemap and `noindex` (see section 6) |
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
| `NEXT_PUBLIC_SITE_URL` | `https://<your-domain>` | leave unset | Inlined at build time. Must be a public `https://` domain. Without it the site still runs (assets use the Vercel URL), but it is not indexed and publishes no canonical URLs. No trailing slash |
| `RESEND_API_KEY` | Resend key | optional | Server-only. A key restricted to sending from your domain is enough |
| `QUOTE_TO_EMAIL` | receiving address | optional | One address, or up to 5 comma-separated |
| `QUOTE_FROM_EMAIL` | `WideCode <ofertat@<your-domain>>` | optional | Must be on the domain verified in Resend |
| `QUOTE_DELIVERY` | **never set** | **never set** | Developer aid only; `log` is refused on production |
| `RESEND_API_URL` | **never set** | **never set** | Automated tests only; accepted only for `localhost` |

If the three Resend variables are missing on a preview, the preview simply shows the "temporarily unavailable" message, which is safe. Setting them on previews means test submissions from previews send real emails.

## 4. Connect the domain

1. **Settings → Domains → Add** your domain (for example `example.com` and `www.example.com`).
2. Add the DNS records Vercel shows at your domain registrar. Choose one primary host and let Vercel redirect the other (`www` → apex or the reverse). HTTPS certificates are issued automatically.
3. Set `NEXT_PUBLIC_SITE_URL` to the primary host (for example `https://example.com`) for **Production**, then redeploy. This switches on indexing: canonical URLs, `sitemap.xml`, `robots.txt` and structured data all use it. Then follow the Search Console steps in section 6.

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

### When the site is indexable

Indexing starts only when **both** are true ([`src/lib/seo.ts`](../src/lib/seo.ts)):

1. it is a production deployment (Vercel Production, or self-hosted), and
2. `NEXT_PUBLIC_SITE_URL` is set to a public `https://` domain (not `localhost`, not `http://`).

| Deployment | `robots.txt` | Pages | `sitemap.xml` | Canonical URLs |
| --- | --- | --- | --- | --- |
| Production with `NEXT_PUBLIC_SITE_URL=https://<your-domain>` | `Allow: /` + sitemap | indexable | every page and concept on your domain | `https://<your-domain>/…` |
| Production **without** a domain (only `*.vercel.app`) | `Disallow: /` | `noindex` | empty | none |
| Vercel Preview / Development | `Disallow: /` | `noindex` | empty or unused | none |
| Local (`next dev`, local builds) | `Disallow: /` | `noindex` | empty | none |

So a deployment can go live on the `*.vercel.app` address to be reviewed before the domain exists, without search engines indexing a temporary address. Nothing that crawlers read ever contains `localhost`.

### What is in place

- **Titles and descriptions:** unique Albanian titles (with " | WideCode") and meta descriptions for every page, from `pages` and `meta` in [`src/content/sq/common.ts`](../src/content/sq/common.ts); project pages use their concept's name and summary.
- **Canonical URLs** without query parameters (pre-fill, filter and estimate parameters never create separate indexable URLs).
- **Open Graph and X** metadata on every page, with the shared social image `/opengraph-image` (1200×630, generated at build time).
- **Structured data** (JSON-LD), only facts that are configured: Organization and WebSite on the home page, Service (with the published starting prices) on `/sherbimet`, FAQPage on `/pyetje-te-shpeshta`. No address, phone number, ratings, reviews or awards. Email, phone and social profiles are added automatically once set in `src/config/site.ts`.
- **No private routes:** the site has no admin, login or account pages; every public page is in the sitemap. The 404 page is always `noindex`.

### Google Search Console (after the domain is live)

1. **Prerequisites:** the domain points to Vercel (section 4), `NEXT_PUBLIC_SITE_URL=https://<your-domain>` is set for Production, and a production deployment has been made after setting it. Check that `https://<your-domain>/robots.txt` shows `Allow: /` and `Sitemap: https://<your-domain>/sitemap.xml`.
2. Open [Google Search Console](https://search.google.com/search-console) with the Google account that should own the site, choose **Add property** and pick **Domain** (covers `https://`, `http://`, `www` and every subdomain).
3. Enter the bare domain (`example.com`, without `https://`). Google shows a **TXT record** (`google-site-verification=…`).
4. At your domain registrar or DNS provider, add that TXT record to the root of the domain (host `@`). Keep it there permanently; removing it removes the verification.
5. Back in Search Console, click **Verify**. DNS changes can take from a few minutes up to a day; retry if it is not found yet.
   *Alternative:* a **URL prefix** property (`https://example.com/`) can be verified with an HTML meta tag; that would need a small code change (`metadata.verification.google`), so the Domain property is simpler.
6. Go to **Indexing → Sitemaps**, enter `sitemap.xml` and click **Submit**. The status should become **Success** with 28 discovered URLs today (8 pages and 6 website concepts, in Albanian and English; the number grows with concepts, client projects and languages). Each URL lists its other language versions (`hreflang`), so Google shows the right language to each visitor.
7. Use **URL inspection** on the home page, then **Request indexing**, to speed up the first crawl. Repeat for the most important pages (services, pricing, contact) if you like.
8. Over the next days, check **Indexing → Pages** for errors and **Enhancements** for the FAQ and structured data reports.
9. **Bing Webmaster Tools** (optional, also feeds other search engines): sign in and choose **Import from Google Search Console**. This adds the site and its sitemap without another DNS record.

### Other checks after launch

- Validate structured data with the [Rich Results Test](https://search.google.com/test/rich-results) or the [Schema Markup Validator](https://validator.schema.org/).
- Check the social preview by sharing the home page link in a messaging app, or with the Facebook Sharing Debugger.
- If the domain ever changes, update `NEXT_PUBLIC_SITE_URL`, redeploy, add the new domain in Search Console and use its **Change of address** tool.

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
- **Security headers** are set for every response in [`next.config.ts`](../next.config.ts): a Content Security Policy that allows only the site's own origin (`'unsafe-inline'` scripts are needed by Next.js's prerendered pages; nonces would disable prerendering), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, a restrictive `Permissions-Policy` and HSTS (without `includeSubDomains`, so other subdomains are not forced to HTTPS). Check them after go-live with `curl -I https://<your-domain>/`. Adding analytics, embedded maps/videos or other third-party scripts requires extending the CSP first, otherwise the browser blocks them. The Vercel toolbar on preview deployments is blocked by the CSP too; this does not affect the site.
- **Errors:** an unexpected error shows the Albanian page "Diçka shkoi keq" with a retry button and an error code; the same code appears in Vercel's **Runtime Logs**, never the error details.

## 9. Self-hosting instead of Vercel

```bash
npm ci
npm run build
NEXT_PUBLIC_SITE_URL=https://<your-domain> npm start   # port 3000 by default
```

- Set the same environment variables as in section 3 (`NEXT_PUBLIC_SITE_URL` must be present at **build** time).
- Run behind a reverse proxy that terminates HTTPS and sets `X-Forwarded-For` to the real client address (the quote form's rate limit relies on it), and does not pass through client-supplied values.
- Without `VERCEL_ENV`, the site is treated as production: it is indexable as soon as `NEXT_PUBLIC_SITE_URL` is a public `https://` domain.
