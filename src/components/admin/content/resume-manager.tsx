"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  deleteResumeVersionAction,
  setActiveResumeVersionAction,
  upsertResumeVersionAction,
} from "@/lib/admin/actions/resume";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { EditItemButton } from "@/components/admin/shared/edit-item-button";
import { MediaSelect } from "@/components/admin/shared/media-select";
import { FormMessage } from "@/components/admin/shared/form-message";
import { ReorderButtons } from "@/components/admin/shared/reorder-buttons";
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

function ResumeVersionForm({
  version,
  pdfFiles,
  nextDisplayOrder,
  onCancel,
  submitLabel,
}: {
  version?: ResumeVersionRecord;
  pdfFiles: MediaFileRecord[];
  nextDisplayOrder: number;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [state, saveVersion] = useActionState(upsertResumeVersionAction, {});

  return (
    <form action={saveVersion} className="grid gap-4 md:grid-cols-2">
      {version ? <input type="hidden" name="id" value={version.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor={version ? `title-${version.id}` : "title"}>Title</Label>
        <Input
          id={version ? `title-${version.id}` : "title"}
          name="title"
          placeholder="Resume 2026"
          defaultValue={version?.title ?? ""}
          required
        />
      </div>
      <MediaSelect
        id={version ? `fileMediaId-${version.id}` : "fileMediaId"}
        name="fileMediaId"
        label="PDF file"
        value={version?.fileMediaId ?? ""}
        mediaFiles={pdfFiles}
        imagesOnly={false}
      />
      <div className="space-y-2">
        <Label htmlFor={version ? `displayOrder-${version.id}` : "displayOrder"}>
          Display order
        </Label>
        <Input
          id={version ? `displayOrder-${version.id}` : "displayOrder"}
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={version?.displayOrder ?? nextDisplayOrder}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id={version ? `isActive-${version.id}` : "isActive"}
          name="isActive"
          type="checkbox"
          defaultChecked={version?.isActive ?? false}
        />
        <Label htmlFor={version ? `isActive-${version.id}` : "isActive"}>
          Set as active download
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

export function ResumeManager({ versions, mediaFiles }: ResumeManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

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
        <ResumeVersionForm
          pdfFiles={pdfFiles}
          nextDisplayOrder={versions.length}
          submitLabel="Add resume version"
        />
      </section>

      <section className="space-y-3">
        {versions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No resume versions yet. Upload a PDF in Media, then add it here.
          </p>
        ) : (
          versions.map((version) => (
            <div key={version.id} className="rounded-xl border border-border p-4">
              {editingId === version.id ? (
                <div>
                  <h3 className="mb-4 font-medium">Edit resume version</h3>
                  <ResumeVersionForm
                    version={version}
                    pdfFiles={pdfFiles}
                    nextDisplayOrder={version.displayOrder}
                    submitLabel="Save changes"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-4">
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
                    <ReorderButtons
                      entity="resume-versions"
                      id={version.id}
                      label={`Reorder ${version.title}`}
                    />
                    <EditItemButton onClick={() => setEditingId(version.id)} />
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
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
