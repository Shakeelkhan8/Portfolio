import type { ArchitectureDiagramData, DiagramEdge } from "@/types";

export type DiagramTrace = {
  /** Every node a request through the selected node can touch. */
  nodeIds: Set<string>;
  /** Keys (see `edgeKey`) of the edges on those paths. */
  edgeKeys: Set<string>;
  /**
   * Labels of the traced nodes grouped by layer, in layer order, for a
   * readable caption: [["Mobile Apps"], ["Laravel API"], ["PostgreSQL"]].
   */
  stages: string[][];
};

export function edgeKey(edge: Pick<DiagramEdge, "from" | "to">): string {
  return `${edge.from}->${edge.to}`;
}

/**
 * The request path through one component: everything upstream of it
 * (who calls it, transitively) plus everything downstream (what it calls,
 * transitively). Unlike "direct neighbours only", this shows a whole flow,
 * e.g. selecting the API lights both clients and every store behind it.
 *
 * Breadth-first in both directions with a visited set, so cycles in the
 * data (a WebSocket server pushing back to its clients) terminate. Unknown
 * ids yield an empty trace rather than throwing: diagrams are CMS content.
 */
export function traceDiagram(
  diagram: ArchitectureDiagramData,
  nodeId: string,
): DiagramTrace {
  const known = new Set(diagram.nodes.map((node) => node.id));
  if (!known.has(nodeId)) {
    return { nodeIds: new Set(), edgeKeys: new Set(), stages: [] };
  }

  const nodeIds = new Set<string>([nodeId]);
  const edgeKeys = new Set<string>();

  const walk = (direction: "down" | "up") => {
    const visited = new Set<string>([nodeId]);
    const queue = [nodeId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const edge of diagram.edges) {
        const [here, next] =
          direction === "down" ? [edge.from, edge.to] : [edge.to, edge.from];
        if (here !== current || !known.has(next)) continue;
        edgeKeys.add(edgeKey(edge));
        nodeIds.add(next);
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
  };

  walk("down");
  walk("up");

  const byLayer = new Map<number, string[]>();
  for (const node of diagram.nodes) {
    if (!nodeIds.has(node.id)) continue;
    const stage = byLayer.get(node.layer) ?? [];
    stage.push(node.label);
    byLayer.set(node.layer, stage);
  }
  const stages = [...byLayer.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, labels]) => labels);

  return { nodeIds, edgeKeys, stages };
}
