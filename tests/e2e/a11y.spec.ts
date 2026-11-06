import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const criticalRoutes = ["/", "/projects", "/services", "/contact", "/about"] as const;

test.describe("Accessibility (axe)", () => {
  for (const path of criticalRoutes) {
    test(`${path} has no critical or serious axe violations`, async ({
      page,
    }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blocking = results.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      );

      expect(
        blocking,
        blocking
          .map(
            (violation) =>
              `${violation.id} (${violation.impact}): ${violation.help}`,
          )
          .join("\n"),
      ).toEqual([]);
    });
  }
});
