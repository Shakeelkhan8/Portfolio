import { test, expect } from "@playwright/test";

/**
 * Testimonials, on /about since 2026-11-22 (they were on the home page).
 * Content comes from the CMS, so the assertions follow whatever is
 * published rather than a fixed number of quotes.
 */
test.describe("Testimonials", () => {
  test("heading matches the number of quotes, and the CTA works", async ({
    page,
  }) => {
    await page.goto("/about");
    // The label is CMS-managed ("Testimonials", "What people say"); the
    // statement is chosen by the page from the number of quotes.
    const heading = page.getByRole("heading", {
      name: /In a client's words|Trusted by people I've worked with/,
    });
    await expect(heading).toBeVisible();

    const section = page.locator("section").filter({ has: heading });
    const quotes = await section.locator("blockquote").count();
    expect(quotes).toBeGreaterThan(0);

    // "Trusted by people I've worked with" only once there is more than one.
    if (quotes >= 2) {
      await expect(heading).toContainText("Trusted by people I've worked with");
    } else {
      await expect(heading).toContainText("In a client's words");
    }

    const cta = section.getByRole("link", { name: "Get in touch" });
    await expect(cta).toHaveAttribute("href", "/contact#contact-form");
  });

});
