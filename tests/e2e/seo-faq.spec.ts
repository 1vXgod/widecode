import { expect, test } from "@playwright/test";
import { projectSlugs } from "../../src/config/projects";
import { routes } from "../../src/config/routes";
import { E2E_SITE_URL } from "./e2e-site";

const allPaths = [...Object.values(routes), ...projectSlugs.map((slug) => `${routes.projects}/${slug}`)];

test.describe("FAQ page", () => {
  test("is a complete, indexable page with every topic", async ({ page }) => {
    await page.goto(routes.faq);
    await expect(page).toHaveTitle("Pyetjet e shpeshta: çmimet, procesi dhe website-i | WideCode");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pyetje dhe përgjigje");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    for (const topic of ["Çmimet dhe oferta", "Procesi dhe afatet", "Website-i dhe funksionalitetet", "Pas publikimit"]) {
      await expect(page.getByRole("region", { name: topic })).toBeVisible();
    }
    await expect(page.locator("main details")).toHaveCount(19);
    // Prices come from the pricing config, never as raw placeholders.
    await expect(page.locator("main")).not.toContainText(/\{\w+\}/);
    await expect(page.getByRole("region", { name: "Gati ta nisim projektin tuaj?" })).toBeVisible();
  });

  test("topic links jump to their section", async ({ page }) => {
    await page.goto(routes.faq);
    await page.waitForLoadState("networkidle");
    await page.getByRole("navigation", { name: "Temat" }).getByRole("link", { name: "Pas publikimit" }).click();
    await expect(page).toHaveURL(/#pas-publikimit$/);
    await expect(page.getByRole("heading", { name: "Pas publikimit", level: 2 })).toBeInViewport();
  });

  test("answers open and close with the keyboard and show configured prices", async ({ page }) => {
    await page.goto(routes.faq);
    const question = page.getByText("A mund ta kem website-in në dy gjuhë?");
    const answer = page.getByText(/funksionalitet shtesë me çmim orientues 150\s€/);
    await expect(answer).toBeHidden();
    await question.focus();
    await page.keyboard.press("Enter");
    await expect(answer).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(answer).toBeHidden();
  });

  test("previews on other pages link to the full FAQ", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Shiko të gjitha pyetjet" }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.faq}$`));
  });
});

test.describe("search engine metadata", () => {
  test("every page has a canonical URL, Open Graph and X metadata with the social image", async ({ page }) => {
    test.setTimeout(120_000); // visits every page
    for (const path of allPaths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonical ?? "").pathname, path).toBe(path);
      await expect(page.locator('meta[property="og:title"]'), path).toHaveAttribute("content", /WideCode/);
      await expect(page.locator('meta[property="og:description"]'), path).toHaveAttribute("content", /.{50,}/);
      await expect(page.locator('meta[property="og:locale"]'), path).toHaveAttribute("content", "sq_AL");
      await expect(page.locator('meta[property="og:image"]'), path).toHaveAttribute("content", /\/opengraph-image$/);
      await expect(page.locator('meta[name="twitter:card"]'), path).toHaveAttribute("content", "summary_large_image");
    }
  });

  test("query parameters never change the canonical URL", async ({ page }) => {
    for (const path of [`${routes.contact}?paketa=business`, `${routes.estimator}?paketa=starter`, `${routes.projects}?kategoria=online-shop`]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonical ?? "").search, path).toBe("");
    }
  });

  test("the social image is a 1200×630 PNG", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
    const png = await response.body();
    // PNG header: width and height are big-endian integers at bytes 16 and 20.
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain("User-Agent: *");
    expect(body).toContain("Allow: /");
    expect(body).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/);
  });

  test("the sitemap lists every page and project, and each one exists", async ({ request }) => {
    test.setTimeout(120_000); // visits every page
    const response = await request.get("/sitemap.xml");
    expect(response.headers()["content-type"]).toContain("xml");
    const locs = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
    expect(locs).toEqual(allPaths);
    for (const path of locs) expect((await request.get(path)).status(), path).toBe(200);
  });

  test("structured data is valid JSON and only states configured facts", async ({ page }) => {
    await page.goto("/");
    const home = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    const [organization, website] = home["@graph"];
    expect(organization["@type"]).toBe("Organization");
    expect(organization.name).toBe("WideCode");
    expect(organization).not.toHaveProperty("telephone");
    expect(organization).not.toHaveProperty("email");
    expect(website["@type"]).toBe("WebSite");

    await page.goto(routes.faq);
    const faq = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity).toHaveLength(await page.locator("main details").count());
    expect(faq.mainEntity[0].acceptedAnswer.text).toMatch(/nga 199\s€/);
  });
});

test.describe("SEO quality", () => {
  test("canonical URLs and og:url use the configured production domain, never localhost", async ({ page, request }) => {
    test.setTimeout(120_000); // visits every page
    for (const path of allPaths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // Compared as normalized URLs: Next.js writes the home page without the trailing slash.
      const expected = new URL(path, E2E_SITE_URL).href;
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonical ?? "").href, path).toBe(expected);
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
      expect(new URL(ogUrl ?? "").href, path).toBe(expected);
    }
    const crawlerFiles = (await (await request.get("/robots.txt")).text()) + (await (await request.get("/sitemap.xml")).text());
    expect(crawlerFiles).not.toContain("localhost");
    expect(crawlerFiles).toContain(`${E2E_SITE_URL}/sitemap.xml`);
  });

  test("every page has a unique title and meta description", async ({ page }) => {
    test.setTimeout(120_000); // visits every page
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();
    for (const path of allPaths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const title = await page.title();
      const description = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      expect(title.length, `${path} title length`).toBeLessThanOrEqual(70);
      expect(description.length, `${path} description length`).toBeGreaterThanOrEqual(70);
      expect(description.length, `${path} description length`).toBeLessThanOrEqual(170);
      expect(titles.get(title), `${path} repeats the title of ${titles.get(title)}`).toBeUndefined();
      expect(descriptions.get(description), `${path} repeats the description of ${descriptions.get(description)}`).toBeUndefined();
      titles.set(title, path);
      descriptions.set(description, path);
    }
  });

  test("every page has exactly one h1 and no skipped heading levels", async ({ page }) => {
    test.setTimeout(120_000); // visits every page
    for (const path of [...allPaths, "/nuk-ekziston"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // Headings as assistive technology and crawlers see them (website concept previews are images).
      const levels = await page.evaluate(() =>
        [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
          .filter((h) => !h.closest('[role="img"], [aria-hidden="true"], dialog:not([open])'))
          .map((h) => Number(h.tagName[1])),
      );
      expect(levels.filter((level) => level === 1), `${path}: number of h1`).toHaveLength(1);
      expect(levels[0], `${path}: first heading`).toBe(1);
      levels.forEach((level, i) => {
        if (i > 0) expect(level - levels[i - 1]!, `${path}: h${levels[i - 1]} followed by h${level}`).toBeLessThanOrEqual(1);
      });
    }
  });

  test("every image has alt text, and informative images describe themselves", async ({ page }) => {
    test.setTimeout(120_000); // visits every page
    for (const path of allPaths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const images = await page.evaluate(() =>
        [...document.querySelectorAll("img")].map((img) => ({
          src: img.getAttribute("src") ?? "",
          alt: img.getAttribute("alt"),
          hidden: Boolean(img.closest('[aria-hidden="true"], [role="img"]')),
        })),
      );
      for (const image of images) {
        expect(image.alt, `${path}: ${image.src} has no alt attribute`).not.toBeNull();
        // An empty alt is only fine for decorative images or images inside a described preview.
        if (!image.hidden && image.alt === "") {
          expect(image.src, `${path}: informative image without alt text`).toMatch(/icon|brand|logo/i);
        }
      }
    }
  });

  test("the services page describes each service with structured data and published starting prices", async ({ page }) => {
    await page.goto(routes.services);
    const data = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}");
    const services = data["@graph"] as Array<Record<string, unknown> & { offers?: { priceSpecification: { minPrice: number } } }>;
    expect(services.map((s) => s.name)).toEqual(["Website prezantues", "Website biznesi", "Online Shop", "Custom Development"]);
    expect(services.map((s) => s.offers?.priceSpecification.minPrice ?? null)).toEqual([199, 399, 999, null]);
    for (const service of services) {
      expect(service["@type"]).toBe("Service");
      expect(String(service.url)).toMatch(new RegExp(`^${E2E_SITE_URL}/sherbimet#`));
      expect(service).not.toHaveProperty("aggregateRating");
      expect(service).not.toHaveProperty("review");
    }
  });
});
