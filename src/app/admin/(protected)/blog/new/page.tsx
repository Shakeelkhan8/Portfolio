import type { Metadata } from "next";
import { ArticleEditor } from "@/components/admin/content/article-editor";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getMediaFiles } from "@/lib/db/queries/media";

export const metadata: Metadata = { title: "New Article" };

export default async function AdminNewArticlePage() {
  const mediaFiles = await getMediaFiles();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          New article
        </Heading>
        <Text muted className="mt-1">
          Draft your post, then publish when it is ready.
        </Text>
      </div>
      <ArticleEditor mediaFiles={mediaFiles} />
    </div>
  );
}
