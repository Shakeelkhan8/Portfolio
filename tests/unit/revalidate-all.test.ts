import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag, revalidatePath }));

const { revalidateAllPublicContent } = await import("@/lib/db/revalidate");
const { CACHE_TAGS } = await import("@/lib/db/cache-tags");

const tagCount = Object.values(CACHE_TAGS).length;

describe("revalidateAllPublicContent", () => {
  beforeEach(() => {
    revalidateTag.mockClear();
    revalidatePath.mockClear();
  });

  it("marks every tag stale by default (Admin's Refresh button)", () => {
    revalidateAllPublicContent();
    expect(revalidateTag).toHaveBeenCalledTimes(tagCount);
    for (const [, profile] of revalidateTag.mock.calls) expect(profile).toBe("max");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("expires every tag at once when immediate", () => {
    revalidateAllPublicContent({ immediate: true });
    expect(revalidateTag.mock.calls.map(([tag]) => tag).sort()).toEqual(
      Object.values(CACHE_TAGS).sort(),
    );
    for (const [, profile] of revalidateTag.mock.calls) {
      expect(profile).toEqual({ expire: 0 });
    }
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });
});
