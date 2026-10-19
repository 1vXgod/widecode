import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { projectSlugs } from "../../src/config/projects";
import { quoteProtection } from "../../src/config/quote";
import { mainNav } from "../../src/config/routes";
import { localizedRoutes } from "../../src/i18n/routing";
import { E2E_SITE_URL } from "./e2e-site";

/**
 * The German site (Phase C): routes, content language, the language switcher,
 * prices, the quote form, 404s and SEO. The e2e build has the test domain
 * configured, so canonical URLs, hreflang and the sitemap are published.
 */
const de = localizedRoutes.de;
const germanPages = [...Object.values(de), ...projectSlugs.map((slug) => `${de.projects}/${slug}`)];

let visitor = 0;
test.beforeEach(async ({ page }, testInfo) => {
  visitor += 1;
  // Own client address per test, so the quote form's rate limit never interferes.
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `192.0.${150 + (testInfo.workerIndex % 50)}.${(visitor % 250) + 1}` });
});

/** Visible text of <main>, without the concept previews (they show Albanian websites on purpose). */
async function mainText(page: Page) {
  return page.locator("main").evaluate((main) => {
    const copy = main.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('[role="img"]').forEach((el) => el.remove());
    document.body.append(copy);
    const text = copy.innerText;
    copy.remove();
    return text;
  });
}

async function openSwitcher(page: Page, buttonName: RegExp, menuName: string) {
  await page.getByRole("button", { name: buttonName }).click();
  return page.getByRole("navigation", { name: menuName }).first();
}

test.describe("German pages", () => {
  test("every page is prerendered in German at its own URL", async ({ request }) => {
    for (const path of germanPages) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(200);
      expect(response.headers()["x-nextjs-prerender"], path).toBeTruthy();
      const html = await response.text();
      expect(html, path).toContain('<html lang="de"');
      // Links stay German; the internal segment, Albanian and English slugs never leak under /de.
      expect(html, path).not.toMatch(/href="\/(sq|de\/(sherbimet|projektet|cmimet|llogarit-cmimin|rreth-nesh|pyetje-te-shpeshta|services|projects|pricing|price-calculator|about|contact))(\/|"|\?|#)/);
    }
  });

  test("the navigation marks the current page already in the prerendered HTML", async ({ request }) => {
    for (const key of mainNav) {
      const html = await (await request.get(de[key])).text();
      const current = (html.match(/<a\s[^>]*>/g) ?? []).filter((tag) => tag.includes('aria-current="page"'));
      expect(current.length, key).toBeGreaterThan(0);
      expect(current.every((tag) => tag.includes(`href="${de[key]}"`)), key).toBe(true);
    }
  });

  test("the content is German (outside the Albanian concept previews) and hydrates without errors", async ({ page }) => {
    test.slow(); // visits every German page
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of germanPages) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toHaveCount(1);
      const text = await mainText(page);
      expect(text, path).not.toMatch(/[ëçËÇ]/);
      // Header and footer are German too.
      await expect(page.getByRole("navigation", { name: "Hauptnavigation" }).first()).toBeAttached();
      await expect(page.locator("footer")).toContainText("Alle Rechte vorbehalten.");
    }
    expect(errors).toEqual([]);
  });

  test("shows German headings on the main pages", async ({ page }) => {
    for (const [path, heading] of [
      [de.home, "Eine professionelle Website, die für Ihr Unternehmen arbeitet"],
      [de.services, "Websites und digitale Lösungen nach Maß"],
      [de.pricing, "Pakete mit transparenten Preisen"],
      [de.estimator, "Berechnen Sie den Preis Ihres Projekts"],
      [de.about, "Websites mit Sorgfalt, Klarheit und fairen Preisen"],
      [de.faq, "Fragen und Antworten"],
      [de.contact, "Erzählen Sie uns von Ihrem Projekt"],
      [de.projects, "Website-Konzepte"],
    ] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 }), path).toHaveText(heading);
    }
  });

  test("keeps the concept previews in Albanian, with German descriptions around them", async ({ page }) => {
    await page.goto(`${de.projects}/klinike-dentare`);
    await expect(page.getByRole("heading", { level: 1, name: "Zahnarztpraxis" })).toBeVisible();
    const preview = page.getByRole("img", { name: "Startseite des Konzepts „Zahnarztpraxis“ auf einem Computer" });
    await expect(preview).toBeAttached();
    // The preview shows the fictional Kosovo clinic's own (Albanian) website.
    expect(await preview.evaluate((el) => el.textContent ?? "")).toMatch(/[ëç]/);
    await expect(page.getByRole("img", { name: "Startseite des Konzepts „Zahnarztpraxis“ auf einem Smartphone" })).toBeAttached();
  });

  test("internal Albanian slugs under /de redirect to the German URL, keeping the query", async ({ request }) => {
    for (const [from, to] of [
      ["/de/sherbimet?a=1", "/de/leistungen?a=1"],
      ["/de/llogarit-cmimin?paketa=business", "/de/preisrechner?paketa=business"],
      ["/de/projektet/klinike-dentare", "/de/projekte/klinike-dentare"],
      ["/de/rreth-nesh", "/de/ueber-uns"],
    ]) {
      const response = await request.get(from!, { maxRedirects: 0 });
      expect(response.status(), from).toBe(308);
      const location = new URL(response.headers().location!, "http://localhost");
      expect(location.pathname + location.search, from).toBe(to);
    }
  });

  test("a refresh keeps the German page", async ({ page }) => {
    await page.goto(`${de.estimator}?paketa=professional`);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.getByRole("radio", { name: /Professional/ })).toBeChecked();
  });
});

test.describe("prices in German", () => {
  test("the same packages and amounts, written 199 €", async ({ page }) => {
    await page.goto(de.pricing);
    // "ab" and the amount are separate elements (no text space between them).
    for (const [name, price] of [["Starter", /ab\s*199\s€/], ["Business", /ab\s*399\s€/], ["Professional", /ab\s*699\s€/], ["E-commerce", /ab\s*999\s€/]] as const) {
      await expect(page.getByRole("article", { name, exact: true })).toContainText(price);
    }
    await expect(page.getByRole("article", { name: "Custom", exact: true })).toContainText("Auf Anfrage");
    await expect(page.locator("main")).not.toContainText(/€\d/);
    await expect(page.locator("main")).toContainText(/30\s€ \/ Seite/);
  });

  test("the calculator gives the same total in German as in Albanian and English", async ({ page }) => {
    const query = "?paketa=business&faqe=8&shtesa=multilingual,booking,analytics";
    await page.goto(`${de.estimator}${query}`);
    await page.waitForLoadState("networkidle");
    await expect.poll(async () => (await page.getByTestId("estimate-total").first().textContent())?.replace(/\s/g, " ").trim()).toBe("879 €");
    await expect(page.getByRole("link", { name: "Angebot mit dieser Schätzung anfordern" })).toHaveAttribute(
      "href",
      "/de/kontakt?paketa=business&faqe=8&shtesa=multilingual%2Cbooking%2Canalytics&vleresim=1",
    );
  });

  test("Custom shows no price, only a quote on request", async ({ page }) => {
    await page.goto(`${de.estimator}?paketa=custom`);
    await page.waitForLoadState("networkidle");
    await expect.poll(async () => (await page.getByTestId("estimate-total").first().textContent())?.trim()).toBe("Auf Anfrage");
  });
});

test.describe("language switcher with German", () => {
  test("is a keyboard-accessible menu on German pages that marks Deutsch as current", async ({ page }) => {
    await page.goto(de.estimator);
    await page.waitForLoadState("networkidle");
    const button = page.getByRole("button", { name: "DE Sprache wechseln (aktuell: Deutsch)" });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("navigation", { name: "Sprache" }).first();
    await expect(menu.getByRole("link")).toHaveText(["Shqip", "English", "Deutsch"]);
    await expect(menu.getByRole("link", { name: "Deutsch" })).toHaveAttribute("aria-current", "true");
    await expect(menu.getByRole("link", { name: "Deutsch" })).toHaveAttribute("hreflang", "de");
    await expect(menu.getByRole("link", { name: "Deutsch" })).toHaveAttribute("lang", "de");
    await expect(menu.getByRole("link", { name: "Shqip" })).toHaveAttribute("href", "/llogarit-cmimin");
    await expect(menu.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en/price-calculator");
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("opens the same page in German and on to English, keeping the estimator's selections", async ({ page }) => {
    await page.goto("/llogarit-cmimin?paketa=business&faqe=8&shtesa=booking");
    await page.waitForLoadState("networkidle");
    await (await openSwitcher(page, /Ndrysho gjuhën/, "Gjuha")).getByRole("link", { name: "Deutsch" }).click();

    await expect(page).toHaveURL(/\/de\/preisrechner\?paketa=business&faqe=8&shtesa=booking$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.getByRole("radio", { name: /Business/ })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: /Buchungen oder Termine/ })).toBeChecked();
    await expect.poll(async () => (await page.getByTestId("estimate-total").first().textContent())?.replace(/\s/g, " ").trim()).toBe("689 €");

    await (await openSwitcher(page, /Sprache wechseln/, "Sprache")).getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/price-calculator\?paketa=business&faqe=8&shtesa=booking$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect.poll(async () => (await page.getByTestId("estimate-total").first().textContent())?.trim()).toBe("€689");

    await (await openSwitcher(page, /Change language/, "Language")).getByRole("link", { name: "Deutsch" }).click();
    await expect(page).toHaveURL(/\/de\/preisrechner\?paketa=business&faqe=8&shtesa=booking$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
  });

  test("keeps the section anchor", async ({ page }) => {
    await page.goto("/sherbimet#online-shop");
    await page.waitForLoadState("networkidle");
    await (await openSwitcher(page, /Ndrysho gjuhën/, "Gjuha")).getByRole("link", { name: "Deutsch" }).click();
    await expect(page).toHaveURL(/\/de\/leistungen#online-shop$/);
    // Next.js keeps the previous page hidden in the DOM; check the visible one.
    await expect(page.locator("#online-shop").filter({ visible: true })).toBeInViewport();
  });

  test("keeps the project filter", async ({ page }) => {
    // The filter value is the service anchor (src/lib/projects.ts), the same in every language.
    await page.goto("/en/projects?kategoria=online-shop");
    await page.waitForLoadState("networkidle");
    await (await openSwitcher(page, /Change language/, "Language")).getByRole("link", { name: "Deutsch" }).click();
    await expect(page).toHaveURL(/\/de\/projekte\?kategoria=online-shop$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.getByRole("button", { name: /^Onlineshop/ })).toHaveAttribute("aria-pressed", "true");
  });

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("is in the menu and opens the equivalent German project page", async ({ page }) => {
      await page.goto("/projektet/klinike-dentare");
      await page.waitForLoadState("networkidle");
      await page.getByRole("button", { name: "Hap menynë" }).click();
      const dialog = page.getByRole("dialog", { name: "Menyja" });
      const languages = dialog.getByRole("navigation", { name: "Gjuha" });
      await expect(languages.getByRole("link")).toHaveText(["Shqip", "English", "Deutsch"]);
      await languages.getByRole("link", { name: "Deutsch" }).click();
      await expect(page).toHaveURL(/\/de\/projekte\/klinike-dentare$/);
      await expect(page.getByRole("heading", { level: 1, name: "Zahnarztpraxis" })).toBeVisible();
      await expect(dialog).toBeHidden();

      // The German menu, with Deutsch marked as current.
      await page.getByRole("button", { name: "Menü öffnen" }).click();
      const germanDialog = page.getByRole("dialog", { name: "Menü" });
      await expect(germanDialog.getByRole("navigation", { name: "Sprache" }).getByRole("link", { name: "Deutsch" })).toHaveAttribute("aria-current", "true");
      await expect(germanDialog.getByRole("link", { name: "Leistungen" })).toHaveAttribute("href", "/de/leistungen");
    });
  });

  test("carries the quote form's selections and typed details over", async ({ page }) => {
    await page.goto("/kontakt?paketa=business&faqe=7&shtesa=analytics&vleresim=1");
    await page.waitForLoadState("networkidle");
    const form = page.getByRole("form", { name: "Kërkesë për ofertë" });
    await form.getByLabel("Emri dhe mbiemri").fill("Lena Weber");
    await form.getByLabel("Email", { exact: true }).fill("lena@example.com");

    await (await openSwitcher(page, /Ndrysho gjuhën/, "Gjuha")).getByRole("link", { name: "Deutsch" }).click();

    await expect(page).toHaveURL(/\/de\/kontakt\?paketa=business&faqe=7&shtesa=analytics&vleresim=1$/);
    const deForm = page.getByRole("form", { name: "Angebotsanfrage" });
    await expect(deForm.getByLabel("Vor- und Nachname")).toHaveValue("Lena Weber");
    await expect(deForm.getByLabel("E-Mail", { exact: true })).toHaveValue("lena@example.com");
    await expect(deForm.getByLabel("Paket")).toHaveValue("business");
    await expect.poll(async () => (await deForm.getByTestId("quote-estimate-total").textContent())?.replace(/\s/g, " ").trim()).toBe("ab 499 €");
    await expect(deForm.getByText("Ihre Schätzung aus dem Preisrechner")).toBeVisible();
  });
});

test.describe("quote form in German", () => {
  const MOCK_RESEND_URL = `http://127.0.0.1:${process.env.MOCK_RESEND_PORT ?? 3199}`;

  async function emailsFrom(request: APIRequestContext, address: string) {
    const all = (await (await request.get(`${MOCK_RESEND_URL}/emails`)).json()) as Array<{ reply_to: string; text: string; subject: string }>;
    return all.filter((email) => email.reply_to === address);
  }

  test("validates in German", async ({ page }) => {
    await page.goto(de.contact);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Anfrage senden" }).click();
    const summary = page.locator("#quote-error-summary");
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("Bitte korrigieren Sie 7 Felder:");
    await expect(page.getByLabel("Vor- und Nachname")).toHaveAccessibleDescription("Geben Sie Ihren Namen ein.");
    await page.getByLabel("E-Mail", { exact: true }).fill("keine-adresse");
    await page.getByRole("button", { name: "Anfrage senden" }).click();
    await expect(page.getByLabel("E-Mail", { exact: true })).toHaveAccessibleDescription(/Geben Sie eine gültige E-Mail-Adresse ein/);
  });

  test("sends the request; the owner email stays Albanian and names German as the customer's language", async ({ page, request }) => {
    const email = `lena+${Date.now().toString(36)}@example.com`;
    await page.goto(`${de.contact}?paketa=business&faqe=7&vleresim=1`);
    await page.waitForLoadState("networkidle");
    const openedAt = Date.now();
    const form = page.getByRole("form", { name: "Angebotsanfrage" });
    await form.getByLabel("Vor- und Nachname").fill("Lena Weber");
    await form.getByLabel("E-Mail", { exact: true }).fill(email);
    await form.getByLabel("Ungefähres Budget").selectOption("300-600");
    await form.getByLabel("Gewünschter Zeitrahmen").selectOption("flexible");
    await form.getByLabel("Projektbeschreibung").fill("Eine Unternehmenswebsite für unser Restaurant, mit Speisekarte und Reservierungen.");
    const remaining = quoteProtection.minFillMs + 300 - (Date.now() - openedAt);
    if (remaining > 0) await page.waitForTimeout(remaining);
    await form.getByRole("button", { name: "Anfrage senden" }).click();

    await expect(page.getByRole("heading", { name: "Vielen Dank, Ihre Anfrage wurde gesendet!" })).toBeFocused();
    await expect(page.getByText(`antworten Ihnen an ${email}`)).toBeVisible();
    const [sent] = await emailsFrom(request, email);
    expect(sent!.subject).toMatch(/^Kërkesë për ofertë: Lena Weber/);
    const text = sent!.text.replace(/\s/g, " ");
    expect(text).toContain("Gjuha e klientit: Gjermanisht");
    expect(text).toContain("Numri i faqeve: 7 faqe (5 të përfshira në paketë)");
    // Recalculated on the server, in the same amount as in every other language.
    expect(text).toContain("Totali orientues: nga 459 €");
  });
});

test.describe("404 in German", () => {
  test("unknown German URLs get the German 404 page with status 404, complete without JavaScript", async ({ page, request }) => {
    for (const path of ["/de/gibt-es-nicht", "/de/projekte/gibt-es-nicht", "/de/leistungen/extra", "/de/services"]) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(404);
      const html = await response.text();
      expect(html, path).toContain('<html lang="de"');
      expect(html, path).toContain("<title>Seite nicht gefunden | WideCode</title>");
      expect(html, path).toMatch(/<h1[^>]*>Seite nicht gefunden<\/h1>/);
      expect(html, path).toContain('aria-label="Hauptnavigation"');
      expect(html, path).toContain('href="/de/leistungen"');
      expect(html, path).toContain('name="robots" content="noindex');
      // Never cached as a shared page: its language depends on the URL.
      expect(response.headers()["cache-control"], path).toMatch(/private|no-store/);
    }

    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/de/gibt-es-nicht");
    await expect(page.getByRole("heading", { level: 1, name: "Seite nicht gefunden" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page).toHaveTitle("Seite nicht gefunden | WideCode");
    await page.getByRole("link", { name: "Zurück zur Startseite" }).click();
    await expect(page).toHaveURL(/\/de$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    expect(errors).toEqual([]);
  });

  test("the switcher on a German 404 offers each language's home page", async ({ page }) => {
    await page.goto("/de/gibt-es-nicht");
    await page.waitForLoadState("networkidle");
    const menu = await openSwitcher(page, /Sprache wechseln/, "Sprache");
    await expect(menu.getByRole("link", { name: "Shqip" })).toHaveAttribute("href", "/");
    await expect(menu.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
  });

  test("a client sending its own language header cannot change the 404's language", async ({ request }) => {
    const response = await request.get("/nuk-ekziston", { headers: { "x-widecode-locale": "de" }, maxRedirects: 0 });
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain('<html lang="sq"');
  });
});

test.describe("German SEO", () => {
  test("each German page names its own canonical URL and every language version", async ({ page }) => {
    for (const [sqPath, enPath, dePath] of [
      ["/", "/en", "/de"],
      ["/llogarit-cmimin", "/en/price-calculator", "/de/preisrechner"],
      ["/rreth-nesh", "/en/about", "/de/ueber-uns"],
      ["/projektet/dyqan-veshjesh", "/en/projects/dyqan-veshjesh", "/de/projekte/dyqan-veshjesh"],
    ] as const) {
      await page.goto(dePath);
      const head = page.locator("head");
      // Compared as normalized URLs: Next.js writes the home page without the trailing slash.
      const href = async (selector: string) => new URL((await head.locator(selector).getAttribute("href")) ?? "").href;
      const url = (p: string) => new URL(p, E2E_SITE_URL).href;
      expect(await href('link[rel="canonical"]'), dePath).toBe(url(dePath));
      expect(await href('link[rel="alternate"][hreflang="sq"]'), dePath).toBe(url(sqPath));
      expect(await href('link[rel="alternate"][hreflang="en"]'), dePath).toBe(url(enPath));
      expect(await href('link[rel="alternate"][hreflang="de"]'), dePath).toBe(url(dePath));
      expect(await href('link[rel="alternate"][hreflang="x-default"]'), dePath).toBe(url(sqPath));
      await expect(head.locator('meta[property="og:locale"]'), dePath).toHaveAttribute("content", "de_DE");
      const alternates = await head.locator('meta[property="og:locale:alternate"]').evaluateAll((tags) => tags.map((tag) => tag.getAttribute("content")));
      expect(alternates.sort(), dePath).toEqual(["en_US", "sq_AL"]);
      await expect(head.locator('meta[property="og:url"]'), dePath).toHaveAttribute("content", url(dePath).replace(/\/$/, ""));
      await expect(head.locator('meta[property="og:image"]'), dePath).toHaveAttribute("content", /\/de\/opengraph-image$/);
      await expect(head.locator('meta[property="og:image:alt"]'), dePath).toHaveAttribute("content", /Webentwicklung aus dem Kosovo/);
    }
  });

  test("the Albanian page lists the German version too", async ({ page }) => {
    await page.goto("/cmimet");
    await expect(page.locator('head link[rel="alternate"][hreflang="de"]')).toHaveAttribute("href", `${E2E_SITE_URL}/de/preise`);
  });

  test("German titles and descriptions", async ({ page }) => {
    await page.goto(de.pricing);
    await expect(page).toHaveTitle("Preise für Websites und Onlineshops | WideCode");
    await expect(page.locator('head meta[name="description"]')).toHaveAttribute("content", /^Pakete mit transparenten Einstiegspreisen/);
    await page.goto(de.home);
    await expect(page).toHaveTitle("Websites und Onlineshops nach Maß aus dem Kosovo | WideCode");
    await page.goto(`${de.projects}/klinike-dentare`);
    await expect(page).toHaveTitle("Zahnarztpraxis – Website-Konzept | WideCode");
  });

  test("the sitemap lists every German page with its alternates, and every URL exists", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    const german = urls.filter((url) => url === `${E2E_SITE_URL}/de` || url.startsWith(`${E2E_SITE_URL}/de/`));
    expect(german).toHaveLength(germanPages.length);
    expect(urls).toHaveLength(germanPages.length * 3);
    expect(xml).toContain(`hreflang="de" href="${E2E_SITE_URL}/de/preisrechner"`);
    expect(xml).toContain(`hreflang="de" href="${E2E_SITE_URL}/de/projekte/klinike-dentare"`);
    for (const url of german) {
      expect((await request.get(new URL(url).pathname, { maxRedirects: 0 })).status(), url).toBe(200);
    }
  });

  test("German has its own social image", async ({ request }) => {
    const sq = await request.get("/opengraph-image");
    const english = await request.get("/en/opengraph-image");
    const german = await request.get("/de/opengraph-image");
    expect(german.status()).toBe(200);
    expect(german.headers()["content-type"]).toBe("image/png");
    expect(Buffer.compare(await german.body(), await sq.body())).not.toBe(0);
    expect(Buffer.compare(await german.body(), await english.body())).not.toBe(0);
  });

  test("structured data is in German on German pages", async ({ page }) => {
    await page.goto(de.home);
    const graphs = await page.locator('script[type="application/ld+json"]').allTextContents();
    const website = graphs.map((g) => JSON.parse(g)["@graph"]).flat().find((node) => node?.["@type"] === "WebSite");
    expect(website).toMatchObject({ inLanguage: "de", url: `${E2E_SITE_URL}/de` });

    await page.goto(de.faq);
    const faq = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((g) => JSON.parse(g)).find((d) => d["@type"] === "FAQPage");
    expect(faq.inLanguage).toBe("de");
    expect(faq.mainEntity[0].name).toBe("Was kostet eine Website?");
    expect(faq.mainEntity[0].acceptedAnswer.text).toMatch(/ab 199\s€/);
  });
});

test.describe("scroll reveal on German pages", () => {
  test("never changes the server-rendered markup", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      const changes: string[] = [];
      (window as unknown as { __mutations: string[] }).__mutations = changes;
      new MutationObserver((records) => {
        for (const record of records) {
          const target = record.target as Element;
          if (target.classList.contains("reveal") || target === document.documentElement) changes.push(`${target.tagName} [${record.attributeName}]`);
        }
      }).observe(document, { attributes: true, subtree: true });
    });
    await page.goto(de.home);
    await page.waitForLoadState("networkidle");
    for (let i = 0; i < 30; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => (window as unknown as { __mutations: string[] }).__mutations)).toEqual([]);
  });
});
