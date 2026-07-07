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
});
