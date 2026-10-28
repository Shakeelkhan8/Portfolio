import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/shared/arrow-link";
import { formatDateRange } from "@/lib/content";
import { routes } from "@/config/navigation";
import type { ExperienceEntry } from "@/types";

type ExperienceSnapshotProps = {
  experience: ExperienceEntry[];
  /** How many of the most recent roles to list. */
  limit?: number;
};

export function ExperienceSnapshot({
  experience,
  limit = 3,
}: ExperienceSnapshotProps) {
  const roles = experience.slice(0, limit);
  if (roles.length === 0) return null;

  return (
    <Reveal>
      <ol className="border-t border-border">
        {roles.map((entry) => (
          <li
            key={entry.id}
            className="grid gap-1 border-b border-border py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
          >
            <p className="font-mono text-xs leading-6 text-muted-foreground">
              {formatDateRange(entry.startDate, entry.endDate)}
            </p>
            <div>
              <h3 className="font-medium text-foreground">
                {entry.role}
                <span className="text-muted-foreground">, {entry.company}</span>
              </h3>
              {entry.highlights[0] ? (
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">
                  {entry.highlights[0]}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        <ArrowLink href={routes.experience}>Full timeline</ArrowLink>
        <ArrowLink href={routes.resume}>Resume</ArrowLink>
      </div>
    </Reveal>
  );
}
