"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NavLink } from "@/components/navigation/nav-link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SocialLinks } from "@/components/shared/social-links";
import type { NavigationData, SiteConfig } from "@/types/cms";

const EASE = [0.16, 1, 0.3, 1] as const;

type MobileNavProps = {
  site: SiteConfig;
  navigation: NavigationData;
};

export function MobileNav({ site, navigation }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l border-border/70 bg-background/95 backdrop-blur-xl sm:max-w-sm"
      >
        <SheetHeader>
          <SheetTitle className="font-heading tracking-tight">{site.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-1 flex-col gap-8 overflow-y-auto px-4">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            <AnimatePresence>
              {open
                ? navigation.mainNav.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={
                        prefersReducedMotion
                          ? false
                          : { opacity: 0, x: 16 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.04 + index * 0.05,
                        duration: 0.4,
                        ease: EASE,
                      }}
                    >
                      <NavLink
                        item={item}
                        className="block rounded-lg px-3 py-3 text-lg after:hidden hover:bg-muted/60"
                        onClick={() => setOpen(false)}
                      />
                    </motion.div>
                  ))
                : null}
            </AnimatePresence>
          </nav>
          {navigation.utilityNav.length > 0 ? (
            <nav aria-label="More site links" className="flex flex-col gap-1">
              <p className="px-3 font-mono text-[10px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
                More
              </p>
              {navigation.utilityNav.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  className="block rounded-lg px-3 py-2.5 text-base text-muted-foreground after:hidden hover:bg-muted/60 hover:text-foreground"
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
          ) : null}
        </div>
        <div className="mt-auto border-t border-border/70 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <SocialLinks navigation={navigation} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
