import type { Metadata } from "next";
import { ArticlesList } from "@/components/admin/content/articles-list";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { ADMIN_PAGE_SIZE, parsePageParam } from "@/lib/admin/pagination";
import { getArticleListRecords } from "@/lib/db/queries/admin/articles";

export const metadata: Metadata = { title: "Blog" };

type AdminBlogPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const result = await getArticleListRecords({
    page,
    pageSize: ADMIN_PAGE_SIZE,
  });

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Blog
        </Heading>
        <Text muted className="mt-1">
          Write, publish, and manage articles with HTML content and SEO controls.
        </Text>
      </div>
      <ArticlesList result={result} />
    </div>
  );
}
