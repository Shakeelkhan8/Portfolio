"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  deleteTestimonialAction,
  upsertTestimonialAction,
} from "@/lib/admin/actions/cms-modules";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { EditItemButton } from "@/components/admin/shared/edit-item-button";
import { MediaSelect } from "@/components/admin/shared/media-select";
import { FormMessage } from "@/components/admin/shared/form-message";
import { ReorderButtons } from "@/components/admin/shared/reorder-buttons";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MediaFileRecord, TestimonialRecord } from "@/types/cms";

type TestimonialsManagerProps = {
  testimonials: TestimonialRecord[];
  mediaFiles: MediaFileRecord[];
};

function TestimonialForm({
  testimonial,
  mediaFiles,
  nextDisplayOrder,
  onCancel,
  submitLabel,
}: {
  testimonial?: TestimonialRecord;
  mediaFiles: MediaFileRecord[];
  nextDisplayOrder: number;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [state, saveTestimonial] = useActionState(upsertTestimonialAction, {});

  return (
    <form action={saveTestimonial} className="grid gap-4 md:grid-cols-2">
      {testimonial ? <input type="hidden" name="id" value={testimonial.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor={testimonial ? `authorName-${testimonial.id}` : "authorName"}>
          Author name
        </Label>
        <Input
          id={testimonial ? `authorName-${testimonial.id}` : "authorName"}
          name="authorName"
          defaultValue={testimonial?.authorName ?? ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={testimonial ? `authorRole-${testimonial.id}` : "authorRole"}>
          Role
        </Label>
        <Input
          id={testimonial ? `authorRole-${testimonial.id}` : "authorRole"}
          name="authorRole"
          defaultValue={testimonial?.authorRole ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={testimonial ? `authorCompany-${testimonial.id}` : "authorCompany"}>
          Company
        </Label>
        <Input
          id={testimonial ? `authorCompany-${testimonial.id}` : "authorCompany"}
          name="authorCompany"
          defaultValue={testimonial?.authorCompany ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={testimonial ? `rating-${testimonial.id}` : "rating"}>
          Rating (1–5)
        </Label>
        <Input
          id={testimonial ? `rating-${testimonial.id}` : "rating"}
          name="rating"
          type="number"
          min={1}
          max={5}
          defaultValue={testimonial?.rating ?? ""}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={testimonial ? `content-${testimonial.id}` : "content"}>
          Testimonial
        </Label>
        <Textarea
          id={testimonial ? `content-${testimonial.id}` : "content"}
          name="content"
          rows={4}
          defaultValue={testimonial?.content ?? ""}
          required
        />
      </div>
      <MediaSelect
        id={testimonial ? `avatarMediaId-${testimonial.id}` : "avatarMediaId"}
        name="avatarMediaId"
        label="Avatar (optional)"
        value={testimonial?.avatarMediaId ?? ""}
        mediaFiles={mediaFiles}
      />
      <div className="space-y-2">
        <Label htmlFor={testimonial ? `displayOrder-${testimonial.id}` : "displayOrder"}>
          Display order
        </Label>
        <Input
          id={testimonial ? `displayOrder-${testimonial.id}` : "displayOrder"}
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={testimonial?.displayOrder ?? nextDisplayOrder}
        />
      </div>
      <div className="flex items-center gap-4 md:col-span-2">
        <div className="flex items-center gap-2">
          <input
            id={testimonial ? `featured-${testimonial.id}` : "featured"}
            name="featured"
            type="checkbox"
            defaultChecked={testimonial?.featured ?? false}
          />
          <Label htmlFor={testimonial ? `featured-${testimonial.id}` : "featured"}>
            Featured on home
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            id={testimonial ? `visible-${testimonial.id}` : "visible"}
            name="visible"
            type="checkbox"
            defaultChecked={testimonial?.visible ?? true}
          />
          <Label htmlFor={testimonial ? `visible-${testimonial.id}` : "visible"}>
            Visible
          </Label>
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

export function TestimonialsManager({
  testimonials,
  mediaFiles,
}: TestimonialsManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add testimonial</h2>
        <TestimonialForm
          mediaFiles={mediaFiles}
          nextDisplayOrder={testimonials.length}
          submitLabel="Add testimonial"
        />
      </section>

      <section className="space-y-3">
        {testimonials.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No testimonials yet.
          </p>
        ) : (
          testimonials.map((item) => (
            <div key={item.id} className="rounded-xl border border-border p-4">
              {editingId === item.id ? (
                <div>
                  <h3 className="mb-4 font-medium">Edit testimonial</h3>
                  <TestimonialForm
                    testimonial={item}
                    mediaFiles={mediaFiles}
                    nextDisplayOrder={item.displayOrder}
                    submitLabel="Save changes"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
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
                  <div className="flex flex-wrap items-center gap-2">
                    <ReorderButtons
                      entity="testimonials"
                      id={item.id}
                      label={`Reorder ${item.authorName}`}
                    />
                    <EditItemButton onClick={() => setEditingId(item.id)} />
                    <DeleteItemButton
                      action={deleteTestimonialAction}
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
