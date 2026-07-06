import type { Metadata } from "next";
import { ProjectEditor } from "@/components/admin/content/project-editor";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getMediaFiles } from "@/lib/db/queries/media";

export const metadata: Metadata = { title: "New Project" };

export default async function AdminNewProjectPage() {
  const mediaFiles = await getMediaFiles();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          New project
        </Heading>
        <Text muted className="mt-1">
          Create a new case study. Save as draft until you are ready to publish.
        </Text>
      </div>
      <ProjectEditor mediaFiles={mediaFiles} />
    </div>
  );
}
