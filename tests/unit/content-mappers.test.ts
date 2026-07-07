import { describe, expect, it } from "vitest";
import { mapProject } from "@/lib/db/mappers/content";

const baseRow = {
  slug: "example",
  title: "Example",
  summary: "Summary",
  problem: "Problem",
  role: "Role",
  context: "Context",
  overview: "Overview",
  architecture_text: "Architecture",
  featured: true,
  demo_url: null,
  github_url: null,
};

const emptyRelations = {
  tags: [],
  stack: [],
  links: [],
  metrics: [],
  challenges: [],
  decisions: [],
  results: [],
  lessons: [],
  futureImprovements: [],
};

describe("mapProject", () => {
  it("passes through a thumbnail URL", () => {
    const project = mapProject(
      baseRow,
      emptyRelations,
      "https://cdn.example.com/thumb.png",
    );
    expect(project.thumbnailUrl).toBe("https://cdn.example.com/thumb.png");
  });

  it("defaults thumbnail URL to null when omitted", () => {
    const project = mapProject(baseRow, emptyRelations);
    expect(project.thumbnailUrl).toBeNull();
  });
});
