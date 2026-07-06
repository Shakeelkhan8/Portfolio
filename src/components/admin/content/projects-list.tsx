"use client";

import { deleteProjectAction } from "@/lib/admin/actions/projects";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/config/navigation";
import type { ProjectRecord } from "@/types/cms";

type ProjectsListProps = {
  projects: ProjectRecord[];
};

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {projects.length} project{projects.length === 1 ? "" : "s"}
        </p>
        <ButtonLink href="/admin/projects/new">New project</ButtonLink>
      </div>

      {projects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No projects yet. Create your first case study.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <p className="font-medium">{project.title}</p>
                      <p className="text-xs text-muted-foreground">/{project.slug}</p>
                      {project.featured ? (
                        <Badge variant="secondary">Featured</Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={
                        project.status === "published" ? "default" : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">{project.displayOrder}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <ButtonLink
                        href={`/admin/projects/${project.id}`}
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </ButtonLink>
                      {project.status === "published" ? (
                        <ButtonLink
                          href={routes.project(project.slug)}
                          size="sm"
                          variant="ghost"
                          external
                        >
                          View
                        </ButtonLink>
                      ) : null}
                      <DeleteItemButton
                        action={deleteProjectAction}
                        id={project.id}
                        label="Archive"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
