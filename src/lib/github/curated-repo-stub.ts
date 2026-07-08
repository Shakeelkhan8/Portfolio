import type { CuratedRepoRecord } from "@/types/cms";
import type { GitHubRepo } from "@/types";

function stableRepoId(fullName: string): number {
  let hash = 0;
  for (let i = 0; i < fullName.length; i += 1) {
    hash = (hash << 5) - hash + fullName.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function curatedRepoToStub(repo: CuratedRepoRecord): GitHubRepo {
  const [, name = repo.repoFullName] = repo.repoFullName.split("/");

  return {
    id: repo.githubRepoId ?? stableRepoId(repo.repoFullName),
    name,
    fullName: repo.repoFullName,
    description: repo.overrideDescription,
    htmlUrl: `https://github.com/${repo.repoFullName}`,
    homepage: null,
    language: null,
    stargazersCount: 0,
    forksCount: 0,
    updatedAt: new Date().toISOString(),
    topics: [],
  };
}

export function sortCuratedRepos(
  repos: GitHubRepo[],
  curated: CuratedRepoRecord[],
): GitHubRepo[] {
  const curatedMap = new Map(curated.map((item) => [item.repoFullName, item]));

  return [...repos].sort((a, b) => {
    const aCurated = curatedMap.get(a.fullName);
    const bCurated = curatedMap.get(b.fullName);

    if (aCurated?.pinned && !bCurated?.pinned) return -1;
    if (!aCurated?.pinned && bCurated?.pinned) return 1;
    if (aCurated?.pinned && bCurated?.pinned) {
      return aCurated.displayOrder - bCurated.displayOrder;
    }

    return aCurated && bCurated
      ? aCurated.displayOrder - bCurated.displayOrder
      : 0;
  });
}
