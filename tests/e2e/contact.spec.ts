import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { quoteProtection } from "../../src/config/quote";
import { routes } from "../../src/config/routes";

/**
 * The e2e server delivers quote requests to a local mock of the Resend API
 * (tests/e2e/mock-resend.mjs, see playwright.config.ts), so the real success
 * path is tested and nothing is ever emailed. Each test uses its own client
 * address and email, so rate limits and received emails never mix between tests.
 */
let visitor = 0;
test.beforeEach(async ({ page }, testInfo) => {
  visitor += 1;
  await page.setExtraHTTPHeaders({
    "x-forwarded-for": `198.51.${testInfo.workerIndex % 250}.${(visitor % 250) + 1}`,
  });
});

const submit = (page: Page) => page.getByRole("button", { name: "Dërgo kërkesën" });
const quoteForm = (page: Page) => page.getByRole("form", { name: "Kërkesë për ofertë" });
// Scoped to the form: Next.js also renders a (route announcer) alert on every page.
const formAlert = (page: Page) => quoteForm(page).getByRole("alert");

async function openContact(page: Page, query = "") {
  await page.goto(`${routes.contact}${query}`);
  // Hydration done: the streamed form (with the delivery mode) is interactive.
  await page.waitForLoadState("networkidle");
  return Date.now();
}

const MOCK_RESEND_URL = `http://127.0.0.1:${process.env.MOCK_RESEND_PORT ?? 3199}`;

type MockEmail = { reply_to: string; subject: string; text: string; to: string[]; idempotencyKey: string | null };

/** Emails the mock Resend API received for a visitor's address. */
async function emailsFrom(request: APIRequestContext, address: string): Promise<MockEmail[]> {
  const all = (await (await request.get(`${MOCK_RESEND_URL}/emails`)).json()) as MockEmail[];
  return all.filter((email) => email.reply_to === address);
}

/** A unique visitor address per call, so each test finds only its own emails. */
function uniqueEmail() {
  return `arta+${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}@example.com`;
}

async function fillValid(page: Page, { selectPackage = true, email = "arta@example.com", description = "" } = {}) {
  await page.getByLabel("Emri dhe mbiemri").fill("Arta Krasniqi");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Lloji i projektit").selectOption("business");
  if (selectPackage) await page.getByLabel("Paketa").selectOption("business");
  await page.getByLabel("Buxheti i përafërt").selectOption("300-600");
  await page.getByLabel("Afati i dëshiruar").selectOption("flexible");
  await page
    .getByLabel("Përshkrimi i projektit")
    .fill(description || "Website për restorantin tonë, me menu dhe rezervime online.");
}

/**
 * Opens the form with the page clock stopped, so the form's fill timer stays
 * at zero however long a busy test machine takes to fill it in.
 */
async function openWithFrozenClock(page: Page) {
  await page.clock.install();
  await openContact(page);
  await page.clock.pauseAt(Date.now() + 1000);
}

/** Waits until a person could plausibly have filled the form (the server's minimum fill time). */
async function waitForMinFillTime(page: Page, openedAt: number) {
  const remaining = quoteProtection.minFillMs + 300 - (Date.now() - openedAt);
  if (remaining > 0) await page.waitForTimeout(remaining);
}

test.describe("contact page", () => {
  test("is a complete, indexable page without invented contact details", async ({ page }) => {
    await openContact(page);
    await expect(page).toHaveTitle("Kërko ofertë për website ose online shop | WideCode");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Na tregoni për projektin tuaj");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.getByRole("form", { name: "Kërkesë për ofertë" })).toBeVisible();
    await expect(page.getByRole("complementary", { name: "Çfarë ndodh pasi e dërgoni" })).toBeVisible();
    await expect(page.locator('main a[href^="mailto:"], main a[href^="tel:"]')).toHaveCount(0);
    // Nothing about delivery internals or testing is ever shown to visitors.
    await expect(page.locator("main")).not.toContainText(/testim|konsol|resend/i);
    await expect(page.getByText("Disa fusha u plotësuan")).toHaveCount(0);
  });

  test("has every field with the right input types", async ({ page }) => {
    await openContact(page);
    await expect(page.getByLabel("Emri dhe mbiemri")).toHaveAttribute("autocomplete", "name");
    await expect(page.getByLabel("Emri i biznesit (opsionale)")).toHaveAttribute("autocomplete", "organization");
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("type", "email");
    await expect(page.getByLabel("Numri i telefonit (opsionale)")).toHaveAttribute("type", "tel");
    for (const label of ["Lloji i projektit", "Paketa", "Buxheti i përafërt", "Afati i dëshiruar"]) {
      await expect(page.getByLabel(label)).toHaveJSProperty("tagName", "SELECT");
    }
    await expect(page.getByLabel("Përshkrimi i projektit")).toHaveAttribute("maxlength", "5000");
  });
});

test.describe("quote form pre-fill", () => {
  test("a pricing card pre-selects its package", async ({ page }) => {
    await page.goto(routes.pricing);
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: "Zgjidh paketën: Professional" }).click();
    await expect(page).toHaveURL(/\/kontakt\?paketa=professional$/);
    // Scoped to the form: after a client-side navigation the previous page stays in the DOM (hidden).
    const form = quoteForm(page);
    await expect(form.getByLabel("Paketa")).toHaveValue("professional");
    await expect(form.getByLabel("Lloji i projektit")).toHaveValue("business");
    await expect(form.getByText("Disa fusha u plotësuan sipas zgjedhjes suaj")).toBeVisible();
  });

  test("the estimator carries its estimate into the form", async ({ page }) => {
    await page.goto(`${routes.estimator}?paketa=business&faqe=7&shtesa=blog`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: "Kërko ofertë me këtë vlerësim" }).click();
    await expect(page).toHaveURL(/\/kontakt\?paketa=business&faqe=7&shtesa=blog&vleresim=1$/);

    const form = quoteForm(page);
    await expect(form.getByLabel("Paketa")).toHaveValue("business");
    const total = form.getByTestId("quote-estimate-total");
    await expect.poll(async () => (await total.textContent())?.replace(/\s/g, " ")).toBe("nga 559 €");
    await expect(form.getByText("Vlerësimi juaj nga llogaritësi")).toBeVisible();
    await expect(form.getByRole("link", { name: "Ndrysho vlerësimin" })).toHaveAttribute(
      "href",
      `${routes.estimator}?paketa=business&faqe=7&shtesa=blog`,
    );
  });

  test("a website concept is referenced in the request", async ({ page }) => {
    await page.goto(`${routes.projects}/klinike-dentare`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: "Merr ofertë për një projekt të ngjashëm" }).click();
    await expect(page).toHaveURL(/\/kontakt\?paketa=business&projekti=klinike-dentare$/);
    const form = quoteForm(page);
    await expect(form.getByText("Koncepti që ju interesoi")).toBeVisible();
    await expect(form.getByText("Klinikë dentare", { exact: true })).toBeVisible();

    await form.getByRole("button", { name: "Hiq konceptin" }).click();
    await expect(form.getByText("Koncepti që ju interesoi")).toHaveCount(0);
    await expect(form.getByLabel("Lloji i projektit")).toBeFocused();
  });

  test("ignores invalid and malicious parameters", async ({ page }) => {
    const dialogs: string[] = [];
    page.on("dialog", (dialog) => {
      dialogs.push(dialog.message());
      void dialog.dismiss();
    });
    const query =
      "?paketa=%3Cscript%3Ealert(1)%3C%2Fscript%3E&faqe=-5&shtesa=%22%3E%3Cimg%20src%3Dx%20onerror%3Dalert(2)%3E&projekti=..%2F..%2Fetc";
    const response = await page.goto(`${routes.contact}${query}`);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.getByLabel("Paketa")).toHaveValue("");
    await expect(page.getByLabel("Lloji i projektit")).toHaveValue("");
    await expect(page.getByTestId("quote-estimate-total")).toHaveCount(0);
    await expect(page.getByText("Koncepti që ju interesoi")).toHaveCount(0);
    await expect(page.locator("main img[src='x']")).toHaveCount(0);
    expect(dialogs).toEqual([]);
  });

  test("clamps hand-edited estimator values", async ({ page }) => {
    await openContact(page, "?paketa=business&faqe=500&shtesa=payments,blog");
    // 30 pages is the Business maximum; payments is not available for Business.
    const total = page.getByTestId("quote-estimate-total");
    await expect.poll(async () => (await total.textContent())?.replace(/\s/g, " ")).toBe("nga 1249 €");
  });
});

test.describe("quote form submission", () => {
  test("shows helpful errors for an empty form and moves focus to them", async ({ page }) => {
    await openContact(page);
    await submit(page).click();

    const summary = page.locator("#quote-error-summary");
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("Ju lutemi korrigjoni 7 fusha:");
    const name = page.getByLabel("Emri dhe mbiemri");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription("Shkruani emrin tuaj.");

    await summary.getByRole("link", { name: "Shkruani adresën tuaj të email-it." }).click();
    await expect(page.getByLabel("Email", { exact: true })).toBeFocused();
  });

  test("validates formats on the client", async ({ page }) => {
    await openContact(page);
    await fillValid(page);
    await page.getByLabel("Email", { exact: true }).fill("arta@example");
    await page.getByLabel("Numri i telefonit (opsionale)").fill("abc");
    await page.getByLabel("Përshkrimi i projektit").fill("Shkurt");
    await submit(page).click();
    await expect(page.locator("#quote-error-summary")).toContainText("Ju lutemi korrigjoni 3 fusha:");
    await expect(page.getByText("Shkruani një adresë email të vlefshme").first()).toBeVisible();
    await expect(page.getByText("Shkruani të paktën 20 karaktere").first()).toBeVisible();
  });

  test("sends a valid request and confirms only after the email was accepted", async ({ page, request }) => {
    const email = uniqueEmail();
    const openedAt = await openContact(page, "?paketa=business&faqe=6&projekti=restorant-tradicional");
    await fillValid(page, { selectPackage: false, email });
    await waitForMinFillTime(page, openedAt);
    await submit(page).click();

    const heading = page.getByRole("heading", { name: "Faleminderit, kërkesa juaj u dërgua!" });
    await expect(heading).toBeFocused();
    await expect(page.getByText(`do t'ju kthejmë përgjigje në ${email}`)).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/testim|konsol/i);

    // The email reached the (mock) provider exactly once, with the estimate recalculated on the server.
    const received = await emailsFrom(request, email);
    expect(received).toHaveLength(1);
    const sent = received[0]!;
    expect(sent.to).toEqual(["quotes@example.test"]);
    expect(sent.subject).toBe("Kërkesë për ofertë: Arta Krasniqi – Website biznesi");
    expect(sent.idempotencyKey).toMatch(/^quote-/);
    expect(sent.text.replace(/\s/g, " ")).toContain("Totali orientues: nga 429 €");
    expect(sent.text).toContain("Restorant tradicional");

    const summary = page.getByRole("region", { name: "Faleminderit, kërkesa juaj u dërgua!" });
    await expect(summary).toContainText("Website biznesi");
    await expect(summary).toContainText(/Business \(nga 399\s€\)/);

    await page.getByRole("button", { name: "Dërgo një kërkesë tjetër" }).click();
    await expect(page.getByLabel("Emri dhe mbiemri")).toBeFocused();
    await expect(page.getByLabel("Emri dhe mbiemri")).toHaveValue("");
  });

  test("works with the keyboard alone", async ({ page }) => {
    const openedAt = await openContact(page);
    await page.getByLabel("Emri dhe mbiemri").focus();
    await page.keyboard.type("Arta Krasniqi");
    await page.keyboard.press("Tab");
    await page.keyboard.type("Biznesi Test");
    await page.keyboard.press("Tab");
    await page.keyboard.type("arta@example.com");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Lloji i projektit")).toBeFocused();
    await page.getByLabel("Lloji i projektit").selectOption("ecommerce");
    await page.getByLabel("Paketa").selectOption("unsure");
    await page.getByLabel("Buxheti i përafërt").selectOption("unsure");
    await page.getByLabel("Afati i dëshiruar").selectOption("asap");
    await page.getByLabel("Afati i dëshiruar").focus();
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Përshkrimi i projektit")).toBeFocused();
    await page.keyboard.type("Online shop për produkte vendore me pagesë në dorëzim.");
    await page.keyboard.press("Tab");
    // The honeypot is skipped: focus goes straight to the submit button.
    await expect(submit(page)).toBeFocused();
    await waitForMinFillTime(page, openedAt);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Faleminderit, kërkesa juaj u dërgua!" })).toBeFocused();
  });

  test("shows a loading state while sending", async ({ page }) => {
    const openedAt = await openContact(page);
    await fillValid(page);
    await waitForMinFillTime(page, openedAt);
    let release!: () => void;
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route(`**${routes.contact}*`, async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await held;
      return route.continue();
    });

    await submit(page).click();
    const sending = page.getByRole("button", { name: "Duke dërguar…" });
    await expect(sending).toBeVisible();
    await expect(sending).toHaveAttribute("aria-disabled", "true");
    await expect(page.getByRole("form", { name: "Kërkesë për ofertë" })).toHaveAttribute("aria-busy", "true");
    // A second click while sending does not send twice.
    await sending.click({ force: true });
    release();
    await expect(page.getByRole("heading", { name: "Faleminderit, kërkesa juaj u dërgua!" })).toBeVisible();
  });

  test("never confirms when the email provider fails", async ({ page, request }) => {
    const email = uniqueEmail();
    const openedAt = await openContact(page);
    await fillValid(page, { email, description: "Website për restorantin tonë. [mock-resend:fail]" });
    await waitForMinFillTime(page, openedAt);
    await submit(page).click();
    await expect(formAlert(page)).toContainText("Kërkesa nuk u dërgua për shkak të një problemi teknik");
    await expect(page.getByRole("heading", { name: "Faleminderit, kërkesa juaj u dërgua!" })).toHaveCount(0);
    await expect(page.getByLabel("Email", { exact: true })).toHaveValue(email);
    expect(await emailsFrom(request, email)).toEqual([]);
  });

  test("keeps the data and explains a network failure", async ({ page }) => {
    const openedAt = await openContact(page);
    await fillValid(page);
    await waitForMinFillTime(page, openedAt);
    await page.route(`**${routes.contact}*`, (route) =>
      route.request().method() === "POST" ? route.abort("internetdisconnected") : route.continue(),
    );
    await submit(page).click();
    await expect(formAlert(page)).toContainText("Nuk u lidhëm dot me serverin");
    await expect(page.getByLabel("Emri dhe mbiemri")).toHaveValue("Arta Krasniqi");
  });

  test("keeps the data and explains a server error", async ({ page }) => {
    const openedAt = await openContact(page);
    await fillValid(page);
    await waitForMinFillTime(page, openedAt);
    await page.route(`**${routes.contact}*`, (route) =>
      route.request().method() === "POST" ? route.fulfill({ status: 500, body: "Internal Server Error" }) : route.continue(),
    );
    await submit(page).click();
    await expect(formAlert(page)).toContainText("provoni përsëri");
    await expect(page.getByLabel("Përshkrimi i projektit")).not.toHaveValue("");
    await expect(page.getByRole("heading", { name: /Faleminderit/ })).toHaveCount(0);
  });
});

test.describe("quote form spam protection", () => {
  test("rejects a form submitted faster than a person can fill it", async ({ page, request }) => {
    const email = uniqueEmail();
    await openWithFrozenClock(page);
    await fillValid(page, { email });
    await submit(page).click();
    await expect(formAlert(page)).toContainText("Formulari u dërgua shumë shpejt");
    await expect(page.getByRole("heading", { name: /Faleminderit/ })).toHaveCount(0);
    expect(await emailsFrom(request, email)).toEqual([]);
  });

  test("rejects requests with the honeypot filled in", async ({ page, request }) => {
    const email = uniqueEmail();
    const openedAt = await openContact(page);
    await fillValid(page, { email });
    // A bot filling every input it finds; people never see this field.
    await page.locator("#quote-website").fill("https://spam.example", { force: true });
    await waitForMinFillTime(page, openedAt);
    await submit(page).click();
    await expect(formAlert(page)).toContainText("Kërkesa nuk mund të pranohej");
    await expect(page.getByRole("heading", { name: /Faleminderit/ })).toHaveCount(0);
    expect(await emailsFrom(request, email)).toEqual([]);
  });

  test("the honeypot is hidden from people and assistive technology", async ({ page }) => {
    await openContact(page);
    const trap = page.locator("#quote-website");
    await expect(trap).toHaveAttribute("tabindex", "-1");
    await expect(trap).not.toBeInViewport();
    await expect(page.getByRole("textbox", { name: "Mos e plotësoni këtë fushë" })).toHaveCount(0);
  });

  test("rate-limits repeated requests from one visitor", async ({ page }) => {
    await openWithFrozenClock(page);
    await fillValid(page);
    // Every request counts, so quick (rejected) attempts reach the limit without waiting.
    for (let i = 0; i < quoteProtection.perVisitor.limit; i++) {
      await submit(page).click();
      await expect(formAlert(page)).toContainText("Formulari u dërgua shumë shpejt");
      await expect(submit(page)).toBeVisible();
    }
    await submit(page).click();
    await expect(formAlert(page)).toContainText(
      "Keni dërguar disa kërkesa brenda një kohe të shkurtër. Ju lutemi provoni përsëri pas 10 minutash.",
    );
  });
});
