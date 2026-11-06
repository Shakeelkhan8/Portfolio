import { test, expect, type Page } from "@playwright/test";

/** Product of the element's and its ancestors' computed opacity. */
async function opacityOf(page: Page, selector: string) {
  return page
    .locator(selector)
    .first()
    .evaluate((element) => {
      let node: Element | null = element;
      let opacity = 1;
      while (node) {
        opacity *= Number(getComputedStyle(node).opacity);
        node = node.parentElement;
      }
      return opacity;
    });
}

/**
 * Above-the-fold content must become visible without waiting for hydration.
 *
 * Regression: the page wrapper, header and hero copy were Motion components
 * rendered with an inline `opacity: 0`, so nothing showed until the client
 * bundles downloaded and React hydrated (LCP 5.6 s on a throttled phone,
 * almost all of it render delay). Their entrances are now CSS keyframes.
 *
 * The test withholds every client JS chunk (Next's inline streaming scripts
 * still run, so streamed content arrives) and checks the headline and header
 * finish their entrance anyway. JavaScript is not disabled outright because
 * the pages stream behind a `loading.tsx` boundary, whose swap needs it.
 */
test.describe("Above the fold without hydration", () => {
  for (const path of ["/", "/projects", "/about"]) {
    test(`${path}: header and H1 become visible while client JS is withheld`, async ({
      page,
    }) => {
      let release!: () => void;
      const held = new Promise<void>((resolve) => (release = resolve));
      await page.route("**/_next/static/chunks/**/*.js", async (route) => {
        await held;
        await route.continue().catch(() => {});
      });

      await page.goto(path, { waitUntil: "commit" });
      await expect(page.getByRole("heading", { level: 1 })).toBeAttached();

      // Entrances finish in about 1.3 s including delays.
      await expect.poll(() => opacityOf(page, "h1"), { timeout: 5000 }).toBe(1);
      await expect
        .poll(() => opacityOf(page, "header[role=banner]"), { timeout: 5000 })
        .toBe(1);

      release();
    });
  }
});

test.describe("Reduced motion", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  /*
   * Regression: components branched their markup on useReducedMotion(), which
   * is null on the server and true on the client's first render, so React
   * threw hydration error #418 and re-rendered the page for these visitors.
   */
  for (const path of ["/", "/projects", "/about"]) {
    test(`${path} hydrates without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(path);
      // Hydration runs right after the client chunks load.
      await page.waitForTimeout(1500);
      expect(errors).toEqual([]);
    });
  }

  test("hero renders at rest with no entrance animation", async ({ page }) => {
    await page.goto("/");

    const animations = await page.evaluate(() =>
      [".enter-word", ".enter-fade", ".page-enter", ".enter-drop"].map(
        (selector) => {
          const element = document.querySelector(selector);
          return element ? getComputedStyle(element).animationName : "missing";
        },
      ),
    );
    expect(animations).toEqual(["none", "none", "none", "none"]);
    expect(await opacityOf(page, "h1")).toBe(1);
  });

  test("architecture diagram traces a path without the flowing dash", async ({
    page,
  }) => {
    // Any case study with a diagram; content comes from the CMS.
    await page.goto("/projects");
    await page.locator('a[aria-label^="Read case study"]').first().click();
    const figure = page.locator("figure").filter({ has: page.locator("svg") });
    await expect(figure.locator(".diagram-edge").first()).toBeAttached();

    const node = figure.getByRole("button").nth(1);
    const label = (await node.textContent())?.trim() ?? "";
    await node.focus();

    // The traced path is written out for keyboard and screen-reader users.
    await expect(figure.locator('[aria-live="polite"]')).toContainText(label);
    const traced = figure.locator('.diagram-edge[data-state="on"] path');
    await expect(traced.first()).toBeAttached();

    const flow = await traced
      .first()
      .evaluate((path) => getComputedStyle(path).animationName);
    expect(flow).toBe("none");
  });
});
