import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/navigation";

export default function NotFound() {
  return (
    <Section spacing="sm" className="flex flex-1 items-center py-24">
      <Container className="text-center">
        <Text size="sm" muted className="mb-4 uppercase tracking-widest">
          404
        </Text>
        <Heading as="h1" size="xl" className="mb-4">
          Page not found
        </Heading>
        <Text muted className="mx-auto mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Text>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button render={<Link href={routes.home} />}>Go Home</Button>
          <Button variant="outline" render={<Link href={routes.projects} />}>
            View Projects
          </Button>
          <Button variant="outline" render={<Link href={routes.contact} />}>
            Contact
          </Button>
        </div>
      </Container>
    </Section>
  );
}
