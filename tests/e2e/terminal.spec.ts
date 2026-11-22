import { test, expect } from "@playwright/test";

/**
 * /terminal: typed commands, Tab completion, history and the quick-command
 * buttons. Project names come from the CMS, so the test reads them from
 * the terminal's own output instead of hard-coding them.
 */
test.describe("Terminal", () => {
  test("runs typed commands, completes with Tab and keeps history", async ({
    page,
  }) => {
    await page.goto("/terminal");
    await page.waitForLoadState("networkidle");
    const input = page.getByLabel("Terminal command");
    const log = page.getByRole("log", { name: "Terminal output" });

    await input.fill("projects");
    await input.press("Enter");
    const firstSlug = (await log.locator("dt").first().textContent())?.trim() ?? "";
    expect(firstSlug).toMatch(/^[a-z0-9-]+$/);

    // Tab completes a unique project prefix.
    await input.fill(`cat ${firstSlug.slice(0, 4)}`);
    await input.press("Tab");
    await expect(input).toHaveValue(new RegExp(`^cat ${firstSlug.slice(0, 4)}`));
    await input.fill(`cat ${firstSlug}`);
    await input.press("Enter");
    await expect(log.getByRole("link", { name: "Read the case study" }).last()).toHaveAttribute(
      "href",
      `/projects/${firstSlug}`,
    );

    // ↑ brings back the last command.
    await input.press("ArrowUp");
    await expect(input).toHaveValue(`cat ${firstSlug}`);

    await input.fill("nope");
    await input.press("Enter");
    await expect(log.getByText("command not found: nope", { exact: false })).toBeVisible();

    await input.fill("clear");
    await input.press("Enter");
    await expect(log.locator("p")).toHaveCount(0);
  });

  test("quick-command buttons work without typing", async ({ page }) => {
    await page.goto("/terminal");
    await page.waitForLoadState("networkidle");
    const log = page.getByRole("log", { name: "Terminal output" });
    await page.getByRole("group", { name: "Quick commands" }).getByRole("button", { name: "contact" }).click();
    await expect(log.locator('a[href^="mailto:"]')).toHaveCount(1);
    await expect(log.getByRole("link", { name: /contact form/ })).toHaveAttribute("href", "/#contact");
  });

  test("the side tab opens the terminal and is hidden on it", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");
    const tab = page.getByRole("link", { name: "Open the terminal version of this portfolio" });
    await expect(tab).toBeVisible();
    await tab.click();
    await expect(page).toHaveURL(/\/terminal$/);
    await expect(tab).toHaveCount(0);
  });
});
