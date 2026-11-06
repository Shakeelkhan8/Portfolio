import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Reveal } from "@/components/motion/reveal";
import { routes } from "@/config/navigation";
import type { Service } from "@/content/service-catalog";

/**
 * Compact services list for the home page: name, one line and starting
 * price, each row linking to the full details on /services. The home page
 * shows what can be hired; the services page explains it.
 */
export function ServicesTeaser({ services }: { services: Service[] }) {
  return (
    <>
      <ul className="grid border-t border-foreground/10 md:grid-cols-2 md:gap-x-12">
        {services.map((service, index) => (
          <li key={service.title} className="border-b border-foreground/10">
            <Reveal delay={(index % 2) * 0.05}>
              <AppLink
                href={routes.services}
                showExternalIcon={false}
                className="group flex h-full items-start justify-between gap-6 py-6"
              >
                <span className="min-w-0">
                  <span className="block font-heading text-subheading font-semibold text-foreground">
                    {service.title}
                  </span>
                  <span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-muted-foreground">
                    {service.summary}
                  </span>
                </span>
                <span className="shrink-0 pt-1 text-right font-mono text-xs whitespace-nowrap text-foreground/80 tabular-nums transition-colors group-hover:text-foreground">
                  {service.price}
                </span>
              </AppLink>
            </Reveal>
          </li>
        ))}
      </ul>
      <AppLink
        href={routes.services}
        showExternalIcon={false}
        className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <span className="link-draw">All services, packages and questions</span>
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      </AppLink>
    </>
  );
}
