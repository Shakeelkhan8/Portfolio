"use client";

import { useActionState } from "react";
import { upsertArticleAction } from "@/lib/admin/actions/articles";
import { articleToFormDefaults } from "@/lib/admin/article-form-utils";
import { MediaSelect } from "@/components/admin/shared/media-select";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleRecord, MediaFileRecord } from "@/types/cms";
import Link from "next/link";

type ArticleEditorProps = {
  article?: ArticleRecord | null;
  mediaFiles: MediaFileRecord[];
};

export function ArticleEditor({ article, mediaFiles }: ArticleEditorProps) {
  const defaults = articleToFormDefaults(article);
  const [state, saveArticle] = useActionState(upsertArticleAction, {});

  return (
    <form action={saveArticle} className="space-y-10">
      {article ? (
        <>
          <input type="hidden" name="id" value={article.id} />
          <input type="hidden" name="previousSlug" value={article.slug} />
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
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={defaults.excerpt}
              required
            />
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
            <Label htmlFor="readingTimeMinutes">Reading time (minutes)</Label>
            <Input
              id="readingTimeMinutes"
              name="readingTimeMinutes"
              type="number"
              min={1}
              defaultValue={defaults.readingTimeMinutes}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to auto-calculate from content.
            </p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" defaultValue={defaults.tags} />
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
          <p className="text-xs text-muted-foreground">
            Use semantic HTML (`&lt;h2&gt;`, `&lt;p&gt;`, `&lt;ul&gt;`, `&lt;pre&gt;&lt;code&gt;`).
            Rich text editor can be added later.
          </p>
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
            <Input id="metaTitle" name="metaTitle" defaultValue={defaults.metaTitle} />
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
        <SubmitButton label={article ? "Save article" : "Create article"} />
        <Link
          href="/admin/blog"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back to blog
        </Link>
      </div>

      <FormMessage {...state} />
    </form>
  );
}
