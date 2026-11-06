import type { ProjectMetric } from "@/types";
import { Reveal } from "@/components/motion/reveal";

type MetricGridProps = {
  metrics: ProjectMetric[];
};

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-7 border-y border-foreground/[0.07] py-7 sm:grid-cols-4">
      {metrics.map((metric, index) => (
        <Reveal key={metric.label} delay={index * 0.05}>
          <div>
            <p className="font-heading font-stretch-semi-expanded text-[clamp(1.375rem,1.2rem+0.7vw,1.75rem)] leading-tight font-semibold tracking-tight tabular-nums text-signal">
              {metric.value}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">{metric.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
