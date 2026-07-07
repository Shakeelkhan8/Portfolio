import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/media/media-library";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import {
  ADMIN_MEDIA_PAGE_SIZE,
  parsePageParam,
} from "@/lib/admin/pagination";
import { getMediaFilesPaginated } from "@/lib/db/queries/media";

export const metadata: Metadata = { title: "Media" };

type AdminMediaPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminMediaPage({ searchParams }: AdminMediaPageProps) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const result = await getMediaFilesPaginated({
    page,
    pageSize: ADMIN_MEDIA_PAGE_SIZE,
  });

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
      <MediaLibrary result={result} />
    </div>
  );
}
