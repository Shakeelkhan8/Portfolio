import type { Metadata } from "next";
import { CuratedReposManager } from "@/components/admin/content/curated-repos-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getCuratedRepoRecords } from "@/lib/db/queries/admin/curated-repos";

export const metadata: Metadata = { title: "Open Source Curation" };

export default async function AdminCuratedReposPage() {
  const repos = await getCuratedRepoRecords();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Open Source Curation
        </Heading>
        <Text muted className="mt-1">
          Pin, hide, and customize how GitHub repositories appear on the public
          open-source page.
        </Text>
      </div>
      <CuratedReposManager repos={repos} />
    </div>
  );
}
