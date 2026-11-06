"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Text } from "@/components/typography/text";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/layout/section-header";
import { AppLink } from "@/components/shared/app-link";
import { routes } from "@/config/navigation";
import {
  getMailtoHref,
  getPublicEmailLabel,
} from "@/lib/contact/email-display";
import type { ServiceRecord, PublicSiteConfig } from "@/types/cms";

type ContactCTAProps = {
  site: PublicSiteConfig;
  /** Project-work offerings (CMS `services`), listed on the project path. */
  services?: ServiceRecord[];
};

/**
 * Closing call to action with two paths: someone hiring for a role, and
 * someone with a project. Ruled columns under the shared section header
 * rather than two boxed cards: the paths hold very different amounts of
 * text, and boxes made the shorter one look half empty.
 */
export function ContactCTA({ site, services = [] }: ContactCTAProps) {
  const email = site.email?.trim() ?? "";
  const availability = site.availability.message?.trim();

  return (
    <div>
      <SectionHeader
        title="Contact"
        description="Have a backend problem, or a role to fill?"
      />
      {availability ? (
        <Text muted className="-mt-4 mb-10 max-w-xl text-pretty sm:-mt-6 sm:mb-14">
          {availability}
        </Text>
      ) : null}

      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className="flex flex-col border-t border-foreground/10 pt-6">
          <p className="label-mono">For hiring managers</p>
          <h3 className="mt-3 font-heading text-subheading font-semibold text-foreground">
            Hiring for a backend role
          </h3>
          <p className="mt-3 max-w-[48ch] leading-relaxed text-pretty text-muted-foreground">
            I&apos;m open to remote backend roles on product teams. The resume
            has the detail; email is the quickest way to reach me.
          </p>
          <div className="flex flex-col items-start gap-4 pt-8 sm:flex-row sm:items-center sm:gap-7">
            <ButtonLink href={routes.resume} className="group/btn">
              Read the resume
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                data-icon="inline-end"
              />
            </ButtonLink>
            {email ? (
              <a
                href={getMailtoHref(email)}
                className="link-draw text-sm font-medium text-foreground"
              >
                {getPublicEmailLabel(email)}
              </a>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col border-t border-foreground/10 pt-6">
          <p className="label-mono">For agencies and product teams</p>
          <h3 className="mt-3 font-heading text-subheading font-semibold text-foreground">
            Project work, scoped in writing
          </h3>
          <p className="mt-3 max-w-[48ch] leading-relaxed text-pretty text-muted-foreground">
            Scope and price in writing before I start, a short update every
            working day, and a test with every fix. For agencies the work is
            white-label: NDA on request, and I never contact your client.
          </p>
          {services.length > 0 ? (
            <ul className="mt-6 divide-y divide-foreground/[0.07] border-y border-foreground/[0.07]">
              {services.map((service) => (
                <li key={service.id} className="py-3.5 text-sm leading-relaxed">
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
          <div className="flex flex-col items-start gap-4 pt-8 sm:flex-row sm:items-center sm:gap-7">
            <ButtonLink href={routes.contact}>Book a code health check</ButtonLink>
            {site.links.upwork ? (
              <AppLink
                href={site.links.upwork}
                showExternalIcon
                className="link-draw text-sm font-medium text-foreground"
              >
                See packages on Upwork
              </AppLink>
            ) : null}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
