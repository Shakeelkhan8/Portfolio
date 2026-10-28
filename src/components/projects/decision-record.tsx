import type { EngineeringDecision } from "@/types";
import { cn } from "@/lib/utils";

type DecisionRecordProps = {
  decision: EngineeringDecision;
  /** Shown in the record's header bar, e.g. the project the call was made on. */
  source?: string;
  /** Position in a list of records, shown as "Decision 02". */
  index?: number;
  className?: string;
};

/**
 * An engineering decision in the shape of a lightweight ADR:
 * the call, why it was made, and what it costs.
 */
export function DecisionRecord({
  decision,
  source,
  index,
  className,
}: DecisionRecordProps) {
  const label =
    index === undefined
      ? "Decision"
      : `Decision ${String(index + 1).padStart(2, "0")}`;

  return (
    <figure
      className={cn("rounded-lg border border-border bg-surface", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3 sm:px-6">
        <span className="label-mono text-signal">{label}</span>
        {source ? <span className="label-mono">{source}</span> : null}
      </div>
      <div className="px-5 py-6 sm:px-6 sm:py-7">
        <p className="font-heading text-xl leading-snug text-foreground sm:text-2xl">
          {decision.decision}
        </p>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="label-mono">Why</dt>
            <dd className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-foreground/85">
              {decision.rationale}
            </dd>
          </div>
          <div>
            <dt className="label-mono">Trade-off</dt>
            <dd className="mt-2 text-[0.9375rem] leading-relaxed text-pretty text-foreground/85">
              {decision.tradeoff}
            </dd>
          </div>
        </dl>
      </div>
    </figure>
  );
}
