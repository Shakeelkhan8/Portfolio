import { Check, Minus } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Reveal } from "@/components/motion/reveal";
import { contactHref } from "@/components/services/service-list";
import type { ServicePackage } from "@/content/service-catalog";

/**
 * Fixed-scope packages side by side. These are separate, comparable offers,
 * so they get panels (a fair use of cards); what is not included is listed
 * as plainly as what is.
 */
export function PackageGrid({ packages }: { packages: ServicePackage[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {packages.map((pkg, index) => (
        <Reveal key={pkg.title} delay={index * 0.06} className="h-full">
          <article className="flex h-full flex-col rounded-2xl border border-foreground/[0.08] bg-surface p-6 sm:p-7">
            <h3 className="font-heading text-subheading font-semibold text-foreground">
              {pkg.title}
            </h3>
            <p className="mt-3 font-heading font-stretch-semi-expanded text-figure font-semibold tabular-nums text-foreground">
              {pkg.price}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
              {pkg.summary}
            </p>

            <p className="label-mono mt-6 mb-3">Included</p>
            <ul className="space-y-2">
              {pkg.includes.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="label-mono mt-6 mb-3">Not included</p>
            <ul className="space-y-2">
              {pkg.excludes.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <Minus aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-foreground/[0.08] pt-4 text-sm leading-relaxed text-pretty text-muted-foreground">
              <span className="font-medium text-foreground/85">Scope: </span>
              {pkg.scope}
            </p>

            <div className="mt-auto pt-6">
              <ButtonLink
                href={contactHref(pkg.type)}
                variant="outline"
                className="w-full bg-transparent"
                aria-label={`Discuss this package: ${pkg.title}`}
              >
                Discuss this package
              </ButtonLink>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
