import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

/**
 * The site's type-scale classes must survive next to colour classes, and a
 * later size must still replace an earlier one. Without the tailwind-merge
 * config in `cn`, `text-display text-foreground` collapsed to
 * `text-foreground` (the size was read as a colour).
 */
describe("cn with the custom type scale", () => {
  for (const size of ["display", "title", "heading", "subheading", "figure", "lead"]) {
    it(`keeps text-${size} beside a text colour`, () => {
      const classes = cn(`text-${size}`, "text-foreground").split(" ");
      expect(classes).toEqual([`text-${size}`, "text-foreground"]);
    });
  }

  it("lets a later size override an earlier one", () => {
    expect(cn("text-heading", "text-sm")).toBe("text-sm");
    expect(cn("text-sm", "text-title")).toBe("text-title");
  });
});
