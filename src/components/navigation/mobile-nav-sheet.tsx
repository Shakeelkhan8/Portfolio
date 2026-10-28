"use client";

import { NavLink } from "@/components/navigation/nav-link";
import { SocialLinks } from "@/components/shared/social-links";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { NavigationData, SiteConfig } from "@/types/cms";

type MobileNavSheetProps = {
  site: SiteConfig;
  navigation: NavigationData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Phone-width menu, opened from the header's "Menu" button. */
export function MobileNavSheet({
  site,
  navigation,
  open,
  onOpenChange,
}: MobileNavSheetProps) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(88vw,22rem)] gap-0 border-border bg-background px-0 pt-[env(safe-area-inset-top)]"
      >
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="font-heading text-lg">{site.name}</SheetTitle>
          <p className="text-sm text-muted-foreground">{site.title}</p>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-8 overflow-y-auto overscroll-contain px-3 py-4">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {navigation.mainNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onClick={close}
                className="block min-h-12 rounded-md px-3 py-3 text-lg after:hidden"
              />
            ))}
          </nav>

          {navigation.utilityNav.length > 0 ? (
            <nav aria-label="More site links" className="flex flex-col">
              <p className="label-mono px-3 pb-1">More</p>
              {navigation.utilityNav.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  onClick={close}
                  className="block min-h-11 rounded-md px-3 py-2.5 text-base after:hidden"
                />
              ))}
            </nav>
          ) : null}
        </div>

        <div className="border-t border-border px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <SocialLinks navigation={navigation} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
