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
