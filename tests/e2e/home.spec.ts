import { expect, test, type Page } from "@playwright/test";
import { routes } from "../../src/config/routes";

const sectionTitles = [
  "Çfarë ndërtojmë për biznesin tuaj",
  "Projekte demonstruese",
  "Çmime të qarta që në fillim",
  "Si punojmë",
  "Një partner i qartë për website-in tuaj",
  "Pyetjet e shpeshta",
  "Gati ta nisim projektin tuaj?",
];

function showcase(page: Page) {
  return page.getByRole("tablist", { name: /Shembull interaktiv/ });
}

test.describe("home page content", () => {
  test("renders the hero and all sections in order", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Website profesional që punon për biznesin tuaj");
    await expect(page.locator("main h2")).toHaveText(sectionTitles);
  });

  test("hero CTAs lead to the contact and projects pages", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByRole("region", { name: /Website profesional/ });
    await expect(hero.getByRole("link", { name: "Merr një ofertë" })).toHaveAttribute("href", routes.contact);
    await hero.getByRole("link", { name: "Shiko projektet" }).click();
    await expect(page).toHaveURL(/\/projektet$/);
  });

  test("hero states the lowest starting price from the pricing config", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("region", { name: /Website profesional/ })).toContainText("Çmime fillestare nga 199 €");
  });

  test("every project card is labelled as a demonstration", async ({ page }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: "Projekte demonstruese" });
    const cards = section.getByRole("article");
    await expect(cards).toHaveCount(3);
    for (const card of await cards.all()) {
      await expect(card).toContainText("Projekt demonstrues");
    }
    await expect(section).toContainText("Nuk janë punë për klientë realë.");
  });

  test("pricing preview shows configured starting prices and the disclaimer", async ({ page }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: "Çmime të qarta që në fillim" });
    for (const price of ["199 €", "399 €", "699 €", "999 €", "Me ofertë"]) {
      await expect(section).toContainText(price);
    }
    await expect(section).toContainText("Të gjitha çmimet janë fillestare dhe orientuese");
    await expect(section.getByRole("link", { name: "Zgjidh paketën: Business" })).toHaveAttribute(
      "href",
      `${routes.contact}?paketa=business`,
    );
  });

  test("FAQ items open and close from the keyboard", async ({ page }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: "Pyetjet e shpeshta" });
    const first = section.locator("details").first();
    const answer = first.locator("p");
    await expect(answer).toBeHidden();

    await first.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(answer).toBeVisible();
    await expect(answer).toContainText("199 €");

    await page.keyboard.press("Enter");
    await expect(answer).toBeHidden();
  });
});

test.describe("hero showcase", () => {
  test("tabs follow the keyboard pattern and stop auto-advancing once used", async ({ page }) => {
    await page.goto("/");
    // Keyboard handlers attach on hydration; wait for the client bundle to settle.
    await page.waitForLoadState("networkidle");
    const tabs = showcase(page).getByRole("tab");
    await expect(tabs).toHaveText([/Dizajni/, /Kodi/, /Gati/]);

    // Selecting a tab stops the rotation, so the rest of the test is deterministic.
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(0)).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel", { name: "Kodi" })).toBeVisible();

    await page.keyboard.press("End");
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

    // Manual selection stops the automatic rotation.
    await expect(page.getByRole("button", { name: "Vazhdo ndërrimin automatik" })).toBeVisible();
  });

  test("auto-advances over time and can be paused", async ({ page }) => {
    // Freeze the fake clock before load so time only moves when the test moves it.
    await page.clock.install({ time: new Date("2026-01-01T10:00:00Z") });
    await page.clock.pauseAt(new Date("2026-01-01T10:00:01Z"));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const tabs = showcase(page).getByRole("tab");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

    await page.clock.runFor(5_100);
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

    await page.getByRole("button", { name: "Ndalo ndërrimin automatik" }).click();
    await expect(page.getByRole("button", { name: "Vazhdo ndërrimin automatik" })).toBeVisible();
    await page.mouse.move(0, 0);
    await page.clock.runFor(15_000);
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

    // Resuming continues the rotation.
    await page.getByRole("button", { name: "Vazhdo ndërrimin automatik" }).click();
    await page.mouse.move(0, 0);
    await page.clock.runFor(5_100);
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("does not auto-advance and hides the pause control", async ({ page }) => {
      await page.clock.install();
      await page.goto("/");
      const tabs = showcase(page).getByRole("tab");
      await page.clock.fastForward(12_000);
      await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
      await expect(page.getByRole("button", { name: /ndërrimin automatik/ })).toHaveCount(0);
      await expect(page.getByTestId("showcase-progress")).toHaveCount(0);
    });
  });
});

test.describe("stability", () => {
  test("no console errors or uncaught exceptions on any page", async ({ page }) => {
    // Visits every route and waits for each to settle, so it needs more than the default 30s.
    test.setTimeout(120_000);
    const problems: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));

    for (const path of Object.values(routes)) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(problems).toEqual([]);
  });

  for (const [path, viewport] of ["/", "/sherbimet", "/rreth-nesh", "/cmimet", "/llogarit-cmimin"].flatMap((p) =>
    [
      { name: "mobile", width: 390, height: 844 },
      { name: "desktop", width: 1280, height: 800 },
    ].map((v) => [p, v] as const),
  )) {
    test(`${path} layout shift stays low (${viewport.name})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.addInitScript(() => {
        const w = window as unknown as { __cls: number };
        w.__cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
            if (!entry.hadRecentInput) w.__cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      for (let i = 0; i < 12; i++) {
        await page.mouse.wheel(0, 700);
        await page.waitForTimeout(120);
      }
      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls).toBeLessThan(0.1);
    });
  }
});
