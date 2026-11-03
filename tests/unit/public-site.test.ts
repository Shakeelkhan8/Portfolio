import { describe, expect, it } from "vitest";
import { getFallbackSiteConfig } from "@/lib/db/fallback";
import { PRIVATE_SITE_FIELDS, toPublicSiteConfig } from "@/lib/public-site";

describe("toPublicSiteConfig", () => {
  const site = getFallbackSiteConfig();
  const publicSite = toPublicSiteConfig(site);

  it("drops every private field", () => {
    for (const field of PRIVATE_SITE_FIELDS) {
      expect(field in publicSite).toBe(false);
    }
  });

  it("leaves no phone number or time zone in the serialised object", () => {
    const serialised = JSON.stringify(publicSite);

    expect(serialised.includes(site.phone)).toBe(false);
    expect(serialised.includes(site.timezone)).toBe(false);
  });

  it("keeps what the client components render", () => {
    expect(publicSite.name).toBe(site.name);
    expect(publicSite.title).toBe(site.title);
    expect(publicSite.email).toBe(site.email);
    expect(publicSite.links).toEqual(site.links);
    expect(publicSite.availability).toEqual(site.availability);
  });

  it("does not modify the original settings", () => {
    expect(site.phone).not.toBe("");
    expect(site.timezone).not.toBe("");
  });
});
