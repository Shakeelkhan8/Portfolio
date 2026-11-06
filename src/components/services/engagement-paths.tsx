import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Reveal } from "@/components/motion/reveal";
import { contactHref } from "@/components/services/service-list";
import type { EngagementPath } from "@/content/service-catalog";

/** Three ways in, by size of job: ruled columns, each ending in one action. */
export function EngagementPaths({ paths }: { paths: EngagementPath[] }) {
  return (
    <div className="grid gap-10 md:grid-cols-3 md:gap-12">
      {paths.map((path, index) => (
        <Reveal
          key={path.title}
          delay={index * 0.06}
          className="flex flex-col border-t border-foreground/10 pt-6"
        >
          <p className="label-mono">{path.price}</p>
          <h3 className="mt-3 font-heading text-subheading font-semibold text-foreground">
            {path.title}
          </h3>
          <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">
            {path.description}
          </p>
          <AppLink
            href={contactHref(path.type)}
            showExternalIcon={false}
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
          >
            <span className="link-draw">{path.cta}</span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </AppLink>
        </Reveal>
      ))}
    </div>
  );
}
