import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Mono label above the title. Hidden when it would just repeat the title. */
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
  const showEyebrow = Boolean(eyebrow) && eyebrow !== title;

  return (
    <header className={cn("border-b border-border", className)}>
      <Container className="pt-14 pb-10 sm:pt-20 sm:pb-14 md:pt-24">
        <div
          className={cn(
            "flex max-w-3xl flex-col",
            align === "center" && "mx-auto items-center text-center",
          )}
        >
          {showEyebrow ? <p className="label-mono mb-4">{eyebrow}</p> : null}

          <h1 className="font-heading text-[2.5rem] leading-[1.05] text-foreground sm:text-6xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:mt-6">
              {description}
            </p>
          ) : null}

          {children ? <div className="mt-7 sm:mt-8">{children}</div> : null}
        </div>
      </Container>
    </header>
  );
}
