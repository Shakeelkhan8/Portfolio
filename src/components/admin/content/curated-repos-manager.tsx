"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  deleteCuratedRepoAction,
  upsertCuratedRepoAction,
} from "@/lib/admin/actions/curated-repos";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { EditItemButton } from "@/components/admin/shared/edit-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { ReorderButtons } from "@/components/admin/shared/reorder-buttons";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CuratedRepoRecord } from "@/types/cms";

type CuratedReposManagerProps = {
  repos: CuratedRepoRecord[];
};

function CuratedRepoForm({
  repo,
  nextDisplayOrder,
  onCancel,
  submitLabel,
}: {
  repo?: CuratedRepoRecord;
  nextDisplayOrder: number;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [state, saveRepo] = useActionState(upsertCuratedRepoAction, {});

  return (
    <form action={saveRepo} className="grid gap-4 md:grid-cols-2">
      {repo ? <input type="hidden" name="id" value={repo.id} /> : null}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={repo ? `repoFullName-${repo.id}` : "repoFullName"}>
          Repository (owner/name)
        </Label>
        <Input
          id={repo ? `repoFullName-${repo.id}` : "repoFullName"}
          name="repoFullName"
          defaultValue={repo?.repoFullName ?? ""}
          placeholder="vercel/next.js"
          required
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label
          htmlFor={
            repo ? `overrideDescription-${repo.id}` : "overrideDescription"
          }
        >
          Override description
        </Label>
        <Textarea
          id={repo ? `overrideDescription-${repo.id}` : "overrideDescription"}
          name="overrideDescription"
          rows={2}
          defaultValue={repo?.overrideDescription ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={repo ? `displayOrder-${repo.id}` : "displayOrder"}>
          Display order
        </Label>
        <Input
          id={repo ? `displayOrder-${repo.id}` : "displayOrder"}
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={repo?.displayOrder ?? nextDisplayOrder}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <div className="flex items-center gap-2">
          <input
            id={repo ? `pinned-${repo.id}` : "pinned"}
            name="pinned"
            type="checkbox"
            defaultChecked={repo?.pinned ?? false}
          />
          <Label htmlFor={repo ? `pinned-${repo.id}` : "pinned"}>Pinned</Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            id={repo ? `hidden-${repo.id}` : "hidden"}
            name="hidden"
            type="checkbox"
            defaultChecked={repo?.hidden ?? false}
          />
          <Label htmlFor={repo ? `hidden-${repo.id}` : "hidden"}>Hidden</Label>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:col-span-2">
        <SubmitButton label={submitLabel} />
        {onCancel ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
      <div className="md:col-span-2">
        <FormMessage {...state} />
      </div>
    </form>
  );
}

export function CuratedReposManager({ repos }: CuratedReposManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Curate repository</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Pin, hide, or override descriptions for repositories on the open-source
          page. Live GitHub data is still fetched; curation layers on top.
        </p>
        <CuratedRepoForm
          nextDisplayOrder={repos.length}
          submitLabel="Add curation rule"
        />
      </section>

      <section className="space-y-3">
        {repos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No curation rules yet. Repositories will display in GitHub star order.
          </p>
        ) : (
          repos.map((repo) => (
            <div key={repo.id} className="rounded-xl border border-border p-4">
              {editingId === repo.id ? (
                <div>
                  <h3 className="mb-4 font-medium">Edit curation rule</h3>
                  <CuratedRepoForm
                    repo={repo}
                    nextDisplayOrder={repo.displayOrder}
                    submitLabel="Save changes"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{repo.repoFullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {repo.overrideDescription ?? "No description override"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {repo.pinned ? <span>Pinned</span> : null}
                      {repo.hidden ? <span>Hidden</span> : null}
                      <span>Order {repo.displayOrder}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ReorderButtons
                      entity="curated-repos"
                      id={repo.id}
                      label={`Reorder ${repo.repoFullName}`}
                    />
                    <EditItemButton onClick={() => setEditingId(repo.id)} />
                    <DeleteItemButton
                      action={deleteCuratedRepoAction}
                      id={repo.id}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
