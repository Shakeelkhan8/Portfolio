import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Text } from "@/components/typography/text";
import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Mono label above the title. Defaults to `title` when omitted. */
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function PageHeader({
  title,
  description,
  eyebrow,
  children,
  className,
  align = "left",
}: PageHeaderProps) {
  const label = eyebrow ?? title;

  return (
    <header className={cn("relative overflow-x-clip", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(48vh,24rem)] bg-[radial-gradient(ellipse_70%_65%_at_0%_0%,rgb(245_245_245/0.04),transparent_58%)]"
      />

      <Container className="relative pt-12 pb-8 sm:pt-16 sm:pb-10 md:pt-20 md:pb-12 lg:pt-24 lg:pb-14">
        <div
          className={cn(
            "relative flex flex-col",
            align === "center" && "mx-auto max-w-3xl items-center text-center",
          )}
        >
          <FadeIn delay={0.02} direction="none" duration={0.5}>
            <p
              aria-hidden={label === title ? true : undefined}
              className={cn(
                "mb-4 font-mono text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase sm:mb-5",
                align === "center" && "text-center",
              )}
            >
              {label}
            </p>
          </FadeIn>

          <TextReveal
            as="h1"
            text={title}
            delay={0.06}
            className="font-heading font-display-wide text-[2.125rem] font-semibold leading-[1.05] text-foreground -tracking-[0.03em] sm:text-5xl md:text-5xl lg:text-6xl"
          />

          {description ? (
            <FadeIn delay={0.18} direction="none" duration={0.65} className="mt-5 sm:mt-6">
              <Text
                size="lg"
                muted
                leading="relaxed"
                className={cn(
                  "text-base text-pretty sm:text-lg",
                  align === "center" && "mx-auto max-w-3xl text-balance",
                )}
              >
                {description}
              </Text>
            </FadeIn>
          ) : null}

          {children ? (
            <FadeIn delay={0.26} direction="none" duration={0.6} className="mt-7 sm:mt-8">
              {children}
            </FadeIn>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
