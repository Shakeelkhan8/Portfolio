import { test, expect } from "@playwright/test";

test.describe("SEO and crawl assets", () => {
  test("robots.txt advertises sitemap and disallows admin", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toContain("Sitemap:");
    expect(body).toContain("/sitemap.xml");
    expect(body).toContain("Disallow: /admin");
  });

  test("sitemap.xml is reachable", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("/projects");
    expect(body).toContain("/writing");
  });

  test("manifest is served", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.start_url).toBe("/");
  });

  test("privacy page renders CMS content", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Privacy Policy",
    );
    await expect(page.getByText("Overview")).toBeVisible();
  });

  test("article page exposes metadata and content", async ({ page }) => {
    await page.goto("/writing/multi-tenant-data-isolation-in-saas");
    await expect(page).toHaveTitle(/Multi-Tenant/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("core pages expose descriptive titles", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveTitle(/Contact/i);

    await page.goto("/projects");
    await expect(page).toHaveTitle(/Projects/i);
  });

  test("home and articles share a preview image that actually loads", async ({
    page,
    request,
  }) => {
    // The meta tag once pointed at /opengraph-image while the route served
    // /opengraph-image/default, so every non-project preview was a 404.
    for (const path of ["/", "/writing/multi-tenant-data-isolation-in-saas"]) {
      await page.goto(path);
      const ogImage = await page
        .locator('meta[property="og:image"]')
        .getAttribute("content");

      expect(ogImage).toBeTruthy();
      const image = await request.get(new URL(ogImage!).pathname);
      expect(image.status()).toBe(200);
      expect(image.headers()["content-type"]).toContain("image/png");
    }
  });

  test("case studies share their own preview image", async ({ page, request }) => {
    await page.goto("/projects/dispatch-management-saas");
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");

    // Before per-project cards every page shared the site-wide image. A
    // CMS-uploaded image may replace the generated card, but the generic
    // one never should.
    expect(ogImage).toBeTruthy();
    expect(ogImage).not.toContain("/opengraph-image");
    if (!ogImage?.includes("/og/projects/")) return;

    expect(ogImage).toContain("/og/projects/dispatch-management-saas");
    const image = await request.get(new URL(ogImage).pathname);
    expect(image.ok()).toBeTruthy();
    expect(image.headers()["content-type"]).toContain("image/png");
  });
});
