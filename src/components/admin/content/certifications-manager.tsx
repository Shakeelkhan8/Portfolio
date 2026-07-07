"use client";

import { useActionState } from "react";
import {
  deleteCertificationAction,
  upsertCertificationAction,
} from "@/lib/admin/actions/cms-modules";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { MediaSelect } from "@/components/admin/shared/media-select";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CertificationRecord, MediaFileRecord } from "@/types/cms";

type CertificationsManagerProps = {
  certifications: CertificationRecord[];
  mediaFiles: MediaFileRecord[];
};

export function CertificationsManager({
  certifications,
  mediaFiles,
}: CertificationsManagerProps) {
  const [state, saveCertification] = useActionState(
    upsertCertificationAction,
    {},
  );

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Add certification</h2>
        <form action={saveCertification} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuer</Label>
            <Input id="issuer" name="issuer" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue date</Label>
            <Input id="issueDate" name="issueDate" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credentialId">Credential ID</Label>
            <Input id="credentialId" name="credentialId" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="verificationUrl">Verification URL</Label>
            <Input id="verificationUrl" name="verificationUrl" type="url" />
          </div>
          <MediaSelect
            id="imageMediaId"
            name="imageMediaId"
            label="Badge image (optional)"
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
              defaultValue={certifications.length}
            />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input id="visible" name="visible" type="checkbox" defaultChecked />
            <Label htmlFor="visible">Visible on site</Label>
          </div>
          <div className="md:col-span-2">
            <SubmitButton label="Add certification" />
          </div>
        </form>
        <div className="mt-4">
          <FormMessage {...state} />
        </div>
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
              className="flex items-start justify-between gap-4 rounded-xl border border-border p-4"
            >
              <div>
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                {!cert.visible ? (
                  <p className="mt-1 text-xs text-muted-foreground">Hidden</p>
                ) : null}
              </div>
              <DeleteItemButton
                action={deleteCertificationAction}
                id={cert.id}
              />
            </div>
          ))
        )}
      </section>
    </div>
  );
}
