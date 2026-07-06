import { describe, expect, it } from "vitest";
import {
  analyticsSettingsSchema,
  seoDefaultsSchema,
  siteSettingsSchema,
  themeSettingsSchema,
} from "@/lib/validators/settings";

describe("settings validators", () => {
  it("validates site settings", () => {
    const result = siteSettingsSchema.safeParse({
      siteName: "Portfolio",
      legalName: "Portfolio LLC",
      tagline: "Engineer",
      description: "Description",
      email: "hello@example.com",
      location: "Remote",
      timezone: "UTC",
      yearsOfExperience: 5,
      availabilityStatus: "available",
      availabilityMessage: "Open",
    });

    expect(result.success).toBe(true);
  });

  it("validates seo defaults", () => {
    const result = seoDefaultsSchema.safeParse({
      defaultTitle: "Title",
      defaultDescription: "Description",
      defaultRobots: "index, follow",
      twitterCardType: "summary_large_image",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid theme colors", () => {
    const result = themeSettingsSchema.safeParse({
      primaryColor: "blue",
      fontHeading: "Geist",
      fontBody: "Geist",
      fontMono: "Geist Mono",
    });

    expect(result.success).toBe(false);
  });

  it("validates analytics settings", () => {
    const result = analyticsSettingsSchema.safeParse({
      plausibleEnabled: true,
      plausibleDomain: "example.com",
      ga4Enabled: false,
      ga4MeasurementId: "",
    });

    expect(result.success).toBe(true);
  });
});
