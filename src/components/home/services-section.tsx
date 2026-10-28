import { Wrench } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
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
    <ul className="grid gap-10 md:grid-cols-3">
      {services.map((service) => {
        const Icon = resolveLucideIcon(service.icon) ?? Wrench;

        return (
          <li key={service.id}>
            <Reveal className="h-full border-t border-border pt-5">
              <Icon className="size-5 text-signal" aria-hidden="true" />
              <h3 className="mt-4 font-medium text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
