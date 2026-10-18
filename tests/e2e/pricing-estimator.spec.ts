import { expect, test, type Page } from "@playwright/test";
import { formatPrice } from "../../src/config/pricing";
import { routes } from "../../src/config/routes";

const packages = [
  { name: "Starter", id: "starter", price: "199 €" },
  { name: "Business", id: "business", price: "399 €" },
  { name: "Professional", id: "professional", price: "699 €" },
  { name: "E-commerce", id: "ecommerce", price: "999 €" },
];

/** Formats euros exactly like the site does, with plain spaces for comparison. */
function eur(amount: number) {
  return formatPrice(amount).replace(/\s/g, " ");
}

/** Normalizes the no-break spaces used by Intl currency formatting. */
async function totalText(page: Page) {
  return ((await page.getByTestId("estimate-total").first().textContent()) ?? "").replace(/\s/g, " ").trim();
}

async function openEstimator(page: Page, query = "") {
  await page.goto(`${routes.estimator}${query}`);
  // Wait for hydration so controls respond and URL preselection is applied.
  await page.waitForLoadState("networkidle");
}

test.describe("pricing page", () => {
  test("is a complete, indexable page", async ({ page }) => {
    await page.goto(routes.pricing);
    await expect(page).toHaveTitle("Çmimet | WideCode");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Paketa me çmime transparente");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator("main")).toContainText("Të gjitha çmimet janë fillestare dhe orientuese");
    await expect(page.locator("main")).toContainText("Ky është vlerësim orientues, jo ofertë përfundimtare");
  });

  test("shows every package from the central config with working links", async ({ page }) => {
    await page.goto(routes.pricing);
    for (const pkg of packages) {
      const card = page.getByRole("article", { name: pkg.name, exact: true });
      await expect(card).toContainText(pkg.price);
      await expect(card.getByRole("link", { name: `Zgjidh paketën: ${pkg.name}` })).toHaveAttribute(
        "href",
        `${routes.contact}?paketa=${pkg.id}`,
      );
      await expect(card.getByRole("link", { name: `Llogarit me këtë paketë: ${pkg.name}` })).toHaveAttribute(
        "href",
        `${routes.estimator}?paketa=${pkg.id}`,
      );
    }
    const custom = page.getByRole("article", { name: "Custom", exact: true });
    await expect(custom).toContainText("Me ofertë");
    await expect(custom.getByRole("link", { name: "Kërko ofertë: Custom" })).toHaveAttribute(
      "href",
      `${routes.contact}?paketa=custom`,
    );
  });

  test("lists add-on prices from the estimator config", async ({ page }) => {
    await page.goto(routes.pricing);
    const section = page.getByRole("region", { name: "Funksionalitete shtesë" });
    const expected: Array<[string, string]> = [
      ["Faqe shtesë", "30 € / faqe"],
      ["Website në dy gjuhë", "+150 €"],
      ["Blog / lajme", "+100 €"],
      ["Rezervime ose takime", "+200 €"],
      ["Analitikë", "+40 €"],
      ["Pagesa online", "+150 €"],
    ];
    for (const [label, price] of expected) {
      const item = section.getByRole("listitem").filter({ has: page.getByRole("heading", { name: label }) });
      // Intl inserts a no-break space between amount and €; compare on normalized text.
      const text = ((await item.textContent()) ?? "").replace(/\s/g, " ");
      expect(text, label).toContain(price);
    }
    await expect(section).toContainText("Përfshirë në Professional");
    await expect(section).toContainText("Për faqet mbi numrin e përfshirë në paketë (Business 5 faqe dhe Professional 10 faqe).");
  });

  test("package card opens the estimator with that package selected", async ({ page }) => {
    await page.goto(routes.pricing);
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: "Llogarit me këtë paketë: E-commerce" }).click();
    await expect(page).toHaveURL(/\/llogarit-cmimin\?paketa=ecommerce$/);
    await expect(page.getByRole("radio", { name: /E-commerce/ })).toBeChecked();
    await expect.poll(() => totalText(page)).toBe("999 €");
  });
});

test.describe("price estimator", () => {
  test("starts from the default package and its starting price", async ({ page }) => {
    await openEstimator(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Llogarit çmimin e projektit tuaj");
    await expect(page.getByRole("radio", { name: /Business/ })).toBeChecked();
    expect(await totalText(page)).toBe("399 €");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });

  test("updates the total and itemised breakdown live", async ({ page }) => {
    await openEstimator(page);
    const summary = page.getByRole("complementary", { name: "Vlerësimi juaj" });

    await page.getByRole("button", { name: "Rrit numrin e faqeve" }).click();
    await page.getByRole("button", { name: "Rrit numrin e faqeve" }).click();
    await expect(page.getByLabel("Numri i faqeve", { exact: true })).toHaveValue("7");
    await expect(summary).toContainText(/2 faqe shtesë × 30\s€/);
    await expect.poll(() => totalText(page)).toBe("459 €");

    await page.getByRole("checkbox", { name: /Website në dy gjuhë/ }).check();
    await page.getByRole("checkbox", { name: /Blog \/ lajme/ }).check();
    await expect.poll(() => totalText(page)).toBe("709 €");
    await expect(summary).toContainText("Website në dy gjuhë");

    await page.getByRole("checkbox", { name: /Blog \/ lajme/ }).uncheck();
    await expect.poll(() => totalText(page)).toBe("609 €");

    // Typed values are clamped to the allowed range.
    await page.getByLabel("Numri i faqeve", { exact: true }).fill("500");
    await page.getByLabel("Numri i faqeve", { exact: true }).blur();
    await expect(page.getByLabel("Numri i faqeve", { exact: true })).toHaveValue("30");
    await expect.poll(() => totalText(page)).toBe(eur(399 + 25 * 30 + 150));
  });

  test("shows included features as included, without charging for them", async ({ page }) => {
    await openEstimator(page, "?paketa=professional");
    const blog = page.getByRole("checkbox", { name: /Blog \/ lajme/ });
    await expect(blog).toBeChecked();
    await expect(blog).toBeDisabled();
    expect(await totalText(page)).toBe("699 €");
  });

  test("never shows a number for Custom Development", async ({ page }) => {
    await openEstimator(page);
    await page.getByText("Custom", { exact: true }).click();
    await expect(page.getByRole("radio", { name: /Custom/ })).toBeChecked();
    await expect.poll(() => totalText(page)).toBe("Me ofertë");
    await expect(page.getByTestId("estimate-total").first()).not.toContainText(/\d/);
    const summary = page.getByRole("complementary", { name: "Vlerësimi juaj" });
    await expect(summary).toContainText("nuk japim çmim paraprak");
    await expect(summary).not.toContainText("Ky është vlerësim orientues");
    await expect(page.getByRole("link", { name: "Kërko ofertë", exact: true })).toHaveAttribute(
      "href",
      `${routes.contact}?paketa=custom`,
    );
  });

  test("works with the keyboard", async ({ page }) => {
    await openEstimator(page);
    await page.getByRole("radio", { name: /Business/ }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: /Professional/ })).toBeChecked();
    await expect.poll(() => totalText(page)).toBe("699 €");

    await page.getByRole("checkbox", { name: /Rezervime ose takime/ }).focus();
    await page.keyboard.press("Space");
    await expect.poll(() => totalText(page)).toBe("899 €");
  });

  test("carries the estimate to the quote link and the shareable URL", async ({ page }) => {
    await openEstimator(page);
    await page.getByRole("button", { name: "Rrit numrin e faqeve" }).click();
    await page.getByRole("checkbox", { name: /Analitikë/ }).check();

    await expect(page).toHaveURL(/\/llogarit-cmimin\?paketa=business&faqe=6&shtesa=analytics$/);
    await expect(page.getByRole("link", { name: "Kërko ofertë me këtë vlerësim" })).toHaveAttribute(
      "href",
      `${routes.contact}?paketa=business&faqe=6&shtesa=analytics`,
    );
  });

  test("restores an estimate from the URL", async ({ page }) => {
    await openEstimator(page, "?paketa=ecommerce&shtesa=payments,multilingual");
    await expect(page.getByRole("radio", { name: /E-commerce/ })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: /Pagesa online/ })).toBeChecked();
    await expect.poll(() => totalText(page)).toBe(eur(999 + 150 + 150));
  });

  test("ignores invalid URL values and falls back safely", async ({ page }) => {
    await openEstimator(page, "?paketa=gold&faqe=-4&shtesa=hack,payments");
    await expect(page.getByRole("radio", { name: /Business/ })).toBeChecked();
    await expect(page.getByLabel("Numri i faqeve", { exact: true })).toHaveValue("5");
    expect(await totalText(page)).toBe("399 €");
  });

  test("resets to the default estimate", async ({ page }) => {
    await openEstimator(page, "?paketa=professional&faqe=15&shtesa=booking");
    await expect.poll(() => totalText(page)).not.toBe("399 €");
    await page.getByRole("button", { name: "Rifillo" }).click();
    await expect(page.getByRole("radio", { name: /Business/ })).toBeChecked();
    await expect.poll(() => totalText(page)).toBe("399 €");
  });

  test("announces total changes to screen readers", async ({ page }) => {
    await openEstimator(page);
    await page.getByRole("checkbox", { name: /Analitikë/ }).check();
    const live = page.locator('[aria-live="polite"]');
    await expect(live).toHaveText(/Vlerësimi orientues u përditësua: 439/);
  });

  test("always labels the result as an estimate, not a confirmed quote", async ({ page }) => {
    await openEstimator(page);
    const summary = page.getByRole("complementary", { name: "Vlerësimi juaj" });
    await expect(summary).toContainText("Vlerësim orientues");
    await expect(summary).toContainText("Ky është vlerësim orientues, jo ofertë përfundimtare");
  });
});
