import { expect, test } from "@playwright/test";
import { routes } from "../../src/config/routes";

test.describe("links", () => {
  test("every link on every page resolves, including #anchors (no dead links)", async ({ page, request }) => {
    test.setTimeout(90_000);
    // Resolve every link to an absolute target: path + optional fragment.
    const targets = new Map<string, { path: string; hash: string; foundOn: string }>();
    for (const path of Object.values(routes)) {
      await page.goto(path);
      const found = await page.locator("a[href]").evaluateAll((anchors) =>
        anchors.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
      for (const href of found) {
        expect(href, `empty or placeholder link on ${path}`).not.toMatch(/^(#?|javascript:.*)$/i);
        if (/^(https?:|mailto:|tel:)/.test(href)) continue;
        const url = new URL(href, `http://localhost${path}`);
        targets.set(`${url.pathname}${url.search}${url.hash}`, { path: `${url.pathname}${url.search}`, hash: url.hash, foundOn: path });
      }
    }

    for (const [href, { path, hash, foundOn }] of targets) {
      const response = await request.get(path);
      expect(response.status(), `${href} (linked from ${foundOn})`).toBe(200);
      if (hash) {
        await page.goto(path);
        expect(await page.locator(hash).count(), `anchor ${href} (linked from ${foundOn})`).toBeGreaterThan(0);
      }
    }
  });

  test("external links open safely in a new tab", async ({ page }) => {
    await page.goto("/");
    const external = page.locator('a[href^="http"]');
    for (const link of await external.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });
});

test.describe("scroll reveal", () => {
  /** Opacity of every `.reveal` element, including inherited parent opacity, and whether it is on screen. */
  async function revealStates(page: import("@playwright/test").Page) {
    return page.locator(".reveal").evaluateAll((elements) =>
      elements.map((el) => {
        let opacity = 1;
        for (let node: Element | null = el; node; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
        const rect = el.getBoundingClientRect();
        return { opacity, onScreen: rect.bottom > 0 && rect.top < window.innerHeight };
      }),
    );
  }

  for (const path of ["/", "/sherbimet", "/rreth-nesh"]) {
    test(`${path}: content on screen is fully visible at load, the rest once scrolled to`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(800); // longer than the 0.7s transition
      const atLoad = await revealStates(page);
      expect(atLoad.filter((s) => s.onScreen && s.opacity < 0.99)).toEqual([]);

      for (let i = 0; i < 40; i++) {
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(800);
      const seen = await revealStates(page);
      expect(seen.filter((s) => s.onScreen && s.opacity < 0.99)).toEqual([]);
    });
  }

  test("nothing is hidden without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto("/rreth-nesh");
    expect((await revealStates(page)).filter((s) => s.opacity < 0.99)).toEqual([]);
    await context.close();
  });

  test("nothing is hidden with reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect((await revealStates(page)).filter((s) => s.opacity < 0.99)).toEqual([]);
    await context.close();
  });
});

test.describe("header", () => {
  test("gains a background and border after scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header).not.toHaveAttribute("data-scrolled");

    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute("data-scrolled", "");

    await page.mouse.wheel(0, -2000);
    await expect(header).not.toHaveAttribute("data-scrolled");
  });

  test("stays visible at the top while scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto("/");
    await page.mouse.wheel(0, 800);
    await expect(page.getByRole("banner")).toBeInViewport();
  });
});

test.describe("footer", () => {
  test("shows navigation groups, contact link and current-year copyright", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    const nav = footer.getByRole("navigation", { name: "Navigimi në fund të faqes" });
    for (const label of ["Ballina", "Shërbimet", "Projektet", "Çmimet", "Rreth nesh", "Kontakti", "Llogarit çmimin", "Pyetjet e shpeshta"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(footer.getByRole("link", { name: "Shko te kontakti" })).toBeVisible();
    await expect(footer).toContainText(`© ${new Date().getFullYear()} WideCode.`);
  });

  test("inner pages end with the shared call to action, except the contact page", async ({ page }) => {
    await page.goto(routes.services);
    const cta = page.getByRole("region", { name: "Gati ta nisim projektin tuaj?" });
    await expect(cta.getByRole("link", { name: "Merr një ofertë" })).toHaveAttribute("href", routes.contact);
    await expect(cta.getByRole("link", { name: "Llogarit çmimin" })).toHaveAttribute("href", routes.estimator);

    await page.goto(routes.contact);
    await expect(page.getByRole("region", { name: "Gati ta nisim projektin tuaj?" })).toHaveCount(0);
  });

  test("does not invent contact details or social profiles", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toContainText("Të dhënat e kontaktit do të publikohen së shpejti");
    await expect(footer.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(0);
    await expect(footer.getByRole("navigation", { name: "Rrjetet sociale" })).toHaveCount(0);
  });
});
