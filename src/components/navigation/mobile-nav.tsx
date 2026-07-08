"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
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

type MobileNavProps = {
  site: SiteConfig;
  navigation: NavigationData;
};

export function MobileNav({ site, navigation }: MobileNavProps) {
  const [open, setOpen] = useState(false);

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
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{site.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-1 flex-col gap-8 overflow-y-auto px-4">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navigation.mainNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                className="block rounded-md px-3 py-2.5 text-lg after:hidden hover:bg-muted"
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>
          {navigation.utilityNav.length > 0 ? (
            <nav aria-label="More site links" className="flex flex-col gap-1">
              <p className="px-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                More
              </p>
              {navigation.utilityNav.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  className="block rounded-md px-3 py-2.5 text-base text-muted-foreground after:hidden hover:bg-muted hover:text-foreground"
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
          ) : null}
        </div>
        <div className="mt-auto border-t border-border px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <SocialLinks navigation={navigation} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
