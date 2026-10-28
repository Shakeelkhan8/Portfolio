import { describe, expect, it } from "vitest";
import { displayTags, isSideProject, SIDE_PROJECT_TAG } from "@/lib/projects";

describe("project kind", () => {
  it("detects side projects by tag", () => {
    expect(isSideProject({ tags: [SIDE_PROJECT_TAG, "AI"] })).toBe(true);
    expect(isSideProject({ tags: ["Payments"] })).toBe(false);
  });

  it("hides the side-project marker from displayed tags", () => {
    expect(
      displayTags({ tags: [SIDE_PROJECT_TAG, "AI", "Data pipeline"] }),
    ).toEqual(["AI", "Data pipeline"]);
  });
});
