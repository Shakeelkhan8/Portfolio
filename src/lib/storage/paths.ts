import { randomUUID } from "crypto";

export function sanitizeFilename(filename: string) {
  const base = filename.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  return base.replace(/-+/g, "-").replace(/^-|-$/g, "") || "file";
}

export function buildStoragePath(originalFilename: string) {
  const year = new Date().getUTCFullYear();
  const safeName = sanitizeFilename(originalFilename);
  return `${year}/${randomUUID()}-${safeName}`;
}

export function buildPublicStorageUrl(
  supabaseUrl: string,
  bucket: string,
  storagePath: string,
) {
  const base = supabaseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${bucket}/${storagePath}`;
}
