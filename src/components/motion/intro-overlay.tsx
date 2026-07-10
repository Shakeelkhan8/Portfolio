"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSound } from "@/components/providers/sound-provider";

const SESSION_KEY = "portfolio-intro-seen";
const DISMISS_EVENT = "portfolio-intro-dismiss";

type IntroOverlayProps = {
  siteName: string;
};

function subscribeIntro(onStoreChange: () => void) {
  window.addEventListener(DISMISS_EVENT, onStoreChange);
  return () => window.removeEventListener(DISMISS_EVENT, onStoreChange);
}

function getIntroSnapshot() {
  try {
    return sessionStorage.getItem(SESSION_KEY) !== "1";
  } catch {
    return false;
  }
}

function getIntroServerSnapshot() {
  return false;
}

/**
 * Brief cinematic black veil — clears quickly so the hero orb opening
 * is the main entrance (aligned with immersive agency pacing).
 */
export function IntroOverlay({ siteName }: IntroOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const { play } = useSound();
  const pending = useSyncExternalStore(
    subscribeIntro,
    getIntroSnapshot,
    getIntroServerSnapshot,
  );
  const show = Boolean(pending && !prefersReducedMotion);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    play("whoosh");
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }, [play]);

  useEffect(() => {
    if (!show) return;
    // Short veil so the orb entrance is visible almost immediately
    const timer = window.setTimeout(dismiss, 700);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dismiss();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [show, dismiss]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[180] cursor-pointer bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          onClick={dismiss}
          role="dialog"
          aria-label={`Welcome to ${siteName}`}
          aria-modal="true"
        />
      ) : null}
    </AnimatePresence>
  );
}
