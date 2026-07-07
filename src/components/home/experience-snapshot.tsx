import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Text } from "@/components/typography/text";
import { Heading } from "@/components/typography/heading";
import { formatDateRange, getFeaturedExperience } from "@/lib/content";
import { routes } from "@/config/navigation";

export async function ExperienceSnapshot() {
  const current = await getFeaturedExperience();

  if (!current) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-8">
      <Text size="sm" muted className="mb-2 uppercase tracking-widest">
        Current Role
      </Text>
      <Heading as="h3" size="md" balance={false} className="mb-1">
        {current.role}
      </Heading>
      <Text className="mb-1 font-medium">{current.company}</Text>
      <Text size="sm" muted className="mb-4">
        {formatDateRange(current.startDate, current.endDate)} ·{" "}
        {current.location}
      </Text>
      <Text size="sm" muted leading="relaxed" className="mb-6">
        {current.highlights[0]}
      </Text>
      <ButtonLink href={routes.experience} variant="outline">
        View full timeline
        <ArrowRight className="size-4" data-icon="inline-end" />
      </ButtonLink>
    </div>
  );
}
