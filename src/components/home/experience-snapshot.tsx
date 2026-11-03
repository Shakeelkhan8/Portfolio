import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Text } from "@/components/typography/text";
import { Heading } from "@/components/typography/heading";
import { Reveal } from "@/components/motion/reveal";
import { formatDateRange } from "@/lib/content";
import { routes } from "@/config/navigation";
import type { ExperienceEntry } from "@/types";

type ExperienceSnapshotProps = {
  experience: ExperienceEntry[];
  /** How many earlier roles to list beside the current one. */
  previousLimit?: number;
};

export function ExperienceSnapshot({
  experience,
  previousLimit = 2,
}: ExperienceSnapshotProps) {
  const current = experience.find((entry) => entry.featured) ?? experience[0];
  if (!current) return null;

  const previous = experience
    .filter((entry) => entry.id !== current.id)
    .slice(0, previousLimit);

  return (
    <Reveal>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <div className="relative max-w-3xl">
          <Text
            size="sm"
            muted
            className="mb-3 font-mono text-[11px] tracking-[0.28em] uppercase"
          >
            Current Role
          </Text>
          <Heading as="h3" size="md" balance={false} className="mb-1">
            {current.role}
          </Heading>
          <Text className="mb-1 font-medium text-foreground/90">
            {current.company}
          </Text>
          <Text size="sm" muted className="mb-5">
            {formatDateRange(current.startDate, current.endDate)} ·{" "}
            {current.location}
          </Text>
          <Text size="sm" muted leading="relaxed" className="mb-7 max-w-2xl">
            {current.highlights[0]}
          </Text>
          <ButtonLink
            href={routes.experience}
            variant="outline"
            className="group/btn bg-transparent"
          >
            View full timeline
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
              data-icon="inline-end"
            />
          </ButtonLink>
        </div>

        {previous.length > 0 ? (
          <div>
            <Text
              size="sm"
              muted
              className="mb-3 font-mono text-[11px] tracking-[0.28em] uppercase"
            >
              {/* Independent work runs alongside the main role, so not "Before that". */}
              Other roles
            </Text>
            <ol className="divide-y divide-foreground/[0.06] border-y border-foreground/[0.06]">
              {previous.map((entry) => (
                <li key={entry.id} className="py-4">
                  <p className="font-heading text-[0.95rem] font-medium tracking-tight text-foreground">
                    {entry.role}
                  </p>
                  <p className="mt-0.5 text-sm text-foreground/80">
                    {entry.company}
                  </p>
                  <p className="mt-1 font-mono text-[11px] tracking-wide text-muted-foreground">
                    {formatDateRange(entry.startDate, entry.endDate)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
