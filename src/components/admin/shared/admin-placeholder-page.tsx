import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/admin/shared/phase-placeholder";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

type AdminPlaceholderPageProps = {
  title: string;
  description: string;
  phase?: number;
};

export function AdminPlaceholderPage({
  title,
  description,
  phase = 2,
}: AdminPlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          {title}
        </Heading>
        <Text muted className="mt-1">
          {description}
        </Text>
      </div>
      <PhasePlaceholder title={title} description={description} phase={phase} />
    </div>
  );
}

export function createAdminPlaceholderMetadata(title: string): Metadata {
  return { title };
}
