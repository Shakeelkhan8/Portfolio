"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NavLink } from "@/components/navigation/nav-link";
import { SocialLinks } from "@/components/shared/social-links";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { NavigationData, SiteConfig } from "@/types/cms";

const EASE = [0.16, 1, 0.3, 1] as const;

type MobileNavSheetProps = {
  site: SiteConfig;
  navigation: NavigationData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Full-height immersive menu — used by the tab bar “More” and header menu.
 */
export function MobileNavSheet({
  site,
  navigation,
  open,
  onOpenChange,
}: MobileNavSheetProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex h-[min(92dvh,40rem)] w-full flex-col rounded-t-3xl border-border/70 bg-background/96 px-0 pb-0 backdrop-blur-2xl sm:max-w-none"
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2 mb-1 h-1 w-10 shrink-0 rounded-full bg-foreground/20"
        />
        <SheetHeader className="px-5 pb-2 text-left">
          <SheetTitle className="font-heading text-xl tracking-tight">
            {site.name}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">{site.title}</p>
        </SheetHeader>

        <div className="mt-2 flex flex-1 flex-col gap-8 overflow-y-auto overscroll-contain px-3 pb-4">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-0.5">
            <AnimatePresence>
              {open
                ? navigation.mainNav.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.03 + index * 0.04,
                        duration: 0.38,
                        ease: EASE,
                      }}
                    >
                      <NavLink
                        item={item}
                        className="block min-h-12 rounded-2xl px-4 py-3.5 text-lg font-medium after:hidden active:bg-muted/70"
                        onClick={() => onOpenChange(false)}
                      />
                    </motion.div>
                  ))
                : null}
            </AnimatePresence>
          </nav>

          {navigation.utilityNav.length > 0 ? (
            <nav aria-label="More site links" className="flex flex-col gap-1">
              <p className="px-4 font-mono text-[10px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
                More
              </p>
              {navigation.utilityNav.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  className="block min-h-11 rounded-2xl px-4 py-3 text-base text-muted-foreground after:hidden active:bg-muted/60 active:text-foreground"
                  onClick={() => onOpenChange(false)}
                />
              ))}
            </nav>
          ) : null}
        </div>

        <div className="mt-auto border-t border-border/60 px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <SocialLinks navigation={navigation} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
