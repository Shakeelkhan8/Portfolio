"use client";

import { useActionState } from "react";
import Link from "next/link";
import { upsertProjectAction } from "@/lib/admin/actions/projects";
import { projectToFormDefaults } from "@/lib/admin/project-form-utils";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MediaFileRecord, ProjectRecord } from "@/types/cms";

type ProjectEditorProps = {
  project?: ProjectRecord | null;
  mediaFiles: MediaFileRecord[];
};

function MediaSelect({
  id,
  name,
  label,
  value,
  mediaFiles,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  mediaFiles: MediaFileRecord[];
}) {
  const images = mediaFiles.filter((file) => file.mimeType.startsWith("image/"));

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        defaultValue={value}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">None</option>
        {images.map((file) => (
          <option key={file.id} value={file.id}>
            {file.originalFilename}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ProjectEditor({ project, mediaFiles }: ProjectEditorProps) {
  const defaults = projectToFormDefaults(project);
  const [state, saveProject] = useActionState(upsertProjectAction, {});

  return (
    <form action={saveProject} className="space-y-10">
      {project ? (
        <>
          <input type="hidden" name="id" value={project.id} />
          <input type="hidden" name="previousSlug" value={project.slug} />
        </>
      ) : null}

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Basics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={defaults.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={defaults.slug} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" name="summary" rows={2} defaultValue={defaults.summary} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={defaults.status}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display order</Label>
            <Input
              id="displayOrder"
              name="displayOrder"
              type="number"
              defaultValue={defaults.displayOrder}
            />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              defaultChecked={defaults.featured}
            />
            <Label htmlFor="featured">Featured project</Label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Case study</h2>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="problem">Problem</Label>
            <Textarea id="problem" name="problem" rows={3} defaultValue={defaults.problem} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" defaultValue={defaults.role} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Context</Label>
              <Input id="context" name="context" defaultValue={defaults.context} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overview">Overview</Label>
            <Textarea id="overview" name="overview" rows={4} defaultValue={defaults.overview} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="architectureText">Architecture narrative</Label>
            <Textarea
              id="architectureText"
              name="architectureText"
              rows={4}
              defaultValue={defaults.architectureText}
              required
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Taxonomy & links</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" defaultValue={defaults.tags} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stack">Stack (comma separated)</Label>
            <Input id="stack" name="stack" defaultValue={defaults.stack} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input id="demoUrl" name="demoUrl" defaultValue={defaults.demoUrl} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" name="githubUrl" defaultValue={defaults.githubUrl} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="links">Links (one per line: Label | URL)</Label>
            <Textarea id="links" name="links" rows={3} defaultValue={defaults.links} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="metrics">Metrics (one per line: Label | Value)</Label>
            <Textarea id="metrics" name="metrics" rows={4} defaultValue={defaults.metrics} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Story sections</h2>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="challenges">Challenges (one per line)</Label>
            <Textarea id="challenges" name="challenges" rows={4} defaultValue={defaults.challenges} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="decisions">
              Decisions (one per line: Decision | Rationale | Tradeoff)
            </Label>
            <Textarea id="decisions" name="decisions" rows={5} defaultValue={defaults.decisions} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="results">Results (one per line)</Label>
            <Textarea id="results" name="results" rows={4} defaultValue={defaults.results} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lessons">Lessons (one per line)</Label>
            <Textarea id="lessons" name="lessons" rows={3} defaultValue={defaults.lessons} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="futureImprovements">Future improvements (one per line)</Label>
            <Textarea
              id="futureImprovements"
              name="futureImprovements"
              rows={3}
              defaultValue={defaults.futureImprovements}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Architecture diagram</h2>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="diagramTitle">Diagram title</Label>
            <Input
              id="diagramTitle"
              name="diagramTitle"
              defaultValue={defaults.diagramTitle}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagramNodes">Nodes JSON</Label>
            <Textarea
              id="diagramNodes"
              name="diagramNodes"
              rows={8}
              defaultValue={defaults.diagramNodes}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagramEdges">Edges JSON</Label>
            <Textarea
              id="diagramEdges"
              name="diagramEdges"
              rows={6}
              defaultValue={defaults.diagramEdges}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Media & SEO</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <MediaSelect
            id="thumbnailMediaId"
            name="thumbnailMediaId"
            label="Thumbnail"
            value={defaults.thumbnailMediaId}
            mediaFiles={mediaFiles}
          />
          <MediaSelect
            id="ogImageId"
            name="ogImageId"
            label="Open Graph image"
            value={defaults.ogImageId}
            mediaFiles={mediaFiles}
          />
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta title</Label>
            <Input id="metaTitle" name="metaTitle" defaultValue={defaults.metaTitle} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="robots">Robots</Label>
            <Input id="robots" name="robots" defaultValue={defaults.robots} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="metaDescription">Meta description</Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              rows={2}
              defaultValue={defaults.metaDescription}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="canonicalUrl">Canonical URL</Label>
            <Input
              id="canonicalUrl"
              name="canonicalUrl"
              defaultValue={defaults.canonicalUrl}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={project ? "Save project" : "Create project"} />
        <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-foreground">
          Back to projects
        </Link>
      </div>

      <FormMessage {...state} />
    </form>
  );
}
