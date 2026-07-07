"use client";

import { useActionState } from "react";
import Image from "next/image";
import {
  deleteMediaAction,
  updateMediaAltAction,
  uploadMediaAction,
} from "@/lib/admin/actions/media";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPagination } from "@/components/admin/shared/admin-pagination";
import type { PaginatedResult } from "@/lib/admin/pagination";
import type { MediaFileRecord } from "@/types/cms";

type MediaLibraryProps = {
  result: PaginatedResult<MediaFileRecord>;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ result }: MediaLibraryProps) {
  const [uploadState, uploadMedia] = useActionState(uploadMediaAction, {});
  const { items: files } = result;

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Upload file</h2>
        <form action={uploadMedia} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="file">File</Label>
            <Input id="file" name="file" type="file" required />
            <p className="text-xs text-muted-foreground">
              Images, PDFs, and short videos up to 50 MB.
            </p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="altText">Alt text (optional)</Label>
            <Input id="altText" name="altText" placeholder="Describe the image" />
          </div>
          <div className="md:col-span-2">
            <SubmitButton label="Upload" pendingLabel="Uploading..." />
          </div>
        </form>
        <div className="mt-4">
          <FormMessage {...uploadState} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Library</h2>
          <AdminPagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            basePath="/admin/media"
          />
        </div>

        {files.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No files uploaded yet.
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {files.map((file) => (
                <MediaCard key={file.id} file={file} />
              ))}
            </div>
            {result.totalPages > 1 ? (
              <AdminPagination
                page={result.page}
                totalPages={result.totalPages}
                total={result.total}
                basePath="/admin/media"
              />
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

function MediaCard({ file }: { file: MediaFileRecord }) {
  const [altState, updateAlt] = useActionState(updateMediaAltAction, {});
  const isImage = file.mimeType.startsWith("image/");

  return (
    <article className="overflow-hidden rounded-xl border border-border">
      <div className="relative aspect-video bg-muted/40">
        {isImage ? (
          <Image
            src={file.publicUrl}
            alt={file.altText ?? file.originalFilename}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
            {file.mimeType}
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="truncate font-medium">{file.originalFilename}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.sizeBytes)} · {file.storageBucket}
          </p>
        </div>

        <form action={updateAlt} className="space-y-2">
          <input type="hidden" name="id" value={file.id} />
          <Label htmlFor={`alt-${file.id}`}>Alt text</Label>
          <Input
            id={`alt-${file.id}`}
            name="altText"
            defaultValue={file.altText ?? ""}
          />
          <SubmitButton label="Save alt text" />
        </form>
        <FormMessage {...altState} />

        <div className="flex items-center justify-between gap-2">
          <a
            href={file.publicUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Open file
          </a>
          <DeleteItemButton action={deleteMediaAction} id={file.id} />
        </div>
      </div>
    </article>
  );
}
