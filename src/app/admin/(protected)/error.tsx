"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/shared/button-link";

export default function AdminError({
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
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <Heading as="h1" size="lg" balance={false}>
        Something went wrong
      </Heading>
      <Text muted className="max-w-md">
        This admin screen failed to load. Try again, or return to the dashboard.
      </Text>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/admin/dashboard" variant="outline">
          Back to dashboard
        </ButtonLink>
      </div>
    </div>
  );
}
