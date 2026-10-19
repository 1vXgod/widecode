import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * The floating back-to-top button: shown only after scrolling, scrolls back
 * smoothly (instantly with reduced motion), localized, keyboard-accessible,
 * and clear of the other fixed elements on phones, tablets and desktops.
 */
const labels = { "/": "Kthehu në krye", "/en": "Back to top", "/de": "Zurück nach oben" } as const;

/** The button in any state (while hidden it is inert, so it is not in the accessibility tree). */
const anyState = (page: Page) => page.locator("button.back-to-top");

async function scrollToY(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
}

async function expectHidden(button: Locator) {
  await expect(button).toHaveAttribute("inert", "");
  await expect(button).toHaveCSS("opacity", "0");
  await expect(button).toHaveCSS("pointer-events", "none");
}

async function expectShown(button: Locator) {
  await expect(button).not.toHaveAttribute("inert");
  await expect(button).toHaveCSS("opacity", "1");
}

function overlaps(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

test.describe("back-to-top button", () => {
  for (const [path, label] of Object.entries(labels)) {
    test(`${path}: hidden at the top, shown after scrolling, and back to the top on click`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const button = anyState(page);
      // Hidden means inert (out of the tab order and the accessibility tree), not only transparent.
      await expectHidden(button);

      await scrollToY(page, 300);
      await expectHidden(button);

      await scrollToY(page, 1200);
      const visible = page.getByRole("button", { name: label });
      await expect(visible).toBeVisible();
      await expectShown(button);

      await visible.click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await expectHidden(button);
      expect(errors).toEqual([]);
    });
  }

  test("is server-rendered hidden, so hydration never changes what was shown", async ({ request }) => {
    for (const [path, label] of Object.entries(labels)) {
      const html = await (await request.get(path)).text();
      const tag = html.match(/<button[^>]*class="[^"]*back-to-top[^"]*"[^>]*>/)?.[0] ?? "";
      expect(tag, path).toContain(`aria-label="${label}"`);
      expect(tag, path).toContain('type="button"');
      expect(tag, path).toMatch(/\sinert=""/);
      expect(tag, path).toContain("opacity-0");
    }
  });

  test("scrolls smoothly by default", async ({ page }) => {
    await page.goto("/sherbimet");
    await page.waitForLoadState("networkidle");
    const start = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    await scrollToY(page, start);
    await expectShown(anyState(page));
    await page.evaluate(() => {
      const positions: number[] = [];
      (window as unknown as { __positions: number[] }).__positions = positions;
      window.addEventListener("scroll", () => positions.push(window.scrollY), { passive: true });
    });
    await page.getByRole("button", { name: "Kthehu në krye" }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    const positions = await page.evaluate(() => (window as unknown as { __positions: number[] }).__positions);
    // Intermediate positions on the way up: an animation, not a jump.
    expect(positions.some((y) => y > 0 && y < start)).toBe(true);
  });

  test("jumps instantly when the visitor prefers reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/de/leistungen");
    await page.waitForLoadState("networkidle");
    await scrollToY(page, 2500);
    const button = page.getByRole("button", { name: "Zurück nach oben" });
    await expect(button).toBeVisible();
    await page.evaluate(() => {
      const positions: number[] = [];
      (window as unknown as { __positions: number[] }).__positions = positions;
      window.addEventListener("scroll", () => positions.push(window.scrollY), { passive: true });
    });
    await button.click();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await page.waitForTimeout(300);
    const positions = await page.evaluate(() => (window as unknown as { __positions: number[] }).__positions);
    expect(positions.every((y) => y === 0)).toBe(true);
  });

  test("works from the keyboard and continues from the top of the page", async ({ page }) => {
    await page.goto("/en/pricing");
    await page.waitForLoadState("networkidle");
    await scrollToY(page, 1500);
    const button = page.getByRole("button", { name: "Back to top" });
    await expect(button).toBeVisible();

    // Reachable with Tab, as the last stop of the page.
    await page.locator("footer a").last().focus();
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS("outline-style", "solid");

    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    // Focus moved to the start of the page: the skip link, then the header.
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
    await expectHidden(anyState(page));
  });

  test("is not in the tab order while hidden", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Focus the last link without scrolling to it (scrolling down would rightly show the button).
    await page.locator("footer a").last().evaluate((link: HTMLElement) => link.focus({ preventScroll: true }));
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await page.keyboard.press("Tab");
    await expect(anyState(page)).not.toBeFocused();
    await expectHidden(anyState(page));
  });

  test("works after client-side navigation, in the new page's language", async ({ page }) => {
    await page.goto("/de");
    await page.waitForLoadState("networkidle");
    await scrollToY(page, 99_999);
    await expectShown(anyState(page));
    await page.getByRole("contentinfo").getByRole("link", { name: "Preise" }).click();
    await expect(page).toHaveURL(/\/de\/preise$/);
    // The new page opens at its top, so the button hides again.
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(400);
    await expectHidden(anyState(page));

    await scrollToY(page, 1500);
    const button = page.getByRole("button", { name: "Zurück nach oben" });
    await expect(button).toBeVisible();
    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    // And after switching language.
    await page.getByRole("button", { name: /Sprache wechseln/ }).click();
    await page.getByRole("navigation", { name: "Sprache" }).first().getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/pricing$/);
    await scrollToY(page, 1500);
    await expect(page.getByRole("button", { name: "Back to top" })).toBeVisible();
  });

  test("is on 404 pages too", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 500 });
    await page.goto("/de/gibt-es-nicht");
    await page.waitForLoadState("networkidle");
    await scrollToY(page, 99_999);
    await expect(page.getByRole("button", { name: "Zurück nach oben" })).toBeVisible();
  });

  test("has no detectable accessibility violations while shown", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    await scrollToY(page, 1500);
    await expectShown(anyState(page));
    const results = await new AxeBuilder({ page }).include("button.back-to-top").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations).toEqual([]);
    // At least 44 × 44 px, a comfortable touch target.
    const box = (await anyState(page).boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  for (const viewport of [
    { name: "phone", width: 360, height: 740 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ]) {
    test.describe(`on a ${viewport.name}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test("sits in the bottom-right corner, inside the screen, and clear of the footer's last line", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
        await scrollToY(page, 99_999);
        await expectShown(anyState(page));
        const box = (await anyState(page).boundingBox())!;
        const right = viewport.width - (box.x + box.width);
        const bottom = viewport.height - (box.y + box.height);
        // The page gutter: 1rem on phones up to 2rem on wide screens; the same on both edges.
        expect(right).toBeGreaterThanOrEqual(16);
        expect(right).toBeLessThanOrEqual(32);
        expect(Math.abs(right - bottom)).toBeLessThanOrEqual(1);

        // The legal line at the very bottom of the page stays readable.
        const text = await page.locator("footer p").last().evaluate((p) => {
          const range = document.createRange();
          range.selectNodeContents(p);
          return [...range.getClientRects()].map(({ x, y, width, height }) => ({ x, y, width, height }));
        });
        for (const rect of text) expect(overlaps(rect, box)).toBe(false);
      });

      test("never covers the price calculator's total bar or the header", async ({ page }) => {
        await page.goto("/llogarit-cmimin?paketa=business");
        await page.waitForLoadState("networkidle");
        // Into the package options, where the compact total bar appears on small screens
        // (the options are in view, the summary below them is not).
        const bar = page.locator("[data-bottom-bar]");
        const firstOption = await page.getByRole("radio").first().evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
        await scrollToY(page, Math.max(firstOption - 100, 500));
        // On a phone the options are taller than the screen, so the bar appears (on a portrait tablet the
        // whole form fits, the summary stays in view and the bar is not needed; above lg it never shows).
        if (viewport.name === "phone") {
          // Further down step by step until the summary is out of view and the bar appears.
          await expect(async () => {
            if ((await bar.getAttribute("data-bottom-bar")) !== "shown") {
              await page.evaluate(() => window.scrollBy({ top: 150, behavior: "instant" }));
            }
            expect(await bar.getAttribute("data-bottom-bar")).toBe("shown");
          }).toPass({ intervals: [250] });
        }
        await expectShown(anyState(page));
        await page.waitForTimeout(400); // the bar's and button's transitions
        const box = (await anyState(page).boundingBox())!;
        if (await bar.isVisible()) {
          const barBox = (await bar.boundingBox())!;
          if (barBox.y < viewport.height) expect(overlaps(box, barBox)).toBe(false);
        }
        const header = (await page.locator("header").first().boundingBox())!;
        expect(overlaps(box, header)).toBe(false);
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      });
    });
  }

  test.describe("with the mobile menu open", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("stays underneath the menu", async ({ page }) => {
      await page.goto("/en/services");
      await page.waitForLoadState("networkidle");
      await scrollToY(page, 1500);
      await expectShown(anyState(page));
      const box = (await anyState(page).boundingBox())!;
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
      const topmost = await page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.closest("button.back-to-top") !== null,
        { x: box.x + box.width / 2, y: box.y + box.height / 2 },
      );
      expect(topmost).toBe(false);
    });
  });
});
