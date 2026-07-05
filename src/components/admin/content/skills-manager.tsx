"use client";

import { useActionState } from "react";
import {
  deleteSkillAction,
  deleteSkillCategoryAction,
  upsertSkillAction,
  upsertSkillCategoryAction,
} from "@/lib/admin/actions/content";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SkillCategoryRecord } from "@/types/cms";

type SkillsManagerProps = {
  categories: SkillCategoryRecord[];
};

export function SkillsManager({ categories }: SkillsManagerProps) {
  const [categoryState, saveCategory] = useActionState(
    upsertSkillCategoryAction,
    {},
  );
  const [skillState, saveSkill] = useActionState(upsertSkillAction, {});

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add category</h2>
        <form action={saveCategory} className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input id="category-name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-slug">Slug (optional)</Label>
            <Input id="category-slug" name="slug" placeholder="backend" />
          </div>
          <div className="flex items-end">
            <SubmitButton label="Add category" />
          </div>
        </form>
        <div className="mt-4">
          <FormMessage {...categoryState} />
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add skill</h2>
        <form action={saveSkill} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              required
              className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="skill-name">Skill name</Label>
            <Input id="skill-name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skill-icon">Icon (optional)</Label>
            <Input id="skill-icon" name="icon" placeholder="code" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skill-level">Level</Label>
            <select
              id="skill-level"
              name="level"
              className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
            >
              <option value="">None</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <SubmitButton label="Add skill" />
          </div>
        </form>
        <div className="mt-4">
          <FormMessage {...skillState} />
        </div>
      </section>

      <section className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="rounded-xl border border-border p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.slug}</p>
              </div>
              <DeleteItemButton
                action={deleteSkillCategoryAction}
                id={category.id}
              />
            </div>
            <ul className="space-y-2">
              {category.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {skill.level ?? "No level"}
                      {skill.icon ? ` · ${skill.icon}` : ""}
                    </p>
                  </div>
                  <DeleteItemButton action={deleteSkillAction} id={skill.id} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
