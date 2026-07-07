import type { CuratedRepoRecord } from "@/types/cms";
import type { GitHubRepo } from "@/types";

export function applyCuratedRepos(
  repos: GitHubRepo[],
  curated: CuratedRepoRecord[],
): GitHubRepo[] {
  if (!curated.length) {
    return repos;
  }

  const curatedMap = new Map(curated.map((item) => [item.repoFullName, item]));

  const visible = repos
    .filter((repo) => !curatedMap.get(repo.fullName)?.hidden)
    .map((repo) => {
      const settings = curatedMap.get(repo.fullName);
      if (settings?.overrideDescription) {
        return { ...repo, description: settings.overrideDescription };
      }
      return repo;
    });

  return visible.sort((a, b) => {
    const aCurated = curatedMap.get(a.fullName);
    const bCurated = curatedMap.get(b.fullName);

    if (aCurated?.pinned && !bCurated?.pinned) {
      return -1;
    }
    if (!aCurated?.pinned && bCurated?.pinned) {
      return 1;
    }
    if (aCurated?.pinned && bCurated?.pinned) {
      return aCurated.displayOrder - bCurated.displayOrder;
    }

    return b.stargazersCount - a.stargazersCount;
  });
}

export function getMissingPinnedRepos(
  repos: GitHubRepo[],
  curated: CuratedRepoRecord[],
): string[] {
  const repoNames = new Set(repos.map((repo) => repo.fullName));
  return curated
    .filter((item) => item.pinned && !item.hidden && !repoNames.has(item.repoFullName))
    .map((item) => item.repoFullName);
}
