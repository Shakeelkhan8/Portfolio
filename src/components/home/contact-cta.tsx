"use client";

import { ButtonLink } from "@/components/shared/button-link";
import { Text } from "@/components/typography/text";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { routes } from "@/config/navigation";
import {
  getMailtoHref,
  getPublicEmailLabel,
} from "@/lib/contact/email-display";
import type { SiteConfig } from "@/types/cms";

type ContactCTAProps = {
  site: SiteConfig;
};

export function ContactCTA({ site }: ContactCTAProps) {
  const email = site.email?.trim() ?? "";

  return (
    <Reveal>
      <div className="relative isolate overflow-hidden px-2 py-8 text-center sm:px-6 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgb(245_245_245/0.04),transparent_70%)]"
        />
        <p className="mb-4 font-mono text-[11px] tracking-[0.32em] text-muted-foreground uppercase">
          Contact
        </p>
        <TextReveal
          as="h2"
          text="Let's work together"
          when="inView"
          className="font-heading mb-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        />
        <Text muted className="mx-auto mb-9 max-w-lg text-balance">
          {site.availability.message}
        </Text>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink
            href={routes.contact}
            size="lg"
            className="transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            Contact me
          </ButtonLink>
          {email ? (
            <ButtonLink
              href={getMailtoHref(email)}
              variant="outline"
              size="lg"
              className="border-border bg-transparent text-foreground transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              {getPublicEmailLabel(email)}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
