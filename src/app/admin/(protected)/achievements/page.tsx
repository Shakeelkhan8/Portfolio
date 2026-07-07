import type { Metadata } from "next";
import { AchievementsManager } from "@/components/admin/content/achievements-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getAchievements } from "@/lib/db/queries/experience";

export const metadata: Metadata = { title: "Achievements" };

export default async function AdminAchievementsPage() {
  const achievements = await getAchievements();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Achievements
        </Heading>
        <Text muted className="mt-1">
          Manage standalone accomplishments shown on your resume and about content.
        </Text>
      </div>
      <AchievementsManager achievements={achievements} />
    </div>
  );
}
