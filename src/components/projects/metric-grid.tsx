import type { ProjectMetric } from "@/types";
import { Reveal } from "@/components/motion/reveal";

type MetricGridProps = {
  metrics: ProjectMetric[];
};

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Reveal key={metric.label} delay={index * 0.05}>
          <div>
            <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {metric.value}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">{metric.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
