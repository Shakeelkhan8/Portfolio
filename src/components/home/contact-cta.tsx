import { ButtonLink } from "@/components/shared/button-link";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { routes } from "@/config/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import type { SiteConfig } from "@/types/cms";

type ContactCTAProps = {
  site: SiteConfig;
};

export function ContactCTA({ site }: ContactCTAProps) {
  return (
    <FadeIn>
      <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center shadow-sm sm:px-8 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-50 [mask-image:radial-gradient(70%_70%_at_50%_0%,#000,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-64 w-[36rem] max-w-[90%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <Heading as="h2" size="xl" className="mb-3">
          Let&apos;s work together
        </Heading>
        <Text muted className="mx-auto mb-8 max-w-lg text-balance">
          {site.availability.message}
        </Text>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={routes.contact} size="lg">
            Contact me
          </ButtonLink>
          <ButtonLink
            href={`mailto:${site.email}`}
            variant="outline"
            size="lg"
          >
            {site.email}
          </ButtonLink>
        </div>
      </div>
    </FadeIn>
  );
}
