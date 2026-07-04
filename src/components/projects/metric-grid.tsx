import { Card, CardContent } from "@/components/ui/card";
import type { ProjectMetric } from "@/types";

type MetricGridProps = {
  metrics: ProjectMetric[];
};

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} size="sm">
          <CardContent className="pt-4">
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {metric.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
