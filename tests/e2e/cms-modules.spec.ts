import { test, expect } from "@playwright/test";

test.describe("Phase 9 CMS surfaces", () => {
  test("home page shows featured projects and experience", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /case studies|selected work/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
    await page
      .getByRole("link", { name: /Dispatch Management SaaS/i })
      .scrollIntoViewIfNeeded();
    await expect(page.getByText("Dispatch Management SaaS")).toBeVisible();
  });

  test("home hero shows availability under the headline, not beside the name", async ({
    page,
  }) => {
    await page.goto("/");
    const headline = page.getByRole("heading", { level: 1 });
    const availability = page
      .getByText(/^(Available for work|Not taking new work)$/)
      .first();
    await expect(availability).toBeVisible();

    const headlineBox = await headline.boundingBox();
    const availabilityBox = await availability.boundingBox();
    expect(availabilityBox!.y).toBeGreaterThan(
      headlineBox!.y + headlineBox!.height,
    );
  });

  test("home hero opens with the headline, not a repeated name line", async ({
    page,
  }) => {
    // The header wordmark shows the name directly above; the hero used to
    // repeat it as a mono label over the headline.
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.locator("main").getByText("Shakeel Khan", { exact: true }),
    ).toHaveCount(0);
  });

  test("resume page renders", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Resume");
    await expect(
      page.getByRole("button", { name: /Download PDF|Print \/ Save as PDF/i })
        .or(page.getByRole("link", { name: /Download PDF/i })),
    ).toBeVisible();
    await expect(page.getByText("View full web resume")).toBeVisible();
  });

  test("printing the resume includes the collapsed full web resume", async ({
    page,
  }) => {
    // The full resume sits in a closed <details> inside a scroll-triggered
    // Reveal. A print showed only the summary: Chrome hides closed details
    // content via ::details-content, and an unrevealed Reveal is opacity 0.
    await page.goto("/resume");
    const skills = page.locator("details h3", { hasText: "Skills" });
    await expect(skills).toBeHidden();

    // CSS path: print media alone must show it, fully opaque.
    await page.emulateMedia({ media: "print" });
    await expect(skills).toBeVisible();
    const fadedAncestors = await skills.evaluate((element) => {
      const faded: string[] = [];
      for (let node: Element | null = element; node; node = node.parentElement) {
        if (getComputedStyle(node).opacity !== "1") faded.push(node.tagName);
      }
      return faded;
    });
    expect(fadedAncestors).toEqual([]);
    // Dark-theme tokens printed near-white text on white paper (blank page).
    await expect(skills).toHaveCSS("color", "rgb(17, 17, 17)");
    // A bare `header` print rule hid the resume's name and contact block.
    const resumeName = page.locator("details h2").first();
    await expect(resumeName).toBeVisible();
    await expect(resumeName).toHaveCSS("color", "rgb(17, 17, 17)");
    // The teaser summary above the fold is not printed twice.
    await expect(page.getByText("Current role", { exact: true })).toBeHidden();
    await page.emulateMedia({ media: "screen" });

    // JS path (browsers without ::details-content): opened for the print,
    // closed again afterwards.
    const details = page.locator("details").first();
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await expect(details).toHaveAttribute("open", "");
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await expect(details).not.toHaveAttribute("open", "");
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
