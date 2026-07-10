import { formatDateRange } from "@/lib/formatters";
import type { ExperienceEntry } from "@/types";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Reveal } from "@/components/motion/reveal";

type TimelineItemProps = {
  entry: ExperienceEntry;
  isLast?: boolean;
  defaultOpen?: boolean;
};

export function TimelineItem({
  entry,
  isLast = false,
  defaultOpen = false,
}: TimelineItemProps) {
  return (
    <Reveal className="relative flex gap-6 pb-12 last:pb-0">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "mt-1.5 size-3 shrink-0 rounded-full border-2",
            entry.featured
              ? "border-foreground bg-foreground"
              : "border-border bg-background",
          )}
          aria-hidden="true"
        />
        {!isLast ? (
          <div
            className="mt-2 w-px flex-1 bg-border"
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="site-card min-w-0 flex-1 space-y-3 rounded-2xl p-5 sm:p-6">
        <div>
          <Heading as="h3" size="sm" balance={false}>
            {entry.role}
          </Heading>
          <Text className="font-medium text-foreground/90">{entry.company}</Text>
          <Text size="sm" muted className="font-mono text-[12px] tracking-wide">
            {formatDateRange(entry.startDate, entry.endDate)} ·{" "}
            {entry.location}
          </Text>
        </div>

        <ul className="space-y-2">
          {entry.highlights
            .slice(0, defaultOpen ? entry.highlights.length : 3)
            .map((highlight) => (
              <li
                key={highlight.slice(0, 40)}
                className="relative pl-5 text-sm leading-relaxed text-muted-foreground before:absolute before:top-2.5 before:left-0 before:size-1.5 before:rounded-full before:bg-muted-foreground/50 before:content-['']"
              >
                {highlight}
              </li>
            ))}
        </ul>

        {!defaultOpen && entry.highlights.length > 3 ? (
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
              Show {entry.highlights.length - 3} more
            </summary>
            <ul className="mt-3 space-y-2">
              {entry.highlights.slice(3).map((highlight) => (
                <li
                  key={highlight.slice(0, 40)}
                  className="relative pl-5 text-sm leading-relaxed text-muted-foreground before:absolute before:top-2.5 before:left-0 before:size-1.5 before:rounded-full before:bg-muted-foreground/40 before:content-['']"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
    </Reveal>
  );
}
