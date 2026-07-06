"use client";

import { deleteArticleAction } from "@/lib/admin/actions/articles";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/config/navigation";
import { formatDate } from "@/lib/formatters";
import type { ArticleRecord } from "@/types/cms";

type ArticlesListProps = {
  articles: ArticleRecord[];
};

export function ArticlesList({ articles }: ArticlesListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {articles.length} article{articles.length === 1 ? "" : "s"}
        </p>
        <ButtonLink href="/admin/blog/new">New article</ButtonLink>
      </div>

      {articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No articles yet. Write your first post.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Article</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <p className="font-medium">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        /{article.slug}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {article.readingTimeMinutes} min read
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={
                        article.status === "published" ? "default" : "outline"
                      }
                    >
                      {article.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {article.publishedAt
                      ? formatDate(article.publishedAt)
                      : "—"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <ButtonLink
                        href={`/admin/blog/${article.id}`}
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </ButtonLink>
                      {article.status === "published" ? (
                        <ButtonLink
                          href={routes.article(article.slug)}
                          size="sm"
                          variant="ghost"
                          external
                        >
                          View
                        </ButtonLink>
                      ) : null}
                      <DeleteItemButton
                        action={deleteArticleAction}
                        id={article.id}
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
