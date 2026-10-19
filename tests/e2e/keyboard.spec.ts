import { expect, test } from "@playwright/test";

test.describe("keyboard access", () => {
  test("skip link is first in tab order and moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Kalo te përmbajtja kryesore" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("focused controls show a visible focus outline", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? getComputedStyle(el).outlineStyle : "none";
    });
    expect(outline).not.toBe("none");
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens from the keyboard, traps focus, closes with Escape and restores focus", async ({ page }) => {
    await page.goto("/");
    // A key press before hydration reaches a button without its handler yet.
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "Hap menynë" });
    await expect(page.getByRole("navigation", { name: "Navigimi kryesor" })).toBeHidden();

    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Menyja" });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // The page behind the modal is inert: tabbing cycles through the dialog and
    // may pass through the browser UI (activeElement = <body>), but never lands
    // on page content outside the dialog.
    const locations: string[] = [];
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      locations.push(
        await page.evaluate(() => {
          const active = document.activeElement;
          if (!active || active === document.body) return "browser";
          return active.closest("dialog") ? "dialog" : "outside";
        }),
      );
    }
    expect(locations).not.toContain("outside");
    expect(locations.lastIndexOf("dialog")).toBeGreaterThan(locations.indexOf("browser"));

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("navigates and closes when a link is chosen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Hap menynë" }).click();
    const dialog = page.getByRole("dialog", { name: "Menyja" });
    await dialog.getByRole("link", { name: "Shërbimet" }).click();
    await expect(page).toHaveURL(/\/sherbimet$/);
    await expect(dialog).toBeHidden();
  });

  test("locks background scrolling while open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Hap menynë" }).click();
    const overflow = await page.evaluate(() => getComputedStyle(document.documentElement).overflow);
    expect(overflow).toBe("hidden");
  });
});
