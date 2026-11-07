"use client";

import { useEffect } from "react";

/**
 * Opens every closed <details> on the page while it prints (button or Ctrl+P)
 * and closes them again afterwards, so the printed resume includes the full
 * web resume. Print CSS alone is not enough in every browser: see the
 * ::details-content rule in globals.css.
 */
export function ExpandDetailsWhilePrinting() {
  useEffect(() => {
    let opened: HTMLDetailsElement[] = [];

    const expand = () => {
      opened = Array.from(
        document.querySelectorAll<HTMLDetailsElement>("details:not([open])"),
      );
      for (const element of opened) element.open = true;
    };

    const restore = () => {
      for (const element of opened) element.open = false;
      opened = [];
    };

    window.addEventListener("beforeprint", expand);
    window.addEventListener("afterprint", restore);
    return () => {
      window.removeEventListener("beforeprint", expand);
      window.removeEventListener("afterprint", restore);
    };
  }, []);

  return null;
}
