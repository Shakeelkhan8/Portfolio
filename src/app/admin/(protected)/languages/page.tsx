import type { Metadata } from "next";
import { LanguagesManager } from "@/components/admin/content/languages-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getLanguageRecords } from "@/lib/db/queries/admin/identity";

export const metadata: Metadata = { title: "Languages" };

export default async function AdminLanguagesPage() {
  const languages = await getLanguageRecords();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Languages
        </Heading>
        <Text muted className="mt-1">
          Spoken languages shown on the about page.
        </Text>
      </div>
      <LanguagesManager languages={languages} />
    </div>
  );
}
