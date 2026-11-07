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

/** Opens a styled select by its trigger id and picks an option by label. */
async function choose(page: Page, id: string, label: string) {
  await page.locator(`#${id}`).click();
  await page.getByRole("option", { name: label, exact: true }).click();
}

async function fillValidForm(page: Page) {
  await page.fill("#name", "Ada Lovelace");
  await page.fill("#email", "ada@example.com");
  await choose(page, "projectType", "Bug fix or slow app");
  await choose(page, "budget", "$300 to $1,000");
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
    await expect(page.locator("#projectType")).toHaveText(
      "AI feature with OpenAI or Claude",
    );
    await expect(page.locator('input[name="projectType"]')).toHaveValue("ai");
  });

  test("the dropdowns are styled, keyboard-usable and fit a phone screen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    // Keys pressed before hydration reach a button with no handlers yet.
    await page.goto("/contact", { waitUntil: "networkidle" });

    // Keyboard: open with Enter, move with the arrows, choose with Enter.
    const trigger = page.locator("#projectType");
    await trigger.focus();
    await page.keyboard.press("Enter");
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(listbox).toBeHidden();
    await expect(page.locator('input[name="projectType"]')).not.toHaveValue("");

    // The popup is a themed element (not the OS list) and stays on screen.
    await trigger.click();
    await expect(listbox).toBeVisible();
    const box = (await listbox.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(375);
    expect(box.y + box.height).toBeLessThanOrEqual(667);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBe(0);
    await page.keyboard.press("Escape");

    // "Prefer not to say" clears the budget back to an empty value.
    await choose(page, "budget", "Over $3,000");
    await expect(page.locator('input[name="budget"]')).toHaveValue("3000-plus");
    await choose(page, "budget", "Prefer not to say");
    await expect(page.locator('input[name="budget"]')).toHaveValue("");
  });
});
