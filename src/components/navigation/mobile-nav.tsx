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
            className="md:hidden"
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
        <nav
          aria-label="Mobile navigation"
          className="mt-8 flex flex-col gap-4"
        >
          {[...navigation.mainNav, ...navigation.utilityNav].map((item) => (
            <NavLink
              key={item.href}
              item={item}
              className="text-lg"
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
        <div className="mt-auto border-t border-border pt-6">
          <SocialLinks navigation={navigation} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
