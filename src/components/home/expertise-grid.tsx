import { siteConfig } from "@/config/site";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import type { SiteConfig } from "@/types/cms";

type ExpertiseGridProps = {
  site?: SiteConfig;
};

export function ExpertiseGrid({ site }: ExpertiseGridProps) {
  const expertise = site?.expertise ?? siteConfig.expertise;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {expertise.map((item, index) => (
        <FadeIn key={item} delay={index * 0.05}>
          <Card className="hover-lift h-full bg-surface hover:ring-foreground/15">
            <CardHeader className="flex-row items-center gap-3">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-medium text-primary"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <CardTitle className="text-base font-medium">{item}</CardTitle>
            </CardHeader>
          </Card>
        </FadeIn>
      ))}
    </div>
  );
}
