import { describe, expect, it } from "vitest";
import { parseArticleTags } from "@/lib/validators/articles";
import { estimateReadingTimeMinutes } from "@/lib/utils/reading-time";

describe("article validators", () => {
  it("parses comma-separated tags", () => {
    expect(parseArticleTags("SaaS, APIs, PostgreSQL")).toEqual([
      "SaaS",
      "APIs",
      "PostgreSQL",
    ]);
  });

  it("returns an empty array for blank tags", () => {
    expect(parseArticleTags("")).toEqual([]);
  });
});

describe("reading time", () => {
  it("estimates reading time from HTML content", () => {
    const html = `<p>${"word ".repeat(400)}</p>`;
    expect(estimateReadingTimeMinutes(html)).toBe(2);
  });

  it("returns at least one minute for empty content", () => {
    expect(estimateReadingTimeMinutes("")).toBe(1);
  });
});
