import { AppLink } from "@/components/shared/app-link";
import { Button } from "@/components/ui/button";
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
          <Button
            size="lg"
            render={
              <AppLink href={routes.contact} showExternalIcon={false} />
            }
          >
            Contact me
          </Button>
          <Button
            variant="outline"
            size="lg"
            render={
              <AppLink
                href={`mailto:${siteConfig.email}`}
                showExternalIcon={false}
              />
            }
          >
            {siteConfig.email}
          </Button>
        </div>
      </div>
    </FadeIn>
  );
}
