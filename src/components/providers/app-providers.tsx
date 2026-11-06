import { MotionProvider } from "@/components/motion/motion-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

type AppProvidersProps = {
  children: React.ReactNode;
};

/**
 * The site is dark-only: `<html class="dark">` and the `color-scheme`
 * viewport setting are rendered by the root layout, so no theme provider
 * (or its bootstrap script) is needed.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MotionProvider>
      <TooltipProvider delay={300}>{children}</TooltipProvider>
    </MotionProvider>
  );
}
