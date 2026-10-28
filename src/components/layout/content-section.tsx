import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type ContentSectionProps = {
  /** Used for the heading id and `aria-labelledby`. */
  id: string;
  title: string;
  description?: string | null;
  /** Rendered under the description, e.g. a "View all" link. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * The home page's section layout: a hairline rule, the heading and intro in
 * a narrow left column, and the content in a wide right column. On phones
 * the columns stack.
 */
export function ContentSection({
  id,
  title,
  description,
  action,
  children,
  className,
}: ContentSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("scroll-mt-16 border-t border-border", className)}
    >
      <Container className="grid gap-10 py-16 sm:py-20 md:grid-cols-12 md:gap-12 md:py-24">
        <Reveal className="md:sticky md:top-24 md:col-span-4 md:self-start">
          <h2
            id={headingId}
            className="font-heading text-[2rem] leading-[1.1] text-foreground sm:text-4xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-sm leading-relaxed text-pretty text-muted-foreground">
              {description}
            </p>
          ) : null}
          {action ? <div className="mt-6">{action}</div> : null}
        </Reveal>
        <div className="min-w-0 md:col-span-8">{children}</div>
      </Container>
    </section>
  );
}
