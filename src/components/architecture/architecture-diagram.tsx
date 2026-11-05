"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ArchitectureDiagramData } from "@/types";
import { cn } from "@/lib/utils";
import { diagramNodeStyles } from "@/lib/architecture/node-styles";
import { edgeKey, traceDiagram } from "@/lib/architecture/trace";

type ArchitectureDiagramProps = {
  diagram: ArchitectureDiagramData;
};

type Box = { x: number; y: number; w: number; h: number };
type EdgeGeometry = { key: string; d: string; endX: number; endY: number };
type State = "idle" | "on" | "off";

/**
 * Cubic path from one node box to another, leaving and entering through the
 * facing sides. Layers stack vertically in narrow containers and sit side by
 * side in wide ones, so the direction is read from the measured boxes rather
 * than assumed. Back edges (a server pushing to its clients) bow out to the
 * right so they don't run through the nodes in between.
 */
function edgeGeometry(s: Box, t: Box): Omit<EdgeGeometry, "key"> {
  const sCx = s.x + s.w / 2;
  const sCy = s.y + s.h / 2;
  const tCx = t.x + t.w / 2;
  const tCy = t.y + t.h / 2;

  const below = t.y >= s.y + s.h - 1;
  const above = t.y + t.h <= s.y + 1;
  const right = t.x >= s.x + s.w - 1;

  if (below) {
    const bend = Math.max((t.y - (s.y + s.h)) / 2, 12);
    return {
      d: `M ${sCx} ${s.y + s.h} C ${sCx} ${s.y + s.h + bend}, ${tCx} ${t.y - bend}, ${tCx} ${t.y}`,
      endX: tCx,
      endY: t.y,
    };
  }

  if (right) {
    const bend = Math.max((t.x - (s.x + s.w)) / 2, 12);
    return {
      d: `M ${s.x + s.w} ${sCy} C ${s.x + s.w + bend} ${sCy}, ${t.x - bend} ${tCy}, ${t.x} ${tCy}`,
      endX: t.x,
      endY: tCy,
    };
  }

  if (above) {
    const out = Math.max(s.w, t.w) * 0.6;
    const sx = s.x + s.w;
    const tx = t.x + t.w;
    return {
      d: `M ${sx} ${sCy} C ${sx + out} ${sCy}, ${tx + out} ${tCy}, ${tx} ${tCy}`,
      endX: tx,
      endY: tCy,
    };
  }

  // Leftward in a horizontal layout: bow below both nodes.
  const drop = Math.max(s.h, t.h) * 1.4;
  const sy = s.y + s.h;
  const ty = t.y + t.h;
  return {
    d: `M ${sCx} ${sy} C ${sCx} ${sy + drop}, ${tCx} ${ty + drop}, ${tCx} ${ty}`,
    endX: tCx,
    endY: ty,
  };
}

/**
 * Interactive system diagram for a case study.
 *
 * Draws the real connections from the CMS data and, when a component is
 * hovered or focused, traces every request path through it (upstream
 * callers and downstream dependencies, see `traceDiagram`). The traced
 * path is also written out as text in a polite live region, so keyboard
 * and screen-reader users get the same information as the drawing.
 *
 * Edges are measured from the rendered nodes (ResizeObserver plus font
 * load), so the drawing follows the responsive layout: layers stack as rows
 * in narrow containers and become columns from the `@3xl` container width.
 */
export function ArchitectureDiagram({ diagram }: ArchitectureDiagramProps) {
  const captionId = useId();
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLElement>());
  const [edges, setEdges] = useState<EdgeGeometry[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const active = hovered ?? focused;
  const trace = useMemo(
    () => (active ? traceDiagram(diagram, active) : null),
    [active, diagram],
  );

  const layers = useMemo(() => {
    const byLayer = new Map<number, ArchitectureDiagramData["nodes"]>();
    for (const node of diagram.nodes) {
      byLayer.set(node.layer, [...(byLayer.get(node.layer) ?? []), node]);
    }
    return [...byLayer.entries()]
      .sort(([a], [b]) => a - b)
      .map(([layer, nodes]) => ({ layer, nodes }));
  }, [diagram.nodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const origin = canvas.getBoundingClientRect();
        const box = (id: string): Box | null => {
          const rect = nodeRefs.current.get(id)?.getBoundingClientRect();
          if (!rect) return null;
          return {
            x: rect.left - origin.left,
            y: rect.top - origin.top,
            w: rect.width,
            h: rect.height,
          };
        };

        const next: EdgeGeometry[] = [];
        for (const edge of diagram.edges) {
          const s = box(edge.from);
          const t = box(edge.to);
          if (!s || !t) continue;
          next.push({ key: edgeKey(edge), ...edgeGeometry(s, t) });
        }
        setEdges(next);
        setSize({ w: canvas.offsetWidth, h: canvas.offsetHeight });
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    void document.fonts?.ready.then(measure);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [diagram.edges, layers]);

  const nodeState = (id: string): State =>
    trace ? (trace.nodeIds.has(id) ? "on" : "off") : "idle";
  const edgeState = (key: string): State =>
    trace ? (trace.edgeKeys.has(key) ? "on" : "off") : "idle";

  return (
    <figure className="@container rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 sm:p-6">
      <figcaption className="mb-6 font-heading text-sm font-medium tracking-tight text-foreground">
        {diagram.title}
      </figcaption>

      <div ref={canvasRef} className="relative">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${Math.max(size.w, 1)} ${Math.max(size.h, 1)}`}
        >
          {edges.map((edge) => {
            const state = edgeState(edge.key);
            return (
              <g key={edge.key} data-state={state} className="diagram-edge">
                <path d={edge.d} />
                <circle cx={edge.endX} cy={edge.endY} r={2.25} />
              </g>
            );
          })}
        </svg>

        <div className="relative flex flex-col items-center gap-11 @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:gap-10">
          {layers.map(({ layer, nodes }) => (
            <div
              key={layer}
              className="flex flex-wrap justify-center gap-2.5 @3xl:flex-col @3xl:flex-nowrap @3xl:gap-3"
            >
              {nodes.map((node) => {
                const state = nodeState(node.id);
                return (
                  <button
                    key={node.id}
                    ref={(element) => {
                      if (element) nodeRefs.current.set(node.id, element);
                      else nodeRefs.current.delete(node.id);
                    }}
                    type="button"
                    aria-describedby={captionId}
                    data-state={state}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setHovered(node.id);
                    }}
                    onPointerLeave={(event) => {
                      if (event.pointerType === "mouse") setHovered(null);
                    }}
                    onFocus={() => setFocused(node.id)}
                    onBlur={() => setFocused(null)}
                    // Opaque base so edges crossing a row pass behind nodes.
                    className={cn(
                      "group/node relative rounded-lg bg-background text-left transition-opacity duration-300 ease-out data-[state=off]:opacity-40",
                      active === node.id && "ring-2 ring-ring/40 ring-offset-2 ring-offset-background",
                    )}
                  >
                    <span
                      className={cn(
                        "block min-w-[8.5rem] rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors duration-300",
                        diagramNodeStyles[node.type],
                        state === "on" && "border-foreground/45",
                      )}
                    >
                      {node.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p
        id={captionId}
        aria-live="polite"
        className="mt-6 min-h-10 border-t border-foreground/[0.06] pt-4 font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs"
      >
        {trace && trace.stages.length > 0 ? (
          <>
            <span className="sr-only">Request path: </span>
            {trace.stages.map((stage, index) => (
              <span key={stage.join("|")}>
                {index > 0 ? (
                  <span aria-hidden="true" className="px-1.5 text-foreground/30">
                    →
                  </span>
                ) : null}
                <span className="text-foreground/85">{stage.join(", ")}</span>
              </span>
            ))}
          </>
        ) : (
          <>
            <span className="pointer-fine:hidden">
              Tap a component to trace the requests that pass through it.
            </span>
            <span className="hidden pointer-fine:inline">
              Point at or tab to a component to trace the requests that pass
              through it.
            </span>
          </>
        )}
      </p>
    </figure>
  );
}
