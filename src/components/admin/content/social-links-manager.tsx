"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  deleteSocialLinkAction,
  upsertSocialLinkAction,
} from "@/lib/admin/actions/identity";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { EditItemButton } from "@/components/admin/shared/edit-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { ReorderButtons } from "@/components/admin/shared/reorder-buttons";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SocialLinkRecord } from "@/types/cms";

type SocialLinksManagerProps = {
  links: SocialLinkRecord[];
};

function SocialLinkForm({
  link,
  nextDisplayOrder,
  onCancel,
  submitLabel,
}: {
  link?: SocialLinkRecord;
  nextDisplayOrder: number;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [state, save] = useActionState(upsertSocialLinkAction, {});

  return (
    <form action={save} className="grid gap-4 md:grid-cols-2">
      {link ? <input type="hidden" name="id" value={link.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor={link ? `platform-${link.id}` : "platform"}>
          Platform key
        </Label>
        <Input
          id={link ? `platform-${link.id}` : "platform"}
          name="platform"
          placeholder="github"
          defaultValue={link?.platform ?? ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={link ? `label-${link.id}` : "label"}>Label</Label>
        <Input
          id={link ? `label-${link.id}` : "label"}
          name="label"
          placeholder="GitHub"
          defaultValue={link?.label ?? ""}
          required
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={link ? `url-${link.id}` : "url"}>URL</Label>
        <Input
          id={link ? `url-${link.id}` : "url"}
          name="url"
          placeholder="https://github.com/username"
          defaultValue={link?.url ?? ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={link ? `icon-${link.id}` : "icon"}>
          Lucide icon name
        </Label>
        <Input
          id={link ? `icon-${link.id}` : "icon"}
          name="icon"
          placeholder="github"
          defaultValue={link?.icon ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={link ? `displayOrder-${link.id}` : "displayOrder"}>
          Display order
        </Label>
        <Input
          id={link ? `displayOrder-${link.id}` : "displayOrder"}
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={link?.displayOrder ?? nextDisplayOrder}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id={link ? `visible-${link.id}` : "visible"}
          name="visible"
          type="checkbox"
          defaultChecked={link?.visible ?? true}
        />
        <Label htmlFor={link ? `visible-${link.id}` : "visible"}>
          Visible on site
        </Label>
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

export function SocialLinksManager({ links }: SocialLinksManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add social link</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Platform keys <code>github</code> and <code>linkedin</code> also power
          structured data. Use <code>email</code> with a{" "}
          <code>mailto:</code> URL for the contact link.
        </p>
        <SocialLinkForm
          nextDisplayOrder={links.length}
          submitLabel="Add social link"
        />
      </section>

      <section className="space-y-3">
        {links.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No social links yet.
          </p>
        ) : (
          links.map((link) => (
            <div key={link.id} className="rounded-xl border border-border p-4">
              {editingId === link.id ? (
                <div>
                  <h3 className="mb-4 font-medium">Edit social link</h3>
                  <SocialLinkForm
                    link={link}
                    nextDisplayOrder={link.displayOrder}
                    submitLabel="Save changes"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{link.label}</p>
                    <p className="text-sm text-muted-foreground">{link.url}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Platform: {link.platform}
                      {link.icon ? ` · Icon: ${link.icon}` : ""}
                      {!link.visible ? " · Hidden" : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ReorderButtons
                      entity="social-links"
                      id={link.id}
                      label={`Reorder ${link.label}`}
                    />
                    <EditItemButton onClick={() => setEditingId(link.id)} />
                    <DeleteItemButton
                      action={deleteSocialLinkAction}
                      id={link.id}
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
