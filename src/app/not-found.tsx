import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { ButtonLink } from "@/components/shared/button-link";
import { routes } from "@/config/navigation";

export default function NotFound() {
  return (
    <Section spacing="sm" className="flex flex-1 items-center py-24">
      <Container className="flex flex-col items-center text-center">
        <span
          className="mb-2 select-none text-gradient font-heading text-7xl font-bold tracking-tighter sm:text-8xl"
          aria-hidden="true"
        >
          404
        </span>
        <Heading as="h1" size="xl" className="mb-4">
          Page not found
        </Heading>
        <Text muted className="mx-auto mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Text>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={routes.home}>Go Home</ButtonLink>
          <ButtonLink href={routes.projects} variant="outline">
            View Projects
          </ButtonLink>
          <ButtonLink href={routes.contact} variant="outline">
            Contact
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
