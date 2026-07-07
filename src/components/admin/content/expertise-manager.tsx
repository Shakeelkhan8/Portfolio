"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  deleteExpertiseItemAction,
  upsertExpertiseItemAction,
} from "@/lib/admin/actions/identity";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { EditItemButton } from "@/components/admin/shared/edit-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { ReorderButtons } from "@/components/admin/shared/reorder-buttons";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExpertiseItemRecord } from "@/types/cms";

type ExpertiseManagerProps = {
  items: ExpertiseItemRecord[];
};

function ExpertiseForm({
  item,
  nextDisplayOrder,
  onCancel,
  submitLabel,
}: {
  item?: ExpertiseItemRecord;
  nextDisplayOrder: number;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [state, save] = useActionState(upsertExpertiseItemAction, {});

  return (
    <form action={save} className="grid gap-4 md:grid-cols-2">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor={item ? `title-${item.id}` : "title"}>Title</Label>
        <Input
          id={item ? `title-${item.id}` : "title"}
          name="title"
          placeholder="Backend Architecture"
          defaultValue={item?.title ?? ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={item ? `displayOrder-${item.id}` : "displayOrder"}>
          Display order
        </Label>
        <Input
          id={item ? `displayOrder-${item.id}` : "displayOrder"}
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={item?.displayOrder ?? nextDisplayOrder}
        />
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

export function ExpertiseManager({ items }: ExpertiseManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add expertise</h2>
        <ExpertiseForm
          nextDisplayOrder={items.length}
          submitLabel="Add expertise"
        />
      </section>

      <section className="space-y-3">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No expertise areas yet.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border p-4">
              {editingId === item.id ? (
                <div>
                  <h3 className="mb-4 font-medium">Edit expertise</h3>
                  <ExpertiseForm
                    item={item}
                    nextDisplayOrder={item.displayOrder}
                    submitLabel="Save changes"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <p className="font-medium">{item.title}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <ReorderButtons
                      entity="expertise"
                      id={item.id}
                      label={`Reorder ${item.title}`}
                    />
                    <EditItemButton onClick={() => setEditingId(item.id)} />
                    <DeleteItemButton
                      action={deleteExpertiseItemAction}
                      id={item.id}
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
