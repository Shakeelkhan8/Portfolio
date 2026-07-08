import { describe, expect, it } from "vitest";
import {
  curatedRepoToStub,
  sortCuratedRepos,
} from "@/lib/github/curated-repo-stub";
import type { CuratedRepoRecord } from "@/types/cms";
import type { GitHubRepo } from "@/types";

const curated: CuratedRepoRecord[] = [
  {
    id: "1",
    repoFullName: "user/alpha",
    githubRepoId: null,
    pinned: true,
    hidden: false,
    overrideDescription: "Pinned alpha",
    displayOrder: 1,
  },
  {
    id: "2",
    repoFullName: "user/beta",
    githubRepoId: null,
    pinned: false,
    hidden: false,
    overrideDescription: null,
    displayOrder: 0,
  },
];

describe("curatedRepoToStub", () => {
  it("builds a navigable repo card from curated metadata", () => {
    const stub = curatedRepoToStub(curated[0]);

    expect(stub.fullName).toBe("user/alpha");
    expect(stub.name).toBe("alpha");
    expect(stub.htmlUrl).toBe("https://github.com/user/alpha");
    expect(stub.description).toBe("Pinned alpha");
  });
});

describe("sortCuratedRepos", () => {
  it("pins curated repositories ahead of others", () => {
    const repos: GitHubRepo[] = [
      {
        id: 2,
        name: "beta",
        fullName: "user/beta",
        description: null,
        htmlUrl: "https://github.com/user/beta",
        homepage: null,
        language: null,
        stargazersCount: 0,
        forksCount: 0,
        updatedAt: "2026-01-01",
        topics: [],
      },
      {
        id: 1,
        name: "alpha",
        fullName: "user/alpha",
        description: null,
        htmlUrl: "https://github.com/user/alpha",
        homepage: null,
        language: null,
        stargazersCount: 0,
        forksCount: 0,
        updatedAt: "2026-01-01",
        topics: [],
      },
    ];

    const sorted = sortCuratedRepos(repos, curated);
    expect(sorted[0]?.fullName).toBe("user/alpha");
  });
});
