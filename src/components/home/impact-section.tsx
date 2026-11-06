import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Reveal } from "@/components/motion/reveal";
import { routes } from "@/config/navigation";
import type { ImpactItem } from "@/content/impact";

/**
 * Engineering impact: each number in amber (results are what the signal
 * colour is for), with a plain sentence on what it measures and a link to
 * the case study it comes from. Numbers without context read as decoration.
 *
 * Each <li> is a direct child of the <ul>; the Reveal sits inside it.
 */
export function ImpactSection({ items }: { items: ImpactItem[] }) {
  return (
    <ul className="grid gap-10 md:grid-cols-3 md:gap-12">
      {items.map((item, index) => (
        <li key={item.label} className="border-t border-foreground/10 pt-6">
          <Reveal delay={index * 0.06} className="flex h-full flex-col">
            <p className="font-heading font-stretch-semi-expanded text-figure font-semibold text-signal tabular-nums">
              {item.value}
            </p>
            <p className="mt-2 font-heading text-[1.0625rem] font-semibold leading-snug text-foreground">
              {item.label}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
              {item.explanation}
            </p>
            <AppLink
              href={routes.project(item.projectSlug)}
              showExternalIcon={false}
              className="group mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-foreground"
            >
              <span className="link-draw">See the case study</span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </AppLink>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
