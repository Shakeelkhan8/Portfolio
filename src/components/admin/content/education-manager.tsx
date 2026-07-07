"use client";

import { useActionState } from "react";
import {
  deleteEducationAction,
  upsertEducationAction,
} from "@/lib/admin/actions/content";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { ReorderButtons } from "@/components/admin/shared/reorder-buttons";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EducationRecord } from "@/types/cms";

type EducationManagerProps = {
  entries: EducationRecord[];
};

export function EducationManager({ entries }: EducationManagerProps) {
  const [state, saveEducation] = useActionState(upsertEducationAction, {});

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add education</h2>
        <form action={saveEducation} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="degree">Degree</Label>
            <Input id="degree" name="degree" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" name="institution" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start date</Label>
            <Input id="startDate" name="startDate" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End date</Label>
            <Input id="endDate" name="endDate" type="date" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="achievements">Achievements (one per line)</Label>
            <Textarea id="achievements" name="achievements" rows={4} />
          </div>
          <div className="md:col-span-2">
            <SubmitButton label="Add education" />
          </div>
        </form>
        <div className="mt-4">
          <FormMessage {...state} />
        </div>
      </section>

      <section className="space-y-4">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-xl border border-border p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{entry.degree}</h3>
                  <p className="text-sm text-muted-foreground">
                    {entry.institution} · {entry.location}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ReorderButtons
                    entity="educations"
                    id={entry.id}
                    label={`Reorder ${entry.degree}`}
                  />
                  <DeleteItemButton action={deleteEducationAction} id={entry.id} />
                </div>
              </div>
          </article>
        ))}
      </section>
    </div>
  );
}
