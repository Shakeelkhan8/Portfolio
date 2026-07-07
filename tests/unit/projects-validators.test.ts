import { describe, expect, it } from "vitest";
import {
  parseDecisions,
  parseDiagramJson,
  parseLinks,
  parseMetrics,
} from "@/lib/validators/projects";

describe("project validators", () => {
  it("parses metrics from pipe-separated lines", () => {
    expect(parseMetrics("Users | 500+\nLatency | <1s")).toEqual([
      { label: "Users", value: "500+" },
      { label: "Latency", value: "<1s" },
    ]);
  });

  it("parses links from pipe-separated lines", () => {
    expect(parseLinks("Live demo | https://example.com")).toEqual([
      { label: "Live demo", href: "https://example.com" },
    ]);
  });

  it("parses decisions from pipe-separated lines", () => {
    expect(
      parseDecisions("Use Postgres | Strong consistency | Higher ops overhead"),
    ).toEqual([
      {
        decision: "Use Postgres",
        rationale: "Strong consistency",
        tradeoff: "Higher ops overhead",
      },
    ]);
  });

  it("parses architecture diagram JSON", () => {
    const diagram = parseDiagramJson(
      JSON.stringify([{ id: "api", label: "API", type: "api", layer: 1 }]),
      JSON.stringify([{ from: "api", to: "db" }]),
    );

    expect(diagram?.nodes).toHaveLength(1);
    expect(diagram?.edges).toHaveLength(1);
  });

  it("rejects invalid metric rows", () => {
    expect(() => parseMetrics("Only one column")).toThrow(/metric/i);
  });
});
