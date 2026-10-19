import { expect, test, type Page } from "@playwright/test";
import { routes } from "../../src/config/routes";

const widths = [360, 768, 1024, 1280];

for (const width of widths) {
  test.describe(`layout at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    for (const path of [...Object.values(routes), `${routes.projects}/klinike-dentare`]) {
      test(`${path} has no horizontal overflow`, async ({ page }) => {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}

/**
 * Service cards (home page and about page) in every language: every text line
 * stays inside its card, and long words (German compounds such as
 * "Unternehmenswebsite") break only at a space or a hyphen, including the soft
 * hyphens in the copy, never in the middle of a word.
 */
test.describe("service cards keep their text inside", () => {
  const cardLists = [
    ["/", "#sherbimet ul"],
    ["/en", "#sherbimet ul"],
    ["/de", "#sherbimet ul"],
    ["/rreth-nesh", 'section[aria-labelledby="about-services-title"] ul'],
    ["/en/about", 'section[aria-labelledby="about-services-title"] ul'],
    ["/de/ueber-uns", 'section[aria-labelledby="about-services-title"] ul'],
  ] as const;

  for (const width of [320, 390, 640, 768, 1024, 1280, 1440]) {
    test(`at ${width}px`, async ({ page }) => {
      test.slow(); // six pages
      await page.setViewportSize({ width, height: 900 });
      const problems: string[] = [];
      for (const [path, list] of cardLists) {
        await page.goto(path);
        const found = await page.locator(list).first().evaluate((ul) => {
          const SHY = String.fromCharCode(0xad);
          const found: string[] = [];
          for (const card of ul.querySelectorAll(":scope > li > *")) {
            const box = card.getBoundingClientRect();
            const style = getComputedStyle(card);
            const left = box.left + parseFloat(style.paddingLeft) - 0.5;
            const right = box.right - parseFloat(style.paddingRight) + 0.5;
            const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
              const node = walker.currentNode as Text;
              const text = node.data;
              if (!text.trim()) continue;
              const range = document.createRange();
              let lineTop: number | null = null;
              for (let i = 0; i < text.length; i++) {
                range.setStart(node, i);
                range.setEnd(node, i + 1);
                // The first character of a wrapped line can also report a box at the end of the
                // previous line; its own box is the last one.
                const rect = [...range.getClientRects()].filter((r) => r.width > 0).at(-1);
                if (!rect) continue;
                if (rect.left < left || rect.right > right) {
                  found.push(`"${text.trim()}" leaves its card (${Math.round(rect.right - right)}px)`);
                  break;
                }
                // A new line starts at this character: the previous one must allow a break.
                if (lineTop !== null && rect.top > lineTop + rect.height / 2 && !/[\s-]/.test(text[i - 1]!) && text[i - 1] !== SHY && text[i] !== " ") {
                  found.push(`"${text.trim()}" breaks inside a word, before "${text.slice(i, i + 6)}"`);
                  break;
                }
                lineTop = rect.top;
              }
            }
          }
          return found;
        });
        problems.push(...found.map((problem) => `${path}: ${problem}`));
      }
      // Every page's problems at once, so a failure shows the whole picture.
      expect(problems, `at ${width}px`).toEqual([]);
    });
  }
});

/**
 * The price calculator's summary buttons on narrow phones. Their labels are
 * long ("Angebot mit dieser Schätzung anfordern"), so they wrap inside the
 * panel instead of widening the page; both stay usable.
 */
test.describe("price calculator buttons on narrow screens", () => {
  const calculators = [
    { path: "/llogarit-cmimin", cta: "Kërko ofertë me këtë vlerësim", reset: "Rifillo", contact: "/kontakt", total: "399 €" },
    { path: "/en/price-calculator", cta: "Request a quote with this estimate", reset: "Start over", contact: "/en/contact", total: "€399" },
    { path: "/de/preisrechner", cta: "Angebot mit dieser Schätzung anfordern", reset: "Neu beginnen", contact: "/de/kontakt", total: "399 €" },
  ];
  const query = "?paketa=professional&faqe=12&shtesa=booking";
  const total = async (page: Page) => (await page.getByTestId("estimate-total").first().textContent())?.replace(/\s/g, " ").trim();

  for (const calculator of calculators) {
    test(`${calculator.path} fits a 320px screen, and both buttons work`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 740 });
      await page.goto(`${calculator.path}${query}`);
      await page.waitForLoadState("networkidle");

      // No sideways scrolling.
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);

      const summary = page.locator("aside").filter({ has: page.getByTestId("estimate-total") }).first();
      const cta = summary.getByRole("link", { name: calculator.cta });
      const reset = summary.getByRole("button", { name: calculator.reset });
      const panel = (await summary.boundingBox())!;
      for (const button of [cta, reset]) {
        await button.scrollIntoViewIfNeeded();
        await expect(button).toBeVisible();
        const box = (await button.boundingBox())!;
        // Inside the panel and the screen, with a comfortable touch target and the whole label shown.
        expect(box.x).toBeGreaterThanOrEqual(panel.x);
        expect(box.x + box.width).toBeLessThanOrEqual(panel.x + panel.width);
        expect(box.x + box.width).toBeLessThanOrEqual(320);
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(await button.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      }

      // The quote link carries the estimate; Start over restores the default package.
      await expect(cta).toHaveAttribute("href", `${calculator.contact}?paketa=professional&faqe=12&shtesa=booking&vleresim=1`);
      await reset.click();
      await expect(page.getByRole("radio", { name: /Business/ })).toBeChecked();
      await expect.poll(() => total(page)).toBe(calculator.total);
      await expect(cta).toHaveAttribute("href", `${calculator.contact}?paketa=business&faqe=5&vleresim=1`);

      // Keyboard focus is visible on the wrapped button.
      await cta.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await expect(cta).toBeFocused();
      await expect(cta).toHaveCSS("outline-style", "solid");

      await cta.click();
      await expect(page).toHaveURL(new RegExp(`${calculator.contact}\\?paketa=business&faqe=5&vleresim=1$`));
    });
  }

  for (const width of [320, 360, 375, 390, 768, 1024, 1440]) {
    test(`no calculator in any language widens the page at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const { path } of calculators) {
        for (const packageQuery of ["", "?paketa=custom"]) {
          await page.goto(`${path}${packageQuery}`);
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          expect(overflow, `${path}${packageQuery}`).toBeLessThanOrEqual(0);
        }
      }
    });
  }
});

test.describe("navigation layout per breakpoint", () => {
  test("mobile shows the menu button, not the desktop nav", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Hap menynë" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Navigimi kryesor" })).toBeHidden();
  });

  test("desktop shows the nav, not the menu button", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Navigimi kryesor" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Hap menynë" })).toBeHidden();
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("animations and transitions are effectively disabled", async ({ page }) => {
    await page.goto("/");
    const durations = await page.evaluate(() => {
      const animated = document.querySelector(".animate-fade-up");
      const button = document.querySelector("main a");
      return {
        animation: animated ? getComputedStyle(animated).animationDuration : null,
        transition: button ? getComputedStyle(button).transitionDuration : null,
        scroll: getComputedStyle(document.documentElement).scrollBehavior,
      };
    });
    expect(durations.animation).not.toBeNull();
    expect(parseFloat(durations.animation ?? "1")).toBeLessThan(0.001);
    expect(durations.transition?.split(",").every((d) => parseFloat(d) < 0.001)).toBe(true);
    expect(durations.scroll).toBe("auto");
  });
});
