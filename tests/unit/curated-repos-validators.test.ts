import { describe, expect, it } from "vitest";
import { curatedRepoSchema } from "@/lib/validators/curated-repos";

describe("curated repo validators", () => {
  it("accepts owner/repo format", () => {
    const parsed = curatedRepoSchema.safeParse({
      repoFullName: "vercel/next.js",
      displayOrder: 0,
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid repository names", () => {
    const parsed = curatedRepoSchema.safeParse({
      repoFullName: "invalid-name",
    });

    expect(parsed.success).toBe(false);
  });
});
