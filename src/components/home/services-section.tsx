import { Wrench } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Text } from "@/components/typography/text";
import { resolveLucideIcon } from "@/lib/icons";
import type { ServiceRecord } from "@/types/cms";

type ServicesSectionProps = {
  services: ServiceRecord[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  if (!services.length) {
    return null;
  }

  return (
    <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
      {services.map((service) => {
        const Icon = resolveLucideIcon(service.icon) ?? Wrench;

        return (
          <StaggerItem key={service.id}>
            <div className="site-card group h-full rounded-2xl p-6">
              <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-foreground transition-all duration-300 group-hover:scale-105 group-hover:bg-surface-elevated">
                <Icon className="size-5" aria-hidden />
              </div>
              <Text className="mb-2 font-heading font-medium tracking-tight">
                {service.title}
              </Text>
              <Text size="sm" muted leading="relaxed">
                {service.description}
              </Text>
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
