import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";

type PhasePlaceholderProps = {
  title: string;
  description: string;
  phase: number;
};

export function PhasePlaceholder({
  title,
  description,
  phase,
}: PhasePlaceholderProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Coming in Phase {phase}
      </p>
      <h2 className="mt-3 font-heading text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {description}
      </p>
      <div className="mt-6">
        <ButtonLink href="/admin/dashboard" variant="outline">
          Back to dashboard
          <ArrowRight className="size-4" data-icon="inline-end" />
        </ButtonLink>
      </div>
    </div>
  );
}
