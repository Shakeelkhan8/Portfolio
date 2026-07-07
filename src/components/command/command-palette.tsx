"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  FileText,
  FolderKanban,
  Home,
  Mail,
  User,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { routes } from "@/config/navigation";
import { useCommandMenu } from "@/components/command/command-menu-provider";
import type { SearchResult } from "@/types";

const iconMap: Record<SearchResult["type"], typeof Home> = {
  page: FileText,
  project: FolderKanban,
  article: BookOpen,
};

const navigationItems = [
  { label: "Home", href: routes.home, icon: Home, shortcut: "G H" },
  { label: "About", href: routes.about, icon: User, shortcut: "G A" },
  { label: "Projects", href: routes.projects, icon: FolderKanban, shortcut: "G P" },
  { label: "Writing", href: routes.writing, icon: BookOpen, shortcut: "G W" },
  { label: "Experience", href: routes.experience, icon: Briefcase, shortcut: "G E" },
  { label: "Contact", href: routes.contact, icon: Mail, shortcut: "G C" },
];

type CommandPaletteProps = {
  searchIndex: SearchResult[];
};

export function CommandPalette({ searchIndex }: CommandPaletteProps) {
  const router = useRouter();
  const { commandOpen, setCommandOpen } = useCommandMenu();

  const grouped = {
    pages: searchIndex.filter((item) => item.type === "page"),
    projects: searchIndex.filter((item) => item.type === "project"),
    articles: searchIndex.filter((item) => item.type === "article"),
  };

  const navHrefs = new Set<string>(navigationItems.map((item) => item.href));
  const customPages = grouped.pages.filter(
    (item) => item.id.startsWith("page-") && !navHrefs.has(item.href),
  );

  function navigate(href: string) {
    setCommandOpen(false);
    router.push(href);
  }

  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={setCommandOpen}
      title="Command palette"
      description="Search pages, projects, and articles"
    >
      <CommandInput placeholder="Search portfolio..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.href}
              value={`nav ${item.label}`}
              onSelect={() => navigate(item.href)}
            >
              <item.icon />
              {item.label}
              <CommandShortcut>{item.shortcut}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        {customPages.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Pages">
              {customPages.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.title} ${item.description}`}
                  onSelect={() => navigate(item.href)}
                >
                  <FileText />
                  <span className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}

        {grouped.projects.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {grouped.projects.map((item) => {
                const Icon = iconMap[item.type];
                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.description}`}
                    onSelect={() => navigate(item.href)}
                  >
                    <Icon />
                    <span className="flex flex-col">
                      <span>{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        ) : null}

        {grouped.articles.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Writing">
              {grouped.articles.map((item) => {
                const Icon = iconMap[item.type];
                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.description}`}
                    onSelect={() => navigate(item.href)}
                  >
                    <Icon />
                    {item.title}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}

export function CommandPaletteShortcuts() {
  const router = useRouter();
  const { commandOpen, setCommandOpen } = useCommandMenu();
  const pendingKey = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function clearSequence() {
      pendingKey.current = null;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(!commandOpen);
        return;
      }

      if (isEditable) return;

      if (event.key === "?") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("open-keyboard-shortcuts"));
        return;
      }

      if (event.key.toLowerCase() === "g") {
        pendingKey.current = "g";
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(clearSequence, 1000);
        return;
      }

      if (pendingKey.current === "g") {
        const key = event.key.toLowerCase();
        clearSequence();

        const routeMap: Record<string, string> = {
          h: routes.home,
          a: routes.about,
          p: routes.projects,
          w: routes.writing,
          e: routes.experience,
          c: routes.contact,
        };

        if (routeMap[key]) {
          event.preventDefault();
          router.push(routeMap[key]);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearSequence();
    };
  }, [commandOpen, router, setCommandOpen]);

  return null;
}
