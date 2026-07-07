import { Wrench } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => {
        const Icon = resolveLucideIcon(service.icon) ?? Wrench;

        return (
          <FadeIn key={service.id} delay={index * 0.05}>
            <div className="h-full rounded-xl border border-border bg-surface p-6">
              <Icon className="mb-4 size-5 text-primary" aria-hidden />
              <Text className="mb-2 font-medium">{service.title}</Text>
              <Text size="sm" muted leading="relaxed">
                {service.description}
              </Text>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
