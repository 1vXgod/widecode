# Content for owner review

Texts on the site that only the owner can confirm, collected in Phase D of the
multilingual work. Each item shows the current wording in every language,
where it appears, and what needs deciding. Nothing here is wrong as far as
the site can tell; these are statements about WideCode, legal or commercial
wording, or translations that should be checked by someone who knows the
business (and, for German, ideally a native speaker).

All copy lives in `src/content/<sq|en|de>/`. Change a text there and run
`npm test`: the tests check that all three languages still have the same
entries and placeholders.

## 1. Statements about WideCode

### 1.1 Languages you communicate in

The Albanian original promises communication in Albanian. The English and
German versions deliberately promise no language, because none was confirmed.

| | Text | File |
| --- | --- | --- |
| sq | **Komunikim në shqip:** "Flasim gjuhën tuaj dhe komunikojmë drejtpërdrejt me ju gjatë gjithë projektit." | `sq/home.ts` (why) |
| en | **Direct communication:** "You talk directly to us throughout the project, with no middlemen." | `en/home.ts` |
| de | **Direkte Kommunikation:** "Während des gesamten Projekts sprechen Sie direkt mit uns – ohne Umwege." | `de/home.ts` |
| sq | About, values: "Flasim shqip, shpjegojmë thjesht dhe ju mbajmë të informuar në çdo fazë." | `sq/about-page.ts` |
| en | "We explain things simply and keep you informed at every stage." | `en/about-page.ts` |
| de | "Wir erklären verständlich und halten Sie in jeder Phase auf dem Laufenden." | `de/about-page.ts` |

**Decide:** can WideCode work with clients in English and/or German? If yes,
say so on the English and German pages (e.g. "in Albanian or English"); a
visitor reading the German site will otherwise not know whether German is an
option.

### 1.2 Where you work and for whom

| | Text | File |
| --- | --- | --- |
| sq | About intro: "… kryesisht për bizneset në Kosovë, por edhe për klientë jashtë saj." Market: "Fokusi ynë kryesor janë bizneset në Kosovë. Njëkohësisht, jemi të hapur edhe për projekte me klientë nga rajoni dhe më gjerë." | `sq/about-page.ts` |
| en | "Our focus is on businesses in Kosovo, and we also welcome projects from clients abroad." Market: "… we are open to projects with clients from the region and beyond." | `en/about-page.ts` |
| de | "Unser Schwerpunkt liegt auf Unternehmen im Kosovo, und wir freuen uns auch über Projekte von Kunden aus dem Ausland." | `de/about-page.ts` |
| all | Search description and services intro: "… for businesses in Kosovo and beyond" / "im Kosovo und darüber hinaus" (Albanian: "në Kosovë dhe më gjerë" on the services page) | `*/common.ts`, `*/services-page.ts` |
| all | Hero label and social image: "Web Development në Kosovë" / "Web development from Kosovo" / "Webentwicklung aus dem Kosovo" | `*/home.ts`, `*/common.ts` |

**Decide:** is WideCode based in Kosovo, and does it want to be presented as
open to clients abroad? The English and German texts describe openness, not
existing foreign clients. The Albanian about intro ("por edhe për klientë
jashtë saj") can be read as having clients abroad already; reword it if
that is not the case.

## 2. Contact form

### 2.1 Privacy line (below the submit button)

| | Text |
| --- | --- |
| sq | "Të dhënat tuaja përdoren vetëm për t'iu përgjigjur kësaj kërkese." |
| en | "Your details are only used to respond to this request." |
| de | "Ihre Angaben werden ausschließlich zur Beantwortung dieser Anfrage verwendet." |

**Decide:** is this accurate for how requests are stored and handled (email
via Resend, your inbox)? For visitors in the EU (German, English pages) a
privacy policy page may be expected or legally required; the site has none
yet. Consider adding one and linking it here.

### 2.2 Budget ranges

| | Options |
| --- | --- |
| sq | Deri në 300 € · 300–600 € · 600–1000 € · 1000–2000 € · Mbi 2000 € · Ende nuk e di |
| en | Up to €300 · €300–600 · €600–1,000 · €1,000–2,000 · Over €2,000 · Not sure yet |
| de | Bis 300 € · 300–600 € · 600–1.000 € · 1.000–2.000 € · Über 2.000 € · Noch nicht sicher |

**Decide:** do these ranges fit your packages (Starter from 199 €,
E-commerce from 999 €, Custom on request)? The values themselves are set in
`src/config/quote.ts`; the labels in each language follow them.

### 2.3 Phone example

All languages give a Kosovo example ("+383 4X XXX XXX"); validation accepts
international numbers. **Decide:** keep it, or show a German example
(e.g. "+49 …") on the German page.

## 3. Two-language websites (add-on)

| | Calculator add-on | FAQ answer |
| --- | --- | --- |
| sq | "Përmbajtja në shqip dhe në anglisht ose në një gjuhë tjetër." | "… për shembull shqip dhe anglisht …" |
| en | "Content in two languages, for example Albanian and English." | "… for example Albanian and English …" |
| de | "Inhalte in zwei Sprachen, zum Beispiel Deutsch und Englisch." | "… zum Beispiel Deutsch und Englisch …" |

The German example was chosen to be relevant for German readers. **Decide:**
is that fine, and is the price (150 €) the same for any language pair?

## 4. German translation

The whole German site is a careful translation, not reviewed by a native
speaker. Most worth checking:

- **Service names:** "Visitenkarten-Website" (presentation website),
  "Unternehmenswebsite" (business website), "Onlineshop", "Individualentwicklung"
  (custom development). Package names stay English (Starter, Business,
  Professional, E-commerce, Custom), as in Albanian.
- **Terms used throughout:** Angebot (quote), Einstiegspreis / ab (starting
  price), unverbindliche Schätzung (indicative estimate), Preisrechner,
  Zusatzfunktionen (add-ons), Website-Konzept. The full list is at the top of
  `src/content/de/common.ts`.
- **FAQ** (`de/faq.ts`, `de/faq-page.ts`): payment, domain/hosting and
  changes after launch are described as "set out in the quote", as in Albanian.
- **Form messages** (`de/contact-page.ts`): validation and error texts.
- Visitors are addressed with "Sie".

## 5. Smaller items

- **Theme toggle labels** (screen readers): sq "Kalo në temën e çelët" /
  "Kalo në temën e errët"; en "Switch to light theme" / "Switch to dark theme";
  de "Zum hellen Design wechseln" / "Zum dunklen Design wechseln".
  Back-to-top: "Kthehu në krye" / "Back to top" / "Zurück nach oben".
- **Footer, until contact details exist:** "Të dhënat e kontaktit do të
  publikohen së shpejti …" (and the en/de equivalents). Disappears as soon as
  contact details are set in `src/config/site.ts`.
- **Portfolio:** the six projects are labelled "Koncept website" / "Website
  concept" / "Website-Konzept" (fictional brands, Unsplash photos; credits in
  `docs/IMAGE_CREDITS.md`). The previews show Albanian websites in every
  language, as agreed.
- **Owner notification email:** always Albanian, with a "Gjuha e klientit"
  row (Shqip / Anglisht / Gjermanisht). No email is sent to customers.

## 6. Inputs still needed (not content)

From `docs/CHECKLIST.md` → Open decisions: production domain
(`NEXT_PUBLIC_SITE_URL`), real contact details and social profiles, a verified
sending domain for Resend in production, and approval to deploy.
