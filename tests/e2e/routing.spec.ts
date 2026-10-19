import { expect, test } from "@playwright/test";
import { projectHref, projectSlugs } from "../../src/config/projects";
import { mainNav, routes } from "../../src/config/routes";

/**
 * Routing foundation: every page lives under app/[lang], while Albanian URLs
 * stay exactly as they were (src/proxy.ts, src/i18n/routing.ts). These checks
 * use raw HTTP responses where it matters, so they see what crawlers and
 * visitors without JavaScript get.
 */
const albanianPages = [...Object.values(routes), ...projectSlugs.map(projectHref)];

test.describe("Albanian URLs", () => {
  test("every page answers at its existing URL, prerendered, in Albanian", async ({ request }) => {
    for (const path of albanianPages) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(200);
      // Served from the build's prerendered output, as before the move to app/[lang].
      expect(response.headers()["x-nextjs-prerender"], path).toBeTruthy();
      const html = await response.text();
      expect(html, path).toContain('<html lang="sq"');
      // The internal language segment never leaks into links.
      expect(html, path).not.toMatch(/href="\/sq(\/|")/);
    }
  });

  // Pages are prerendered at their internal path (/sq/...). If the navigation used that
  // path, the server HTML would have no current page while the browser marks one:
  // a hydration error (React #418) on every page in the main navigation.
  test("the prerendered HTML already marks the current page in the navigation", async ({ request }) => {
    for (const key of mainNav) {
      const html = await (await request.get(routes[key])).text();
      // Attribute order is up to React, so check each <a> tag as a whole.
      const current = (html.match(/<a\s[^>]*>/g) ?? []).filter((tag) => tag.includes('aria-current="page"'));
      expect(current.length, key).toBeGreaterThan(0);
      expect(current.every((tag) => tag.includes(`href="${routes[key]}"`)), key).toBe(true);
    }
  });

  test("pages hydrate without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of [routes.home, routes.services, routes.contact, projectHref("klinike-dentare")]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(errors).toEqual([]);
  });

  test("query strings and anchors work as before", async ({ page }) => {
    await page.goto(`${routes.estimator}?paketa=professional&faqe=12&shtesa=booking`);
    await expect(page.getByRole("radio", { name: /Professional/ })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: /Rezervime ose takime/ })).toBeChecked();
    await expect(page).toHaveURL(/\/llogarit-cmimin\?paketa=professional&faqe=12&shtesa=booking$/);

    await page.goto(`${routes.about}#procesi`);
    await expect(page.locator("#procesi")).toBeInViewport();
    await expect(page).toHaveURL(/\/rreth-nesh#procesi$/);
  });

  test("client-side navigation keeps the public URLs and the current-page marker", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const nav = page.getByRole("navigation", { name: "Navigimi kryesor" });
    await nav.getByRole("link", { name: "Shërbimet" }).click();
    await expect(page).toHaveURL(/\/sherbimet$/);
    await expect(nav.getByRole("link", { name: "Shërbimet" })).toHaveAttribute("aria-current", "page");
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(nav.getByRole("link", { name: "Ballina" })).toHaveAttribute("aria-current", "page");
  });
});

test.describe("redirects", () => {
  test("/sq and /sq/... move permanently to the unprefixed URL, keeping the query", async ({ request }) => {
    for (const [from, to] of [
      ["/sq", "/"],
      ["/sq/sherbimet", "/sherbimet"],
      ["/sq/kontakt?paketa=business&vleresim=1", "/kontakt?paketa=business&vleresim=1"],
      ["/sq/projektet/klinike-dentare", "/projektet/klinike-dentare"],
    ]) {
      const response = await request.get(from!, { maxRedirects: 0 });
      expect(response.status(), from).toBe(308);
      const location = new URL(response.headers().location!, "http://localhost");
      expect(location.pathname + location.search, from).toBe(to);
    }
  });
});

test.describe("404 pages", () => {
  for (const path of [
    "/nuk-ekziston",
    "/nuk/ekziston/aspak",
    "/sherbimet/extra",
    "/projektet/nuk-ekziston",
    "/projektet/studio-fotografie/extra",
    "/de",
    "/de/leistungen",
    "/fr/services",
    "/brand/nuk-ekziston",
    "/foo.php",
    "/%",
  ]) {
    test(`${path} is a complete Albanian 404 page, without JavaScript`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status()).toBe(404);
      const html = await response.text();
      expect(html).toContain('<html lang="sq"');
      expect(html).toContain("<title>Faqja nuk u gjet | WideCode</title>");
      expect(html).toMatch(/<h1[^>]*>Faqja nuk u gjet<\/h1>/);
      // Inside the normal site frame, with navigation back to the site.
      expect(html).toContain('aria-label="Navigimi kryesor"');
      expect(html).toContain('name="robots" content="noindex');
    });
  }

  test("missing files still get a 404", async ({ request }) => {
    expect((await request.get("/brand/nuk-ekziston.png")).status()).toBe(404);
    expect((await request.get("/projects/nuk-ekziston/hero.jpg")).status()).toBe(404);
  });
});
