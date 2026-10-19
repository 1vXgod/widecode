import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { quoteProtection } from "../../src/config/quote";
import { routes } from "../../src/config/routes";

/**
 * Complete visitor journeys across pages, ending in a quote request that the
 * local mock Resend API receives (see playwright.config.ts); nothing is emailed.
 */
let visitor = 0;
test.beforeEach(async ({ page }, testInfo) => {
  visitor += 1;
  // Own client address per test, so the quote form's rate limit never interferes.
  await page.setExtraHTTPHeaders({
    "x-forwarded-for": `203.0.${113 + (testInfo.workerIndex % 10)}.${(visitor % 250) + 1}`,
  });
});

const MOCK_RESEND_URL = `http://127.0.0.1:${process.env.MOCK_RESEND_PORT ?? 3199}`;

async function emailsFrom(request: APIRequestContext, address: string) {
  const all = (await (await request.get(`${MOCK_RESEND_URL}/emails`)).json()) as Array<{ reply_to: string; text: string }>;
  return all.filter((email) => email.reply_to === address);
}

const uniqueEmail = () => `journey+${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}@example.com`;

/** Fills in the fields a pre-filled link leaves empty, then sends once a person could have filled it in. */
async function completeAndSend(page: Page, email: string, openedAt: number) {
  const form = page.getByRole("form", { name: "Kërkesë për ofertë" });
  await form.getByLabel("Emri dhe mbiemri").fill("Arta Krasniqi");
  await form.getByLabel("Email", { exact: true }).fill(email);
  await form.getByLabel("Lloji i projektit").selectOption("ecommerce");
  await form.getByLabel("Buxheti i përafërt").selectOption("1000-2000");
  await form.getByLabel("Afati i dëshiruar").selectOption("flexible");
  await form.getByLabel("Përshkrimi i projektit").fill("Duam një online shop për produktet tona, me pagesa online.");
  const remaining = quoteProtection.minFillMs + 300 - (Date.now() - openedAt);
  if (remaining > 0) await page.waitForTimeout(remaining);
  await form.getByRole("button", { name: "Dërgo kërkesën" }).click();
  await expect(page.getByRole("heading", { name: "Faleminderit, kërkesa juaj u dërgua!" })).toBeFocused();
}

test.describe("visitor journeys", () => {
  test("home → pricing → estimator → quote request with the estimate", async ({ page, request }) => {
    test.slow();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("navigation", { name: "Navigimi kryesor" }).getByRole("link", { name: "Çmimet" }).click();
    await expect(page).toHaveURL(/\/cmimet$/);

    await page.getByRole("link", { name: "Llogarit me këtë paketë: E-commerce" }).click();
    await expect(page).toHaveURL(/\/llogarit-cmimin\?paketa=ecommerce$/);
    await page.waitForLoadState("networkidle");
    await page.getByRole("checkbox", { name: /Pagesa online/ }).check();
    await expect(page).toHaveURL(/shtesa=payments/);

    await page.getByRole("link", { name: "Kërko ofertë me këtë vlerësim" }).click();
    await expect(page).toHaveURL(/\/kontakt\?paketa=ecommerce&shtesa=payments&vleresim=1$/);
    await page.waitForLoadState("networkidle");
    const openedAt = Date.now();
    const form = page.getByRole("form", { name: "Kërkesë për ofertë" });
    await expect(form.getByLabel("Paketa")).toHaveValue("ecommerce");
    await expect.poll(async () => (await form.getByTestId("quote-estimate-total").textContent())?.replace(/\s/g, " ")).toBe(
      "nga 1149 €",
    );

    const email = uniqueEmail();
    await completeAndSend(page, email, openedAt);
    const [sent, ...more] = await emailsFrom(request, email);
    expect(more).toHaveLength(0);
    expect(sent!.text.replace(/\s/g, " ")).toContain("Pagesa online: 150 €");
    expect(sent!.text.replace(/\s/g, " ")).toContain("Totali orientues: nga 1149 €");
  });

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("menu → projects filter → concept → quote request about that concept", async ({ page, request }) => {
      test.slow();
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.getByRole("button", { name: "Hap menynë" }).click();
      await page.getByRole("dialog", { name: "Menyja" }).getByRole("link", { name: "Projektet", exact: true }).click();
      await expect(page).toHaveURL(/\/projektet$/);
      await page.waitForLoadState("networkidle");

      await page.getByRole("group", { name: "Filtro projektet sipas kategorisë" }).getByRole("button", { name: /Online Shop/ }).click();
      await expect(page).toHaveURL(/kategoria=online-shop$/);
      await page.getByRole("link", { name: "Online shop për veshje" }).click();
      await expect(page).toHaveURL(/\/projektet\/dyqan-veshjesh$/);
      await page.waitForLoadState("networkidle");

      await page.getByRole("link", { name: "Merr ofertë për një projekt të ngjashëm" }).click();
      await expect(page).toHaveURL(/\/kontakt\?paketa=ecommerce&projekti=dyqan-veshjesh$/);
      await page.waitForLoadState("networkidle");
      const openedAt = Date.now();
      await expect(page.getByRole("form", { name: "Kërkesë për ofertë" }).getByText("Koncepti që ju interesoi")).toBeVisible();

      const email = uniqueEmail();
      await completeAndSend(page, email, openedAt);
      const [sent] = await emailsFrom(request, email);
      expect(sent!.text).toContain("Online shop për veshje (https://widecode.example/projektet/dyqan-veshjesh)");
    });
  });
});

test.describe("security headers", () => {
  test("pages are served with a content security policy and hardening headers", async ({ request }) => {
    for (const path of ["/", routes.contact, `${routes.projects}/studio-fotografie`, "/nuk-ekziston"]) {
      const headers = (await request.get(path)).headers();
      const csp = headers["content-security-policy"] ?? "";
      expect(csp, path).toContain("default-src 'self'");
      expect(csp, path).toContain("frame-ancestors 'none'");
      expect(csp, path).toContain("object-src 'none'");
      // A production build never allows eval.
      expect(csp, path).not.toContain("unsafe-eval");
      expect(headers["x-content-type-options"], path).toBe("nosniff");
      expect(headers["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
      expect(headers["x-frame-options"], path).toBe("DENY");
      expect(headers["permissions-policy"], path).toContain("camera=()");
      expect(headers["x-powered-by"], path).toBeUndefined();
    }
  });
});
