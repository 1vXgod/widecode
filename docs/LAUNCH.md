# Launch checklist

State after the Phase D production readiness audit (2026-10-20). How to
deploy is in [DEPLOYMENT.md](DEPLOYMENT.md); texts to confirm are in
[CONTENT_REVIEW.md](CONTENT_REVIEW.md); the full history is in
[CHECKLIST.md](CHECKLIST.md).

Nothing below has been filled in with assumed values. Every item marked
**Owner** needs a real value or decision from the owner.

## 1. Inputs needed from the owner

### 1.1 Privacy policy and legal information

The site has no privacy policy or imprint page. The quote form collects name,
email, phone (optional), business name and project details, and the site
addresses visitors in Kosovo and abroad (English and German versions), so a
privacy policy is normally expected; depending on where WideCode is registered,
an imprint may be required too. No legal text was written.

Needed:

- [ ] **Owner:** who is legally responsible for the site: a registered business
      (legal name, legal form, registration number, registered address) or a
      private person (name and address)
- [ ] **Owner:** country of registration, which decides which laws apply
      (e.g. Kosovo's Law No. 06/L-082 on personal data protection; GDPR where EU
      visitors are targeted) and whether an imprint is required
- [ ] **Owner:** contact address for privacy requests (access, correction, deletion)
- [ ] **Owner:** how long quote requests are kept, and where (the inbox of
      `QUOTE_TO_EMAIL`)
- [ ] **Owner:** confirm the processors used: Resend (sends the request emails),
      Vercel (hosting), the email provider of `QUOTE_TO_EMAIL`. No analytics,
      cookies for tracking, or third-party scripts are used; the theme choice
      and an unsent form draft are kept only in the visitor's browser
- [ ] **Owner:** the policy text in Albanian, English and German, ideally written
      or reviewed by someone qualified in the applicable law
- [ ] **Decision:** page URLs (proposal: `/privatesia`, `/en/privacy`,
      `/de/datenschutz`) and whether the form's privacy line should link to it.
      Adding the pages, footer links, sitemap entries and tests is a small
      follow-up once the text exists

### 1.2 Public contact details

Today the footer and contact page say the details will be published soon, and
the structured data contains no contact information. Set in
[`src/config/site.ts`](../src/config/site.ts) (then update
`tests/unit/contact.test.ts`). Each field is optional; anything left empty is
simply not shown.

- [ ] **Owner:** public email address (shown as a `mailto:` link; also goes into
      the Organization JSON-LD)
- [ ] **Owner:** public phone number in international format, e.g. `+383 …`
      (shown as a `tel:` link; also in the JSON-LD, like the social profiles)
- [ ] **Owner:** location, one short text shown unchanged in all three languages
      (e.g. a city and country). Leave empty to show none
- [ ] **Owner:** social profiles that exist today, as full `https://` URLs.
      Supported: Instagram, Facebook, LinkedIn, GitHub, TikTok, X
- [ ] **Decision:** whether the public email may be the same address as
      `QUOTE_TO_EMAIL`

### 1.3 Production domain (`NEXT_PUBLIC_SITE_URL`)

- [ ] **Owner:** the registered domain and the primary host, e.g. whether the
      site lives at `https://<domain>` or `https://www.<domain>` (the other one
      redirects)
- [ ] **Owner:** access to the domain's DNS at the registrar (for Vercel and
      for Resend's records)
- [ ] Value to set in Vercel, **Production only**:
      `NEXT_PUBLIC_SITE_URL=https://<primary-host>` (no trailing slash). Leave
      it unset on Preview

Until it is set, the site is deliberately closed to search engines
(`noindex`, `Disallow: /`, empty sitemap, no canonical URLs).

### 1.4 Quote form email (Resend)

The local `.env.local` uses Resend's sandbox sender (`@resend.dev`), which only
delivers to the Resend account's own address. Production needs:

- [ ] **Owner:** a sending domain verified in Resend (the production domain or a
      subdomain such as `mail.<domain>`), with the SPF and DKIM records Resend
      shows (DMARC recommended)
- [ ] **Owner:** an API key with sending access, restricted to that domain →
      `RESEND_API_KEY` (set only in Vercel, never in a committed file)
- [ ] **Owner:** the address(es) that receive quote requests →
      `QUOTE_TO_EMAIL` (one, or up to 5 comma-separated)
- [ ] **Owner:** the sender shown on those emails, on the verified domain →
      `QUOTE_FROM_EMAIL`, e.g. `WideCode <name@verified-domain>`
- [ ] **Decision:** whether Preview deployments get the Resend variables too
      (then test submissions from previews send real emails) or show the
      "temporarily unavailable" message
- [ ] Never set `QUOTE_DELIVERY` or `RESEND_API_URL` in Vercel

### 1.5 Other open owner decisions (not blocking)

- [ ] Review of [CONTENT_REVIEW.md](CONTENT_REVIEW.md): statements about
      WideCode, privacy line, budget ranges, the German copy
- [ ] Project pages: accept the slightly slower client-side navigation into a
      project page, or add a loading skeleton / full prefetching (CHECKLIST,
      Phase D)
- [ ] Concept preview "Local products online shop": keep or darken its amber
      eyebrow text (CHECKLIST, Phase D)
- [ ] Approval to deploy

## 2. Complete and verified locally

- [x] Three languages (sq default, en, de) with localized URLs, language
      switcher, localized 404 and error pages
- [x] Dark and light theme (system default, saved choice), correct logo per
      theme in header, mobile menu, footer and About page
- [x] Responsive layouts: no horizontal overflow at 320–1440 px in every
      language and both themes; header fits on one line from 1024 px
- [x] Navigation: page changes jump to the top; in-page anchors and
      back-to-top scroll smoothly; everything instant with reduced motion
- [x] Accessibility: axe WCAG 2.2 A/AA on every page, language, theme, phone and
      desktop (one documented exception inside a concept preview); keyboard
      flows, focus styles, skip link, reduced motion
- [x] SEO ready for the domain: titles, descriptions, canonical, `hreflang`,
      Open Graph and X tags, social images per language, JSON-LD (Organization,
      WebSite, Service, FAQPage), sitemap and robots, all generated from
      `NEXT_PUBLIC_SITE_URL` (verified with a test domain)
- [x] Quote form: validation on client and server, honeypot, minimum fill time,
      rate limits, idempotent sending, success shown only when Resend accepts
      (verified end to end with a mock Resend API)
- [x] Security: CSP and security headers, no secrets in the repository or its
      history, none in the browser bundles, `npm audit --omit=dev` clean
- [x] Production build without warnings; browser console clean on every page
- [x] Automated tests: lint, typecheck, 315 unit tests, 407 e2e tests

## 3. To test on the live domain

After deploying with the values above, follow [DEPLOYMENT.md](DEPLOYMENT.md)
section 7 ("Check the live site") and section 6 (Search Console). In short:

- [ ] Every page loads over HTTPS in all three languages; the other host
      (`www` or apex) redirects to the primary host
- [ ] 404 pages return status 404 in the URL's language
- [ ] `curl -I https://<domain>/` shows the security headers, including HSTS
- [ ] `robots.txt` allows crawling and names the sitemap on the domain;
      `sitemap.xml` lists only URLs on the domain; pages have a canonical URL
      on the domain and no `noindex`
- [ ] A real quote request from the live contact page shows the confirmation,
      arrives at `QUOTE_TO_EMAIL` with all fields, and replying addresses the
      visitor; repeat once in English and once in German
- [ ] Links from pricing, calculator and project pages pre-fill the form
- [ ] Contact details, social links and (once added) privacy pages appear in
      the footer and contact page
- [ ] Social preview of the home page in each language (sharing debugger)
- [ ] Structured data passes the Rich Results Test
- [ ] Search Console: domain verified, sitemap submitted
- [ ] Real phone check (iOS and Android) and a Lighthouse run in both themes
- [ ] Browser console clean on the live site (the CSP may block anything
      added by the host, e.g. the Vercel toolbar on previews)
