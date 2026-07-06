import { describe, expect, it } from "vitest";
import { resolveBucketForMimeType } from "@/lib/storage/constants";
import { buildStoragePath, sanitizeFilename } from "@/lib/storage/paths";

describe("storage helpers", () => {
  it("maps mime types to buckets", () => {
    expect(resolveBucketForMimeType("image/png")).toBe("media");
    expect(resolveBucketForMimeType("application/pdf")).toBe("documents");
    expect(resolveBucketForMimeType("image/x-icon")).toBe("branding");
  });

  it("sanitizes filenames", () => {
    expect(sanitizeFilename("My File Name.PNG")).toBe("my-file-name.png");
  });

  it("builds unique storage paths", () => {
    const path = buildStoragePath("hero.png");
    expect(path).toMatch(/^\d{4}\/.+-hero\.png$/);
  });
});
