import { test, expect } from "@playwright/test";

test.describe("Portfolio smoke tests", () => {
  test("homepage renders hero content", async ({ page }) => {
    await page.goto("/");
    // The hero leads with the name as its H1, so the header hides its
    // wordmark until the page scrolls (see cms-modules.spec.ts).
    await expect(
      page.getByRole("heading", { level: 1, name: "Shakeel Khan" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /case studies|work/i }).first()).toBeVisible();
  });

  test("other pages keep the header wordmark", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Shakeel Khan" }),
    ).toBeVisible();
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
    // Pages other than home use the Admin-managed nav of page links.
    await page.goto("/projects");
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "About",
    );
  });

  test("social rail shows on a laptop without covering any text", async ({
    page,
  }) => {
    for (const width of [1100, 1239, 1240, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const rail = page.getByRole("navigation", { name: "Profiles" });
      await expect(rail, `rail at ${width}px`).toBeVisible();
      const railRight = await rail.evaluate((el) => el.getBoundingClientRect().right);
      const textLeft = await page
        .locator("main h1, main h2, main p, footer p")
        .evaluateAll((nodes) =>
          Math.min(
            ...nodes
              .filter((node) => (node as HTMLElement).offsetParent)
              .map((node) => node.getBoundingClientRect().left),
          ),
        );
      expect(textLeft, `text clears the rail at ${width}px`).toBeGreaterThan(railRight + 8);
    }
  });

  test("home nav jumps to its sections and marks the current one", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByRole("link", { name: "Resume" })).toHaveAttribute(
      "href",
      "/resume",
    );
    const experience = nav.getByRole("link", { name: "Experience" });
    await expect(experience).toHaveAttribute("href", "#experience");
    await experience.click();
    await expect(page).toHaveURL(/#experience$/);
    await expect(experience).toHaveAttribute("aria-current", "location");
  });

  test("projects page lists case studies", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByText("Dispatch Management SaaS")).toBeVisible();
  });

  test("command palette opens with keyboard shortcut", async ({ page }) => {
    await page.goto("/");
    // The shortcut handler attaches on hydration; pressing earlier is a race.
    await page.waitForLoadState("networkidle");
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
