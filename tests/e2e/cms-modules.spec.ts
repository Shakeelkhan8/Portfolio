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

  test("home hero opens with the name, shown once in the first screen", async ({
    page,
  }) => {
    // The name is the hero headline, so the header hides its wordmark until
    // the page scrolls; otherwise the name would appear twice at the top.
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Shakeel Khan" }),
    ).toBeVisible();
    const wordmark = page.getByRole("banner").locator('a[href="/"]').first();
    await expect(wordmark).toHaveCSS("opacity", "0");

    await page.mouse.wheel(0, 600);
    await expect(wordmark).toHaveCSS("opacity", "1");
  });

  test("home page has an About section with the story and highlights", async ({
    page,
  }) => {
    await page.goto("/");
    // Let hydration finish first: the home page swaps DOM nodes while it
    // hydrates, and scrolling a node mid-swap fails with "not attached".
    await page.waitForLoadState("networkidle");
    const about = page.locator("#about");
    await about.scrollIntoViewIfNeeded();
    await expect(
      about.getByRole("heading", { level: 2, name: /Careful systems/ }),
    ).toBeVisible();
    await expect(about.getByText("Full cycle", { exact: true })).toBeVisible();
  });

  test("tech stack filters by group", async ({ page }) => {
    await page.goto("/");
    // Let hydration finish first: the home page swaps DOM nodes while it
    // hydrates, and scrolling a node mid-swap fails with "not attached".
    await page.waitForLoadState("networkidle");
    const stack = page.locator("#tech-stack");
    await stack.scrollIntoViewIfNeeded();
    const all = stack.getByRole("button", { name: "All", exact: true });
    await expect(all).toHaveAttribute("aria-pressed", "true");

    const groups = stack.getByRole("group", { name: "Filter the tech stack" });
    const firstGroup = groups.getByRole("button").nth(1);
    const allCount = await stack.locator("ul[aria-live] > li").count();
    await firstGroup.click();
    await expect(firstGroup).toHaveAttribute("aria-pressed", "true");
    await expect(all).toHaveAttribute("aria-pressed", "false");
    expect(await stack.locator("ul[aria-live] > li").count()).toBeLessThan(
      allCount,
    );
  });

  test("live platforms link out to the live sites", async ({ page }) => {
    await page.goto("/");
    // Let hydration finish first: the home page swaps DOM nodes while it
    // hydrates, and scrolling a node mid-swap fails with "not attached".
    await page.waitForLoadState("networkidle");
    const section = page.locator("#live-platforms");
    await section.scrollIntoViewIfNeeded();
    await expect(
      section.getByRole("heading", { level: 3, name: "HUM News" }),
    ).toBeVisible();
    const link = section.getByRole("link", { name: /Visit humnews\.pk/ });
    await expect(link).toHaveAttribute("href", "https://humnews.pk/");
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("home hero offers the resume next to the main action", async ({
    page,
  }) => {
    await page.goto("/");
    // Matched by text, not role: ButtonLink renders <a role="button">, while
    // the PDF download is a plain <a>, so the role depends on the CMS.
    await expect(
      page.locator("main a", { hasText: /Download resume|View resume/ }).first(),
    ).toBeVisible();
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
