import { TimelineItem } from "@/components/experience/timeline-item";
import type { ExperienceEntry } from "@/types";

type TimelineProps = {
  entries: ExperienceEntry[];
};

export function Timeline({ entries }: TimelineProps) {
  return (
    <div className="border-b border-border">
      {entries.map((entry) => (
        <TimelineItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
