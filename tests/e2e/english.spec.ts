import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { projectSlugs } from "../../src/config/projects";
import { quoteProtection } from "../../src/config/quote";
import { mainNav } from "../../src/config/routes";
import { localizedRoutes } from "../../src/i18n/routing";
import { E2E_SITE_URL } from "./e2e-site";

/**
 * The English site (Phase B): routes, content language, the language switcher,
 * prices, the quote form, 404s and SEO. The e2e build has the test domain
 * configured, so canonical URLs, hreflang and the sitemap are published.
 */
const en = localizedRoutes.en;
const englishPages = [...Object.values(en), ...projectSlugs.map((slug) => `${en.projects}/${slug}`)];

let visitor = 0;
test.beforeEach(async ({ page }, testInfo) => {
  visitor += 1;
  // Own client address per test, so the quote form's rate limit never interferes.
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `192.0.${100 + (testInfo.workerIndex % 50)}.${(visitor % 250) + 1}` });
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

test.describe("English pages", () => {
  test("every page is prerendered in English at its own URL", async ({ request }) => {
    for (const path of englishPages) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(200);
      expect(response.headers()["x-nextjs-prerender"], path).toBeTruthy();
      const html = await response.text();
      expect(html, path).toContain('<html lang="en"');
      // Links stay in English; the internal segment and Albanian slugs never leak.
      expect(html, path).not.toMatch(/href="\/(sq|en\/(sherbimet|projektet|cmimet|kontakt))(\/|"|\?|#)/);
    }
  });

  test("the navigation marks the current page already in the prerendered HTML", async ({ request }) => {
    for (const key of mainNav) {
      const html = await (await request.get(en[key])).text();
      const current = (html.match(/<a\s[^>]*>/g) ?? []).filter((tag) => tag.includes('aria-current="page"'));
      expect(current.length, key).toBeGreaterThan(0);
      expect(current.every((tag) => tag.includes(`href="${en[key]}"`)), key).toBe(true);
    }
  });

  test("the content is English (outside the Albanian concept previews) and hydrates without errors", async ({ page }) => {
    test.slow(); // visits every English page
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of englishPages) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toHaveCount(1);
      const text = await mainText(page);
      expect(text, path).not.toMatch(/[ëçËÇ]/);
    }
    expect(errors).toEqual([]);
  });

  test("internal Albanian slugs under /en redirect to the English URL", async ({ request }) => {
    const response = await request.get("/en/sherbimet?a=1", { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(new URL(response.headers().location!, "http://localhost").pathname).toBe("/en/services");
  });
});

test.describe("prices", () => {
  test("the same packages and amounts in both languages, in each language's notation", async ({ page }) => {
    await page.goto(en.pricing);
    for (const [name, price] of [["Starter", "€199"], ["Business", "€399"], ["Professional", "€699"], ["E-commerce", "€999"]]) {
      await expect(page.getByRole("article", { name, exact: true })).toContainText(price!);
    }
    await expect(page.getByText("On request").first()).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/\d\s€/);
  });

  test("the calculator gives the same total in English as in Albanian", async ({ page }) => {
    const query = "?paketa=business&faqe=8&shtesa=multilingual,booking,analytics";
    await page.goto(`${en.estimator}${query}`);
    await page.waitForLoadState("networkidle");
    await expect.poll(async () => (await page.getByTestId("estimate-total").first().textContent())?.trim()).toBe("€879");
    await expect(page.getByRole("link", { name: "Request a quote with this estimate" })).toHaveAttribute(
      "href",
      "/en/contact?paketa=business&faqe=8&shtesa=multilingual%2Cbooking%2Canalytics&vleresim=1",
    );
  });
});

test.describe("language switcher", () => {
  test("is a keyboard-accessible menu that marks the current language and offers all three", async ({ page }) => {
    await page.goto("/llogarit-cmimin");
    await page.waitForLoadState("networkidle");
    const button = page.getByRole("button", { name: "Ndrysho gjuhën (tani: Shqip)" });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("navigation", { name: "Gjuha" }).first();
    await expect(menu.getByRole("link")).toHaveText(["Shqip", "English", "Deutsch"]);
    await expect(menu.getByRole("link", { name: "Shqip" })).toHaveAttribute("aria-current", "true");
    await expect(menu.getByRole("link", { name: "English" })).toHaveAttribute("hreflang", "en");
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("opens the same page in English, keeping the estimator's selections", async ({ page }) => {
    await page.goto("/llogarit-cmimin?paketa=business&faqe=8&shtesa=booking");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /Ndrysho gjuhën/ }).click();
    await page.getByRole("navigation", { name: "Gjuha" }).first().getByRole("link", { name: "English" }).click();

    await expect(page).toHaveURL(/\/en\/price-calculator\?paketa=business&faqe=8&shtesa=booking$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("radio", { name: /Business/ })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: /Bookings or appointments/ })).toBeChecked();
    await expect.poll(async () => (await page.getByTestId("estimate-total").first().textContent())?.trim()).toBe("€689");

    // And back, still the same choices.
    await page.getByRole("button", { name: "Change language (current: English)" }).click();
    await page.getByRole("navigation", { name: "Language" }).first().getByRole("link", { name: "Shqip" }).click();
    await expect(page).toHaveURL(/\/llogarit-cmimin\?paketa=business&faqe=8&shtesa=booking$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "sq");
  });

  test("keeps the section anchor", async ({ page }) => {
    await page.goto("/sherbimet#online-shop");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /Ndrysho gjuhën/ }).click();
    await page.getByRole("navigation", { name: "Gjuha" }).first().getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/services#online-shop$/);
    // Next.js keeps the previous (Albanian) page hidden in the DOM; check the visible one.
    await expect(page.locator("#online-shop").filter({ visible: true })).toBeInViewport();
  });

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("is in the menu and opens the equivalent project page", async ({ page }) => {
      await page.goto("/projektet/klinike-dentare");
      await page.waitForLoadState("networkidle");
      await page.getByRole("button", { name: "Hap menynë" }).click();
      const dialog = page.getByRole("dialog", { name: "Menyja" });
      const languages = dialog.getByRole("navigation", { name: "Gjuha" });
      await expect(languages.getByRole("link", { name: "Shqip" })).toHaveAttribute("aria-current", "true");
      await languages.getByRole("link", { name: "English" }).click();
      await expect(page).toHaveURL(/\/en\/projects\/klinike-dentare$/);
      await expect(page.getByRole("heading", { level: 1, name: "Dental clinic" })).toBeVisible();
      await expect(dialog).toBeHidden();
    });
  });

  test("carries the quote form's selections and typed details over", async ({ page }) => {
    await page.goto("/kontakt?paketa=business&faqe=7&shtesa=analytics&vleresim=1");
    await page.waitForLoadState("networkidle");
    const form = page.getByRole("form", { name: "Kërkesë për ofertë" });
    await form.getByLabel("Emri dhe mbiemri").fill("Jane Smith");
    await form.getByLabel("Email", { exact: true }).fill("jane@example.com");

    await page.getByRole("button", { name: /Ndrysho gjuhën/ }).click();
    await page.getByRole("navigation", { name: "Gjuha" }).first().getByRole("link", { name: "English" }).click();

    await expect(page).toHaveURL(/\/en\/contact\?paketa=business&faqe=7&shtesa=analytics&vleresim=1$/);
    const enForm = page.getByRole("form", { name: "Quote request" });
    await expect(enForm.getByLabel("Full name")).toHaveValue("Jane Smith");
    await expect(enForm.getByLabel("Email", { exact: true })).toHaveValue("jane@example.com");
    await expect(enForm.getByLabel("Package")).toHaveValue("business");
    await expect.poll(async () => (await enForm.getByTestId("quote-estimate-total").textContent())?.trim()).toBe("from €499");
    await expect(enForm.getByText("Your estimate from the calculator")).toBeVisible();
  });
});

test.describe("quote form in English", () => {
  const MOCK_RESEND_URL = `http://127.0.0.1:${process.env.MOCK_RESEND_PORT ?? 3199}`;

  async function emailsFrom(request: APIRequestContext, address: string) {
    const all = (await (await request.get(`${MOCK_RESEND_URL}/emails`)).json()) as Array<{ reply_to: string; text: string; subject: string }>;
    return all.filter((email) => email.reply_to === address);
  }

  test("validates in English", async ({ page }) => {
    await page.goto(en.contact);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Send request" }).click();
    const summary = page.locator("#quote-error-summary");
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("Please correct 7 fields:");
    await expect(page.getByLabel("Full name")).toHaveAccessibleDescription("Enter your name.");
  });

  test("sends the request; the owner email stays Albanian and names the customer's language", async ({ page, request }) => {
    const email = `jane+${Date.now().toString(36)}@example.com`;
    await page.goto(`${en.contact}?paketa=business&faqe=7&vleresim=1`);
    await page.waitForLoadState("networkidle");
    const openedAt = Date.now();
    const form = page.getByRole("form", { name: "Quote request" });
    await form.getByLabel("Full name").fill("Jane Smith");
    await form.getByLabel("Email", { exact: true }).fill(email);
    await form.getByLabel("Approximate budget").selectOption("300-600");
    await form.getByLabel("Desired timeline").selectOption("flexible");
    await form.getByLabel("Project description").fill("A business website for our restaurant, with a menu and bookings.");
    const remaining = quoteProtection.minFillMs + 300 - (Date.now() - openedAt);
    if (remaining > 0) await page.waitForTimeout(remaining);
    await form.getByRole("button", { name: "Send request" }).click();

    await expect(page.getByRole("heading", { name: "Thank you, your request has been sent!" })).toBeFocused();
    const [sent] = await emailsFrom(request, email);
    expect(sent!.subject).toMatch(/^Kërkesë për ofertë: Jane Smith/);
    const text = sent!.text.replace(/\s/g, " ");
    expect(text).toContain("Gjuha e klientit: Anglisht");
    expect(text).toContain("Numri i faqeve: 7 faqe (5 të përfshira në paketë)");
    expect(text).toContain("Totali orientues: nga 459 €");
  });
});

test.describe("404 in English", () => {
  test("unknown English URLs get the English 404 page with status 404", async ({ page, request }) => {
    const response = await request.get("/en/does-not-exist", { maxRedirects: 0 });
    expect(response.status()).toBe(404);
    // Rendered on the server in English: complete without JavaScript.
    const html = await response.text();
    expect(html).toContain('<html lang="en"');
    expect(html).toContain("<title>Page not found | WideCode</title>");
    expect(html).toMatch(/<h1[^>]*>Page not found<\/h1>/);
    expect(html).toContain('aria-label="Main navigation"');
    expect(html).not.toContain("Faqja nuk u gjet");
    expect(html).toContain('name="robots" content="noindex');

    // And in the browser, without hydration errors.
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/en/does-not-exist");
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("Page not found | WideCode");
    await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/en");
    expect(errors).toEqual([]);
  });

  test("unknown languages still get the Albanian 404", async ({ request }) => {
    for (const path of ["/fr", "/es/servicios", "/en-us/services"]) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(404);
      expect(await response.text(), path).toContain('<html lang="sq"');
    }
  });
});

test.describe("multilingual SEO", () => {
  test("each page names its own canonical URL and every language version", async ({ page }) => {
    test.slow(); // six pages
    for (const [sqPath, enPath] of [["/", "/en"], ["/llogarit-cmimin", "/en/price-calculator"], ["/projektet/dyqan-veshjesh", "/en/projects/dyqan-veshjesh"]] as const) {
      for (const [path, locale] of [[sqPath, "sq"], [enPath, "en"]] as const) {
        await page.goto(path);
        const head = page.locator("head");
        // Compared as normalized URLs: Next.js writes the home page without the trailing slash.
        const href = async (selector: string) => new URL((await head.locator(selector).getAttribute("href")) ?? "").href;
        const url = (p: string) => new URL(p, E2E_SITE_URL).href;
        expect(await href('link[rel="canonical"]'), path).toBe(url(path));
        expect(await href('link[rel="alternate"][hreflang="sq"]'), path).toBe(url(sqPath));
        expect(await href('link[rel="alternate"][hreflang="en"]'), path).toBe(url(enPath));
        expect(await href('link[rel="alternate"][hreflang="x-default"]'), path).toBe(url(sqPath));
        await expect(head.locator('meta[property="og:locale"]'), path).toHaveAttribute("content", locale === "en" ? "en_US" : "sq_AL");
        const alternates = await head.locator('meta[property="og:locale:alternate"]').evaluateAll((tags) => tags.map((tag) => tag.getAttribute("content")));
        expect(alternates.sort(), path).toEqual(locale === "en" ? ["de_DE", "sq_AL"] : ["de_DE", "en_US"]);
        expect(await head.locator('link[rel="alternate"][hreflang="de"]').count(), path).toBe(1);
        await expect(head.locator('meta[property="og:image"]'), path).toHaveAttribute("content", locale === "en" ? /\/en\/opengraph-image$/ : /\.example\/opengraph-image$/);
      }
    }
  });

  test("the sitemap lists the English pages with their alternates, and every URL exists", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    expect(urls).toContain(`${E2E_SITE_URL}/en/price-calculator`);
    expect(urls).toContain(`${E2E_SITE_URL}/llogarit-cmimin`);
    expect(urls.filter((url) => url.startsWith(`${E2E_SITE_URL}/en`))).toHaveLength(englishPages.length);
    expect(xml).toContain(`hreflang="en" href="${E2E_SITE_URL}/en/price-calculator"`);
    expect(xml).toContain(`hreflang="x-default" href="${E2E_SITE_URL}/llogarit-cmimin"`);
    expect(xml).toContain(`hreflang="de" href="${E2E_SITE_URL}/de/preisrechner"`);
    for (const url of urls.filter((u) => u.startsWith(`${E2E_SITE_URL}/en`))) {
      expect((await request.get(new URL(url).pathname, { maxRedirects: 0 })).status(), url).toBe(200);
    }
  });

  test("each language has its own social image", async ({ request }) => {
    const sq = await request.get("/opengraph-image");
    const english = await request.get("/en/opengraph-image");
    for (const response of [sq, english]) {
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toBe("image/png");
    }
    expect(Buffer.compare(await sq.body(), await english.body())).not.toBe(0);
  });

  test("structured data is in English on English pages", async ({ page }) => {
    await page.goto(en.home);
    const graphs = await page.locator('script[type="application/ld+json"]').allTextContents();
    const website = graphs.map((g) => JSON.parse(g)["@graph"]).flat().find((node) => node?.["@type"] === "WebSite");
    expect(website).toMatchObject({ inLanguage: "en", url: `${E2E_SITE_URL}/en` });
  });
});

test.describe("scroll reveal on English pages", () => {
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
    await page.goto(en.home);
    await page.waitForLoadState("networkidle");
    for (let i = 0; i < 30; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => (window as unknown as { __mutations: string[] }).__mutations)).toEqual([]);
  });
});
