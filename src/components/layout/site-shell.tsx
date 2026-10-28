import { CommandMenuProvider } from "@/components/command/command-menu-provider";
import {
  CommandPalette,
  CommandPaletteShortcuts,
} from "@/components/command/command-palette";
import { KeyboardShortcutsDialog } from "@/components/command/keyboard-shortcuts-dialog";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MainContent } from "@/components/layout/main-content";
import { SkipLink } from "@/components/layout/skip-link";
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
    <div className="site-shell relative flex min-h-full w-full max-w-full flex-1 flex-col overflow-x-clip">
      <CommandMenuProvider>
        <SkipLink />
        <Header site={site} navigation={navigation} />
        <MainContent>{children}</MainContent>
        <Footer site={site} navigation={navigation} />
        <CommandPalette searchIndex={searchIndex} />
        <CommandPaletteShortcuts />
        <KeyboardShortcutsDialog />
      </CommandMenuProvider>
    </div>
  );
}
