import type { Metadata } from "next";
import { PageEditor } from "@/components/admin/content/page-editor";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getMediaFiles } from "@/lib/db/queries/media";

export const metadata: Metadata = { title: "New Page" };

export default async function AdminNewPagePage() {
  const mediaFiles = await getMediaFiles();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          New page
        </Heading>
        <Text muted className="mt-1">
          Create a custom page. HTML is sanitized on save.
        </Text>
      </div>
      <PageEditor mediaFiles={mediaFiles} />
    </div>
  );
}
