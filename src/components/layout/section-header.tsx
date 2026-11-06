import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

type SectionHeaderProps = {
  /** The section's category, shown as the small label ("Case studies"). */
  title: string;
  /**
   * The section's statement, shown as the heading. Without one, the title is
   * the heading and the label is omitted.
   */
  description?: string;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

/**
 * Opens a section like a page in a printed report: a hairline rule that
 * draws across as the section arrives, a small mono label naming the
 * category, and a sentence with a point of view as the heading.
 *
 * It replaced a large noun heading ("Case studies") with a grey line under
 * it, repeated identically for every section, which made the sections
 * interchangeable. See docs/DESIGN.md.
 */
export function SectionHeader({
  title,
  description,
  action,
  className,
  align = "left",
}: SectionHeaderProps) {
  const statement = description?.trim() || title;
  const label = description?.trim() ? title : null;
  const centered = align === "center";

  return (
    <header className={cn("mb-10 sm:mb-14", className)}>
      <div
        aria-hidden="true"
        className="section-rule h-px w-full bg-gradient-to-r from-foreground/20 via-foreground/10 to-transparent"
      />
      <Reveal
        direction="up"
        distance={12}
        className={cn(
          "mt-5 flex flex-col gap-4 sm:mt-6",
          centered && "items-center text-center",
          action && "md:flex-row md:items-end md:justify-between md:gap-10",
        )}
      >
        {/*
          The label sits inside the heading, so the heading's accessible name
          (and what a screen reader lists when jumping between headings) is
          "Case studies: Live systems ...", category first.
        */}
        <h2 className={cn("min-w-0", centered && "flex flex-col items-center")}>
          {label ? (
            <span className="label-mono mb-4 flex items-center gap-2.5">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
              {label}
              <span className="sr-only">: </span>
            </span>
          ) : null}
          <span className="block font-heading font-stretch-semi-expanded max-w-[24ch] text-heading font-semibold text-balance text-foreground">
            {statement}
          </span>
        </h2>
        {action ? <div className="shrink-0 md:pb-1.5">{action}</div> : null}
      </Reveal>
    </header>
  );
}
