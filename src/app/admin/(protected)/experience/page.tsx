import type { Metadata } from "next";
import { ExperienceManager } from "@/components/admin/content/experience-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getExperienceRecords } from "@/lib/db/queries/experience";

export const metadata: Metadata = { title: "Experience" };

export default async function AdminExperiencePage() {
  const entries = await getExperienceRecords();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Experience
        </Heading>
        <Text muted className="mt-1">
          Manage work history, highlights, and technologies.
        </Text>
      </div>
      <ExperienceManager entries={entries} />
    </div>
  );
}
