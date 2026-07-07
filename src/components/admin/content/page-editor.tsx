"use client";

import { useActionState } from "react";
import { upsertPageAction } from "@/lib/admin/actions/pages";
import { MediaSelect } from "@/components/admin/shared/media-select";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MediaFileRecord, PageRecord } from "@/types/cms";
import Link from "next/link";

type PageEditorProps = {
  page?: PageRecord | null;
  mediaFiles: MediaFileRecord[];
};

function pageToFormDefaults(page?: PageRecord | null) {
  return {
    slug: page?.slug ?? "",
    title: page?.title ?? "",
    contentHtml: page?.contentHtml ?? "",
    status: page?.status ?? "draft",
    metaTitle: page?.metaTitle ?? "",
    metaDescription: page?.metaDescription ?? "",
    ogImageId: page?.ogImageId ?? "",
    canonicalUrl: page?.canonicalUrl ?? "",
    robots: page?.robots ?? "index, follow",
  };
}

export function PageEditor({ page, mediaFiles }: PageEditorProps) {
  const defaults = pageToFormDefaults(page);
  const [state, savePage] = useActionState(upsertPageAction, {});

  return (
    <form action={savePage} className="space-y-10">
      {page ? (
        <>
          <input type="hidden" name="id" value={page.id} />
          <input type="hidden" name="previousSlug" value={page.slug} />
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
            <p className="text-xs text-muted-foreground">
              Public URL: /{defaults.slug || "your-slug"}
            </p>
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
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Content</h2>
        <div className="space-y-2">
          <Label htmlFor="contentHtml">HTML content</Label>
          <Textarea
            id="contentHtml"
            name="contentHtml"
            rows={18}
            defaultValue={defaults.contentHtml}
            className="font-mono text-xs"
            required
          />
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">SEO</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <MediaSelect
            id="ogImageId"
            name="ogImageId"
            label="Open Graph image"
            value={defaults.ogImageId}
            mediaFiles={mediaFiles}
          />
          <div className="space-y-2">
            <Label htmlFor="robots">Robots</Label>
            <Input id="robots" name="robots" defaultValue={defaults.robots} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta title</Label>
            <Input
              id="metaTitle"
              name="metaTitle"
              defaultValue={defaults.metaTitle}
            />
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
              type="url"
              defaultValue={defaults.canonicalUrl}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton label={page ? "Save page" : "Create page"} />
        <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-foreground">
          Cancel
        </Link>
        <FormMessage {...state} />
      </div>
    </form>
  );
}
