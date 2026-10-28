import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Text } from "@/components/typography/text";
import { Heading } from "@/components/typography/heading";
import { Reveal } from "@/components/motion/reveal";
import { formatDateRange, getFeaturedExperience } from "@/lib/content";
import { routes } from "@/config/navigation";

export async function ExperienceSnapshot() {
  const current = await getFeaturedExperience();

  if (!current) return null;

  return (
    <Reveal>
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
        <Text className="mb-1 font-medium text-foreground/90">{current.company}</Text>
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
    </Reveal>
  );
}
