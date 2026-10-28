import { test, expect } from "@playwright/test";

test.describe("Phase 9 CMS surfaces", () => {
  test("home page shows featured projects and experience", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Selected work" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Experience" }),
    ).toBeVisible();
    const caseStudy = page.getByRole("link", {
      name: "Dispatch Management SaaS",
      exact: true,
    });
    await caseStudy.scrollIntoViewIfNeeded();
    await expect(caseStudy).toBeVisible();
  });

  test("resume page renders", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Resume",
    );
    await expect(
      page
        .getByRole("button", { name: /Download PDF|Print \/ Save as PDF/i })
        .or(page.getByRole("link", { name: /Download PDF/i })),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Experience" }),
    ).toBeVisible();
  });

  test("privacy page remains available at dedicated route", async ({
    page,
  }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Privacy Policy",
    );
  });

  test("open-source page loads", async ({ page }) => {
    await page.goto("/open-source");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Open source",
    );
  });
});
