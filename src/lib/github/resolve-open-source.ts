import {
  applyCuratedRepos,
  getMissingPinnedRepos,
} from "@/lib/github/apply-curation";
import {
  curatedRepoToStub,
  sortCuratedRepos,
} from "@/lib/github/curated-repo-stub";
import { getGitHubData, getGitHubRepo } from "@/services/github";
import type { CuratedRepoRecord } from "@/types/cms";
import type { GitHubProfile, GitHubRepo } from "@/types";

export type OpenSourcePageData = {
  profile: GitHubProfile | null;
  repos: GitHubRepo[];
  liveStatsUnavailable: boolean;
};

async function loadCuratedRepos(
  curated: CuratedRepoRecord[],
): Promise<GitHubRepo[]> {
  const visible = curated.filter((item) => !item.hidden);
  if (!visible.length) {
    return [];
  }

  const repos = await Promise.all(
    visible.map(async (item) => {
      const live = await getGitHubRepo(item.repoFullName);
      if (!live) {
        return curatedRepoToStub(item);
      }

      return item.overrideDescription
        ? { ...live, description: item.overrideDescription }
        : live;
    }),
  );

  return sortCuratedRepos(repos, visible);
}

export async function resolveOpenSourcePageData(
  username: string,
  showLiveStats: boolean,
  curated: CuratedRepoRecord[],
): Promise<OpenSourcePageData> {
  if (showLiveStats) {
    try {
      const data = await getGitHubData(username);
      let allRepos = data.repos;
      const missingPinned = getMissingPinnedRepos(allRepos, curated);

      if (missingPinned.length) {
        const extraRepos = await Promise.all(
          missingPinned.map((fullName) => getGitHubRepo(fullName)),
        );
        const validExtra = extraRepos.filter(
          (repo): repo is GitHubRepo => repo !== null,
        );
        allRepos = [...allRepos, ...validExtra];
      }

      const repos = applyCuratedRepos(allRepos, curated);

      return {
        profile: data.profile,
        repos,
        liveStatsUnavailable: false,
      };
    } catch {
      const repos = await loadCuratedRepos(curated);

      return {
        profile: null,
        repos,
        liveStatsUnavailable: true,
      };
    }
  }

  return {
    profile: null,
    repos: await loadCuratedRepos(curated),
    liveStatsUnavailable: false,
  };
}
