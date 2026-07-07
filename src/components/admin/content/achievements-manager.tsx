"use client";

import { useActionState } from "react";
import {
  deleteAchievementAction,
  upsertAchievementAction,
} from "@/lib/admin/actions/content";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { ReorderButtons } from "@/components/admin/shared/reorder-buttons";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AchievementRecord } from "@/types/cms";

type AchievementsManagerProps = {
  achievements: AchievementRecord[];
};

export function AchievementsManager({ achievements }: AchievementsManagerProps) {
  const [state, saveAchievement] = useActionState(upsertAchievementAction, {});

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add achievement</h2>
        <form action={saveAchievement} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Achievement</Label>
            <Textarea id="text" name="text" rows={3} required />
          </div>
          <div className="flex items-center gap-2">
            <input id="featured" name="featured" type="checkbox" />
            <Label htmlFor="featured">Featured</Label>
          </div>
          <SubmitButton label="Add achievement" />
        </form>
        <div className="mt-4">
          <FormMessage {...state} />
        </div>
      </section>

      <section className="space-y-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-border p-4"
          >
            <div>
              <p>{achievement.text}</p>
              {achievement.featured ? (
                <p className="mt-1 text-xs text-primary">Featured</p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ReorderButtons
                entity="achievements"
                id={achievement.id}
                label="Reorder achievement"
              />
              <DeleteItemButton
                action={deleteAchievementAction}
                id={achievement.id}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
