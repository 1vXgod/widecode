import { expect, test, type Locator } from "@playwright/test";

const FILE_RATIO = 688 / 174;

async function expectLogoRendered(img: Locator, expectedHeight: number) {
  await expect(img).toBeVisible();
  const box = await img.evaluate((el) => {
    const image = el as HTMLImageElement;
    const rect = image.getBoundingClientRect();
    return { loaded: image.complete && image.naturalWidth > 0, w: rect.width, h: rect.height, natural: image.naturalWidth / image.naturalHeight };
  });
  expect(box.loaded).toBe(true);
  expect(box.h).toBeCloseTo(expectedHeight, 0);
  // Not stretched: rendered and intrinsic ratios both match the source file.
  expect(box.w / box.h).toBeCloseTo(FILE_RATIO, 1);
  expect(box.natural).toBeCloseTo(FILE_RATIO, 1);
}

test.describe("logo", () => {
  test("header and footer show the official logo on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expectLogoRendered(page.getByRole("banner").getByRole("img", { name: "WideCode" }), 44);

    const footerLogo = page.getByRole("contentinfo").getByRole("img", { name: "WideCode" });
    await footerLogo.scrollIntoViewIfNeeded();
    await expectLogoRendered(footerLogo, 52);
  });

  test("header and mobile menu show the official logo on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 760 });
    await page.goto("/");
    await expectLogoRendered(page.getByRole("banner").getByRole("img", { name: "WideCode" }), 44);

    await page.getByRole("button", { name: "Hap menynë" }).click();
    await expectLogoRendered(page.getByRole("dialog", { name: "Menyja" }).getByRole("img", { name: "WideCode" }), 44);
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
