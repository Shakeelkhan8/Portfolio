import { TimelineItem } from "@/components/experience/timeline-item";
import type { ExperienceEntry } from "@/types";

type TimelineProps = {
  entries: ExperienceEntry[];
};

export function Timeline({ entries }: TimelineProps) {
  return (
    <div>
      {entries.map((entry, index) => (
        <TimelineItem
          key={entry.id}
          entry={entry}
          isLast={index === entries.length - 1}
          defaultOpen={entry.featured}
        />
      ))}
    </div>
  );
}
