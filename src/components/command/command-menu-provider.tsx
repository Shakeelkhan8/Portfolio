"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CommandMenuContextValue = {
  commandOpen: boolean;
  shortcutsOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  setShortcutsOpen: (open: boolean) => void;
};

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const value = useMemo(
    () => ({
      commandOpen,
      shortcutsOpen,
      setCommandOpen,
      setShortcutsOpen,
    }),
    [commandOpen, shortcutsOpen],
  );

  return (
    <CommandMenuContext.Provider value={value}>
      {children}
    </CommandMenuContext.Provider>
  );
}

export function useCommandMenu() {
  const context = useContext(CommandMenuContext);
  if (!context) {
    throw new Error("useCommandMenu must be used within CommandMenuProvider");
  }
  return context;
}

export function useCommandMenuSafe() {
  return useContext(CommandMenuContext);
}

export function useCommandActions() {
  const context = useCommandMenuSafe();

  const openCommand = useCallback(() => {
    context?.setCommandOpen(true);
  }, [context]);

  const openShortcuts = useCallback(() => {
    context?.setShortcutsOpen(true);
  }, [context]);

  return { openCommand, openShortcuts, context };
}
