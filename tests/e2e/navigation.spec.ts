import { expect, test } from "@playwright/test";
import { routes } from "../../src/config/routes";

const mainNav: Array<[label: string, path: string]> = [
  ["Ballina", routes.home],
  ["Shërbimet", routes.services],
  ["Projektet", routes.projects],
  ["Çmimet", routes.pricing],
  ["Rreth nesh", routes.about],
  ["Kontakti", routes.contact],
];

function urlFor(path: string) {
  return new RegExp(`${path === "/" ? "/" : path}$`);
}

test.describe("routes", () => {
  for (const [key, path] of Object.entries(routes)) {
    test(`${key} (${path}) renders with a single h1`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", "sq");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  test("unknown paths show the Albanian 404 page", async ({ page }) => {
    const response = await page.goto("/nuk-ekziston");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Faqja nuk u gjet" })).toBeVisible();
  });

  test("no page is a placeholder or excluded from indexing any more", async ({ page }) => {
    test.setTimeout(90_000); // visits every page
    for (const path of Object.values(routes)) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.getByText("Në përgatitje"), path).toHaveCount(0);
      await expect(page.locator('meta[name="robots"]'), path).toHaveCount(0);
    }
  });
});

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("shows the requested items in order", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navigimi kryesor" });
    await expect(nav.getByRole("link")).toHaveText(mainNav.map(([label]) => label));
  });

  test("every item navigates and becomes the current page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navigimi kryesor" });
    for (const [label, path] of mainNav) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(urlFor(path));
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    }
  });

  test("header CTA leads to the contact page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("banner").getByRole("link", { name: "Merr një ofertë" }).click();
    await expect(page).toHaveURL(/\/kontakt$/);
  });

  test("logo returns to the home page", async ({ page }) => {
    await page.goto(routes.pricing);
    await page.getByRole("banner").getByRole("link", { name: "WideCode — ballina" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("every menu item navigates and closes the menu", async ({ page }) => {
    await page.goto(routes.pricing);
    // A click before hydration reaches the button without its handler yet.
    await page.waitForLoadState("networkidle");
    for (const [label, path] of mainNav) {
      await page.getByRole("button", { name: "Hap menynë" }).click();
      const dialog = page.getByRole("dialog", { name: "Menyja" });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(urlFor(path));
      await expect(dialog).toBeHidden();
    }
  });

  test("menu CTA leads to the contact page", async ({ page }) => {
    await page.goto("/");
    // A click before hydration reaches the button without its handler yet.
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Hap menynë" }).click();
    await page.getByRole("dialog", { name: "Menyja" }).getByRole("link", { name: "Merr një ofertë" }).click();
    await expect(page).toHaveURL(/\/kontakt$/);
  });
});

/**
 * globals.css scrolls smoothly for in-page anchors; data-scroll-behavior="smooth"
 * on <html> tells Next.js to jump instead during page navigations (Next.js 16
 * no longer does this by default), so a new page never animates up from where
 * the previous one was scrolled to.
 */
test.describe("scrolling on page navigation", () => {
  test("every document shell marks <html> with data-scroll-behavior", async ({ request }) => {
    for (const path of ["/", "/en/services", "/de/preise", "/nuk-ekziston", "/de/gibt-es-nicht"]) {
      const html = await (await request.get(path, { maxRedirects: 0 })).text();
      expect(html.match(/<html[^>]*>/)?.[0], path).toContain('data-scroll-behavior="smooth"');
    }
  });

  test("a page navigation jumps to the top instead of scrolling there", async ({ page }) => {
    await page.goto(routes.pricing);
    // A click before hydration reaches the link without its handler yet.
    await page.waitForLoadState("networkidle");
    const start = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), start);
    await page.evaluate(() => {
      const positions: number[] = [];
      (window as unknown as { __positions: number[] }).__positions = positions;
      window.addEventListener("scroll", () => positions.push(window.scrollY), { passive: true });
    });
    await page.getByRole("contentinfo").getByRole("link", { name: "Shërbimet" }).click();
    await expect(page).toHaveURL(/\/sherbimet$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(400);
    await page.waitForTimeout(500);
    const positions = await page.evaluate(() => (window as unknown as { __positions: number[] }).__positions);
    // No animation frames between the old position and the top of the new page.
    expect(positions.filter((y) => y > 400 && y < start - 1)).toEqual([]);
  });
});
