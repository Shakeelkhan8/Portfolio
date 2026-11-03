"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Text } from "@/components/typography/text";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { routes } from "@/config/navigation";
import {
  getMailtoHref,
  getPublicEmailLabel,
} from "@/lib/contact/email-display";
import type { ServiceRecord, SiteConfig } from "@/types/cms";

type ContactCTAProps = {
  site: SiteConfig;
  /** Project-work offerings (CMS `services`), listed on the project path. */
  services?: ServiceRecord[];
};

/**
 * Closing call to action with two paths: someone hiring for a role, and
 * someone with a project. Replaces the separate "Working together" service
 * cards, which said the same thing in a generic way one section earlier.
 */
export function ContactCTA({ site, services = [] }: ContactCTAProps) {
  const email = site.email?.trim() ?? "";
  const availability = site.availability.message?.trim();

  return (
    <Reveal>
      <div className="relative isolate overflow-hidden px-2 py-8 sm:px-6 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgb(245_245_245/0.04),transparent_70%)]"
        />
        <div className="text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.32em] text-muted-foreground uppercase">
            Contact
          </p>
          <TextReveal
            as="h2"
            text="Have a backend problem, or a role to fill?"
            when="inView"
            className="font-heading mx-auto mb-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl"
          />
          {availability ? (
            <Text muted className="mx-auto max-w-lg text-balance">
              {availability}
            </Text>
          ) : null}
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 text-left md:grid-cols-2">
          <div className="site-card flex flex-col rounded-2xl p-5 sm:p-6">
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Hiring for a backend role
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
              I&apos;m open to remote backend roles on product teams. The resume
              has the detail; email is the quickest way to reach me.
            </p>
            <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
              <ButtonLink href={routes.resume} className="group/btn">
                Read the resume
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                  data-icon="inline-end"
                />
              </ButtonLink>
              {email ? (
                <ButtonLink
                  href={getMailtoHref(email)}
                  variant="outline"
                  className="bg-transparent"
                >
                  {getPublicEmailLabel(email)}
                </ButtonLink>
              ) : null}
            </div>
          </div>

          <div className="site-card flex flex-col rounded-2xl p-5 sm:p-6">
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              For agencies and product teams
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
              For agencies the work is white-label: your brand, an NDA, and no
              contact with your clients. Everyone gets a reply within one
              working day (Pakistan time).
            </p>
            {services.length > 0 ? (
              <ul className="mt-4 space-y-2.5">
                {services.map((service) => (
                  <li key={service.id} className="text-sm leading-relaxed">
                    <span className="font-medium text-foreground">
                      {service.title}.
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {service.description}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
              <ButtonLink href={routes.contact}>
                Book a code health check
              </ButtonLink>
              {site.links.upwork ? (
                <ButtonLink
                  href={site.links.upwork}
                  variant="outline"
                  className="bg-transparent"
                  showExternalIcon
                >
                  See packages on Upwork
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
