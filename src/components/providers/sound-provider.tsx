"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type SoundName = "click" | "whoosh";

type SoundContextValue = {
  muted: boolean;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  play: (name: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);
const STORAGE_KEY = "portfolio-sound-muted";
const MUTE_EVENT = "portfolio-sound-mute-change";

function subscribeMute(onStoreChange: () => void) {
  window.addEventListener(MUTE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(MUTE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getMuteSnapshot() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== "false";
  } catch {
    return true;
  }
}

function getMuteServerSnapshot() {
  return true;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scheduleGain(
  gain: GainNode,
  ctx: AudioContext,
  peak: number,
  attack: number,
  release: number,
) {
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);
}

/** Soft whoosh / transition */
function playWhoosh(ctx: AudioContext) {
  const now = ctx.currentTime;
  const bufferSize = Math.floor(ctx.sampleRate * 0.28);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
  }
  const noise = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  noise.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(1600, now + 0.22);
  filter.Q.value = 0.7;
  scheduleGain(gain, ctx, 0.12, 0.02, 0.22);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
}

const BGM_SRC = "/bg-music.mp3";
const BGM_VOLUME = 0.28;
const CLICK_SRC = "/clicks.mp3";
const CLICK_VOLUME = 0.5;

function playClickSample(ctx: AudioContext, buffer: AudioBuffer) {
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.value = CLICK_VOLUME;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const muted = useSyncExternalStore(
    subscribeMute,
    getMuteSnapshot,
    getMuteServerSnapshot,
  );
  const mutedRef = useRef(muted);
  const ctxRef = useRef<AudioContext | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const clickBufferRef = useRef<AudioBuffer | null>(null);
  const clickLoadRef = useRef<Promise<AudioBuffer | null> | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const ensureBgm = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!bgmRef.current) {
      const audio = new Audio(BGM_SRC);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = BGM_VOLUME;
      bgmRef.current = audio;
    }
    return bgmRef.current;
  }, []);

  const syncBgm = useCallback(async () => {
    const audio = ensureBgm();
    if (!audio) return;

    if (mutedRef.current || prefersReducedMotion()) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      // Autoplay blocked until a user gesture (unmute toggle).
    }
  }, [ensureBgm]);

  useEffect(() => {
    void syncBgm();
  }, [muted, syncBgm]);

  useEffect(() => {
    return () => {
      const audio = bgmRef.current;
      if (!audio) return;
      audio.pause();
      audio.src = "";
      bgmRef.current = null;
    };
  }, []);

  const setMuted = useCallback((next: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(MUTE_EVENT));
  }, []);

  const ensureContext = useCallback(async () => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === "suspended") {
      await ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const ensureClickBuffer = useCallback(async (ctx: AudioContext) => {
    if (clickBufferRef.current) return clickBufferRef.current;
    if (!clickLoadRef.current) {
      clickLoadRef.current = (async () => {
        try {
          const response = await fetch(CLICK_SRC);
          if (!response.ok) return null;
          const data = await response.arrayBuffer();
          const buffer = await ctx.decodeAudioData(data.slice(0));
          clickBufferRef.current = buffer;
          return buffer;
        } catch {
          clickLoadRef.current = null;
          return null;
        }
      })();
    }
    return clickLoadRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (mutedRef.current) return;
      if (prefersReducedMotion()) return;

      void (async () => {
        const ctx = await ensureContext();
        if (!ctx) return;

        if (name === "click") {
          const buffer = await ensureClickBuffer(ctx);
          if (buffer && !mutedRef.current) playClickSample(ctx, buffer);
          return;
        }
        playWhoosh(ctx);
      })();
    },
    [ensureContext, ensureClickBuffer],
  );

  const toggleMuted = useCallback(() => {
    const wasMuted = mutedRef.current;
    const nextMuted = !wasMuted;

    if (prefersReducedMotion()) {
      mutedRef.current = nextMuted;
      setMuted(nextMuted);
      if (nextMuted) bgmRef.current?.pause();
      else void syncBgm();
      return;
    }

    if (nextMuted) {
      // Still unmuted — play the normal click, then mute.
      play("click");
      mutedRef.current = true;
      setMuted(true);
      bgmRef.current?.pause();
      return;
    }

    // Unmuting — unlock audio, play click, then start BGM.
    mutedRef.current = false;
    setMuted(false);
    void (async () => {
      const ctx = await ensureContext();
      if (!ctx) return;
      const buffer = await ensureClickBuffer(ctx);
      if (buffer && !mutedRef.current) playClickSample(ctx, buffer);
      await syncBgm();
    })();
  }, [ensureContext, ensureClickBuffer, play, setMuted, syncBgm]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (mutedRef.current) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      // Toggle plays click itself so mute/unmute both get the same SFX
      if (target.closest("[data-sound-toggle]")) return;
      if (target.closest("a, button, [role='button'], summary, [data-slot='button']")) {
        play("click");
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [play]);

  const value = useMemo(
    () => ({ muted, setMuted, toggleMuted, play }),
    [muted, setMuted, toggleMuted, play],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    return {
      muted: true,
      setMuted: () => undefined,
      toggleMuted: () => undefined,
      play: () => undefined,
    };
  }
  return ctx;
}
