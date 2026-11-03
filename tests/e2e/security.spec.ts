import { test, expect } from "@playwright/test";

test.describe("Security hardening", () => {
  test("contact API rejects invalid payloads", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      data: {
        name: "",
        email: "not-an-email",
        message: "short",
      },
    });

    expect(response.status()).toBe(400);
  });

  test("contact API rejects cross-origin requests", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: {
        "Content-Type": "application/json",
        Origin: "https://evil.example",
      },
      data: {
        name: "Jane Doe",
        email: "jane@example.com",
        message: "This should be blocked by origin validation.",
      },
    });

    expect(response.status()).toBe(403);
  });

  test("contact API rejects non-JSON content types", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: {
        "Content-Type": "text/plain",
        Origin: "http://localhost:3000",
      },
      data: "name=test",
    });

    expect(response.status()).toBe(415);
  });

  test("protected admin routes redirect to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  // Client component props are serialised into the HTML, so a full
  // SiteConfig there publishes the phone number and location even though
  // nothing renders them (src/lib/public-site.ts).
  for (const path of ["/", "/about", "/contact", "/projects"]) {
    test(`${path} does not serialise private site settings`, async ({
      request,
    }) => {
      const html = await (await request.get(path)).text();

      expect(
        html.match(/\\?"(phone|timezone|legalName)\\?":/)?.[0] ?? null,
      ).toBeNull();
    });
  }
});
