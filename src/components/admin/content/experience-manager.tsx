"use client";

import { useActionState } from "react";
import {
  deleteExperienceAction,
  upsertExperienceAction,
} from "@/lib/admin/actions/content";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { ReorderButtons } from "@/components/admin/shared/reorder-buttons";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ExperienceRecord } from "@/types/cms";

type ExperienceManagerProps = {
  entries: ExperienceRecord[];
};

export function ExperienceManager({ entries }: ExperienceManagerProps) {
  const [state, saveExperience] = useActionState(upsertExperienceAction, {});

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add experience</h2>
        <form action={saveExperience} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" required />
            <p className="text-xs text-muted-foreground">
              Featured roles appear on the homepage. Use the official job title from the employer, even when the site Tagline differs.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required />
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
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display order</Label>
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue={0} />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input id="featured" name="featured" type="checkbox" />
            <Label htmlFor="featured">Featured role</Label>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="highlights">Highlights (one per line)</Label>
            <Textarea id="highlights" name="highlights" rows={5} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="technologies">Technologies (comma separated)</Label>
            <Input id="technologies" name="technologies" />
          </div>
          <div className="md:col-span-2">
            <SubmitButton label="Add experience" />
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
                  <h3 className="font-semibold">
                    {entry.role} · {entry.company}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {entry.location} · {entry.startDate} – {entry.endDate ?? "Present"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ReorderButtons
                    entity="experiences"
                    id={entry.id}
                    label={`Reorder ${entry.company}`}
                  />
                  <DeleteItemButton action={deleteExperienceAction} id={entry.id} />
                </div>
              </div>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {entry.highlights.map((highlight) => (
                <li key={highlight.slice(0, 40)}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
