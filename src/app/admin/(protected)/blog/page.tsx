import type { Metadata } from "next";
import { ArticlesList } from "@/components/admin/content/articles-list";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getArticleRecords } from "@/lib/db/queries/admin/articles";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const articles = await getArticleRecords();

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
      <ArticlesList articles={articles} />
    </div>
  );
}
