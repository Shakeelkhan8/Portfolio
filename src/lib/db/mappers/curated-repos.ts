import type { CuratedRepoRecord } from "@/types/cms";

export function mapCuratedRepo(row: {
  id: string;
  repo_full_name: string;
  github_repo_id: number | null;
  pinned: boolean;
  hidden: boolean;
  override_description: string | null;
  display_order: number;
}): CuratedRepoRecord {
  return {
    id: row.id,
    repoFullName: row.repo_full_name,
    githubRepoId: row.github_repo_id,
    pinned: row.pinned,
    hidden: row.hidden,
    overrideDescription: row.override_description,
    displayOrder: row.display_order,
  };
}
