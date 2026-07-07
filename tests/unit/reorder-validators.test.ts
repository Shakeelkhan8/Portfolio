import { describe, expect, it } from "vitest";
import { moveDisplayOrderSchema } from "@/lib/validators/reorder";

describe("moveDisplayOrderSchema", () => {
  it("accepts a valid reorder payload", () => {
    const result = moveDisplayOrderSchema.safeParse({
      entity: "projects",
      id: "550e8400-e29b-41d4-a716-446655440000",
      direction: "up",
    });

    expect(result.success).toBe(true);
  });

  it("accepts scoped navigation reorder payloads", () => {
    const result = moveDisplayOrderSchema.safeParse({
      entity: "navigation",
      id: "550e8400-e29b-41d4-a716-446655440000",
      direction: "down",
      scopeKey: "main",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid entity names", () => {
    const result = moveDisplayOrderSchema.safeParse({
      entity: "articles",
      id: "550e8400-e29b-41d4-a716-446655440000",
      direction: "up",
    });

    expect(result.success).toBe(false);
  });
});
