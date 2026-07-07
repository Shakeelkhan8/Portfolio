import { describe, expect, it } from "vitest";
import {
  applyCuratedRepos,
  getMissingPinnedRepos,
} from "@/lib/github/apply-curation";
import type { CuratedRepoRecord } from "@/types/cms";
import type { GitHubRepo } from "@/types";

const sampleRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "alpha",
    fullName: "user/alpha",
    description: "Alpha repo",
    htmlUrl: "https://github.com/user/alpha",
    homepage: null,
    language: "TypeScript",
    stargazersCount: 10,
    forksCount: 2,
    updatedAt: "2026-01-01",
    topics: [],
  },
  {
    id: 2,
    name: "beta",
    fullName: "user/beta",
    description: "Beta repo",
    htmlUrl: "https://github.com/user/beta",
    homepage: null,
    language: "Go",
    stargazersCount: 50,
    forksCount: 5,
    updatedAt: "2026-01-02",
    topics: [],
  },
];

describe("applyCuratedRepos", () => {
  it("hides repositories marked hidden", () => {
    const curated: CuratedRepoRecord[] = [
      {
        id: "1",
        repoFullName: "user/beta",
        githubRepoId: null,
        pinned: false,
        hidden: true,
        overrideDescription: null,
        displayOrder: 0,
      },
    ];

    const result = applyCuratedRepos(sampleRepos, curated);
    expect(result.map((repo) => repo.fullName)).toEqual(["user/alpha"]);
  });

  it("pins repositories ahead of star sorting", () => {
    const curated: CuratedRepoRecord[] = [
      {
        id: "1",
        repoFullName: "user/alpha",
        githubRepoId: null,
        pinned: true,
        hidden: false,
        overrideDescription: null,
        displayOrder: 0,
      },
    ];

    const result = applyCuratedRepos(sampleRepos, curated);
    expect(result[0]?.fullName).toBe("user/alpha");
  });

  it("applies description overrides", () => {
    const curated: CuratedRepoRecord[] = [
      {
        id: "1",
        repoFullName: "user/alpha",
        githubRepoId: null,
        pinned: false,
        hidden: false,
        overrideDescription: "Custom description",
        displayOrder: 0,
      },
    ];

    const result = applyCuratedRepos(sampleRepos, curated);
    expect(result.find((repo) => repo.fullName === "user/alpha")?.description).toBe(
      "Custom description",
    );
  });
});

describe("getMissingPinnedRepos", () => {
  it("returns pinned repos not present in the fetched list", () => {
    const curated: CuratedRepoRecord[] = [
      {
        id: "1",
        repoFullName: "user/missing",
        githubRepoId: null,
        pinned: true,
        hidden: false,
        overrideDescription: null,
        displayOrder: 0,
      },
    ];

    expect(getMissingPinnedRepos(sampleRepos, curated)).toEqual(["user/missing"]);
  });
});
