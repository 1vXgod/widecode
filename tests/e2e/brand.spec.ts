import { expect, test, type Locator, type Page } from "@playwright/test";

/** Files in public/brand (src/components/brand/logo.tsx): width / height of each. */
const LOGOS = {
  dark: { src: "/brand/wide-code-logo-on-dark.png", ratio: 562 / 102 },
  light: { src: "/brand/wide-code-logo-light.png", ratio: 694 / 139 },
} as const;

async function expectLogoRendered(img: Locator, expectedHeight: number, theme: keyof typeof LOGOS) {
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute("src", new RegExp(encodeURIComponent(LOGOS[theme].src)));
  const box = await img.evaluate((el) => {
    const image = el as HTMLImageElement;
    const rect = image.getBoundingClientRect();
    return { loaded: image.complete && image.naturalWidth > 0, w: rect.width, h: rect.height, naturalW: image.naturalWidth, naturalH: image.naturalHeight };
  });
  expect(box.loaded).toBe(true);
  expect(box.h).toBeCloseTo(expectedHeight, 0);
  // Not stretched: shown in the proportions of the image the browser received…
  expect(box.w / box.h).toBeCloseTo(box.naturalW / box.naturalH, 1);
  // …which is the source file resized: next/image rounds the height to whole pixels (e.g. 256×46.46 → 256×46).
  expect(Math.abs(box.naturalH - box.naturalW / LOGOS[theme].ratio)).toBeLessThanOrEqual(1);
}

async function showTheme(page: Page, theme: keyof typeof LOGOS) {
  await page.emulateMedia({ colorScheme: theme });
  await expect.poll(() => page.evaluate(() => document.head.querySelector<HTMLMetaElement>('meta[name="widecode-theme"]')?.content)).toBe(theme);
}

test.describe("logo", () => {
  for (const theme of ["dark", "light"] as const) {
    test(`header and footer show the official logo on desktop (${theme} theme)`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/");
      await showTheme(page, theme);
      await expectLogoRendered(page.getByRole("banner").getByRole("img", { name: "WideCode" }), 26, theme);

      const footerLogo = page.getByRole("contentinfo").getByRole("img", { name: "WideCode" });
      await footerLogo.scrollIntoViewIfNeeded();
      await expectLogoRendered(footerLogo, 32, theme);
    });

    test(`header and mobile menu show the official logo on mobile (${theme} theme)`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 760 });
      await page.goto("/");
      await showTheme(page, theme);
      await expectLogoRendered(page.getByRole("banner").getByRole("img", { name: "WideCode" }), 26, theme);

      // A click before hydration reaches the button without its handler yet.
      await page.waitForLoadState("networkidle");
      await page.getByRole("button", { name: "Hap menynë" }).click();
      await expectLogoRendered(page.getByRole("dialog", { name: "Menyja" }).getByRole("img", { name: "WideCode" }), 26, theme);
    });
  }

  test("the logo files have no baked-in background: transparent around the artwork", async ({ page }) => {
    await page.goto("/");
    for (const { src } of Object.values(LOGOS)) {
      const edges = await page.evaluate(async (url) => {
        const image = new Image();
        image.src = url;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d")!;
        context.drawImage(image, 0, 0);
        const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
        const alpha = (x: number, y: number) => data[(y * width + x) * 4 + 3]!;
        const border = [];
        for (let x = 0; x < width; x++) border.push(alpha(x, 0), alpha(x, height - 1));
        for (let y = 0; y < height; y++) border.push(alpha(0, y), alpha(width - 1, y));
        return {
          corners: [alpha(0, 0), alpha(width - 1, 0), alpha(0, height - 1), alpha(width - 1, height - 1)],
          // Share of the outermost pixels that are clearly visible: a box would make it ~100%.
          visibleBorder: border.filter((a) => a > 64).length / border.length,
        };
      }, src);
      expect(edges.corners, src).toEqual([0, 0, 0, 0]);
      expect(edges.visibleBorder, src).toBeLessThan(0.25);
    }
  });
});

test.describe("icons", () => {
  test("favicon and Apple touch icon are served as PNGs", async ({ page, request }) => {
    await page.goto("/");
    for (const rel of ["icon", "apple-touch-icon"]) {
      const href = await page.locator(`link[rel="${rel}"]`).first().getAttribute("href");
      expect(href, rel).toBeTruthy();
      const response = await request.get(href ?? "");
      expect(response.status(), rel).toBe(200);
      expect(response.headers()["content-type"], rel).toContain("image/png");
    }
    await expect(page.locator('link[href*="icon.svg"]')).toHaveCount(0);
  });
});
