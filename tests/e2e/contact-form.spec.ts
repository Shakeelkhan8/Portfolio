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
  await page.selectOption("#projectType", "fix");
  await page.selectOption("#budget", "300-1000");
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

    expect(payload).toMatchObject({ projectType: "fix", budget: "300-1000" });
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
    await expect(page.locator("#projectType-error")).toHaveText(
      "Please choose a project type.",
    );
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

  test("a service's 'Discuss' link preselects the project type", async ({
    page,
  }) => {
    await page.goto("/contact?type=ai");
    await expect(page.locator("#projectType")).toHaveValue("ai");
  });
});
