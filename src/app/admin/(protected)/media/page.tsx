import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/media/media-library";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getMediaFiles } from "@/lib/db/queries/media";

export const metadata: Metadata = { title: "Media" };

export default async function AdminMediaPage() {
  const files = await getMediaFiles();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Media Library
        </Heading>
        <Text muted className="mt-1">
          Upload, organize, and reuse images, PDFs, and videos across the site.
        </Text>
      </div>
      <MediaLibrary files={files} />
    </div>
  );
}
