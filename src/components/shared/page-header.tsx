import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Text } from "@/components/typography/text";
import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
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
    <Container className={cn("relative pt-16 pb-12 md:pt-24 md:pb-16", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-0 h-40 w-72 rounded-full bg-foreground/[0.03] blur-3xl"
      />
      <div
        className={cn(
          "relative max-w-3xl space-y-4",
          align === "center" && "mx-auto text-center",
        )}
      >
        <TextReveal
          as="h1"
          text={title}
          className="font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground -tracking-[0.01em] sm:text-4xl"
        />
        {description ? (
          <FadeIn delay={0.15}>
            <Text size="lg" muted leading="relaxed" className="max-w-2xl text-balance">
              {description}
            </Text>
          </FadeIn>
        ) : null}
        {children ? <FadeIn delay={0.22}>{children}</FadeIn> : null}
      </div>
    </Container>
  );
}
