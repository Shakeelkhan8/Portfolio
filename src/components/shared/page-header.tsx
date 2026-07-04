import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function PageHeader({
  title,
  description,
  children,
  className,
  align = "left",
}: PageHeaderProps) {
  return (
    <Container className={cn("pt-16 pb-12 md:pt-20 md:pb-16", className)}>
      <div
        className={cn(
          "max-w-3xl space-y-4",
          align === "center" && "mx-auto text-center",
        )}
      >
        <Heading as="h1" size="xl">
          {title}
        </Heading>
        {description ? (
          <Text size="lg" muted leading="relaxed">
            {description}
          </Text>
        ) : null}
        {children}
      </div>
    </Container>
  );
}
