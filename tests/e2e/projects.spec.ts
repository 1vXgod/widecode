import { expect, test, type Page } from "@playwright/test";
import { routes } from "../../src/config/routes";

const ALL = 6;

function cards(page: Page) {
  return page.locator("main").getByRole("article");
}

async function openProjects(page: Page, query = "") {
  await page.goto(`${routes.projects}${query}`);
  // Wait for hydration so the filter responds and URL preselection is applied.
  await page.waitForLoadState("networkidle");
}

test.describe("projects page", () => {
  test("is complete, indexable and labels every project as a demo", async ({ page }) => {
    await openProjects(page);
    await expect(page).toHaveTitle("Projektet | WideCode");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projekte demonstruese");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.getByRole("complementary", { name: "Pse projekte demonstruese?" })).toContainText(
      "jo punë për klientë realë",
    );
    await expect(cards(page)).toHaveCount(ALL);
    for (const card of await cards(page).all()) await expect(card).toContainText("Projekt demonstrues");
    await expect(page.getByText(`Po shfaqen ${ALL} projekte`)).toBeVisible();
  });

  test("filters by category and keeps the choice in the URL", async ({ page }) => {
    await openProjects(page);
    const filters = page.getByRole("group", { name: "Filtro projektet sipas kategorisë" });

    await filters.getByRole("button", { name: /Online Shop/ }).click();
    await expect(filters.getByRole("button", { name: /Online Shop/ })).toHaveAttribute("aria-pressed", "true");
    await expect(filters.getByRole("button", { name: /Të gjitha/ })).toHaveAttribute("aria-pressed", "false");
    await expect(cards(page)).toHaveCount(2);
    await expect(page.getByText("Po shfaqen 2 projekte")).toBeVisible();
    await expect(page).toHaveURL(/\/projektet\?kategoria=online-shop$/);

    await filters.getByRole("button", { name: /Website prezantues/ }).click();
    await expect(cards(page)).toHaveCount(1);
    await expect(page.getByText("Po shfaqet 1 projekt")).toBeVisible();

    await filters.getByRole("button", { name: /Të gjitha/ }).click();
    await expect(cards(page)).toHaveCount(ALL);
    await expect(page).toHaveURL(/\/projektet$/);
  });

  test("filters work with the keyboard", async ({ page }) => {
    await openProjects(page);
    const button = page.getByRole("button", { name: /Website biznesi/ });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(2);
  });

  // One navigation per test: after a second goto to the same path, Chromium cancels the
  // previous page's prefetches without Playwright seeing them finish, so "networkidle"
  // would never fire (a test-tool quirk, not a site issue).
  test("restores a filter from the URL", async ({ page }) => {
    await openProjects(page, "?kategoria=custom-development");
    await expect(page.getByRole("button", { name: /Web aplikacion/ })).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(1);
  });

  test("ignores invalid filter values in the URL", async ({ page }) => {
    await openProjects(page, "?kategoria=nuk-ekziston");
    await expect(page.getByRole("button", { name: /Të gjitha/ })).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(ALL);
    await expect(page).toHaveURL(/\/projektet$/);
  });

  test("cards open the project detail page", async ({ page }) => {
    await openProjects(page);
    await page.getByRole("link", { name: "Klinikë dentare" }).click();
    await expect(page).toHaveURL(/\/projektet\/klinike-dentare$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Klinikë dentare");
  });
});

test.describe("project detail page", () => {
  test("is clearly a demo, with concept, goals, features and structure", async ({ page }) => {
    await page.goto(`${routes.projects}/restorant-tradicional`);
    await expect(page).toHaveTitle("Restorant tradicional (projekt demonstrues) | WideCode");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Projekt demonstrues/);
    await expect(page.getByRole("note")).toContainText("jo punë për klient real");
    await expect(page.locator("main").getByText("Projekt demonstrues").first()).toBeVisible();
    for (const heading of ["Koncepti", "Qëllimet e konceptit", "Funksionalitetet", "Faqet dhe seksionet"]) {
      await expect(page.getByRole("heading", { level: 2, name: heading, exact: true })).toBeVisible();
    }
    // The not-found template ships in the page payload, but must never be visible on a real project.
    await expect(page.getByText("Faqja nuk u gjet")).toBeHidden();
  });

  test("links to the matching service, a pre-selected quote and the estimator", async ({ page }) => {
    await page.goto(`${routes.projects}/restorant-tradicional`);
    const aside = page.getByRole("complementary", { name: "Doni diçka të ngjashme?" });
    await expect(aside.getByRole("link", { name: "Website biznesi" })).toHaveAttribute(
      "href",
      `${routes.services}#website-biznesi`,
    );
    await expect(aside).toContainText(/Business\s*nga 399\s€/);
    await expect(aside.getByRole("link", { name: "Merr ofertë për një projekt të ngjashëm" })).toHaveAttribute(
      "href",
      `${routes.contact}?paketa=business`,
    );
    await expect(aside.getByRole("link", { name: "Llogarit çmimin" })).toHaveAttribute(
      "href",
      `${routes.estimator}?paketa=business`,
    );
    await expect(aside).toContainText("Të gjitha çmimet janë fillestare dhe orientuese");
  });

  test("never prices a custom project", async ({ page }) => {
    await page.goto(`${routes.projects}/panel-palestre`);
    const aside = page.getByRole("complementary", { name: "Doni diçka të ngjashme?" });
    await expect(aside).toContainText(/Custom\s*Me ofertë/);
    await expect(aside.getByRole("link", { name: "Merr ofertë për një projekt të ngjashëm" })).toHaveAttribute(
      "href",
      `${routes.contact}?paketa=custom`,
    );
    await expect(aside.getByRole("link", { name: "Llogarit çmimin" })).toHaveCount(0);
  });

  test("suggests other demo projects, not the current one", async ({ page }) => {
    await page.goto(`${routes.projects}/dyqan-veshjesh`);
    const related = page.getByRole("region", { name: "Projekte të tjera" });
    await expect(related.getByRole("article")).toHaveCount(3);
    await expect(related.getByRole("link", { name: "Online shop për veshje" })).toHaveCount(0);
    await expect(related.getByRole("article").first()).toContainText("Projekt demonstrues");
  });

  test("returns a real 404 for unknown projects, even on the first request", async ({ page, request }) => {
    // A fresh slug each run, so no cached response can hide a soft 404.
    const slug = `nuk-ekziston-${Date.now()}`;
    const first = await request.get(`${routes.projects}/${slug}`);
    expect(first.status()).toBe(404);

    const response = await page.goto(`${routes.projects}/${slug}-b`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Faqja nuk u gjet" })).toBeVisible();
  });

  test("has a working back link", async ({ page }) => {
    await page.goto(`${routes.projects}/studio-fotografie`);
    await page.getByRole("link", { name: "Të gjitha projektet" }).click();
    await expect(page).toHaveURL(/\/projektet$/);
  });

  test("makes no unverifiable claims", async ({ page }) => {
    for (const slug of ["studio-fotografie", "klinike-dentare", "produkte-vendore", "panel-palestre"]) {
      await page.goto(`${routes.projects}/${slug}`);
      const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
      expect(text, slug).not.toMatch(/\d+\s*%|\d+\s*\+|\b(19|20)\d{2}\b/);
    }
  });
});

test.describe("home projects", () => {
  test("featured cards link to their detail pages", async ({ page }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: "Projekte demonstruese" });
    await expect(section.getByRole("link", { name: "Restorant tradicional" })).toHaveAttribute(
      "href",
      `${routes.projects}/restorant-tradicional`,
    );
    await expect(section.getByRole("link", { name: "Panel për palestër" })).toHaveAttribute(
      "href",
      `${routes.projects}/panel-palestre`,
    );
  });
});
