"use client";

import { useId, useState, type CSSProperties } from "react";
import {
  Boxes,
  Braces,
  Building2,
  Cloud,
  Code2,
  CreditCard,
  Database,
  FlaskConical,
  KeyRound,
  ListOrdered,
  Puzzle,
  Server,
  ShieldCheck,
  Sparkles,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenericTechIcon, TechGroup, TechItem } from "@/lib/tech-icons";

const ALL = "All";

const GENERIC: Record<GenericTechIcon, LucideIcon> = {
  api: Braces,
  database: Database,
  shield: ShieldCheck,
  server: Server,
  cloud: Cloud,
  test: FlaskConical,
  payment: CreditCard,
  ai: Sparkles,
  queue: ListOrdered,
  webhook: Webhook,
  tenant: Building2,
  key: KeyRound,
  puzzle: Puzzle,
  code: Code2,
};

function TechIcon({ item }: { item: TechItem }) {
  if (item.path) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 fill-current">
        <path d={item.path} />
      </svg>
    );
  }
  const Icon = GENERIC[item.generic ?? "code"] ?? Boxes;
  return <Icon aria-hidden="true" className="size-7" strokeWidth={1.6} />;
}

function TechGrid({ items }: { items: TechItem[] }) {
  return (
    <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
      {items.map((item) => (
        <li key={item.name} data-tech-tile="">
          <div className="group flex h-full min-h-[6.5rem] flex-col items-center justify-center gap-3 rounded-xl border border-foreground/8 bg-foreground/[0.025] px-2 py-4 text-center transition-colors duration-200 hover:border-foreground/25 hover:bg-foreground/[0.05]">
            {/* On hover the icon takes the brand's own colour, or full
                foreground when the brand has none readable on this page. */}
            <span
              className="text-foreground/70 transition-colors duration-200 group-hover:text-[var(--tile-hover)]"
              style={{ "--tile-hover": item.brandColor ?? "var(--foreground)" } as CSSProperties}
            >
              <TechIcon item={item} />
            </span>
            <span className="text-[0.8125rem] leading-tight font-medium text-pretty text-foreground/80">
              {item.name}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Home tech stack: filter tabs over the CMS skill groups (Admin → Skills),
 * each skill as an icon tile. "All" shows every group as its own titled
 * block; a group tab shows just that group. The tabs are toggle buttons
 * (aria-pressed) controlling one polite live region.
 */
export function StackSection({ groups }: { groups: TechGroup[] }) {
  const [active, setActive] = useState(ALL);
  const regionId = useId();
  const shown =
    active === ALL ? groups : groups.filter((group) => group.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter the tech stack" className="flex flex-wrap gap-2">
        {[ALL, ...groups.map((group) => group.category)].map((name) => {
          const selected = name === active;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={selected}
              aria-controls={regionId}
              onClick={() => setActive(name)}
              className={cn(
                "label-mono inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 py-1.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/15 text-foreground/70 hover:border-foreground/35 hover:text-foreground",
              )}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div
        id={regionId}
        aria-live="polite"
        className="mt-8 space-y-10 rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-4 sm:p-6"
      >
        {shown.map((group) => (
          <section key={group.category} aria-label={group.category}>
            <h3 className="label-mono mb-4 flex items-center gap-2 text-foreground/60">
              <Code2 aria-hidden="true" className="size-3.5" />
              {group.category}
            </h3>
            <TechGrid items={group.items} />
          </section>
        ))}
      </div>
    </div>
  );
}
