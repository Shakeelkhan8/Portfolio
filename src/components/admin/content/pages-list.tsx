"use client";

import { deletePageAction } from "@/lib/admin/actions/pages";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/config/navigation";
import { formatDate } from "@/lib/formatters";
import type { PageRecord } from "@/types/cms";

type PagesListProps = {
  pages: PageRecord[];
};

export function PagesList({ pages }: PagesListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {pages.length} page{pages.length === 1 ? "" : "s"}
        </p>
        <ButtonLink href="/admin/pages/new">New page</ButtonLink>
      </div>

      {pages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No custom pages yet. Create your first page.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Page</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <p className="font-medium">{page.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {page.slug === "privacy"
                          ? routes.privacy
                          : routes.page(page.slug)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={
                        page.status === "published" ? "default" : "outline"
                      }
                    >
                      {page.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {formatDate(page.updatedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <ButtonLink
                        href={`/admin/pages/${page.id}`}
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </ButtonLink>
                      {page.status === "published" ? (
                        <ButtonLink
                          href={
                            page.slug === "privacy"
                              ? routes.privacy
                              : routes.page(page.slug)
                          }
                          size="sm"
                          variant="ghost"
                          external
                        >
                          View
                        </ButtonLink>
                      ) : null}
                      <DeleteItemButton
                        action={deletePageAction}
                        id={page.id}
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
