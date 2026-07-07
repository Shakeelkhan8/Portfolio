import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/content/project-editor";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getProjectRecordById } from "@/lib/db/queries/admin/projects";
import { getMediaFiles } from "@/lib/db/queries/media";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectRecordById(id);
  return { title: project ? `Edit ${project.title}` : "Edit Project" };
}

export default async function AdminEditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const [project, mediaFiles] = await Promise.all([
    getProjectRecordById(id),
    getMediaFiles(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Edit project
        </Heading>
        <Text muted className="mt-1">
          Update {project.title}. Changes revalidate the public site on save.
        </Text>
      </div>
      <ProjectEditor project={project} mediaFiles={mediaFiles} />
    </div>
  );
}
