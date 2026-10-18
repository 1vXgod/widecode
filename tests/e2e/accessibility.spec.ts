import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Scroll through the page so every scroll-reveal element has faded in, then
 * return to the top. axe then checks content in the state visitors read it,
 * instead of measuring not-yet-revealed (transparent) elements below the fold.
 */
async function revealWholePage(page: Page) {
  await page.waitForLoadState("networkidle");
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(40);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // Stop the hero showcase rotation (as a visitor can) so axe never samples a
  // half-finished crossfade between stages.
  const pause = page.getByRole("button", { name: "Ndalo ndërrimin automatik" });
  if (await pause.count()) await pause.click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(800); // longer than the 0.7s reveal and 0.5s crossfade transitions
}

const pages = ["/", "/sherbimet", "/rreth-nesh", "/cmimet", "/llogarit-cmimin", "/nuk-ekziston"];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 800 },
];

for (const viewport of viewports) {
  test.describe(`axe (${viewport.name})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const path of pages) {
      test(`${path} has no detectable WCAG A/AA violations`, async ({ page }) => {
        test.setTimeout(60_000);
        await page.goto(path);
        await revealWholePage(page);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
      });
    }
  });
}

test.describe("axe with mobile menu open", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("open menu has no detectable violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Hap menynë" }).click();
    await expect(page.getByRole("dialog", { name: "Menyja" })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
