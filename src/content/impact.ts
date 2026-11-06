/**
 * The home page's engineering-impact section: each published number with
 * what it actually measures. Every figure and sentence comes from the case
 * studies in src/content/projects (and so from the verified CV); add a
 * number here only with the same evidence. tests/unit/content-claims.test.ts
 * scans this file.
 */
export type ImpactItem = {
  value: string;
  label: string;
  explanation: string;
  /** Case study the number comes from. */
  projectSlug: string;
};

export const impact: ImpactItem[] = [
  {
    value: "100+",
    label: "hours a month of manual reporting removed",
    explanation:
      "Hum Network's operations team built Excel reports by hand from several data sources, which took more than 100 hours a month. The reporting backend I built generates them automatically, and its output was checked against the manual reports before the switch.",
    projectSlug: "enterprise-reporting-automation",
  },
  {
    value: "~63%",
    label: "of a live financial engine's code",
    explanation:
      "On the dispatch SaaS at Elityx, about 63% of the financial engine's code is mine: company billing, inter-company settlements and captain payouts on a double-entry ledger that handles real money.",
    projectSlug: "dispatch-management-saas",
  },
  {
    value: "58%",
    label: "of the platform's commits in its first seven months",
    explanation:
      "I was the same platform's primary engineer for its first seven months, and designed its tenant isolation and inbound integration framework as well as the financial engine.",
    projectSlug: "dispatch-management-saas",
  },
];
