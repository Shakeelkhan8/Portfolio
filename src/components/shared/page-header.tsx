import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Text } from "@/components/typography/text";
import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  /** The page's name ("About"). The H1 on its own, or its label with `heading`. */
  title: string;
  /**
   * A sentence that says something about the page ("I work on the parts of a
   * product that move money."). When set, it is the large line of the H1 and
   * `title` becomes the small label inside it (see docs/DESIGN.md).
   */
  heading?: string;
  description?: string;
  /** Mono label above the title. Defaults to `title` when omitted. */
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function PageHeader({
  title,
  heading,
  description,
  eyebrow,
  children,
  className,
  align = "left",
}: PageHeaderProps) {
  // A label that only repeats the title ("ABOUT" over "About") is noise.
  const label = heading ? null : eyebrow && eyebrow !== title ? eyebrow : null;

  return (
    <header className={cn("relative overflow-x-clip", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(48vh,24rem)] bg-[radial-gradient(ellipse_60%_60%_at_0%_0%,color-mix(in_oklch,var(--signal)_6%,transparent),transparent_62%)]"
      />

      <Container className="relative pt-12 pb-8 sm:pt-16 sm:pb-10 md:pt-20 md:pb-12 lg:pt-24 lg:pb-14">
        <div
          className={cn(
            "relative flex flex-col",
            align === "center" && "mx-auto max-w-3xl items-center text-center",
          )}
        >
          {label ? (
            <FadeIn delay={0.02} direction="none" duration={0.5}>
              <p className="label-mono mb-5 flex items-center gap-2.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
                {label}
              </p>
            </FadeIn>
          ) : null}

          {heading ? (
            <h1 className={cn("flex flex-col", align === "center" && "items-center")}>
              <FadeIn delay={0.02} direction="none" duration={0.5}>
                <span className="label-mono mb-5 flex items-center gap-2.5">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
                  {title}
                  <span className="sr-only">: </span>
                </span>
              </FadeIn>
              <TextReveal
                as="span"
                text={heading}
                delay={0.06}
                className="block font-heading font-stretch-semi-expanded max-w-[20ch] text-title font-semibold text-balance text-foreground"
              />
            </h1>
          ) : (
            <TextReveal
              as="h1"
              text={title}
              delay={0.06}
              className="font-heading font-stretch-semi-expanded max-w-[20ch] text-title font-semibold text-balance text-foreground"
            />
          )}

          {description ? (
            <FadeIn delay={0.18} direction="none" duration={0.65} className="mt-5 sm:mt-6">
              <Text
                muted
                className={cn(
                  "max-w-[62ch] text-lead text-pretty",
                  align === "center" && "mx-auto text-balance",
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
