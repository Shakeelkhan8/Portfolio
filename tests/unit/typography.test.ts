import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Heading } from "@/components/typography/heading";

/**
 * Regression: a custom `font-display-wide` utility looked like a font-family
 * class to tailwind-merge, which then dropped `font-heading`, so the large
 * headings silently fell back to the body face. Display sizes must keep the
 * display font and the width setting together.
 */
describe("Heading", () => {
  for (const size of ["xl", "2xl", "hero"] as const) {
    it(`size ${size} keeps the display face and its semi-expanded width`, () => {
      const html = renderToStaticMarkup(
        createElement(Heading, { size, className: "text-foreground" }, "Title"),
      );
      const classes = /class="([^"]*)"/.exec(html)?.[1].split(" ") ?? [];

      expect(classes).toContain("font-heading");
      expect(classes).toContain("font-stretch-semi-expanded");
    });
  }
});
