import { test, expect } from "@playwright/test";

test.describe("Portfolio smoke tests", () => {
  test("homepage renders hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Shakeel Khan",
    );
    await expect(
      page.getByText("Senior Backend Engineer", { exact: true }),
    ).toBeVisible();
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

  test("command palette opens from search button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
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
