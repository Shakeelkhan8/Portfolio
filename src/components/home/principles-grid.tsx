import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { SiteConfig } from "@/types/cms";

type PrinciplesGridProps = {
  principles: SiteConfig["philosophy"];
};

/**
 * Engineering principles (CMS `philosophy_items`) as a ruled two-column
 * list: each rule opens with a hairline and a short index, like clauses in
 * a written agreement, rather than four floating items with circle badges.
 */
export function PrinciplesGrid({ principles }: PrinciplesGridProps) {
  if (principles.length === 0) return null;

  return (
    <Stagger
      className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:gap-x-16"
      stagger={0.06}
    >
      {principles.map((item, index) => (
        <StaggerItem key={item.title}>
          <div className="group border-t border-foreground/10 pt-5 transition-colors duration-500 hover:border-foreground/25">
            <p
              aria-hidden="true"
              className="font-mono text-xs text-signal/80 tabular-nums"
            >
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 font-heading text-subheading font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2.5 max-w-[46ch] leading-relaxed text-pretty text-muted-foreground">
              {item.description}
            </p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
