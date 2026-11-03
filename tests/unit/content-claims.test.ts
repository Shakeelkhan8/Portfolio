import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
} from "@/lib/db/fallback/settings";
import { getSeedPayload } from "@/lib/seed/content-data";

/**
 * Claims the 2026-10-29 git audit contradicts, or that were never verified.
 * Everything seeded or used as a fallback can reach the public site, so none
 * of these may appear in it. Update this list only with evidence.
 */
const unsupportedClaims: Array<[string, RegExp]> = [
  ["a Senior title (official title is Full Stack Developer)", /\bsenior\b/i],
  ["ZATCA work (0 of 48 commits)", /zatca/i],
  ["owning 80%+ of the backend", /80%\+/],
  ["sole or solo ownership of the platform", /\bsole\b|\balone\b/i],
  ["a year count instead of 'since 2021 / since 2022'", /\d\+\s*years/i],
  ["the ISP system in current daily use", /used daily|daily use|use (it )?every day/i],
  ["unverified platform volume", /\d+\+ (shipments|captains)|\b5 companies\b/i],
];

const publicText = JSON.stringify({
  seed: getSeedPayload(),
  site: siteConfig,
  seo: [DEFAULT_SEO_TITLE, DEFAULT_SEO_DESCRIPTION],
});

describe("public content claims", () => {
  it.each(unsupportedClaims)("does not claim %s", (_claim, pattern) => {
    expect(publicText.match(pattern)?.[0] ?? null).toBeNull();
  });
});
