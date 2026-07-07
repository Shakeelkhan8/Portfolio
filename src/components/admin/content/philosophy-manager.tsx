"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  deletePhilosophyItemAction,
  upsertPhilosophyItemAction,
} from "@/lib/admin/actions/identity";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { EditItemButton } from "@/components/admin/shared/edit-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { ReorderButtons } from "@/components/admin/shared/reorder-buttons";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PhilosophyItemRecord } from "@/types/cms";

type PhilosophyManagerProps = {
  items: PhilosophyItemRecord[];
};

function PhilosophyForm({
  item,
  nextDisplayOrder,
  onCancel,
  submitLabel,
}: {
  item?: PhilosophyItemRecord;
  nextDisplayOrder: number;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [state, save] = useActionState(upsertPhilosophyItemAction, {});

  return (
    <form action={save} className="grid gap-4 md:grid-cols-2">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={item ? `title-${item.id}` : "title"}>Title</Label>
        <Input
          id={item ? `title-${item.id}` : "title"}
          name="title"
          placeholder="Build for scale, not just for today"
          defaultValue={item?.title ?? ""}
          required
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={item ? `description-${item.id}` : "description"}>
          Description
        </Label>
        <Textarea
          id={item ? `description-${item.id}` : "description"}
          name="description"
          rows={3}
          defaultValue={item?.description ?? ""}
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

export function PhilosophyManager({ items }: PhilosophyManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add principle</h2>
        <PhilosophyForm
          nextDisplayOrder={items.length}
          submitLabel="Add principle"
        />
      </section>

      <section className="space-y-3">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No principles yet.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border p-4">
              {editingId === item.id ? (
                <div>
                  <h3 className="mb-4 font-medium">Edit principle</h3>
                  <PhilosophyForm
                    item={item}
                    nextDisplayOrder={item.displayOrder}
                    submitLabel="Save changes"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ReorderButtons
                      entity="philosophy"
                      id={item.id}
                      label={`Reorder ${item.title}`}
                    />
                    <EditItemButton onClick={() => setEditingId(item.id)} />
                    <DeleteItemButton
                      action={deletePhilosophyItemAction}
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
