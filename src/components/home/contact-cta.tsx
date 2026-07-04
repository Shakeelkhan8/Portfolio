import { ButtonLink } from "@/components/shared/button-link";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { FadeIn } from "@/components/motion/fade-in";

export function ContactCTA() {
  return (
    <FadeIn>
      <div className="rounded-xl border border-border bg-muted/30 px-8 py-12 text-center">
        <Heading as="h2" size="lg" className="mb-3">
          Let&apos;s work together
        </Heading>
        <Text muted className="mx-auto mb-8 max-w-lg">
          {siteConfig.availability.message}
        </Text>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={routes.contact} size="lg">
            Contact me
          </ButtonLink>
          <ButtonLink
            href={`mailto:${siteConfig.email}`}
            variant="outline"
            size="lg"
          >
            {siteConfig.email}
          </ButtonLink>
        </div>
      </div>
    </FadeIn>
  );
}
