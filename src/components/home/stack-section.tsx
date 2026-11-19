"use client";

import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SkillGroup } from "@/types";

const ALL = "All";

/**
 * Home tech stack: filter tabs over the CMS skill groups (Admin → Skills).
 * "All" lists every skill once; a group tab shows just that group. The tabs
 * are toggle buttons (aria-pressed) controlling one live region, which is
 * simpler for screen readers than a full tablist for a filter.
 */
export function StackSection({ groups }: { groups: SkillGroup[] }) {
  const [active, setActive] = useState(ALL);
  const listId = useId();

  const visible =
    active === ALL
      ? Array.from(new Set(groups.flatMap((group) => group.skills)))
      : (groups.find((group) => group.category === active)?.skills ?? []);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter the tech stack"
        className="flex flex-wrap gap-2"
      >
        {[ALL, ...groups.map((group) => group.category)].map((name) => {
          const selected = name === active;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={selected}
              aria-controls={listId}
              onClick={() => setActive(name)}
              className={cn(
                "label-mono min-h-9 rounded-full border px-3.5 py-1.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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

      <ul
        id={listId}
        aria-live="polite"
        aria-label={active === ALL ? "All technologies" : active}
        className="mt-8 flex flex-wrap gap-2.5 border-t border-foreground/10 pt-8"
      >
        {visible.map((skill) => (
          <li key={skill}>
            <Badge
              variant="secondary"
              className="border border-foreground/8 bg-foreground/[0.03] px-3 py-1.5 text-sm font-medium text-foreground/85"
            >
              {skill}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
