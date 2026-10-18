import { expect, test, type Locator, type Page } from "@playwright/test";
import { routes } from "../../src/config/routes";

const services = [
  { title: "Uebfaqe prezantuese", anchor: "uebfaqe-prezantuese", packages: { Starter: "starter" } },
  { title: "Uebfaqe biznesi", anchor: "uebfaqe-biznesi", packages: { Biznes: "business", Profesional: "professional" } },
  { title: "Dyqane online", anchor: "dyqane-online", packages: { "E-commerce": "ecommerce" } },
  { title: "Platforma me porosi", anchor: "platforma-me-porosi", packages: { "Platformë me porosi": "custom" } },
];

/** The element is visible and not hidden underneath the sticky header. */
async function expectClearOfHeader(page: Page, target: Locator) {
  await expect(target).toBeInViewport();
  const headerBottom = await page.getByRole("banner").evaluate((el) => el.getBoundingClientRect().bottom);
  const top = await target.evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(headerBottom - 1);
}

test.describe("services page", () => {
  test("is a complete, indexable page", async ({ page }) => {
    await page.goto(routes.services);
    await expect(page).toHaveTitle("Shërbimet | WideCode");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Uebfaqe dhe zgjidhje online, të ndërtuara me porosi",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.getByText("Në përgatitje")).toHaveCount(0);
  });

  test("describes every service in its own anchored section", async ({ page }) => {
    await page.goto(routes.services);
    for (const service of services) {
      const section = page.locator(`section#${service.anchor}`);
      await expect(section.getByRole("heading", { level: 2 })).toHaveText(service.title);
      await expect(section).toContainText("Ideale për");
      await expect(section).toContainText("Çfarë përfshihet");
    }
  });

  test("every quote link pre-selects the matching package", async ({ page }) => {
    await page.goto(routes.services);
    for (const service of services) {
      const section = page.locator(`section#${service.anchor}`);
      const links = section.getByRole("link", { name: /^Merr ofertë: / });
      await expect(links).toHaveCount(Object.keys(service.packages).length);
      for (const [name, id] of Object.entries(service.packages)) {
        await expect(section.getByRole("link", { name: `Merr ofertë: ${name}` })).toHaveAttribute(
          "href",
          `${routes.contact}?paketa=${id}`,
        );
      }
    }
  });

  test("shows starting prices from the pricing config", async ({ page }) => {
    await page.goto(routes.services);
    await expect(page.locator("section#uebfaqe-prezantuese")).toContainText("nga 199 €");
    await expect(page.locator("section#uebfaqe-biznesi")).toContainText("nga 399 €");
    await expect(page.locator("section#uebfaqe-biznesi")).toContainText("nga 699 €");
    await expect(page.locator("section#dyqane-online")).toContainText("nga 999 €");
    await expect(page.locator("section#platforma-me-porosi")).toContainText("Me ofertë");
    await expect(page.locator("main")).toContainText("Të gjitha çmimet janë fillestare dhe orientuese");
  });

  test("in-page navigation scrolls each section clear of the sticky header", async ({ page }) => {
    await page.goto(routes.services);
    await page.waitForLoadState("networkidle");
    const nav = page.getByRole("navigation", { name: "Në këtë faqe" });
    for (const service of services) {
      await nav.getByRole("link", { name: service.title }).click();
      await expect(page).toHaveURL(new RegExp(`#${service.anchor}$`));
      await expectClearOfHeader(page, page.locator(`section#${service.anchor}`).getByRole("heading", { level: 2 }));
    }
  });

  test("links to the process on the about page", async ({ page }) => {
    await page.goto(routes.services);
    await page.getByRole("link", { name: "Shiko procesin" }).click();
    await expect(page).toHaveURL(/\/rreth-nesh#procesi$/);
    await expectClearOfHeader(page, page.getByRole("heading", { name: "Si punojmë" }));
  });
});

test.describe("home service cards", () => {
  test("open the matching section on the services page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const section = page.getByRole("region", { name: "Çfarë ndërtojmë për biznesin tuaj" });
    await section.getByRole("link", { name: "Dyqane online" }).click();
    await expect(page).toHaveURL(/\/sherbimet#dyqane-online$/);
    await expectClearOfHeader(page, page.locator("section#dyqane-online").getByRole("heading", { level: 2 }));
  });
});

test.describe("about page", () => {
  test("is a complete, indexable page with the official logo", async ({ page }) => {
    await page.goto(routes.about);
    await expect(page).toHaveTitle("Rreth nesh | WideCode");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Ndërtojmë uebfaqe me kujdes, qartësi dhe çmime të ndershme",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    for (const title of ["Prani profesionale online për çdo biznes", "Si i qasemi punës", "Shërbimet tona", "Si punojmë", "Tregu ynë"]) {
      await expect(page.getByRole("heading", { level: 2, name: title })).toBeVisible();
    }
    const missionLogo = page.locator("main figure").getByRole("img", { name: "WideCode" });
    await missionLogo.scrollIntoViewIfNeeded();
    await expect(missionLogo).toBeVisible();
    expect(await missionLogo.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  });

  test("links each service to its section", async ({ page }) => {
    await page.goto(routes.about);
    const section = page.getByRole("region", { name: "Shërbimet tona" });
    for (const service of services) {
      await expect(section.getByRole("link", { name: service.title })).toHaveAttribute(
        "href",
        `${routes.services}#${service.anchor}`,
      );
    }
  });

  test("makes no unverifiable claims (years, counts, percentages)", async ({ page }) => {
    await page.goto(routes.about);
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    expect(text).not.toMatch(/\b(19|20)\d{2}\b/);
    expect(text).not.toMatch(/\d+\s*\+/);
    expect(text).not.toMatch(/\d+\s*%/);
  });
});
