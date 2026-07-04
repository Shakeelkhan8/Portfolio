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
import { mainNav, utilityNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/components/shared/social-links";

export function MobileNav() {
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
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <nav
          aria-label="Mobile navigation"
          className="mt-8 flex flex-col gap-4"
        >
          {[...mainNav, ...utilityNav].map((item) => (
            <NavLink
              key={item.href}
              item={item}
              className="text-lg"
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
        <div className="mt-auto border-t border-border pt-6">
          <SocialLinks />
        </div>
      </SheetContent>
    </Sheet>
  );
}
