"use client";

import { useActionState } from "react";
import {
  deleteTestimonialAction,
  upsertTestimonialAction,
} from "@/lib/admin/actions/cms-modules";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { MediaSelect } from "@/components/admin/shared/media-select";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MediaFileRecord, TestimonialRecord } from "@/types/cms";

type TestimonialsManagerProps = {
  testimonials: TestimonialRecord[];
  mediaFiles: MediaFileRecord[];
};

export function TestimonialsManager({
  testimonials,
  mediaFiles,
}: TestimonialsManagerProps) {
  const [state, saveTestimonial] = useActionState(upsertTestimonialAction, {});

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add testimonial</h2>
        <form action={saveTestimonial} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="authorName">Author name</Label>
            <Input id="authorName" name="authorName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorRole">Role</Label>
            <Input id="authorRole" name="authorRole" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorCompany">Company</Label>
            <Input id="authorCompany" name="authorCompany" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1–5)</Label>
            <Input id="rating" name="rating" type="number" min={1} max={5} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="content">Testimonial</Label>
            <Textarea id="content" name="content" rows={4} required />
          </div>
          <MediaSelect
            id="avatarMediaId"
            name="avatarMediaId"
            label="Avatar (optional)"
            value=""
            mediaFiles={mediaFiles}
          />
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display order</Label>
            <Input
              id="displayOrder"
              name="displayOrder"
              type="number"
              min={0}
              defaultValue={testimonials.length}
            />
          </div>
          <div className="flex items-center gap-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <input id="featured" name="featured" type="checkbox" />
              <Label htmlFor="featured">Featured on home</Label>
            </div>
            <div className="flex items-center gap-2">
              <input id="visible" name="visible" type="checkbox" defaultChecked />
              <Label htmlFor="visible">Visible</Label>
            </div>
          </div>
          <div className="md:col-span-2">
            <SubmitButton label="Add testimonial" />
          </div>
        </form>
        <div className="mt-4">
          <FormMessage {...state} />
        </div>
      </section>

      <section className="space-y-3">
        {testimonials.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No testimonials yet.
          </p>
        ) : (
          testimonials.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-border p-4"
            >
              <div>
                <p className="font-medium">{item.authorName}</p>
                <p className="text-sm text-muted-foreground">
                  {[item.authorRole, item.authorCompany].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-2 text-sm">{item.content}</p>
                <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                  {item.featured ? <span>Featured</span> : null}
                  {!item.visible ? <span>Hidden</span> : null}
                </div>
              </div>
              <DeleteItemButton
                action={deleteTestimonialAction}
                id={item.id}
              />
            </div>
          ))
        )}
      </section>
    </div>
  );
}
