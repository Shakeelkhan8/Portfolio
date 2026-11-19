import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
} from "@/lib/db/fallback/settings";
import { getSeedPayload } from "@/lib/seed/content-data";
import * as serviceCatalog from "@/content/service-catalog";
import { impact } from "@/content/impact";

/**
 * Claims the 2026-10-29 git audit contradicts, or that were never verified.
 * Everything seeded or used as a fallback can reach the public site, so none
 * of these may appear in it. Update this list only with evidence.
 */
const unsupportedClaims: Array<[string, RegExp]> = [
  ["ZATCA work (0 of 48 commits)", /zatca/i],
  ["owning 80%+ of the backend", /80%\+/],
  ["sole or solo ownership of the platform", /\bsole\b|\balone\b/i],
  ["a year count instead of 'since 2021 / since 2022'", /\d\+\s*years/i],
  [
    "the ISP system in current daily use",
    /used daily|daily use|use (it )?every day/i,
  ],
  [
    "unverified platform volume",
    /\d+\+? (shipments|captains)|\b5 companies\b/i,
  ],
  ["API response times (never measured)", /sub-second|under a second/i],
  // The CV (2026-11-05) publishes no ISP count; the user confirmed none.
  [
    "a count of ISPs on the ISP system",
    /\b(\d+|two|three|four|five)\s+(local\s+|small\s+)?(isps|providers|internet service providers)\b/i,
  ],
  // Can't be backed, so the CV dropped it (CV review, 2026-11-04). Only
  // "100+ hours a month" is confirmed.
  [
    "the Hum Network report turnaround (3 days to 2 minutes)",
    /under (2|two) min|report turnaround|took (3|three) days|(3|three) days each cycle|(3|three)-day manual/i,
  ],
];

/**
 * GitHub repos a visitor can actually open. Checked with `gh repo view` on
 * 2026-11-05; vantage went private on 2026-11-03, so its link 404s.
 */
const publicRepos = ["ai-mentor-health"];

const publicText = JSON.stringify({
  seed: getSeedPayload(),
  site: siteConfig,
  seo: [DEFAULT_SEO_TITLE, DEFAULT_SEO_DESCRIPTION],
  services: serviceCatalog,
  impact,
});

describe("public content claims", () => {
  it.each(unsupportedClaims)("does not claim %s", (_claim, pattern) => {
    expect(publicText.match(pattern)?.[0] ?? null).toBeNull();
  });

  it("links only to public GitHub repos", () => {
    const repos = [
      ...publicText.matchAll(/github\.com\/Shakeelkhan8\/([\w.-]+)/gi),
    ].map((match) => match[1]);

    expect(repos.filter((repo) => !publicRepos.includes(repo))).toEqual([]);
  });

  // Confirmed by the user on 2026-11-05: it ran in production in 2023 and is
  // no longer in use. Past tense only, and no ISP count in any metric.
  describe("the ISP Management System case study", () => {
    const isp = getSeedPayload().projects.find(
      (project) => project.slug === "isp-management-system",
    );

    it("publishes no ISP count as a metric", () => {
      expect(isp).toBeDefined();
      expect(
        isp?.metrics.filter((metric) => /isp|provider/i.test(metric.label)),
      ).toEqual([]);
    });

    it("does not claim the system is still in use", () => {
      const text = JSON.stringify(isp);
      const pattern =
        /(?<!ran )in production|in use|\bstill\b|currently|\bdaily\b|\bruns? (their|its)\b/i;
      expect(text.match(pattern)?.[0] ?? null).toBeNull();
    });
  });

  // "Full Stack Developer & Software Engineer" is the chosen professional
  // title (user's decision, 2026-11-19). The timeline is a factual record,
  // so every role there stays the employer's official title.
  it("keeps official job titles in the experience timeline", () => {
    const roles = getSeedPayload().experience.map((entry) => entry.role);
    const elityx = getSeedPayload().experience.find(
      (entry) => entry.legacy_id === "elityx",
    );

    expect(elityx?.role).toBe("Full Stack Developer (backend focus)");
    expect(roles.filter((role) => /senior|architect|lead/i.test(role))).toEqual(
      [],
    );
  });
});

/**
 * Client-facing copy says what clients get, not where I am (user's request,
 * 2026-11-03). The experience timeline and the resume keep their locations:
 * those are a factual record, not sales copy.
 */
describe("client-facing copy", () => {
  const seed = getSeedPayload();
  const copy = JSON.stringify({
    hero: seed.ctaSections,
    about: seed.aboutParagraphs,
    services: seed.services,
    description: seed.siteSettings.description,
    availability: seed.siteSettings.availability_message,
    responseTime: seed.siteSettings.response_time_text,
    seo: [DEFAULT_SEO_TITLE, DEFAULT_SEO_DESCRIPTION],
  });

  it("names no location, time zone or working-hours overlap", () => {
    const pattern =
      /pakistan|islamabad|karachi|rawalpindi|time ?zone|\bPKT\b|\bGMT\b|\bUTC\b|overlap/i;
    expect(copy.match(pattern)?.[0] ?? null).toBeNull();
  });
});

/**
 * Offers that can't be delivered or aren't cleared yet (company-profile.md,
 * section 2). Salla, Zid and EdfaPay may still appear as experience; they
 * must not be sold until the employment contract has been checked.
 */
const heldOffers: Array<[string, RegExp]> = [
  ["Saudi merchant work", /salla|zid|edfapay|zatca/i],
  ["a dedicated developer (from the first hire)", /dedicated developer/i],
];

describe("services on offer", () => {
  const offers = JSON.stringify(getSeedPayload().services);

  it.each(heldOffers)("do not sell %s", (_offer, pattern) => {
    expect(offers.match(pattern)?.[0] ?? null).toBeNull();
  });
});
