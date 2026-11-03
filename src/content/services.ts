/**
 * Project-work offerings, shown on the contact page and in the closing
 * section of the home page. They mirror the fixed-price packages on Upwork
 * (`siteConfig.links.upwork`); keep the starting prices in step with it.
 */
export const defaultServices = [
  {
    title: "Payment gateway integration",
    description:
      "Stripe, EdfaPay, HyperPay or another gateway in your Laravel app, with signed webhooks that are safe to receive twice. From $150.",
    icon: "CreditCard",
  },
  {
    title: "AI features",
    description:
      "OpenAI or Claude in your Laravel app for summaries, classification, search or chat, queued and with a spend limit. From $200.",
    icon: "Sparkles",
  },
  {
    title: "Store sync",
    description:
      "Orders, products and stock synced between your app and Shopify, WooCommerce, Salla or Zid. From $200.",
    icon: "RefreshCw",
  },
  {
    title: "Laravel and PHP upgrades",
    description:
      "Your app moved to a supported Laravel and PHP version, with the test suite green before cutover. From $120.",
    icon: "CircleArrowUp",
  },
  {
    title: "Bug fixes",
    description:
      "The root cause found and fixed, with a test that fails on the old code and passes on the new. From $60.",
    icon: "Bug",
  },
  {
    title: "Web app or SaaS MVP",
    description:
      "A Laravel web app built from a written spec, tested and deployed. Spec from $150, builds from $1,500.",
    icon: "Rocket",
  },
] as const;
