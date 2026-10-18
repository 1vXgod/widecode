import { expect, test } from "@playwright/test";
import { routes } from "../../src/config/routes";

test.describe("links", () => {
  test("every link on every page resolves (no dead links)", async ({ page, request }) => {
    const hrefs = new Set<string>();
    for (const path of Object.values(routes)) {
      await page.goto(path);
      const found = await page.locator("a[href]").evaluateAll((anchors) =>
        anchors.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
      for (const href of found) hrefs.add(href);
    }

    for (const href of hrefs) {
      expect(href, "links must not be empty or placeholder anchors").not.toMatch(/^(#?|javascript:.*)$/i);
      if (href.startsWith("#")) {
        expect(await page.locator(href).count(), `anchor target ${href}`).toBeGreaterThan(0);
        continue;
      }
      if (href.startsWith("/")) {
        const response = await request.get(href);
        expect(response.status(), href).toBe(200);
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
  test("shows navigation groups, CTA and current-year copyright", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    const nav = footer.getByRole("navigation", { name: "Navigimi në fund të faqes" });
    for (const label of ["Ballina", "Shërbimet", "Projektet", "Çmimet", "Rreth nesh", "Kontakti", "Llogarit çmimin", "Pyetjet e shpeshta"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(footer.getByRole("link", { name: "Merr një ofertë" })).toBeVisible();
    await expect(footer).toContainText(`© ${new Date().getFullYear()} WideCode.`);
  });

  test("does not invent contact details or social profiles", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toContainText("Të dhënat e kontaktit do të publikohen së shpejti");
    await expect(footer.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(0);
    await expect(footer.getByRole("navigation", { name: "Rrjetet sociale" })).toHaveCount(0);
  });
});
