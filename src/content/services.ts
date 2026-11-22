/**
 * "Work with me" offers, shown on the contact page and in the closing section
 * of the home page. Entry offer first, then recurring work, then the premium
 * specialty. (Not shown on the site since 2026-11-20; kept as seed data.)
 *
 * Source: plans/company/company-profile.md, section 2. Two offers there are
 * deliberately left out until they can be delivered or are cleared:
 * - the white-label dedicated developer (from the first hire);
 * - Saudi merchant work such as Salla, Zid or EdfaPay (pending the employment
 *   contract check). tests/unit/content-claims.test.ts guards this.
 */
export const defaultServices = [
  {
    title: "Code health check",
    description:
      "One Laravel or PHP app reviewed in 3 days: upgrades, security, payments and queues, with a ranked fix list. $300 fixed.",
    icon: "ClipboardCheck",
  },
  {
    title: "Care plans",
    description:
      "Updates, security patches, backups and monitoring, 2 to 10 hours of fixes a month, and a monthly report under your agency's name. From $249 a month.",
    icon: "ShieldCheck",
  },
  {
    title: "Payments and integrations",
    description:
      "Audits for double charges, lost webhooks and refund or payout mismatches, each proven with a test, plus gateway integrations with signed, retry-safe webhooks. Audit $490; projects from $700.",
    icon: "CreditCard",
  },
  {
    title: "Fixed-price projects",
    description:
      "AI features with OpenAI or Claude, Laravel and PHP upgrades, store sync, bug fixes, slow queries, and tests for code that has none.",
    icon: "Rocket",
  },
] as const;
