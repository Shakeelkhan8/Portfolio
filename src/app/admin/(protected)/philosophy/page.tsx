import type { Metadata } from "next";
import { PhilosophyManager } from "@/components/admin/content/philosophy-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getPhilosophyItemRecords } from "@/lib/db/queries/admin/identity";

export const metadata: Metadata = { title: "Philosophy" };

export default async function AdminPhilosophyPage() {
  const items = await getPhilosophyItemRecords();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Philosophy
        </Heading>
        <Text muted className="mt-1">
          Guiding principles shown on the home and about pages.
        </Text>
      </div>
      <PhilosophyManager items={items} />
    </div>
  );
}
