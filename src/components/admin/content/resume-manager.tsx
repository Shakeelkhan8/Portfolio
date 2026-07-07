"use client";

import { useActionState } from "react";
import {
  deleteResumeVersionAction,
  setActiveResumeVersionAction,
  upsertResumeVersionAction,
} from "@/lib/admin/actions/resume";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { MediaSelect } from "@/components/admin/shared/media-select";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/formatters";
import type { MediaFileRecord, ResumeVersionRecord } from "@/types/cms";

type ResumeManagerProps = {
  versions: ResumeVersionRecord[];
  mediaFiles: MediaFileRecord[];
};

export function ResumeManager({ versions, mediaFiles }: ResumeManagerProps) {
  const [state, saveVersion] = useActionState(upsertResumeVersionAction, {});

  const pdfFiles = mediaFiles.filter(
    (file) => file.mimeType === "application/pdf",
  );

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Upload resume version</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Upload a PDF to the media library first, then attach it here. Only one
          version can be active for public download.
        </p>
        <form action={saveVersion} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Resume 2026"
              required
            />
          </div>
          <MediaSelect
            id="fileMediaId"
            name="fileMediaId"
            label="PDF file"
            value=""
            mediaFiles={pdfFiles}
            imagesOnly={false}
          />
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display order</Label>
            <Input
              id="displayOrder"
              name="displayOrder"
              type="number"
              min={0}
              defaultValue={versions.length}
            />
          </div>
          <div className="flex items-center gap-2">
            <input id="isActive" name="isActive" type="checkbox" />
            <Label htmlFor="isActive">Set as active download</Label>
          </div>
          <div className="md:col-span-2">
            <SubmitButton label="Add resume version" />
          </div>
        </form>
        <div className="mt-4">
          <FormMessage {...state} />
        </div>
      </section>

      <section className="space-y-3">
        {versions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No resume versions yet. Upload a PDF in Media, then add it here.
          </p>
        ) : (
          versions.map((version) => (
            <div
              key={version.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{version.title}</p>
                  {version.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{version.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  Uploaded {formatDate(version.uploadedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {!version.isActive ? (
                  <form
                    action={async (formData) => {
                      await setActiveResumeVersionAction(formData);
                    }}
                  >
                    <input type="hidden" name="id" value={version.id} />
                    <Button type="submit" size="sm" variant="outline">
                      Set active
                    </Button>
                  </form>
                ) : null}
                <DeleteItemButton
                  action={deleteResumeVersionAction}
                  id={version.id}
                />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
