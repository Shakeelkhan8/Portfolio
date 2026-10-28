import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { SiteConfig } from "@/types/cms";

type PrinciplesGridProps = {
  principles: SiteConfig["philosophy"];
};

/**
 * Numbered engineering principles (CMS `philosophy_items`). Replaces the old
 * expertise list on the home page, which repeated the hero's skill chips
 * without adding anything a reader could learn from.
 */
export function PrinciplesGrid({ principles }: PrinciplesGridProps) {
  if (principles.length === 0) return null;

  return (
    <Stagger className="grid gap-x-10 gap-y-9 sm:grid-cols-2" stagger={0.06}>
      {principles.map((item, index) => (
        <StaggerItem key={item.title}>
          <div className="group flex gap-4">
            <span
              className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/10 font-mono text-[11px] font-medium text-muted-foreground transition-colors duration-300 group-hover:border-foreground/25 group-hover:text-foreground"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="font-heading text-base font-semibold tracking-tight text-foreground sm:text-[1.0625rem]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
