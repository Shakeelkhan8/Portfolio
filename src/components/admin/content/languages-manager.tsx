"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  deleteLanguageAction,
  updateLanguagesVisibilityAction,
  upsertLanguageAction,
} from "@/lib/admin/actions/identity";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { EditItemButton } from "@/components/admin/shared/edit-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { ReorderButtons } from "@/components/admin/shared/reorder-buttons";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LanguageRecord } from "@/types/cms";

type LanguagesManagerProps = {
  languages: LanguageRecord[];
  /** Whether the Languages section is shown on the public About page. */
  sectionVisible: boolean;
};

function LanguageForm({
  language,
  nextDisplayOrder,
  onCancel,
  submitLabel,
}: {
  language?: LanguageRecord;
  nextDisplayOrder: number;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [state, save] = useActionState(upsertLanguageAction, {});

  return (
    <form action={save} className="grid gap-4 md:grid-cols-2">
      {language ? <input type="hidden" name="id" value={language.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor={language ? `name-${language.id}` : "name"}>Name</Label>
        <Input
          id={language ? `name-${language.id}` : "name"}
          name="name"
          placeholder="English"
          defaultValue={language?.name ?? ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={language ? `level-${language.id}` : "level"}>Level</Label>
        <Input
          id={language ? `level-${language.id}` : "level"}
          name="level"
          placeholder="Native"
          defaultValue={language?.level ?? ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor={language ? `displayOrder-${language.id}` : "displayOrder"}
        >
          Display order
        </Label>
        <Input
          id={language ? `displayOrder-${language.id}` : "displayOrder"}
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={language?.displayOrder ?? nextDisplayOrder}
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

function LanguagesVisibilityForm({ visible }: { visible: boolean }) {
  const [state, save] = useActionState(updateLanguagesVisibilityAction, {});

  return (
    <section className="rounded-xl border border-border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">About page visibility</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Control whether the Languages section appears on the public About
          page. Your language list is kept either way.
        </p>
      </div>
      <form action={save} className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            id="visible"
            name="visible"
            type="checkbox"
            defaultChecked={visible}
          />
          <Label htmlFor="visible">Show Languages section on About page</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Current status:{" "}
          <span className="font-medium text-foreground">
            {visible ? "Visible" : "Hidden"}
          </span>
        </p>
        <SubmitButton label="Save visibility" />
        <FormMessage {...state} />
      </form>
    </section>
  );
}

export function LanguagesManager({
  languages,
  sectionVisible,
}: LanguagesManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <LanguagesVisibilityForm visible={sectionVisible} />

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add language</h2>
        <LanguageForm
          nextDisplayOrder={languages.length}
          submitLabel="Add language"
        />
      </section>

      <section className="space-y-3">
        {languages.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No languages yet.
          </p>
        ) : (
          languages.map((language) => (
            <div
              key={language.id}
              className="rounded-xl border border-border p-4"
            >
              {editingId === language.id ? (
                <div>
                  <h3 className="mb-4 font-medium">Edit language</h3>
                  <LanguageForm
                    language={language}
                    nextDisplayOrder={language.displayOrder}
                    submitLabel="Save changes"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{language.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {language.level}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ReorderButtons
                      entity="languages"
                      id={language.id}
                      label={`Reorder ${language.name}`}
                    />
                    <EditItemButton onClick={() => setEditingId(language.id)} />
                    <DeleteItemButton
                      action={deleteLanguageAction}
                      id={language.id}
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
