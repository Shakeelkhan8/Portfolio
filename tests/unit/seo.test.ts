import { describe, expect, it } from "vitest";
import { parseRobotsDirective } from "@/lib/seo/robots";
import { buildPageMetadata } from "@/lib/metadata";
import type { MetadataContext } from "@/lib/metadata";

function isRobotsObject(
  robots: ReturnType<typeof parseRobotsDirective>,
): robots is Exclude<ReturnType<typeof parseRobotsDirective>, string | null | undefined> {
  return Boolean(robots) && typeof robots === "object" && !Array.isArray(robots);
}

const ctx: MetadataContext = {
  site: {
    name: "Shakeel Khan",
    legalName: "Shakeel Khan",
    title: "Senior Backend Engineer",
    description: "Portfolio description",
    url: "https://example.com",
    location: "Pakistan",
    city: "Karachi",
    timezone: "Asia/Karachi",
    phone: "",
    email: "test@example.com",
    yearsOfExperience: 8,
    links: { github: "https://github.com/test", linkedin: "https://linkedin.com/in/test" },
    githubUsername: "test",
    languages: [],
    availability: { status: "available", message: "Open to work" },
    expertise: ["Node.js"],
    philosophy: [],
    resumeSummary: "",
    responseTimeText: "24h",
    copyrightText: "© 2026",
    maintenanceEnabled: false,
    maintenanceMessage: null,
  },
  seo: {
    id: "seo-1",
    defaultTitle: "Shakeel Khan — Senior Backend Engineer",
    defaultDescription: "Default SEO description",
    defaultOgImageId: null,
    defaultOgImageUrl: null,
    defaultRobots: "index, follow",
    twitterCardType: "summary_large_image",
  },
};

describe("parseRobotsDirective", () => {
  it("parses index,follow directives", () => {
    const robots = parseRobotsDirective("index, follow");
    expect(isRobotsObject(robots)).toBe(true);
    if (!isRobotsObject(robots)) return;
    expect(robots.index).toBe(true);
    expect(robots.follow).toBe(true);
  });

  it("parses noindex,nofollow directives", () => {
    const robots = parseRobotsDirective("noindex, nofollow");
    expect(isRobotsObject(robots)).toBe(true);
    if (!isRobotsObject(robots)) return;
    expect(robots.index).toBe(false);
    expect(robots.follow).toBe(false);
  });
});

describe("buildPageMetadata", () => {
  it("builds canonical and social metadata from CMS context", () => {
    const metadata = buildPageMetadata(ctx, {
      title: "About",
      description: "About page",
      path: "/about",
    });

    expect(metadata.title).toBe("About");
    expect(metadata.alternates?.canonical).toBe("https://example.com/about");
    expect(metadata.openGraph?.title).toBe("About — Shakeel Khan");
    expect(
      metadata.twitter &&
        "card" in metadata.twitter &&
        metadata.twitter.card,
    ).toBe("summary_large_image");
  });

  it("applies page-level robots overrides", () => {
    const metadata = buildPageMetadata(ctx, {
      title: "Draft",
      path: "/draft",
      robots: "noindex, nofollow",
    });

    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
