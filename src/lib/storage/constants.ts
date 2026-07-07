export const STORAGE_BUCKETS = {
  media: "media",
  documents: "documents",
  branding: "branding",
} as const;

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export const BUCKET_MIME_TYPES: Record<StorageBucket, readonly string[]> = {
  media: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
  ],
  documents: ["application/pdf"],
  branding: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/x-icon",
  ],
};

export const BUCKET_SIZE_LIMITS: Record<StorageBucket, number> = {
  media: 50 * 1024 * 1024,
  documents: 50 * 1024 * 1024,
  branding: 10 * 1024 * 1024,
};

export function resolveBucketForMimeType(mimeType: string): StorageBucket | null {
  for (const [bucket, mimeTypes] of Object.entries(BUCKET_MIME_TYPES)) {
    if (mimeTypes.includes(mimeType)) {
      return bucket as StorageBucket;
    }
  }

  return null;
}
