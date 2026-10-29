import { describe, expect, it } from "vitest";
import { getSeedPayload, getSkillCategorySlug } from "@/lib/seed/content-data";
import { parseMonthDate, slugify } from "@/lib/seed/helpers";

describe("seed helpers", () => {
  it("parses month dates to ISO date strings", () => {
    expect(parseMonthDate("2025-11")).toBe("2025-11-01");
    expect(parseMonthDate("2023-9")).toBe("2023-09-01");
  });

  it("slugifies category names", () => {
    expect(slugify("Backend & APIs")).toBe("backend-apis");
    expect(getSkillCategorySlug("Multi-Tenant SaaS")).toBe("multi-tenant-saas");
  });
});

describe("seed content payload", () => {
  it("includes core portfolio content", () => {
    const payload = getSeedPayload();

    expect(payload.siteSettings.site_name).toBe("Shakeel Khan");
    expect(payload.projects).toHaveLength(8);
    expect(payload.articles).toHaveLength(2);
    expect(payload.experience).toHaveLength(5);
    expect(payload.skillGroups).toHaveLength(6);
    expect(payload.navigation.length).toBeGreaterThan(0);
    expect(payload.privacyPage.slug).toBe("privacy");
  });

  it("ships no testimonials or certifications", () => {
    // The seed used to ship a sample testimonial and certification. Anything
    // seeded can reach the public site, so nothing unverified belongs here.
    const payload = getSeedPayload();

    expect(payload.testimonials).toEqual([]);
    expect(payload.certifications).toEqual([]);
  });

  it("splits professional work from side projects", () => {
    const payload = getSeedPayload();
    const side = payload.projects.filter((project) =>
      project.tags.includes("Side project"),
    );
    const featured = payload.projects.filter((project) => project.featured);

    expect(side.map((project) => project.slug)).toEqual([
      "vantage",
      "keystone",
      "hearback",
      "ai-mentor-health",
      "portfolio",
    ]);
    expect(featured.map((project) => project.slug)).toEqual([
      "dispatch-management-saas",
      "enterprise-reporting-automation",
      "isp-management-system",
    ]);
  });

  it("marks seeded projects as published", () => {
    const payload = getSeedPayload();

    expect(
      payload.projects.every((project) => project.status === "published"),
    ).toBe(true);
  });
});
