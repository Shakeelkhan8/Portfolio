"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  deleteCertificationAction,
  upsertCertificationAction,
} from "@/lib/admin/actions/cms-modules";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { EditItemButton } from "@/components/admin/shared/edit-item-button";
import { MediaSelect } from "@/components/admin/shared/media-select";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CertificationRecord, MediaFileRecord } from "@/types/cms";

type CertificationsManagerProps = {
  certifications: CertificationRecord[];
  mediaFiles: MediaFileRecord[];
};

function CertificationForm({
  certification,
  mediaFiles,
  nextDisplayOrder,
  onCancel,
  submitLabel,
}: {
  certification?: CertificationRecord;
  mediaFiles: MediaFileRecord[];
  nextDisplayOrder: number;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [state, saveCertification] = useActionState(
    upsertCertificationAction,
    {},
  );

  return (
    <form action={saveCertification} className="grid gap-4 md:grid-cols-2">
      {certification ? <input type="hidden" name="id" value={certification.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor={certification ? `name-${certification.id}` : "name"}>Name</Label>
        <Input
          id={certification ? `name-${certification.id}` : "name"}
          name="name"
          defaultValue={certification?.name ?? ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={certification ? `issuer-${certification.id}` : "issuer"}>Issuer</Label>
        <Input
          id={certification ? `issuer-${certification.id}` : "issuer"}
          name="issuer"
          defaultValue={certification?.issuer ?? ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={certification ? `issueDate-${certification.id}` : "issueDate"}>
          Issue date
        </Label>
        <Input
          id={certification ? `issueDate-${certification.id}` : "issueDate"}
          name="issueDate"
          type="date"
          defaultValue={certification?.issueDate ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={certification ? `credentialId-${certification.id}` : "credentialId"}>
          Credential ID
        </Label>
        <Input
          id={certification ? `credentialId-${certification.id}` : "credentialId"}
          name="credentialId"
          defaultValue={certification?.credentialId ?? ""}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label
          htmlFor={
            certification ? `verificationUrl-${certification.id}` : "verificationUrl"
          }
        >
          Verification URL
        </Label>
        <Input
          id={certification ? `verificationUrl-${certification.id}` : "verificationUrl"}
          name="verificationUrl"
          type="url"
          defaultValue={certification?.verificationUrl ?? ""}
        />
      </div>
      <MediaSelect
        id={certification ? `imageMediaId-${certification.id}` : "imageMediaId"}
        name="imageMediaId"
        label="Badge image (optional)"
        value={certification?.imageMediaId ?? ""}
        mediaFiles={mediaFiles}
      />
      <div className="space-y-2">
        <Label htmlFor={certification ? `displayOrder-${certification.id}` : "displayOrder"}>
          Display order
        </Label>
        <Input
          id={certification ? `displayOrder-${certification.id}` : "displayOrder"}
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={certification?.displayOrder ?? nextDisplayOrder}
        />
      </div>
      <div className="flex items-center gap-2 md:col-span-2">
        <input
          id={certification ? `visible-${certification.id}` : "visible"}
          name="visible"
          type="checkbox"
          defaultChecked={certification?.visible ?? true}
        />
        <Label htmlFor={certification ? `visible-${certification.id}` : "visible"}>
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

export function CertificationsManager({
  certifications,
  mediaFiles,
}: CertificationsManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add certification</h2>
        <CertificationForm
          mediaFiles={mediaFiles}
          nextDisplayOrder={certifications.length}
          submitLabel="Add certification"
        />
      </section>

      <section className="space-y-3">
        {certifications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No certifications yet.
          </p>
        ) : (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="rounded-xl border border-border p-4"
            >
              {editingId === cert.id ? (
                <div>
                  <h3 className="mb-4 font-medium">Edit certification</h3>
                  <CertificationForm
                    certification={cert}
                    mediaFiles={mediaFiles}
                    nextDisplayOrder={cert.displayOrder}
                    submitLabel="Save changes"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    {!cert.visible ? (
                      <p className="mt-1 text-xs text-muted-foreground">Hidden</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <EditItemButton onClick={() => setEditingId(cert.id)} />
                    <DeleteItemButton
                      action={deleteCertificationAction}
                      id={cert.id}
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
