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
    for (const path of Object.values(routes)) {
      await page.goto(path);
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
    await page.getByRole("button", { name: "Hap menynë" }).click();
    await page.getByRole("dialog", { name: "Menyja" }).getByRole("link", { name: "Merr një ofertë" }).click();
    await expect(page).toHaveURL(/\/kontakt$/);
  });
});
