import { describe, expect, it } from "vitest";
import {
  getFeaturedProjects,
  getProjectBySlug,
  getProjectSlugs,
  formatDateRange,
} from "@/lib/content";
import { searchContent, buildSearchIndex } from "@/lib/search";
import {
  getPersonSchema,
  getWebSiteSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";

describe("content helpers", () => {
  it("returns all project slugs", () => {
    expect(getProjectSlugs().length).toBeGreaterThan(0);
  });

  it("finds project by slug", () => {
    const project = getProjectBySlug("dispatch-management-saas");
    expect(project?.title).toBe("Dispatch Management SaaS");
  });

  it("returns featured projects", () => {
    const featured = getFeaturedProjects();
    expect(featured.every((project) => project.featured)).toBe(true);
  });

  it("formats date ranges", () => {
    expect(formatDateRange("2025-11", null)).toContain("Present");
    expect(formatDateRange("2023-09", "2025-10")).toContain("2023");
  });
});

describe("search", () => {
  it("builds a non-empty search index", () => {
    expect(buildSearchIndex().length).toBeGreaterThan(5);
  });

  it("finds projects by query", () => {
    const results = searchContent("dispatch");
    expect(results.some((item) => item.type === "project")).toBe(true);
  });

  it("returns all items for empty query", () => {
    expect(searchContent("").length).toBe(buildSearchIndex().length);
  });
});

describe("structured data", () => {
  it("generates valid person schema", () => {
    const schema = getPersonSchema();
    expect(schema["@type"]).toBe("Person");
    expect(schema.name).toBeTruthy();
  });

  it("generates website schema with search action", () => {
    const schema = getWebSiteSchema();
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.potentialAction).toBeTruthy();
  });

  it("generates breadcrumb list", () => {
    const schema = getBreadcrumbSchema([
      { name: "Home", url: "https://example.com" },
      { name: "Projects", url: "https://example.com/projects" },
    ]);
    expect(schema.itemListElement).toHaveLength(2);
  });
});
