import { expect, test } from "@playwright/test";
import { routes } from "../../src/config/routes";

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

  test("header navigation reaches every main page on desktop", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navigimi kryesor" });
    await nav.getByRole("link", { name: "Çmimet" }).click();
    await expect(page).toHaveURL(/\/cmimet$/);
    await expect(nav.getByRole("link", { name: "Çmimet" })).toHaveAttribute("aria-current", "page");
  });

  test("placeholder pages are excluded from search indexing", async ({ page }) => {
    await page.goto(routes.services);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});
