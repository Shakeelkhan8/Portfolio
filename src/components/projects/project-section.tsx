import type { ReactNode } from "react";
import { Heading } from "@/components/typography/heading";

type ProjectSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function ProjectSection({ id, title, children }: ProjectSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <Heading as="h2" size="md">
        {title}
      </Heading>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}
