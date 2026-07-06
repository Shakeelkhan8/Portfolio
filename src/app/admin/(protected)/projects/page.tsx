import type { Metadata } from "next";
import { ProjectsList } from "@/components/admin/content/projects-list";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getProjectRecords } from "@/lib/db/queries/admin/projects";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const projects = await getProjectRecords();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Projects
        </Heading>
        <Text muted className="mt-1">
          Manage portfolio case studies, publish state, and project content.
        </Text>
      </div>
      <ProjectsList projects={projects} />
    </div>
  );
}
