import { siteConfig } from "@/config/site";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { SiteConfig } from "@/types/cms";

type ExpertiseGridProps = {
  site?: SiteConfig;
};

export function ExpertiseGrid({ site }: ExpertiseGridProps) {
  const expertise = site?.expertise ?? siteConfig.expertise;

  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
      {expertise.map((item, index) => (
        <StaggerItem key={item}>
          <div className="site-card group relative h-full overflow-hidden rounded-2xl p-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-foreground/20 transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
            <div className="relative flex items-center gap-3.5">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-muted font-mono text-[11px] font-medium text-muted-foreground transition-colors duration-300 group-hover:border-foreground/20 group-hover:text-foreground"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-heading text-base font-medium tracking-tight text-foreground">
                {item}
              </p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
