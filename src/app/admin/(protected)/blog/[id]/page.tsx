import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/content/article-editor";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getArticleRecordById } from "@/lib/db/queries/admin/articles";
import { getMediaFiles } from "@/lib/db/queries/media";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleRecordById(id);
  return { title: article ? `Edit ${article.title}` : "Edit Article" };
}

export default async function AdminEditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const [article, mediaFiles] = await Promise.all([
    getArticleRecordById(id),
    getMediaFiles(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Edit article
        </Heading>
        <Text muted className="mt-1">
          Update {article.title}. Changes revalidate the public site on save.
        </Text>
      </div>
      <ArticleEditor article={article} mediaFiles={mediaFiles} />
    </div>
  );
}
