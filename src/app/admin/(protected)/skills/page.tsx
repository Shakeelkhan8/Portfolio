import type { Metadata } from "next";
import { SkillsManager } from "@/components/admin/content/skills-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getSkillCategories } from "@/lib/db/queries/skills";

export const metadata: Metadata = { title: "Skills" };

export default async function AdminSkillsPage() {
  const categories = await getSkillCategories();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Skills
        </Heading>
        <Text muted className="mt-1">
          Manage skill categories, names, levels, and ordering.
        </Text>
      </div>
      <SkillsManager categories={categories} />
    </div>
  );
}
