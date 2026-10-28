import { siteConfig } from "@/config/site";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { SiteConfig } from "@/types/cms";

type ExpertiseGridProps = {
  site?: SiteConfig;
};

export function ExpertiseGrid({ site }: ExpertiseGridProps) {
  const expertise = site?.expertise ?? siteConfig.expertise;

  return (
    <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
      {expertise.map((item, index) => (
        <StaggerItem key={item}>
          <div className="group flex items-center gap-3.5">
            <span
              className="flex size-9 shrink-0 items-center justify-center font-mono text-[11px] font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="font-heading text-base font-medium tracking-tight text-foreground">
              {item}
            </p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
