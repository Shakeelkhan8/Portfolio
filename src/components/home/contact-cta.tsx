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
      <div className="rounded-xl border border-border bg-muted/30 px-8 py-12 text-center">
        <Heading as="h2" size="lg" className="mb-3">
          Let&apos;s work together
        </Heading>
        <Text muted className="mx-auto mb-8 max-w-lg">
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
