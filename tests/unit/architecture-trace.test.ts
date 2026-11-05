import { describe, expect, it } from "vitest";
import { edgeKey, traceDiagram } from "@/lib/architecture/trace";
import type { ArchitectureDiagramData } from "@/types";

const diagram: ArchitectureDiagramData = {
  title: "Test system",
  nodes: [
    { id: "web", label: "Web", type: "frontend", layer: 0 },
    { id: "mobile", label: "Mobile", type: "frontend", layer: 0 },
    { id: "api", label: "API", type: "api", layer: 1 },
    { id: "billing", label: "Billing", type: "service", layer: 2 },
    { id: "search", label: "Search", type: "service", layer: 2 },
    { id: "socket", label: "Socket", type: "service", layer: 2 },
    { id: "db", label: "DB", type: "database", layer: 3 },
    { id: "psp", label: "PSP", type: "external", layer: 4 },
  ],
  edges: [
    { from: "web", to: "api" },
    { from: "mobile", to: "api" },
    { from: "api", to: "billing" },
    { from: "api", to: "search" },
    { from: "api", to: "socket" },
    { from: "billing", to: "db" },
    { from: "billing", to: "psp" },
    { from: "search", to: "db" },
    // Back edge: the socket server pushes to the web client (a cycle).
    { from: "socket", to: "web" },
  ],
};

const sorted = (set: Set<string>) => [...set].sort();

describe("traceDiagram", () => {
  it("follows a leaf all the way back to every client that reaches it", () => {
    const trace = traceDiagram(diagram, "psp");

    expect(sorted(trace.nodeIds)).toEqual(
      ["api", "billing", "mobile", "psp", "socket", "web"].sort(),
    );
    expect(trace.stages).toEqual([
      ["Web", "Mobile"],
      ["API"],
      ["Billing", "Socket"],
      ["PSP"],
    ]);
  });

  it("does not include siblings that share no path with the node", () => {
    const trace = traceDiagram(diagram, "billing");

    expect(trace.nodeIds.has("search")).toBe(false);
    expect(trace.edgeKeys.has(edgeKey({ from: "api", to: "search" }))).toBe(
      false,
    );
    // api->socket is upstream through the cycle: socket -> web -> api -> billing.
    expect(sorted(trace.edgeKeys)).toEqual(
      [
        "api->billing",
        "api->socket",
        "billing->db",
        "billing->psp",
        "mobile->api",
        "socket->web",
        "web->api",
      ].sort(),
    );
  });

  it("terminates on cycles and keeps both directions of the loop", () => {
    const trace = traceDiagram(diagram, "socket");

    expect(trace.edgeKeys.has("socket->web")).toBe(true);
    expect(trace.edgeKeys.has("web->api")).toBe(true);
    expect(trace.edgeKeys.has("api->socket")).toBe(true);
    expect(trace.nodeIds.size).toBe(8);
  });

  it("returns an empty trace for an id that is not in the diagram", () => {
    const trace = traceDiagram(diagram, "missing");

    expect(trace.nodeIds.size).toBe(0);
    expect(trace.edgeKeys.size).toBe(0);
    expect(trace.stages).toEqual([]);
  });

  it("ignores edges that point at nodes the CMS no longer has", () => {
    const trace = traceDiagram(
      { ...diagram, edges: [...diagram.edges, { from: "db", to: "ghost" }] },
      "db",
    );

    expect(trace.nodeIds.has("ghost")).toBe(false);
    expect(trace.edgeKeys.has("db->ghost")).toBe(false);
  });
});
