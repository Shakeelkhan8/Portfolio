import { CommandMenuProvider } from "@/components/command/command-menu-provider";
import { CommandPalette, CommandPaletteShortcuts } from "@/components/command/command-palette";
import { KeyboardShortcutsDialog } from "@/components/command/keyboard-shortcuts-dialog";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MainContent } from "@/components/layout/main-content";
import { SkipLink } from "@/components/layout/skip-link";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <CommandMenuProvider>
      <SkipLink />
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
      <CommandPalette />
      <CommandPaletteShortcuts />
      <KeyboardShortcutsDialog />
    </CommandMenuProvider>
  );
}
