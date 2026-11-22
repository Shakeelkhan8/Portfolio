import type { Project } from "@/types";

/**
 * Projects tagged with this are personal side projects rather than paid or
 * employed work. A tag (not a column) keeps the split editable from the CMS
 * project editor without a migration.
 */
export const SIDE_PROJECT_TAG = "Side project";

export function isSideProject(project: Pick<Project, "tags">): boolean {
  return project.tags.includes(SIDE_PROJECT_TAG);
}

/** Tags worth showing to a reader: the side-project marker is implied by context. */
export function displayTags(project: Pick<Project, "tags">): string[] {
  return project.tags.filter((tag) => tag !== SIDE_PROJECT_TAG);
}

/** The status part of a project's context line ("Elityx · In production · …"). */
const STATUS = /production|paused|not deployed|open source/i;

/**
 * A project's context line ("Side project · 2026 · Paused · Private repo")
 * split into who it was for, its status, and the rest. Used by the home Work
 * section and the terminal, so a paused or undeployed project says so.
 */
export function projectContext(project: Pick<Project, "context">): {
  who: string;
  status: string | null;
  rest: string[];
} {
  const parts = project.context.split(" · ").filter(Boolean);
  return {
    who: parts[0] ?? "",
    status: parts.find((part) => STATUS.test(part)) ?? null,
    rest: parts.slice(1).filter((part) => !STATUS.test(part)),
  };
}
