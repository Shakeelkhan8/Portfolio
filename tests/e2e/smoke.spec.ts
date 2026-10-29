import { test, expect } from "@playwright/test";

test.describe("Portfolio smoke tests", () => {
  test("homepage renders hero content", async ({ page }) => {
    await page.goto("/");
    // The hero leads with the work; the name lives in the header. The H1 text
    // comes from the CMS, so assert it exists rather than pin its wording.
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Shakeel Khan" }),
    ).toBeVisible();
    const headline = page.getByRole("heading", { level: 1 });
    await expect(headline).toBeVisible();
    await expect(headline).not.toHaveText("Shakeel Khan");
    await expect(page.getByRole("link", { name: /case studies|work/i }).first()).toBeVisible();
  });

  test("project cards are not remounted after hydration", async ({ page }) => {
    await page.goto("/");
    const card = await page
      .locator('a[aria-label^="Read case study"]')
      .first()
      .elementHandle();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    // HoverTilt and Magnetic used to swap <div> for <motion.div> once they
    // detected a mouse, which replaced every card's DOM after hydration.
    expect(await card?.evaluate((node) => node.isConnected)).toBe(true);
  });

  test("navigation to about page works", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "About",
    );
  });

  test("projects page lists case studies", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByText("Dispatch Management SaaS")).toBeVisible();
  });

  test("command palette opens with keyboard shortcut", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+KeyK");
    await expect(page.getByPlaceholder("Search portfolio...")).toBeVisible();
  });

  test("404 page shows helpful links", async ({ page }) => {
    await page.goto("/does-not-exist");
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
    await expect(page.locator('a[href="/"]', { hasText: "Go Home" })).toBeVisible();
  });

  test("admin login page is reachable", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(
      page.getByRole("heading", { name: "Admin sign in" }),
    ).toBeVisible();
  });
});
