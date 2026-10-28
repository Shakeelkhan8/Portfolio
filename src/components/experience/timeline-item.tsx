import { formatDateRange } from "@/lib/formatters";
import type { ExperienceEntry } from "@/types";
import { Reveal } from "@/components/motion/reveal";

type TimelineItemProps = {
  entry: ExperienceEntry;
};

function HighlightList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((highlight) => (
        <li
          key={highlight.slice(0, 40)}
          className="relative max-w-[65ch] pl-5 leading-relaxed text-pretty text-foreground/85 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-signal before:content-['']"
        >
          {highlight}
        </li>
      ))}
    </ul>
  );
}

const VISIBLE_HIGHLIGHTS = 3;

export function TimelineItem({ entry }: TimelineItemProps) {
  const showAll =
    entry.featured || entry.highlights.length <= VISIBLE_HIGHLIGHTS;
  const visible = showAll
    ? entry.highlights
    : entry.highlights.slice(0, VISIBLE_HIGHLIGHTS);
  const hidden = showAll ? [] : entry.highlights.slice(VISIBLE_HIGHLIGHTS);

  return (
    <Reveal className="border-t border-border py-10 md:grid md:grid-cols-12 md:gap-12">
      <div className="md:col-span-3">
        <p className="font-mono text-xs leading-6 text-muted-foreground">
          {formatDateRange(entry.startDate, entry.endDate)}
        </p>
        <p className="text-sm text-muted-foreground">{entry.location}</p>
      </div>

      <div className="mt-3 min-w-0 md:col-span-9 md:mt-0">
        <h2 className="font-heading text-2xl leading-tight text-foreground">
          {entry.role}
        </h2>
        <p className="mt-1 font-medium text-foreground">{entry.company}</p>
        <div className="mt-5">
          <HighlightList items={visible} />
        </div>
        {hidden.length > 0 ? (
          <details className="group mt-3">
            <summary className="cursor-pointer text-sm font-medium text-foreground hover:text-signal">
              Show {hidden.length} more
            </summary>
            <div className="mt-3">
              <HighlightList items={hidden} />
            </div>
          </details>
        ) : null}
      </div>
    </Reveal>
  );
}
