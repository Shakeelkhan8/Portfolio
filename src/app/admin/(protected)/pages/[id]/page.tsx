import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/content/page-editor";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getPageRecordById } from "@/lib/db/queries/admin/pages";
import { getMediaFiles } from "@/lib/db/queries/media";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const page = await getPageRecordById(id);
  return { title: page ? `Edit ${page.title}` : "Edit Page" };
}

export default async function AdminEditPagePage({ params }: PageProps) {
  const { id } = await params;
  const [page, mediaFiles] = await Promise.all([
    getPageRecordById(id),
    getMediaFiles(),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Edit page
        </Heading>
        <Text muted className="mt-1">
          Update {page.title}. Changes revalidate the public site on save.
        </Text>
      </div>
      <PageEditor page={page} mediaFiles={mediaFiles} />
    </div>
  );
}
