import { test, expect } from "@playwright/test";

test.describe("Phase 9 CMS surfaces", () => {
  test("home page shows services section", async ({ page }) => {
    await page.goto("/");
    const servicesSection = page.locator("section").filter({
      has: page.getByRole("heading", { name: "Services" }),
    });
    await expect(servicesSection.getByText("Backend Architecture")).toBeVisible();
  });

  test("resume page renders", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Resume");
  });

  test("privacy page remains available at dedicated route", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Privacy Policy",
    );
  });

  test("open-source page loads", async ({ page }) => {
    await page.goto("/open-source");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Open Source",
    );
  });
});
