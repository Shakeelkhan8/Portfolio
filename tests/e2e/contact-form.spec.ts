import { test, expect, type Page } from "@playwright/test";

/**
 * The contact form's client behaviour. The API is answered in the browser
 * (page.route), so these tests never store or email anything.
 */
async function answerApi(page: Page, status: number, body: object) {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    }),
  );
}

async function fillValidForm(page: Page) {
  await page.fill("#name", "Ada Lovelace");
  await page.fill("#email", "ada@example.com");
  await page.fill("#message", "Our nightly queue stalls and orders back up.");
}

test.describe("Contact form", () => {
  /*
   * Regression: after a successful send the form called reset() on
   * event.currentTarget after an await, when React has already cleared it.
   * Visitors whose message was delivered saw "Cannot read properties of
   * null (reading 'reset')" instead of the confirmation.
   */
  test("shows the confirmation after a successful send", async ({ page }) => {
    await answerApi(page, 200, { success: true, deliveredByEmail: true });
    await page.goto("/contact");
    await fillValidForm(page);

    const request = page.waitForRequest("**/api/contact");
    await page.getByRole("button", { name: "Send message" }).click();
    const payload = (await request).postDataJSON();

    expect(payload).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@example.com",
    });
    // The form no longer asks for a project type or budget (2026-11-19).
    expect(payload).not.toHaveProperty("projectType");
    expect(payload).not.toHaveProperty("budget");
    await expect(
      page.getByRole("status").filter({ hasText: "Message sent" }),
    ).toBeVisible();
    await expect(page.getByText(/reading 'reset'/)).toHaveCount(0);
  });

  test("explains each missing field and sends nothing", async ({ page }) => {
    let sent = false;
    await page.route("**/api/contact", (route) => {
      sent = true;
      return route.abort();
    });
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.locator("#name-error")).toHaveText("Name is required.");
    await expect(page.locator("#email-error")).toBeVisible();
    await expect(page.locator("#message-error")).toBeVisible();
    await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#name")).toBeFocused();
    expect(sent).toBe(false);
  });

  test("shows the server's error with an email fallback", async ({ page }) => {
    await answerApi(page, 429, {
      error: "Too many messages sent recently. Please try again later.",
    });
    await page.goto("/contact");
    await fillValidForm(page);
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.locator('form [role="alert"]')).toContainText("Too many messages");
    await expect(page.locator('form [role="alert"]')).toContainText("Or email directly");
  });

  test("asks only for name, email and message, and fits a phone screen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/contact", { waitUntil: "networkidle" });
    const form = page.getByRole("form", { name: "Contact form" });

    await expect(form.locator("#name")).toBeVisible();
    await expect(form.locator("#email")).toBeVisible();
    await expect(form.locator("#message")).toBeVisible();
    await expect(form.locator("#projectType, #budget")).toHaveCount(0);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBe(0);
  });
});
