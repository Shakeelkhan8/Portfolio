import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildAdminQueryString } from "@/lib/admin/pagination";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  basePath: string;
  query?: Record<string, string | number | undefined | null>;
};

export function AdminPagination({
  page,
  totalPages,
  total,
  basePath,
  query = {},
}: AdminPaginationProps) {
  if (totalPages <= 1) {
    return (
      <p className="text-sm text-muted-foreground">
        {total} item{total === 1 ? "" : "s"}
      </p>
    );
  }

  const prevHref =
    page > 1
      ? `${basePath}${buildAdminQueryString({ ...query, page: page - 1 })}`
      : null;
  const nextHref =
    page < totalPages
      ? `${basePath}${buildAdminQueryString({ ...query, page: page + 1 })}`
      : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} · {total} item{total === 1 ? "" : "s"}
      </p>
      <div className="flex items-center gap-2">
        {prevHref ? (
          <Button variant="outline" size="sm" render={<Link href={prevHref} />}>
            <ChevronLeft className="size-4" data-icon="inline-start" />
            Previous
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="size-4" data-icon="inline-start" />
            Previous
          </Button>
        )}
        {nextHref ? (
          <Button variant="outline" size="sm" render={<Link href={nextHref} />}>
            Next
            <ChevronRight className="size-4" data-icon="inline-end" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
            <ChevronRight className="size-4" data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  );
}
