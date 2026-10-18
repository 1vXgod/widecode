import { expect, test } from "@playwright/test";
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
