import { CommandMenuProvider } from "@/components/command/command-menu-provider";
import { CommandPalette, CommandPaletteShortcuts } from "@/components/command/command-palette";
import { KeyboardShortcutsDialog } from "@/components/command/keyboard-shortcuts-dialog";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MainContent } from "@/components/layout/main-content";
import { SkipLink } from "@/components/layout/skip-link";
import { AmbientBackground } from "@/components/motion/ambient-background";
import { MobileTabBar } from "@/components/navigation/mobile-tab-bar";
import { SocialRail } from "@/components/layout/social-rail";
import { SoundProvider } from "@/components/providers/sound-provider";
import type { NavigationData, PublicSiteConfig } from "@/types/cms";
import type { SearchResult } from "@/types";

type SiteShellProps = {
  children: React.ReactNode;
  site: PublicSiteConfig;
  navigation: NavigationData;
  searchIndex: SearchResult[];
  /** Active CMS resume PDF for the footer, or null. */
  resumeUrl?: string | null;
  /** Server-derived wa.me link for the social rail, or null. */
  whatsappHref?: string | null;
};

export function SiteShell({
  children,
  site,
  navigation,
  searchIndex,
  resumeUrl = null,
  whatsappHref = null,
}: SiteShellProps) {
  return (
    <SoundProvider>
      <div className="site-shell relative flex min-h-full w-full max-w-full flex-1 flex-col overflow-x-clip pb-[calc(var(--mobile-tab-bar-height)+env(safe-area-inset-bottom))] md:pb-0">
        <AmbientBackground />
        <CommandMenuProvider>
          <SkipLink />
          <Header site={site} navigation={navigation} />
          <SocialRail navigation={navigation} whatsappHref={whatsappHref} />
          <MainContent>{children}</MainContent>
          <Footer site={site} navigation={navigation} resumeUrl={resumeUrl} />
          <MobileTabBar site={site} navigation={navigation} />
          <CommandPalette searchIndex={searchIndex} />
          <CommandPaletteShortcuts />
          <KeyboardShortcutsDialog />
        </CommandMenuProvider>
      </div>
    </SoundProvider>
  );
}
