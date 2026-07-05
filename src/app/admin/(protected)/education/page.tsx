import type { Metadata } from "next";
import { EducationManager } from "@/components/admin/content/education-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getEducationRecords } from "@/lib/db/queries/experience";

export const metadata: Metadata = { title: "Education" };

export default async function AdminEducationPage() {
  const entries = await getEducationRecords();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Education
        </Heading>
        <Text muted className="mt-1">
          Manage degrees, institutions, dates, and achievements.
        </Text>
      </div>
      <EducationManager entries={entries} />
    </div>
  );
}
