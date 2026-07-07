import type { Metadata } from "next";
import { ExpertiseManager } from "@/components/admin/content/expertise-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getExpertiseItemRecords } from "@/lib/db/queries/admin/identity";

export const metadata: Metadata = { title: "Expertise" };

export default async function AdminExpertisePage() {
  const items = await getExpertiseItemRecords();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Expertise
        </Heading>
        <Text muted className="mt-1">
          Areas of expertise shown on the home hero and expertise section.
        </Text>
      </div>
      <ExpertiseManager items={items} />
    </div>
  );
}
