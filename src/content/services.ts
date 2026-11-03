/**
 * "Work with me" offers, shown on the contact page and in the closing section
 * of the home page. Entry offer first, then recurring work, then the premium
 * specialty; the six fixed-price packages stay on Upwork
 * (`siteConfig.links.upwork`), which is where their prices are kept.
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
      "A 3-day review of one Laravel app: version upgrades, security, payments and queues, with a prioritised fix list. $300 fixed.",
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
      "Payment-correctness audits, gateway integrations, webhooks that are safe to receive twice, and ledgers. Audit $490; projects from $700.",
    icon: "CreditCard",
  },
  {
    title: "Fixed-price projects",
    description:
      "Builds, Laravel and PHP upgrades, AI features, store sync and bug fixes. From $60, with packages and reviews on Upwork.",
    icon: "Rocket",
  },
] as const;
