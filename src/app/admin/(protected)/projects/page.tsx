import type { Metadata } from "next";
import { ProjectsList } from "@/components/admin/content/projects-list";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { ADMIN_PAGE_SIZE, parsePageParam } from "@/lib/admin/pagination";
import { getProjectListRecords } from "@/lib/db/queries/admin/projects";

export const metadata: Metadata = { title: "Projects" };

type AdminProjectsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminProjectsPage({
  searchParams,
}: AdminProjectsPageProps) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const result = await getProjectListRecords({
    page,
    pageSize: ADMIN_PAGE_SIZE,
  });

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
      <ProjectsList result={result} />
    </div>
  );
}
