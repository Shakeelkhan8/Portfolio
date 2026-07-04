import { siteConfig } from "@/config/site";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";

export function ExpertiseGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {siteConfig.expertise.map((item, index) => (
        <FadeIn key={item} delay={index * 0.05}>
          <Card className="h-full border-border/60 bg-surface">
            <CardHeader>
              <CardTitle className="text-base font-medium">{item}</CardTitle>
            </CardHeader>
          </Card>
        </FadeIn>
      ))}
    </div>
  );
}
