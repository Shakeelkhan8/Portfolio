import { z } from "zod";

const optionalUuid = z
  .string()
  .uuid()
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined));

export const portfolioQrGenerateSchema = z.object({
  targetUrl: z
    .string()
    .trim()
    .url("Enter a valid URL including https://")
    .refine((value) => {
      try {
        const host = new URL(value).hostname.toLowerCase();
        return (
          host !== "localhost" &&
          host !== "127.0.0.1" &&
          host !== "::1" &&
          !host.endsWith(".localhost")
        );
      } catch {
        return false;
      }
    }, "Use a public URL, not localhost."),
  label: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value || "Scan to view on your phone"),
});

export const portfolioQrSaveSchema = z.object({
  mediaId: optionalUuid,
  targetUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || "")
    .refine(
      (value) => value === "" || z.string().url().safeParse(value).success,
      "Enter a valid URL including https://",
    ),
  label: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => value || "Scan to view on your phone"),
  enabled: z.coerce.boolean().optional(),
});

export const QR_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
] as const;

export function isQrImageMimeType(mimeType: string) {
  return (QR_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType);
}
