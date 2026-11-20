"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Text } from "@/components/typography/text";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/layout/section-header";
import { routes } from "@/config/navigation";
import {
  getMailtoHref,
  getPublicEmailLabel,
} from "@/lib/contact/email-display";
import type { PublicSiteConfig } from "@/types/cms";
import { ContactCards } from "@/components/home/contact-cards";

type ContactCTAProps = {
  site: PublicSiteConfig;
  /** WhatsApp click-to-chat link derived on the server, or null. */
  whatsappHref?: string | null;
};

/**
 * Closing call to action: direct contact cards, then two paths, someone
 * hiring for a role and someone with a project. No prices or service list
 * (removed 2026-11-19 at the user's request); the project path stays general.
 */
export function ContactCTA({ site, whatsappHref = null }: ContactCTAProps) {
  const email = site.email?.trim() ?? "";
  const availability = site.availability.message?.trim();

  return (
    <div>
      <SectionHeader
        title="Contact"
        description="Have a product to build, or a role to fill?"
      />
      {availability ? (
        <Text muted className="-mt-4 mb-10 max-w-xl text-pretty sm:-mt-6 sm:mb-14">
          {availability}
        </Text>
      ) : null}

      <div className="mb-14">
        <ContactCards
          email={email}
          linkedin={site.links.linkedin}
          whatsappHref={whatsappHref}
        />
      </div>

      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className="flex flex-col border-t border-foreground/10 pt-6">
          <p className="label-mono">For hiring managers</p>
          <h3 className="mt-3 font-heading text-subheading font-semibold text-foreground">
            Hiring a full stack engineer
          </h3>
          <p className="mt-3 max-w-[48ch] leading-relaxed text-pretty text-muted-foreground">
            I&apos;m open to full-time and remote full stack and backend roles on
            product teams. The resume has the detail; email or WhatsApp is the
            quickest way to reach me.
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
          <p className="label-mono">For projects</p>
          <h3 className="mt-3 font-heading text-subheading font-semibold text-foreground">
            Open to project work
          </h3>
          <p className="mt-3 max-w-[48ch] leading-relaxed text-pretty text-muted-foreground">
            Scope agreed in writing before I start, a short update every working
            day, and a test with every fix.
          </p>
          <div className="flex flex-col items-start gap-4 pt-8 sm:flex-row sm:items-center sm:gap-7">
            <ButtonLink href={routes.contact}>Start a conversation</ButtonLink>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
