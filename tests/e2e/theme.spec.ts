import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Dark and light theme (src/lib/theme.ts, src/styles/theme.css): the system
 * setting by default, an explicit choice that persists, applied before the
 * first paint without touching React's markup, in every language.
 */
const DARK_BG = "rgb(5, 7, 15)";
const LIGHT_BG = "rgb(244, 246, 251)";
const toggles = {
  "/": { toLight: "Kalo në temën e çelët", toDark: "Kalo në temën e errët" },
  "/en": { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
  "/de": { toLight: "Zum hellen Design wechseln", toDark: "Zum dunklen Design wechseln" },
} as const;

const themeMeta = (page: Page) => page.evaluate(() => document.head.querySelector<HTMLMetaElement>('meta[name="widecode-theme"]')?.content ?? null);
const background = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

async function expectTheme(page: Page, theme: "dark" | "light") {
  await expect.poll(() => themeMeta(page)).toBe(theme);
  await expect.poll(() => background(page)).toBe(theme === "light" ? LIGHT_BG : DARK_BG);
  // The matching logo is shown in the header.
  const shown = page.getByRole("banner").getByRole("img", { name: "WideCode" });
  await expect(shown).toHaveCount(1);
  await expect(shown).toHaveAttribute("src", new RegExp(theme === "light" ? "logo-light" : "logo-on-dark"));
}

/**
 * Waits until React has hydrated an element (it then holds React's props, incl. its click
 * handler). networkidle only means the scripts are loaded: on a busy machine a click right
 * after it can land before hydration and be lost, like on any button before React runs.
 */
async function hydrated(locator: Locator) {
  await expect.poll(() => locator.evaluate((el) => Object.keys(el).some((key) => key.startsWith("__reactProps")))).toBe(true);
  return locator;
}

/** Records changes to <html>/<body> attributes and page errors from the very start of each load. */
async function watchMarkup(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/status of 404/.test(message.text())) errors.push(message.text());
  });
  await page.addInitScript(() => {
    const changes: string[] = [];
    (window as unknown as { __rootChanges: string[] }).__rootChanges = changes;
    new MutationObserver((records) => {
      for (const record of records) {
        const target = record.target as Element;
        if (target === document.documentElement || target === document.body) changes.push(`${target.tagName} [${record.attributeName}]`);
      }
    }).observe(document, { attributes: true, subtree: true });
  });
  return {
    errors,
    rootChanges: () => page.evaluate(() => (window as unknown as { __rootChanges: string[] }).__rootChanges),
  };
}

test.describe("default theme", () => {
  test("follows the system setting: light", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/de");
    await expectTheme(page, "light");
    await expect(page.getByRole("button", { name: toggles["/de"].toDark })).toBeVisible();
    await context.close();
  });

  test("follows the system setting: dark", async ({ page }) => {
    await page.goto("/en");
    await expectTheme(page, "dark");
    await expect(page.getByRole("button", { name: toggles["/en"].toLight })).toBeVisible();
  });

  test("follows a change of the system setting while there is no saved choice", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expectTheme(page, "dark");
    await page.emulateMedia({ colorScheme: "light" });
    await expectTheme(page, "light");
    await page.emulateMedia({ colorScheme: "dark" });
    await expectTheme(page, "dark");
  });

  test("is applied before the first paint by a script in <head>, and the pages stay prerendered", async ({ request }) => {
    for (const path of ["/", "/en/pricing", "/de/preisrechner"]) {
      const response = await request.get(path);
      expect(response.headers()["x-nextjs-prerender"], path).toBeTruthy();
      const html = await response.text();
      const head = html.slice(html.indexOf("<head"), html.indexOf("</head>"));
      expect(head, path).toContain("widecode-theme");
      expect(head, path).toMatch(/<script>\(function\(\)\{try\{var t;try\{t=localStorage\.getItem\("widecode-theme"\)/);
      // The theme is not part of the server HTML (it never differs between visitors).
      expect(html, path).not.toMatch(/<meta name="widecode-theme"/);
      expect(html.match(/<html[^>]*>/)?.[0], path).not.toMatch(/theme|dark|light/);
    }
  });
});

test.describe("theme toggle", () => {
  for (const [home, labels] of Object.entries(toggles)) {
    test(`${home}: switches, persists across reloads, and labels its action`, async ({ page }) => {
      test.slow(); // a load and two reloads of a home page: over 30s on a busy machine
      const watch = await watchMarkup(page);
      await page.goto(home);
      await page.waitForLoadState("networkidle");
      await expectTheme(page, "dark");

      await (await hydrated(page.getByRole("button", { name: labels.toLight }))).click();
      await expectTheme(page, "light");
      await expect(page.getByRole("button", { name: labels.toDark })).toBeVisible();
      expect(await page.evaluate(() => localStorage.getItem("widecode-theme"))).toBe("light");

      await page.reload();
      await expectTheme(page, "light");
      await (await hydrated(page.getByRole("button", { name: labels.toDark }))).click();
      await expectTheme(page, "dark");
      await page.reload();
      await expectTheme(page, "dark");

      // Neither the pre-paint script nor the toggle touch <html> or <body>; no hydration errors.
      expect(await watch.rootChanges()).toEqual([]);
      expect(watch.errors).toEqual([]);
    });
  }

  test("a saved choice wins over the system setting", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    await context.addInitScript(() => localStorage.setItem("widecode-theme", "dark"));
    const page = await context.newPage();
    await page.goto("/de/leistungen");
    await expectTheme(page, "dark");
    await page.emulateMedia({ colorScheme: "dark" });
    await page.emulateMedia({ colorScheme: "light" });
    await expectTheme(page, "dark");
    await context.close();
  });

  test("stays after client-side navigation and language switches, and on the 404 page", async ({ page }) => {
    const watch = await watchMarkup(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await (await hydrated(page.getByRole("button", { name: toggles["/"].toLight }))).click();
    await expectTheme(page, "light");

    await page.getByRole("navigation", { name: "Navigimi kryesor" }).getByRole("link", { name: "Çmimet" }).click();
    await expect(page).toHaveURL(/\/cmimet$/);
    await expectTheme(page, "light");

    await page.getByRole("button", { name: /Ndrysho gjuhën/ }).click();
    await page.getByRole("navigation", { name: "Gjuha" }).first().getByRole("link", { name: "Deutsch" }).click();
    await expect(page).toHaveURL(/\/de\/preise$/);
    await expectTheme(page, "light");
    await expect(page.getByRole("button", { name: toggles["/de"].toDark })).toBeVisible();

    await page.getByRole("button", { name: /Sprache wechseln/ }).click();
    await page.getByRole("navigation", { name: "Sprache" }).first().getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/pricing$/);
    await expectTheme(page, "light");

    await page.goto("/en/does-not-exist");
    await expectTheme(page, "light");
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    expect(await watch.rootChanges()).toEqual([]);
    expect(watch.errors).toEqual([]);
  });

  test("works from the keyboard with a visible focus indicator", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    const toggle = await hydrated(page.getByRole("button", { name: toggles["/en"].toLight }));
    await page.getByRole("button", { name: /Change language/ }).focus();
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await expectTheme(page, "light");
    await expect(page.getByRole("button", { name: toggles["/en"].toDark })).toBeFocused();
  });

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 320, height: 740 } });

    test("is in the header next to the menu, with a comfortable touch target", async ({ page }) => {
      await page.goto("/de");
      await page.waitForLoadState("networkidle");
      const toggle = await hydrated(page.getByRole("button", { name: toggles["/de"].toLight }));
      await expect(toggle).toBeVisible();
      const box = (await toggle.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x + box.width).toBeLessThanOrEqual(320);
      await toggle.click();
      await expectTheme(page, "light");
    });
  });
});

test.describe("header with the theme toggle", () => {
  // From lg the full navigation, language menu, toggle and CTA share one row; the logo differs per theme.
  for (const width of [1024, 1100, 1279, 1280]) {
    test(`fits on one line at ${width}px in every language and both themes`, async ({ page }) => {
      test.slow(); // six page loads
      await page.setViewportSize({ width, height: 600 });
      for (const scheme of ["dark", "light"] as const) {
        await page.emulateMedia({ colorScheme: scheme });
        for (const home of Object.keys(toggles)) {
          await page.goto(home);
          await expect.poll(() => themeMeta(page)).toBe(scheme);
          const [rowOverflow, tallest] = await page.evaluate(() => {
            const row = document.querySelector("header > div")!;
            const heights = [...row.querySelectorAll("nav a, a, button")].filter((el) => el.getClientRects().length > 0).map((el) => el.getBoundingClientRect().height);
            return [row.scrollWidth - row.clientWidth, Math.max(...heights)];
          });
          expect(rowOverflow, `${home} ${scheme}`).toBeLessThanOrEqual(0);
          // Single-line labels: no navigation item or button grows beyond one line.
          expect(tallest, `${home} ${scheme}`).toBeLessThanOrEqual(48);
        }
      }
    });
  }
});

test.describe("light theme", () => {
  test.use({ colorScheme: "light" });

  const pages = [
    "/", "/sherbimet", "/cmimet", "/llogarit-cmimin", "/projektet/klinike-dentare", "/kontakt", "/rreth-nesh", "/pyetje-te-shpeshta",
    "/en", "/en/pricing", "/en/price-calculator", "/en/contact", "/en/projects",
    "/de", "/de/leistungen", "/de/preisrechner", "/de/kontakt", "/de/ueber-uns", "/de/faq", "/de/gibt-es-nicht",
  ];

  // 1024px: the full navigation, language menu, theme toggle and CTA share the header row.
  for (const width of [320, 390, 768, 1024, 1280]) {
    test(`no page widens the screen at ${width}px, and the header fits`, async ({ page }) => {
      test.slow(); // twenty pages
      await page.setViewportSize({ width, height: 800 });
      for (const path of pages) {
        await page.goto(path);
        await expect.poll(() => themeMeta(page), path).toBe("light");
        const [document, header] = await page.evaluate(() => {
          const row = window.document.querySelector("header > div")!;
          return [window.document.documentElement.scrollWidth - window.document.documentElement.clientWidth, row.scrollWidth - row.clientWidth];
        });
        expect(document, path).toBeLessThanOrEqual(0);
        expect(header, `${path} header`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("pages hydrate without errors and without changing <html> or <body>", async ({ page }) => {
    test.slow();
    const watch = await watchMarkup(page);
    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expect(await watch.rootChanges(), path).toEqual([]);
    }
    expect(watch.errors).toEqual([]);
  });

  for (const viewport of [{ name: "mobile", width: 390, height: 844 }, { name: "desktop", width: 1280, height: 800 }]) {
    test.describe(`axe (${viewport.name})`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const path of ["/", "/en/pricing", "/de/preisrechner?paketa=business&faqe=7&shtesa=booking", "/de/kontakt?paketa=business&faqe=7&vleresim=1", "/en/projects/klinike-dentare", "/llogarit-cmimin", "/de/faq"]) {
        test(`${path} has no detectable WCAG A/AA violations in the light theme`, async ({ page }) => {
          test.setTimeout(60_000);
          await page.goto(path);
          await page.waitForLoadState("networkidle");
          await expect.poll(() => themeMeta(page)).toBe("light");
          // Let every scroll-reveal block fade in, then measure from the top (as in accessibility.spec.ts).
          const height = await page.evaluate(() => document.documentElement.scrollHeight);
          for (let y = 0; y <= height; y += 400) {
            await page.mouse.wheel(0, 400);
            await page.waitForTimeout(40);
          }
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
          const pause = page.getByRole("button", { name: /Ndalo ndërrimin automatik|Pause automatic switching|Automatischen Wechsel anhalten/ });
          if (await pause.count()) await pause.click();
          await page.mouse.move(0, 0);
          await page.waitForTimeout(800);
          const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
          expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")})`)).toEqual([]);
        });
      }
    });
  }

  test("the calculator works and keeps its prices", async ({ page }) => {
    await page.goto("/de/preisrechner?paketa=business&faqe=8&shtesa=multilingual,booking,analytics");
    await page.waitForLoadState("networkidle");
    await expect.poll(async () => (await page.getByTestId("estimate-total").first().textContent())?.replace(/\s/g, " ").trim()).toBe("879 €");
    // The radios are visually hidden inside their cards; visitors click the card.
    await page.locator("label", { has: page.getByRole("radio", { name: /Professional/ }) }).click();
    await expect(page.getByRole("radio", { name: /Professional/ })).toBeChecked();
    await page.getByRole("button", { name: "Neu beginnen" }).click();
    await expect.poll(async () => (await page.getByTestId("estimate-total").first().textContent())?.replace(/\s/g, " ").trim()).toBe("399 €");
  });

  test("the quote form shows its validation messages", async ({ page }) => {
    await page.goto("/en/contact");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Send request" }).click();
    const summary = page.locator("#quote-error-summary");
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("Please correct 7 fields:");
    // Error text in the light theme's danger color, readable on the card.
    const color = await page.locator("#quote-error-summary").evaluate((el) => getComputedStyle(el).borderColor);
    expect(color).not.toBe("rgba(0, 0, 0, 0)");
  });
});
