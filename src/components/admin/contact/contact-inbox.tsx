"use client";

import { useMemo, useState, useTransition } from "react";
import { Archive, Download } from "lucide-react";
import {
  archiveContactSubmissionAction,
  deleteContactSubmissionAction,
  exportContactSubmissionsAction,
  markContactSubmissionReadAction,
  markContactSubmissionUnreadAction,
} from "@/lib/admin/actions/contact";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/formatters";
import type { ContactSubmissionRecord } from "@/types/cms";
import type { ContactStatusFilter } from "@/lib/validators/contact";

type ContactInboxProps = {
  submissions: ContactSubmissionRecord[];
};

const statusFilters: Array<{ value: ContactStatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archived" },
];

function statusVariant(status: ContactSubmissionRecord["status"]) {
  if (status === "unread") return "default" as const;
  if (status === "archived") return "outline" as const;
  return "secondary" as const;
}

export function ContactInbox({ submissions }: ContactInboxProps) {
  const [statusFilter, setStatusFilter] = useState<ContactStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    submissions[0]?.id ?? null,
  );
  const [isExporting, startExport] = useTransition();

  const filteredSubmissions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return submissions.filter((submission) => {
      const matchesStatus =
        statusFilter === "all" || submission.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        `${submission.name} ${submission.email} ${submission.message}`
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, submissions]);

  const selectedSubmission =
    filteredSubmissions.find((submission) => submission.id === selectedId) ??
    filteredSubmissions[0] ??
    null;

  function handleExport() {
    startExport(async () => {
      const formData = new FormData();
      formData.set("status", statusFilter);
      formData.set("search", search);

      const result = await exportContactSubmissionsAction({}, formData);

      if (!result.csv) {
        return;
      }

      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contact-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant={statusFilter === filter.value ? "default" : "outline"}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isExporting || filteredSubmissions.length === 0}
        >
          <Download className="size-4" data-icon="inline-start" />
          Export CSV
        </Button>
      </div>

      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name, email, or message..."
        aria-label="Search contact submissions"
      />

      {filteredSubmissions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No contact submissions match your filters.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">From</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className={
                      selectedSubmission?.id === submission.id
                        ? "bg-muted/30"
                        : "cursor-pointer hover:bg-muted/20"
                    }
                    onClick={() => setSelectedId(submission.id)}
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium">{submission.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {submission.email}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={statusVariant(submission.status)}>
                        {submission.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {formatDate(submission.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedSubmission ? (
            <article className="rounded-xl border border-border p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedSubmission.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubmission.email}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Received {formatDate(selectedSubmission.createdAt)}
                  </p>
                </div>
                <Badge variant={statusVariant(selectedSubmission.status)}>
                  {selectedSubmission.status}
                </Badge>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-muted/20 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {selectedSubmission.message}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <ButtonLink href={`mailto:${selectedSubmission.email}`} size="sm">
                  Reply by email
                </ButtonLink>

                {selectedSubmission.status !== "read" ? (
                  <form
                    action={async (formData) => {
                      await markContactSubmissionReadAction(formData);
                    }}
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={selectedSubmission.id}
                    />
                    <Button type="submit" size="sm" variant="outline">
                      Mark read
                    </Button>
                  </form>
                ) : (
                  <form
                    action={async (formData) => {
                      await markContactSubmissionUnreadAction(formData);
                    }}
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={selectedSubmission.id}
                    />
                    <Button type="submit" size="sm" variant="outline">
                      Mark unread
                    </Button>
                  </form>
                )}

                {selectedSubmission.status !== "archived" ? (
                  <form
                    action={async (formData) => {
                      await archiveContactSubmissionAction(formData);
                    }}
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={selectedSubmission.id}
                    />
                    <Button type="submit" size="sm" variant="outline">
                      <Archive className="size-4" data-icon="inline-start" />
                      Archive
                    </Button>
                  </form>
                ) : null}

                <DeleteItemButton
                  action={deleteContactSubmissionAction}
                  id={selectedSubmission.id}
                  label="Delete"
                />
              </div>
            </article>
          ) : null}
        </div>
      )}
    </div>
  );
}
