import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Reveal } from "@/components/motion/reveal";
import type { Service } from "@/content/service-catalog";

export function contactHref(type: string) {
  return `/contact?type=${encodeURIComponent(type)}#contact-form`;
}

/**
 * Services as ruled rows (docs/DESIGN.md): name and starting price, what it
 * is and who it suits, then what's included. Rows rather than cards: five
 * near-identical boxes would read as a template, and rows keep the prices
 * aligned for comparison.
 */
export function ServiceList({ services }: { services: Service[] }) {
  return (
    <ol className="border-t border-foreground/10">
      {services.map((service, index) => (
        <li key={service.title} className="border-b border-foreground/10">
          <Reveal delay={index * 0.04}>
            <article className="grid gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
              <div className="min-w-0">
                <h3 className="font-heading text-subheading font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 font-heading font-stretch-semi-expanded text-lg font-semibold tabular-nums text-foreground/90">
                  {service.price}
                </p>
                <AppLink
                  href={contactHref(service.type)}
                  showExternalIcon={false}
                  aria-label={`Discuss this service: ${service.title}`}
                  className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
                >
                  <span className="link-draw">Discuss this service</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </AppLink>
              </div>

              <div className="min-w-0">
                <p className="leading-relaxed text-pretty text-foreground/80">
                  {service.summary}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="label-mono mr-2 text-foreground/70">Good for</span>
                  {service.goodFor}
                </p>
              </div>

              <ul className="min-w-0 space-y-2.5">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-px w-3 shrink-0 bg-foreground/30"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
