import type { GitHubProfile, GitHubRepo } from "@/types";

const GITHUB_API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: getHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

type GitHubUserResponse = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type GitHubRepoResponse = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  fork: boolean;
};

function mapProfile(data: GitHubUserResponse): GitHubProfile {
  return {
    login: data.login,
    name: data.name,
    bio: data.bio,
    avatarUrl: data.avatar_url,
    htmlUrl: data.html_url,
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
    createdAt: data.created_at,
  };
}

function mapRepo(data: GitHubRepoResponse): GitHubRepo {
  return {
    id: data.id,
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    htmlUrl: data.html_url,
    homepage: data.homepage,
    language: data.language,
    stargazersCount: data.stargazers_count,
    forksCount: data.forks_count,
    updatedAt: data.updated_at,
    topics: data.topics ?? [],
  };
}

export async function getGitHubProfile(username: string): Promise<GitHubProfile> {
  const data = await githubFetch<GitHubUserResponse>(`/users/${username}`);
  return mapProfile(data);
}

export async function getGitHubRepo(
  fullName: string,
): Promise<GitHubRepo | null> {
  try {
    const data = await githubFetch<GitHubRepoResponse>(`/repos/${fullName}`);
    if (data.fork) {
      return null;
    }
    return mapRepo(data);
  } catch {
    return null;
  }
}

export async function getGitHubRepos(
  username: string,
  limit = 12,
): Promise<GitHubRepo[]> {
  const data = await githubFetch<GitHubRepoResponse[]>(
    `/users/${username}/repos?sort=updated&per_page=${limit}`,
  );

  return data
    .filter((repo) => !repo.fork)
    .map(mapRepo)
    .sort((a, b) => b.stargazersCount - a.stargazersCount);
}

export async function getGitHubData(username: string): Promise<{
  profile: GitHubProfile;
  repos: GitHubRepo[];
}> {
  const [profile, repos] = await Promise.all([
    getGitHubProfile(username),
    getGitHubRepos(username),
  ]);

  return { profile, repos };
}
