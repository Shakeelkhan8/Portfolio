/** Project-work offerings, shown in "Working together" on the home page. */
export const defaultServices = [
  {
    title: "New SaaS backends",
    description:
      "Laravel and PostgreSQL backends designed for multiple tenants from the first migration.",
    icon: "Server",
  },
  {
    title: "Payments and integrations",
    description:
      "Payment gateways, webhooks and e-commerce platforms, with retries and idempotency handled properly.",
    icon: "Webhook",
  },
  {
    title: "Fixing slow or fragile systems",
    description:
      "Query and index tuning, reliable queues and jobs, and cleaning up legacy Laravel code without a rewrite.",
    icon: "Wrench",
  },
] as const;
