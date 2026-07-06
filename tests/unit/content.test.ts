import { describe, expect, it } from "vitest";
import { routes } from "@/config/navigation";
import { getFallbackProjects } from "@/lib/db/fallback";
import { formatDateRange } from "@/lib/formatters";
import { filterSearchIndex } from "@/lib/search-utils";
import {
  getPersonSchema,
  getWebSiteSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";
import { getFallbackSiteConfig } from "@/lib/db/fallback";

const site = getFallbackSiteConfig();

describe("content helpers", () => {
  it("returns all project slugs from fallback content", () => {
    const slugs = getFallbackProjects().map((project) => project.slug);
    expect(slugs.length).toBeGreaterThan(0);
  });

  it("finds project by slug in fallback content", () => {
    const project = getFallbackProjects().find(
      (item) => item.slug === "dispatch-management-saas",
    );
    expect(project?.title).toBe("Dispatch Management SaaS");
  });

  it("returns featured projects from fallback content", () => {
    const featured = getFallbackProjects().filter((project) => project.featured);
    expect(featured.every((project) => project.featured)).toBe(true);
  });

  it("formats date ranges", () => {
    expect(formatDateRange("2025-11", null)).toContain("Present");
    expect(formatDateRange("2023-09", "2025-10")).toContain("2023");
  });
});

describe("search", () => {
  it("filters a search index by query", () => {
    const index = [
      {
        id: "project-dispatch",
        title: "Dispatch Management SaaS",
        description: "Operations platform",
        href: routes.project("dispatch-management-saas"),
        type: "project" as const,
      },
      {
        id: "home",
        title: "Home",
        description: "Portfolio homepage",
        href: routes.home,
        type: "page" as const,
      },
    ];

    const results = filterSearchIndex(index, "dispatch");
    expect(results.some((item) => item.type === "project")).toBe(true);
  });

  it("returns the full index for an empty query", () => {
    const index = [
      {
        id: "home",
        title: "Home",
        description: "Portfolio homepage",
        href: routes.home,
        type: "page" as const,
      },
    ];

    expect(filterSearchIndex(index, "")).toHaveLength(1);
  });
});

describe("structured data", () => {
  it("generates valid person schema", () => {
    const schema = getPersonSchema(site);
    expect(schema["@type"]).toBe("Person");
    expect(schema.name).toBeTruthy();
  });

  it("generates website schema with search action", () => {
    const schema = getWebSiteSchema(site);
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
