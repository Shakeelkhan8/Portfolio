import { describe, expect, it } from "vitest";
import {
  ADMIN_PAGE_SIZE,
  buildAdminQueryString,
  buildPaginatedResult,
  getRange,
  parsePageParam,
} from "@/lib/admin/pagination";

describe("admin pagination helpers", () => {
  it("parses page numbers safely", () => {
    expect(parsePageParam("3")).toBe(3);
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
  });

  it("builds paginated results with clamped page", () => {
    const result = buildPaginatedResult(["a", "b"], 42, 99, ADMIN_PAGE_SIZE);
    expect(result.page).toBe(3);
    expect(result.totalPages).toBe(3);
    expect(result.total).toBe(42);
  });

  it("calculates supabase ranges", () => {
    expect(getRange(1, 20)).toEqual({ from: 0, to: 19 });
    expect(getRange(2, 20)).toEqual({ from: 20, to: 39 });
  });

  it("builds admin query strings without empty values", () => {
    expect(
      buildAdminQueryString({ page: 2, status: "unread", q: undefined }),
    ).toBe("?page=2&status=unread");
  });
});
