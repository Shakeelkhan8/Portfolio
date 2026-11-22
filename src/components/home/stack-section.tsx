"use client";

import { useId, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  Braces,
  Building2,
  Code2,
  CreditCard,
  Database,
  FlaskConical,
  KeyRound,
  ListOrdered,
  Puzzle,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenericTechIcon, TechGroup, TechItem, TechLogo } from "@/lib/tech-icons";

const ALL = "All";

const GENERIC: Record<GenericTechIcon, LucideIcon> = {
  api: Braces,
  database: Database,
  shield: ShieldCheck,
  realtime: RadioTower,
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

/**
 * One logo. Idle: a calm grey (dark marks inverted so they stay visible).
 * Hover: the original colours; dark marks sit on a small white backing, the
 * way those brands present on dark backgrounds.
 */
function Logo({ logo, size }: { logo: TechLogo; size: "lg" | "sm" }) {
  const box = size === "lg" ? "h-7 max-w-[3.75rem]" : "h-6 max-w-[2.75rem]";
  const backing = logo.backdrop
    ? "rounded-md p-0.5 transition-colors duration-300 group-hover:bg-white"
    : "";

  if (logo.kind === "image") {
    return (
      <span className={cn("flex items-center", backing)}>
        <Image
          src={logo.src}
          alt=""
          width={28}
          height={28}
          unoptimized
          className={cn(
            "w-auto object-contain opacity-75 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0",
            box,
            // Idle grey needs lifting for dark marks (MySQL's teal read as
            // near-black); black marks are inverted to light grey instead.
            logo.backdrop
              ? "invert group-hover:invert-0"
              : "brightness-150 group-hover:brightness-100",
          )}
        />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "flex items-center text-foreground/65 transition-colors duration-300 group-hover:text-[var(--logo)]",
        backing,
      )}
      style={{ "--logo": logo.color } as CSSProperties}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("fill-current", size === "lg" ? "size-7" : "size-6")}>
        <path d={logo.path} />
      </svg>
    </span>
  );
}

function TechIcon({ item }: { item: TechItem }) {
  if (item.logos.length > 0) {
    return (
      <span className="flex items-center gap-1.5">
        {item.logos.map((logo, index) => (
          <Logo key={index} logo={logo} size={item.logos.length > 1 ? "sm" : "lg"} />
        ))}
      </span>
    );
  }
  const Icon = GENERIC[item.generic ?? "code"];
  return (
    <Icon
      aria-hidden="true"
      className="size-7 text-foreground/60 transition-colors duration-300 group-hover:text-[var(--glow)]"
      strokeWidth={1.6}
    />
  );
}

/**
 * On hover the logo turns from grey to its original colours, which carries
 * the effect; the tile answers quietly in the brand's colour (--glow): a
 * faint border tint, a light wash from the top and a 2px lift (not under
 * reduced motion). An outer glow was removed (2026-11-22): with five
 * effects at once the hover read as "too much".
 */
function TechGrid({ items }: { items: TechItem[] }) {
  return (
    <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
      {items.map((item) => (
        <li key={item.name} data-tech-tile="">
          <div
            className="group relative flex h-full min-h-[6.5rem] flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-foreground/8 bg-gradient-to-b from-foreground/[0.04] to-foreground/[0.01] px-2 py-4 text-center transition-[border-color,transform] duration-300 ease-out hover:border-[color-mix(in_oklab,var(--glow)_30%,transparent)] motion-safe:hover:-translate-y-0.5"
            style={{ "--glow": item.glow } as CSSProperties}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--glow)_6%,transparent),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <span className="relative flex h-8 items-center justify-center">
              <TechIcon item={item} />
            </span>
            <span className="relative text-[0.8125rem] leading-tight font-medium text-pretty text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
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
