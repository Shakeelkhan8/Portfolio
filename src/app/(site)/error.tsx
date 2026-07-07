"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/shared/button-link";
import { routes } from "@/config/navigation";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Section spacing="sm" className="flex flex-1 items-center py-24">
      <Container className="text-center">
        <Text size="sm" muted className="mb-4 uppercase tracking-widest">
          Error
        </Text>
        <Heading as="h1" size="xl" className="mb-4">
          Something went wrong
        </Heading>
        <Text muted className="mx-auto mb-8 max-w-md">
          An unexpected error occurred while loading this page. You can try again
          or head back home.
        </Text>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href={routes.home} variant="outline">
            Go Home
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
