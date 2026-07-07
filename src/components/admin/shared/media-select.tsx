"use client";

import { Label } from "@/components/ui/label";
import type { MediaFileRecord } from "@/types/cms";

type MediaSelectProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  mediaFiles: MediaFileRecord[];
  imagesOnly?: boolean;
};

export function MediaSelect({
  id,
  name,
  label,
  value,
  mediaFiles,
  imagesOnly = true,
}: MediaSelectProps) {
  const options = imagesOnly
    ? mediaFiles.filter((file) => file.mimeType.startsWith("image/"))
    : mediaFiles;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        defaultValue={value}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">None</option>
        {options.map((file) => (
          <option key={file.id} value={file.id}>
            {file.originalFilename}
          </option>
        ))}
      </select>
    </div>
  );
}
