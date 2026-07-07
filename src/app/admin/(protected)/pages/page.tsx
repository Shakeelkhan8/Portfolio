import type { Metadata } from "next";
import { PagesList } from "@/components/admin/content/pages-list";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getPageRecords } from "@/lib/db/queries/admin/pages";

export const metadata: Metadata = { title: "Pages" };

export default async function AdminPagesPage() {
  const pages = await getPageRecords();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Custom Pages
        </Heading>
        <Text muted className="mt-1">
          Create and publish custom pages with HTML content and SEO controls.
        </Text>
      </div>
      <PagesList pages={pages} />
    </div>
  );
}
