import { CommandMenuProvider } from "@/components/command/command-menu-provider";
import { CommandPalette, CommandPaletteShortcuts } from "@/components/command/command-palette";
import { KeyboardShortcutsDialog } from "@/components/command/keyboard-shortcuts-dialog";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MainContent } from "@/components/layout/main-content";
import { SkipLink } from "@/components/layout/skip-link";
import { AmbientBackground } from "@/components/motion/ambient-background";
import { CursorGlow } from "@/components/motion/cursor-glow";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { MobileTabBar } from "@/components/navigation/mobile-tab-bar";
import { SoundProvider } from "@/components/providers/sound-provider";
import type { NavigationData, SiteConfig } from "@/types/cms";
import type { SearchResult } from "@/types";

type SiteShellProps = {
  children: React.ReactNode;
  site: SiteConfig;
  navigation: NavigationData;
  searchIndex: SearchResult[];
};

export function SiteShell({
  children,
  site,
  navigation,
  searchIndex,
}: SiteShellProps) {
  return (
    <SoundProvider>
      <div className="site-shell relative flex min-h-full w-full max-w-full flex-1 flex-col overflow-x-clip pb-[calc(var(--mobile-tab-bar-height)+env(safe-area-inset-bottom))] md:pb-0">
        <AmbientBackground />
        <CursorGlow />
        <ScrollProgress />
        <CommandMenuProvider>
          <SkipLink />
          <Header site={site} navigation={navigation} />
          <MainContent>{children}</MainContent>
          <Footer site={site} navigation={navigation} />
          <MobileTabBar site={site} navigation={navigation} />
          <CommandPalette searchIndex={searchIndex} />
          <CommandPaletteShortcuts />
          <KeyboardShortcutsDialog />
        </CommandMenuProvider>
      </div>
    </SoundProvider>
  );
}
