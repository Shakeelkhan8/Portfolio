import { test, expect } from "@playwright/test";

test.describe("Phase 9 CMS surfaces", () => {
  test("home page shows featured projects and experience", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 2, name: /^Work/ }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
    // The title also appears in its button's label and its diagram, so
    // match the heading itself.
    const dispatch = page.getByRole("heading", {
      level: 3,
      name: "Dispatch Management SaaS",
    });
    await dispatch.scrollIntoViewIfNeeded();
    await expect(dispatch).toBeVisible();
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
    const allCount = await stack.locator("[data-tech-tile]").count();
    await firstGroup.click();
    await expect(firstGroup).toHaveAttribute("aria-pressed", "true");
    await expect(all).toHaveAttribute("aria-pressed", "false");
    expect(await stack.locator("[data-tech-tile]").count()).toBeLessThan(
      allCount,
    );
  });

  test("home contact cards link to email, LinkedIn and WhatsApp", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const cards = page.getByRole("list", { name: "Contact details" });
    await cards.scrollIntoViewIfNeeded();
    await expect(cards.locator('a[href^="mailto:"]')).toHaveCount(1);
    await expect(cards.locator('a[href*="linkedin.com"]')).toHaveCount(1);
    // Only a wa.me link is published; the phone field stays out of the page
    // (security.spec.ts checks that no "phone" key is serialised).
    await expect(cards.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
  });

  test("home contact section has the form beside the contact routes", async ({
    page,
  }) => {
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");
    const section = page.locator("#contact");
    await section.scrollIntoViewIfNeeded();
    await expect(
      section.getByRole("heading", { level: 2, name: /Contact.*Let's talk/ }),
    ).toBeVisible();
    await expect(section.getByRole("form", { name: "Contact form" })).toBeVisible();
    await expect(
      section.getByRole("navigation", { name: "Other ways in" }).getByRole("link", {
        name: /Read the resume/,
      }),
    ).toHaveAttribute("href", "/resume");

    // The counter follows what is typed.
    const message = section.getByLabel("Message");
    await message.fill("Hello there");
    await expect(section.getByText("11/5000")).toBeVisible();
  });

  test("home Work section: featured rows with proof, then more work", async ({
    page,
  }) => {
    // Content comes from the CMS, so this checks structure, not which projects.
    await page.goto("/#work");
    await page.waitForLoadState("networkidle");
    const work = page.locator("#work");
    const rows = work.locator("ol > li article");
    expect(await rows.count()).toBeGreaterThan(0);
    const first = rows.first();
    await first.scrollIntoViewIfNeeded();
    await expect(first.getByRole("heading", { level: 3 })).toBeVisible();
    await expect(
      first.getByRole("link", { name: /Read the case study/ }),
    ).toHaveAttribute("href", /^\/projects\/[a-z0-9-]+$/);
    // Every "More work" card opens its case study.
    const cards = work.getByRole("link", { name: /^Read case study: / });
    for (const href of await cards.evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    )) {
      expect(href).toMatch(/^\/projects\/[a-z0-9-]+$/);
    }
  });

  test("home has its seven sections in order", async ({ page }) => {
    await page.goto("/");
    const ids = await page
      .locator("main [id]")
      .evaluateAll((nodes) => nodes.map((node) => node.id));
    const order = ["about", "experience", "tech-stack", "work", "contact"];
    const found = order.map((id) => ids.indexOf(id));
    expect(found.every((index) => index >= 0)).toBe(true);
    expect([...found].sort((a, b) => a - b)).toEqual(found);
    // These moved to /about, and the HUM cards were removed.
    expect(ids).not.toContain("live-platforms");
  });

  test("footer links to the resume", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page
        .getByRole("navigation", { name: "Resume" })
        .getByRole("link", { name: "View resume" }),
    ).toHaveAttribute("href", "/resume");
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
    // The listener is attached on hydration; firing before it is in place
    // made this flaky (2 of 3 runs failed locally on 2026-11-22).
    await page.waitForLoadState("networkidle");
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
