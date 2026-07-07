import type { Article } from "@/types";

export const articles: Article[] = [
  {
    slug: "multi-tenant-data-isolation-in-saas",
    title: "Multi-Tenant Data Isolation in SaaS",
    excerpt:
      "Practical patterns for tenant scoping, query safety, and operational trade-offs when multiple companies share one application stack.",
    content: `
      <p>Multi-tenant SaaS products often start with a simple tenant ID column and grow into complex permission boundaries. The goal is not perfect theoretical isolation on day one — it is making incorrect tenant access structurally difficult.</p>
      <h2>Enforce scoping at the query layer</h2>
      <p>Do not rely on every developer remembering to add <code>where tenant_id = ?</code>. Centralize tenant scoping in repositories, policies, or middleware so unsafe queries are the exception, not the default.</p>
      <h2>Separate admin and tenant contexts</h2>
      <p>Platform operators need cross-tenant visibility, but tenant users never should. Use explicit context objects and separate authorization paths instead of ad hoc bypass flags.</p>
      <h2>Design for auditability</h2>
      <p>When financial or operational data is involved, log actor, tenant, and entity identifiers for sensitive mutations. This pays off immediately during support incidents.</p>
    `.trim(),
    date: "2026-02-15T00:00:00.000Z",
    readingTime: 4,
    tags: ["SaaS", "Architecture", "PostgreSQL"],
    published: true,
  },
  {
    slug: "designing-idempotent-webhooks-for-payments",
    title: "Designing Idempotent Webhooks for Payments",
    excerpt:
      "Why payment and billing webhooks must be idempotent from day one, and how to model retries without duplicate side effects.",
    content: `
      <p>Payment providers retry webhooks. Sometimes many times. If your handler is not idempotent, you will eventually double-charge, duplicate invoices, or corrupt ledger balances.</p>
      <h2>Store webhook delivery IDs</h2>
      <p>Persist a unique provider event ID before processing side effects. If the same ID arrives again, short-circuit and return success.</p>
      <h2>Make business actions replay-safe</h2>
      <p>Settlement, invoice creation, and payout updates should be modeled as upserts or state transitions keyed by external references.</p>
      <h2>Return fast, process safely</h2>
      <p>Acknowledge quickly, then process in a transaction. Providers care about response codes; your system cares about correctness under retries.</p>
    `.trim(),
    date: "2026-01-20T00:00:00.000Z",
    readingTime: 3,
    tags: ["APIs", "Payments", "Backend"],
    published: true,
  },
];
