import { cn } from "@/lib/utils";

type AmbientBackgroundProps = {
  className?: string;
};

/**
 * Static atmospheric backdrop: soft monochrome glows, grain and grid.
 *
 * It used to follow the mouse with parallax springs. Together with the
 * cursor glow, magnetic buttons and scroll progress bar that made the page
 * feel busy, so motion is now reserved for the hero orb, scroll reveals and
 * page transitions.
 */
export function AmbientBackground({ className }: AmbientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-background" />
      <div className="site-mesh absolute inset-0" />
      <div className="absolute -top-40 left-1/2 h-[560px] w-[780px] -translate-x-1/2 rounded-full bg-foreground/[0.055] blur-[130px]" />
      <div className="absolute right-[-10%] bottom-[6%] h-[380px] w-[380px] rounded-full bg-foreground/[0.035] blur-[110px]" />
      <div className="absolute top-[35%] left-[-12%] h-[280px] w-[280px] rounded-full bg-foreground/[0.025] blur-[90px]" />
      <div className="site-noise absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" />
      <div className="absolute inset-0 bg-grid opacity-25 [mask-image:radial-gradient(70%_55%_at_50%_20%,#000,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_95%)]" />
    </div>
  );
}
