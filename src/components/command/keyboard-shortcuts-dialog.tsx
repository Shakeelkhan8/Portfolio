"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCommandMenu } from "@/components/command/command-menu-provider";

const shortcuts = [
  { keys: ["⌘", "K"], description: "Open command palette" },
  { keys: ["Ctrl", "K"], description: "Open command palette (Windows)" },
  { keys: ["G", "H"], description: "Go to Home" },
  { keys: ["G", "A"], description: "Go to About" },
  { keys: ["G", "P"], description: "Go to Projects" },
  { keys: ["G", "W"], description: "Go to Writing" },
  { keys: ["G", "E"], description: "Go to Experience" },
  { keys: ["G", "C"], description: "Go to Contact" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
];

export function KeyboardShortcutsDialog() {
  const { shortcutsOpen, setShortcutsOpen } = useCommandMenu();

  useEffect(() => {
    function handleOpen() {
      setShortcutsOpen(true);
    }

    window.addEventListener("open-keyboard-shortcuts", handleOpen);
    return () =>
      window.removeEventListener("open-keyboard-shortcuts", handleOpen);
  }, [setShortcutsOpen]);

  return (
    <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Navigate the portfolio without touching the mouse.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
