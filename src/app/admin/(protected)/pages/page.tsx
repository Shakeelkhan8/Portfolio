import type { Metadata } from "next";
import { PagesList } from "@/components/admin/content/pages-list";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { ADMIN_PAGE_SIZE, parsePageParam } from "@/lib/admin/pagination";
import { getPageListRecords } from "@/lib/db/queries/admin/pages";

export const metadata: Metadata = { title: "Pages" };

type AdminPagesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminPagesPage({ searchParams }: AdminPagesPageProps) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const result = await getPageListRecords({
    page,
    pageSize: ADMIN_PAGE_SIZE,
  });

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
      <PagesList result={result} />
    </div>
  );
}
