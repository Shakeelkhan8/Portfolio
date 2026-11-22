import {
  siOdoo,
  siOwasp,
  siSalla,
  siShopify,
  siStripe,
  type SimpleIcon,
} from "simple-icons";
import type { SkillGroup } from "@/types";

/**
 * Icons for the tech stack, one deliberate entry per skill (2026-11-22, after
 * the user found wrong marks: Redis showed its 2024 logo, Flutter's dark navy
 * never lit up on hover, WebSockets borrowed Socket.IO's logo).
 *
 * - Brands use their original, full-colour logo from Devicon (MIT), copied to
 *   public/icons/tech by scripts/copy-tech-icons.ts.
 * - Brands Devicon lacks (Stripe, Shopify, Salla, Odoo, OWASP) use the
 *   one-colour Simple Icons mark (CC0) in the brand's colour.
 * - Skills with no official logo anywhere (practices, and OpenAI, HyperPay,
 *   EdfaPay, Zid, Blade, Pest, PHPUnit, Larastan) get a neutral icon rather
 *   than a lookalike.
 *
 * `glow` is the colour the tile takes on hover (border and glow), so every
 * tile reacts. `backdrop` marks logos that are black or very dark: on the
 * dark page they get a white backing on hover, the way those brands present
 * on dark backgrounds, and are inverted while idle so they stay visible.
 */

export type GenericTechIcon =
  | "api"
  | "database"
  | "shield"
  | "realtime"
  | "test"
  | "payment"
  | "ai"
  | "queue"
  | "webhook"
  | "tenant"
  | "key"
  | "puzzle"
  | "code";

export type TechLogo =
  /** A Devicon SVG served from public/icons/tech. */
  | { kind: "image"; src: string; backdrop?: boolean }
  /** A Simple Icons path (24x24), drawn in `color` on hover. */
  | { kind: "path"; path: string; color: string; backdrop?: boolean };

export type TechItem = {
  name: string;
  /** One logo, or two for a pair such as "RabbitMQ / Kafka". Empty means generic. */
  logos: TechLogo[];
  generic?: GenericTechIcon;
  /** Hover colour for the tile's border and glow. */
  glow: string;
};

export type TechGroup = { category: string; items: TechItem[] };

/** The site's accent (--signal) for tiles without a brand colour. */
const ACCENT = "var(--signal)";

const devicon = (file: string, backdrop = false): TechLogo => ({
  kind: "image",
  src: `/icons/tech/${file}`,
  ...(backdrop ? { backdrop } : {}),
});

const simple = (icon: SimpleIcon, backdrop = false): TechLogo => ({
  kind: "path",
  path: icon.path,
  color: `#${icon.hex}`,
  ...(backdrop ? { backdrop } : {}),
});

type Entry = { logos: TechLogo[]; glow: string } | { generic: GenericTechIcon };

/** Every skill on the site. A skill missing here falls back to a generic icon. */
const ENTRIES: Record<string, Entry> = {
  // Languages
  TypeScript: { logos: [devicon("typescript-original.svg")], glow: "#3178C6" },
  JavaScript: { logos: [devicon("javascript-original.svg")], glow: "#F7DF1E" },
  "PHP 8.4": { logos: [devicon("php-original.svg")], glow: "#777BB4" },
  Python: { logos: [devicon("python-original.svg")], glow: "#FFD43B" },
  // go-original is the gopher mascot; the language's logo is the "GO" mark.
  Go: { logos: [devicon("go-original-wordmark.svg")], glow: "#00ADD8" },
  SQL: { generic: "database" },

  // Backend
  "Node.js": { logos: [devicon("nodejs-original.svg")], glow: "#5FA04E" },
  NestJS: { logos: [devicon("nestjs-original.svg")], glow: "#E0234E" },
  Express: { logos: [devicon("express-original.svg", true)], glow: "#E8E8E8" },
  Laravel: { logos: [devicon("laravel-original.svg")], glow: "#FF2D20" },
  "REST APIs": { generic: "api" },
  GraphQL: { logos: [devicon("graphql-plain.svg")], glow: "#E10098" },
  WebSockets: { generic: "realtime" },
  "Queues and scheduled jobs": { generic: "queue" },
  "RabbitMQ / Kafka": {
    logos: [devicon("rabbitmq-original.svg"), devicon("apachekafka-original.svg", true)],
    glow: "#FF6600",
  },
  "Idempotent webhooks": { generic: "webhook" },
  "Multi-tenancy": { generic: "tenant" },
  RBAC: { generic: "key" },
  "Adapter pattern": { generic: "puzzle" },

  // Frontend
  React: { logos: [devicon("react-original.svg")], glow: "#61DAFB" },
  "Next.js": { logos: [devicon("nextjs-original.svg")], glow: "#E8E8E8" },
  "Vue.js": { logos: [devicon("vuejs-original.svg")], glow: "#4FC08D" },
  Livewire: { logos: [devicon("livewire-original.svg")], glow: "#FB70A9" },
  Vite: { logos: [devicon("vitejs-original.svg")], glow: "#646CFF" },
  "Tailwind CSS": { logos: [devicon("tailwindcss-original.svg")], glow: "#06B6D4" },
  Blade: { generic: "code" },
  jQuery: { logos: [devicon("jquery-original.svg")], glow: "#0769AD" },

  // Mobile (React Native's logo is React's)
  "React Native": { logos: [devicon("react-original.svg")], glow: "#61DAFB" },
  Flutter: { logos: [devicon("flutter-original.svg")], glow: "#54C5F8" },

  // Data
  PostgreSQL: { logos: [devicon("postgresql-original.svg")], glow: "#4169E1" },
  // A thin dark-blue outline: unreadable on the dark page without a backing.
  MySQL: { logos: [devicon("mysql-original.svg", true)], glow: "#00758F" },
  Redis: { logos: [devicon("redis-original.svg")], glow: "#DC382D" },
  MongoDB: { logos: [devicon("mongodb-original.svg")], glow: "#47A248" },
  Prisma: { logos: [devicon("prisma-original.svg", true)], glow: "#5A67D8" },
  Supabase: { logos: [devicon("supabase-original.svg")], glow: "#3FCF8E" },
  "Row-level security": { generic: "database" },
  "Schema design": { generic: "database" },
  Indexing: { generic: "database" },
  Migrations: { generic: "database" },

  // Payments and integrations
  Stripe: { logos: [simple(siStripe)], glow: "#635BFF" },
  HyperPay: { generic: "payment" },
  EdfaPay: { generic: "payment" },
  Shopify: { logos: [simple(siShopify)], glow: "#7AB55C" },
  Salla: { logos: [simple(siSalla)], glow: "#BAF3E6" },
  Zid: { generic: "payment" },
  WooCommerce: { logos: [devicon("woocommerce-original.svg")], glow: "#96588A" },
  Odoo: { logos: [simple(siOdoo, true)], glow: "#A47FA0" },
  Webhooks: { generic: "webhook" },

  // Security
  "Secure development": { generic: "shield" },
  "JWT / OAuth 2.0": {
    logos: [devicon("jwt-original.svg"), devicon("oauth-original.svg")],
    glow: "#D500F9",
  },
  "OWASP web app audits": { logos: [simple(siOwasp, true)], glow: "#E8E8E8" },
  "Code security reviews": { generic: "shield" },
  "Server hardening": { generic: "shield" },
  "Dependency audits": { generic: "shield" },

  // AI integration (OpenAI's logo isn't in either icon set)
  "OpenAI API": { generic: "ai" },
  "Claude API": { logos: [devicon("claude-original.svg")], glow: "#D97757" },
  "Structured output": { generic: "api" },
  Evals: { generic: "test" },
  "Batch processing": { generic: "queue" },
  "Spend limits": { generic: "payment" },

  // DevOps and testing
  Docker: { logos: [devicon("docker-original.svg")], glow: "#2496ED" },
  Kubernetes: { logos: [devicon("kubernetes-original.svg")], glow: "#326CE5" },
  Nginx: { logos: [devicon("nginx-original.svg")], glow: "#009639" },
  "GitHub Actions": { logos: [devicon("githubactions-original.svg")], glow: "#2088FF" },
  "AWS (EC2, S3, RDS)": {
    logos: [devicon("amazonwebservices-original.svg", true)],
    glow: "#FF9900",
  },
  Vercel: { logos: [devicon("vercel-original.svg", true)], glow: "#E8E8E8" },
  Linux: { logos: [devicon("linux-original.svg", true)], glow: "#FCC624" },
  OpenTelemetry: { logos: [devicon("opentelemetry-original.svg")], glow: "#F5A800" },
  Sentry: { logos: [devicon("sentry-original.svg", true)], glow: "#7553FF" },
  Vitest: { logos: [devicon("vitest-original.svg")], glow: "#6E9F18" },
  "Pest and PHPUnit": { generic: "test" },
  Playwright: { logos: [devicon("playwright-original.svg")], glow: "#2EAD33" },
  Larastan: { generic: "test" },
};

/** Skills with a deliberate entry; a test checks every seeded skill is here. */
export const MAPPED_SKILLS: string[] = Object.keys(ENTRIES);

/** Devicon files the stack uses; scripts/copy-tech-icons.ts copies these. */
export const DEVICON_FILES: string[] = [
  ...new Set(
    Object.values(ENTRIES).flatMap((entry) =>
      "logos" in entry
        ? entry.logos.flatMap((logo) =>
            logo.kind === "image" ? [logo.src.replace("/icons/tech/", "")] : [],
          )
        : [],
    ),
  ),
].sort();

export function techItem(name: string): TechItem {
  const entry = ENTRIES[name];
  if (!entry) return { name, logos: [], generic: "code", glow: ACCENT };
  if ("generic" in entry) return { name, logos: [], generic: entry.generic, glow: ACCENT };
  return { name, logos: entry.logos, glow: entry.glow };
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
