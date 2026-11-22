import {
  siClaude,
  siDocker,
  siExpress,
  siFlutter,
  siGithubactions,
  siGo,
  siGraphql,
  siJavascript,
  siJquery,
  siJsonwebtokens,
  siKubernetes,
  siLaravel,
  siLinux,
  siLivewire,
  siMongodb,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siOdoo,
  siOpentelemetry,
  siOwasp,
  siPhp,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siSentry,
  siShopify,
  siSocketdotio,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  siVitest,
  siVuedotjs,
  siWoocommerce,
  siWordpress,
  type SimpleIcon,
} from "simple-icons";
import type { SkillGroup } from "@/types";

/**
 * Generic icons for skills with no brand mark (patterns, practices, and
 * brands simple-icons doesn't carry, such as AWS or OpenAI). Resolved to
 * lucide icons in the client component.
 */
export type GenericTechIcon =
  | "api"
  | "database"
  | "shield"
  | "server"
  | "cloud"
  | "test"
  | "payment"
  | "ai"
  | "queue"
  | "webhook"
  | "tenant"
  | "key"
  | "puzzle"
  | "code";

export type TechItem = {
  name: string;
  /** SVG path in a 24x24 viewBox (simple-icons, CC0), when the skill is a brand. */
  path?: string;
  /** The brand's own colour (#rrggbb), shown on hover; only when readable on the page. */
  brandColor?: string;
  generic?: GenericTechIcon;
};

/** The site's background (globals.css --background); the site is dark-only. */
const PAGE_BACKGROUND = "0b0a09";
/** WCAG 1.4.11: graphical objects need 3:1 against what is behind them. */
const MIN_ICON_CONTRAST = 3;

function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio of a brand colour against the page background. */
export function contrastOnPage(hex: string): number {
  const [light, dark] = [luminance(hex), luminance(PAGE_BACKGROUND)].sort(
    (a, b) => b - a,
  );
  return (light + 0.05) / (dark + 0.05);
}

export type TechGroup = { category: string; items: TechItem[] };

const BRAND: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  "PHP 8.4": siPhp,
  Python: siPython,
  Go: siGo,
  "Node.js": siNodedotjs,
  NestJS: siNestjs,
  Express: siExpress,
  Laravel: siLaravel,
  GraphQL: siGraphql,
  WebSockets: siSocketdotio,
  // "RabbitMQ / Kafka" uses the generic queue icon: one logo would imply one tool.
  React: siReact,
  "Next.js": siNextdotjs,
  "Vue.js": siVuedotjs,
  Livewire: siLivewire,
  Vite: siVite,
  "Tailwind CSS": siTailwindcss,
  jQuery: siJquery,
  WordPress: siWordpress,
  "React Native": siReact,
  Flutter: siFlutter,
  PostgreSQL: siPostgresql,
  MySQL: siMysql,
  Redis: siRedis,
  MongoDB: siMongodb,
  Prisma: siPrisma,
  Supabase: siSupabase,
  Stripe: siStripe,
  Shopify: siShopify,
  WooCommerce: siWoocommerce,
  Odoo: siOdoo,
  "JWT / OAuth 2.0": siJsonwebtokens,
  "OWASP web app audits": siOwasp,
  "Claude API": siClaude,
  Docker: siDocker,
  Kubernetes: siKubernetes,
  Nginx: siNginx,
  "GitHub Actions": siGithubactions,
  Vercel: siVercel,
  Linux: siLinux,
  OpenTelemetry: siOpentelemetry,
  Sentry: siSentry,
  Vitest: siVitest,
};

/** Keyword rules for skills without a brand icon; first match wins. */
const GENERIC_RULES: Array<[RegExp, GenericTechIcon]> = [
  [/webhook/i, "webhook"],
  [/queue|batch|rabbitmq|kafka/i, "queue"],
  [/tenan/i, "tenant"],
  [/rbac|jwt|oauth/i, "key"],
  [/adapter|pattern/i, "puzzle"],
  [/rest|api|structured output/i, "api"],
  [/sql|schema|index|migration|row-level|database/i, "database"],
  [/secur|owasp|hardening|audit/i, "shield"],
  [/aws|cloud/i, "cloud"],
  [/phpunit|pest|playwright|larastan|test|eval/i, "test"],
  [/pay|salla|zid|spend/i, "payment"],
  [/openai|claude|ai\b/i, "ai"],
  [/server|linux|nginx/i, "server"],
];

export function techItem(name: string): TechItem {
  const brand = BRAND[name];
  if (brand) {
    // Black or very dark marks (Next.js, Vercel, Prisma...) would vanish on
    // the dark page, so they keep the default light colour on hover.
    const readable = contrastOnPage(brand.hex) >= MIN_ICON_CONTRAST;
    return readable
      ? { name, path: brand.path, brandColor: `#${brand.hex}` }
      : { name, path: brand.path };
  }
  const rule = GENERIC_RULES.find(([pattern]) => pattern.test(name));
  return { name, generic: rule ? rule[1] : "code" };
}

/**
 * Skill groups with an icon for every skill. Runs on the server so the
 * simple-icons module never reaches the browser bundle; only the paths used
 * are sent as props.
 */
export function withTechIcons(groups: SkillGroup[]): TechGroup[] {
  return groups.map((group) => ({
    category: group.category,
    items: group.skills.map(techItem),
  }));
}
