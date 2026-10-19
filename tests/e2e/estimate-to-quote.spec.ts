import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { quoteProtection } from "../../src/config/quote";
import { routes } from "../../src/config/routes";

/**
 * The estimator → contact flow: the configuration chosen in the estimator must
 * arrive complete in the quote form, survive refreshes and corrections, and
 * reach the (mock) email recalculated on the server. Nothing is emailed: the
 * e2e server delivers to tests/e2e/mock-resend.mjs.
 */
let visitor = 0;
test.beforeEach(async ({ page }, testInfo) => {
  visitor += 1;
  // Own client address per test, so the quote form's rate limit never interferes.
  await page.setExtraHTTPHeaders({
    "x-forwarded-for": `192.0.${2 + (testInfo.workerIndex % 50)}.${(visitor % 250) + 1}`,
  });
});

const MOCK_RESEND_URL = `http://127.0.0.1:${process.env.MOCK_RESEND_PORT ?? 3199}`;

async function emailsFrom(request: APIRequestContext, address: string) {
  const all = (await (await request.get(`${MOCK_RESEND_URL}/emails`)).json()) as Array<{ reply_to: string; text: string }>;
  return all.filter((email) => email.reply_to === address);
}

const uniqueEmail = () => `estimate+${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}@example.com`;
const quoteForm = (page: Page) => page.getByRole("form", { name: "Kërkesë për ofertë" });
// The card's title sits in its header row; the card is the header's parent.
const estimateCard = (page: Page) => quoteForm(page).getByText("Vlerësimi juaj nga llogaritësi").locator("xpath=../..");
const normalized = async (page: Page) => ((await estimateCard(page).textContent()) ?? "").replace(/\s/g, " ");
const totalText = async (page: Page) =>
  ((await quoteForm(page).getByTestId("quote-estimate-total").textContent()) ?? "").replace(/\s/g, " ");

/** Business, 8 pages, two languages, booking and analytics: 399 + 3 × 30 + 150 + 200 + 40 = 879 €. */
async function configureInEstimator(page: Page) {
  await page.goto(routes.estimator);
  await page.waitForLoadState("networkidle");
  // Business is the default; choose another package first so the choice is really made here.
  await page.getByRole("radio", { name: /Professional/ }).check({ force: true });
  await page.getByRole("radio", { name: /Business/ }).check({ force: true });
  await page.getByRole("spinbutton", { name: "Numri i faqeve" }).fill("8");
  await page.getByRole("checkbox", { name: /Website në dy gjuhë/ }).check({ force: true });
  await page.getByRole("checkbox", { name: /Rezervime ose takime/ }).check({ force: true });
  await page.getByRole("checkbox", { name: /Analitikë/ }).check({ force: true });
  await expect(page).toHaveURL(/paketa=business&faqe=8&shtesa=multilingual%2Cbooking%2Canalytics$/);
}

async function expectBusinessConfiguration(page: Page) {
  const form = quoteForm(page);
  await expect(form.getByLabel("Paketa")).toHaveValue("business");
  await expect(form.getByLabel("Lloji i projektit")).toHaveValue("business");
  await expect.poll(() => totalText(page)).toBe("nga 879 €");
  const card = await normalized(page);
  for (const part of [
    "Numri i faqeve8 faqe (5 të përfshira në paketë)",
    "Paketa Business399 €",
    "3 faqe shtesë × 30 €90 €",
    "Website në dy gjuhë150 €",
    "Rezervime ose takime200 €",
    "Analitikë40 €",
    "Çmimin përfundimtar e konfirmojmë në ofertë.",
  ]) {
    expect(card).toContain(part);
  }
}

async function fillContactDetails(page: Page, email: string) {
  const form = quoteForm(page);
  await form.getByLabel("Emri dhe mbiemri").fill("Arta Krasniqi");
  await form.getByLabel("Email", { exact: true }).fill(email);
  await form.getByLabel("Përshkrimi i projektit").fill("Website për restorantin, në shqip dhe anglisht, me rezervime.");
}

test.describe("estimator → quote request", () => {
  test("carries every selection to the form, survives a refresh and arrives complete in the email", async ({ page, request }) => {
    test.slow();
    await configureInEstimator(page);
    await page.getByRole("link", { name: "Kërko ofertë me këtë vlerësim" }).click();
    await expect(page).toHaveURL(/\/kontakt\?paketa=business&faqe=8&shtesa=multilingual%2Cbooking%2Canalytics&vleresim=1$/);
    await expectBusinessConfiguration(page);

    const email = uniqueEmail();
    await fillContactDetails(page, email);
    await quoteForm(page).getByLabel("Buxheti i përafërt").selectOption("600-1000");

    // A refresh keeps the configuration (URL) and what was typed (this tab's draft).
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expectBusinessConfiguration(page);
    await expect(quoteForm(page).getByLabel("Emri dhe mbiemri")).toHaveValue("Arta Krasniqi");
    await expect(quoteForm(page).getByLabel("Buxheti i përafërt")).toHaveValue("600-1000");
    const openedAt = Date.now();

    await quoteForm(page).getByLabel("Afati i dëshiruar").selectOption("within-month");
    const remaining = quoteProtection.minFillMs + 300 - (Date.now() - openedAt);
    if (remaining > 0) await page.waitForTimeout(remaining);
    await quoteForm(page).getByRole("button", { name: "Dërgo kërkesën" }).click();
    await expect(page.getByRole("heading", { name: "Faleminderit, kërkesa juaj u dërgua!" })).toBeFocused();

    const [sent, ...more] = await emailsFrom(request, email);
    expect(more).toHaveLength(0);
    const text = sent!.text.replace(/\s/g, " ");
    for (const line of [
      "Paketa: Business (nga 399 €)",
      "Vlerësimi orientues nga llogaritësi:",
      "Numri i faqeve: 8 faqe (5 të përfshira në paketë)",
      "Paketa Business: 399 €",
      "3 faqe shtesë × 30 €: 90 €",
      "Website në dy gjuhë: 150 €",
      "Rezervime ose takime: 200 €",
      "Analitikë: 40 €",
      "Totali orientues: nga 879 €",
    ]) {
      expect(text).toContain(line);
    }

    // Once sent, the draft is gone: a new visit starts empty.
    await page.goto(routes.contact);
    await page.waitForLoadState("networkidle");
    await expect(quoteForm(page).getByLabel("Emri dhe mbiemri")).toHaveValue("");
  });

  test("adjusting the estimate updates the form and keeps the visitor's details", async ({ page }) => {
    await configureInEstimator(page);
    await page.getByRole("link", { name: "Kërko ofertë me këtë vlerësim" }).click();
    await expectBusinessConfiguration(page);
    await quoteForm(page).getByLabel("Emri dhe mbiemri").fill("Arta Krasniqi");

    await quoteForm(page).getByRole("link", { name: "Ndrysho vlerësimin" }).click();
    await expect(page).toHaveURL(/\/llogarit-cmimin\?paketa=business&faqe=8&shtesa=multilingual%2Cbooking%2Canalytics$/);
    const booking = page.getByRole("checkbox", { name: /Rezervime ose takime/ });
    await expect(booking).toBeChecked();
    await booking.focus();
    await page.keyboard.press("Space");
    await expect(booking).not.toBeChecked();
    await page.getByRole("link", { name: "Kërko ofertë me këtë vlerësim" }).click();

    await expect(page).toHaveURL(/\/kontakt\?paketa=business&faqe=8&shtesa=multilingual%2Canalytics&vleresim=1$/);
    await expect.poll(() => totalText(page)).toBe("nga 679 €");
    expect(await normalized(page)).not.toContain("Rezervime");
    await expect(quoteForm(page).getByLabel("Emri dhe mbiemri")).toHaveValue("Arta Krasniqi");
  });

  test("the form is complete at once, even while the server is slow, and keeps what is typed meanwhile", async ({ page }) => {
    await configureInEstimator(page);
    // Hold back the contact page's server responses, like a cold start or a slow connection.
    await page.route(/\/kontakt/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      await route.continue();
    });
    await page.getByRole("link", { name: "Kërko ofertë me këtë vlerësim" }).click();
    await expect(page).toHaveURL(/\/kontakt\?/);

    // Long before the server answers, the selections are on screen.
    await expect(quoteForm(page).getByLabel("Paketa")).toHaveValue("business", { timeout: 1500 });
    await expect.poll(() => totalText(page), { timeout: 1500 }).toBe("nga 879 €");
    await quoteForm(page).getByLabel("Emri dhe mbiemri").fill("Arta");

    // The server's answer arrives without resetting the form.
    await page.waitForTimeout(3000);
    await expect(quoteForm(page).getByLabel("Emri dhe mbiemri")).toHaveValue("Arta");
    await expect.poll(() => totalText(page)).toBe("nga 879 €");
  });

  for (const [pkg, total] of [
    ["starter", "199 €"],
    ["ecommerce", "999 €"],
  ] as const) {
    test(`${pkg} without add-ons still arrives as an estimate`, async ({ page }) => {
      await page.goto(`${routes.estimator}?paketa=${pkg}`);
      await page.waitForLoadState("networkidle");
      await page.getByRole("link", { name: "Kërko ofertë me këtë vlerësim" }).click();
      await expect(page).toHaveURL(new RegExp(`/kontakt\\?paketa=${pkg}&vleresim=1$`));
      await expect(quoteForm(page).getByLabel("Paketa")).toHaveValue(pkg);
      await expect.poll(() => totalText(page)).toBe(`nga ${total}`);
    });
  }
});

test.describe("contact page without the estimator", () => {
  test("opened directly, it is an empty form without an estimate", async ({ page }) => {
    await page.goto(routes.contact);
    await page.waitForLoadState("networkidle");
    const form = quoteForm(page);
    await expect(form.getByLabel("Paketa")).toHaveValue("");
    await expect(form.getByLabel("Emri dhe mbiemri")).toHaveValue("");
    await expect(form.getByText("Vlerësimi juaj nga llogaritësi")).toHaveCount(0);
  });

  // One navigation per test: a second goto to the same path in one tab never reaches networkidle.
  test("an unknown package pre-selects nothing and shows no estimate", async ({ page }) => {
    await page.goto(`${routes.contact}?paketa=premium&faqe=3&shtesa=blog&vleresim=1`);
    await page.waitForLoadState("networkidle");
    await expect(quoteForm(page).getByLabel("Paketa")).toHaveValue("");
    await expect(quoteForm(page).getByText("Vlerësimi juaj nga llogaritësi")).toHaveCount(0);
  });

  test("tampered estimate parameters are rebuilt from the configured rules", async ({ page }) => {
    // Invalid pages, an add-on Business does not offer, an unknown one and a forged total.
    await page.goto(`${routes.contact}?paketa=business&faqe=-3&shtesa=payments,%3Cscript%3E,analytics&total=1&vleresim=1`);
    await page.waitForLoadState("networkidle");
    await expect.poll(() => totalText(page)).toBe("nga 439 €");
    const card = await normalized(page);
    expect(card).toContain("Numri i faqeve5 faqe");
    expect(card).not.toContain("Pagesa online");
    expect(card).not.toContain("script");
  });

  test("Custom never gets a number, even when marked as an estimate", async ({ page }) => {
    await page.goto(`${routes.contact}?paketa=custom&faqe=5&vleresim=1`);
    await page.waitForLoadState("networkidle");
    await expect(quoteForm(page).getByLabel("Paketa")).toHaveValue("custom");
    await expect(quoteForm(page).getByText("Vlerësimi juaj nga llogaritësi")).toHaveCount(0);
  });
});
