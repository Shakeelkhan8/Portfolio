import { z } from "zod";
import type { AdminActionState } from "@/lib/validators/content";

export type { AdminActionState };

export const mediaAltSchema = z.object({
  id: z.uuid("Invalid media id."),
  altText: z.string().trim().max(500).optional(),
});

export const mediaUploadSchema = z.object({
  altText: z.string().trim().max(500).optional(),
});

export const ALLOWED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "image/x-icon",
] as const;

export function isAllowedUploadMimeType(mimeType: string) {
  return (ALLOWED_UPLOAD_MIME_TYPES as readonly string[]).includes(mimeType);
}
