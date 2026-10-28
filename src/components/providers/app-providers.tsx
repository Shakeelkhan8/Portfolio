import { TooltipProvider } from "@/components/ui/tooltip";

type AppProvidersProps = {
  children: React.ReactNode;
};

/**
 * Providers shared by the public site and the admin panel. The forced dark
 * theme lives in `AdminProviders`: the public site follows the visitor's OS
 * colour scheme through CSS alone (see `globals.css`).
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <TooltipProvider delay={300}>{children}</TooltipProvider>;
}
