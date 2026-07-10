"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { HERO } from "@/components/motion/hero-timeline";
import { cn } from "@/lib/utils";

type Vec3 = { x: number; y: number; z: number; w: number; seed: number };

type Mote = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  phase: number;
  elev: number;
};

type HeroOrbProps = {
  className?: string;
};

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - 2 ** (-10 * clamp01(t));
}

function easeInOutCubic(t: number) {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

function easeInOutQuint(t: number) {
  const x = clamp01(t);
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - (-2 * x + 2) ** 5 / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function fibonacciSphere(count: number, radius: number): Vec3[] {
  const pts: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const rAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const shell = 0.88 + ((i * 19) % 13) * 0.01;
    pts.push({
      x: Math.cos(theta) * rAtY * radius * shell,
      y: y * radius * shell,
      z: Math.sin(theta) * rAtY * radius * shell,
      w: 0.45 + ((i * 11) % 10) * 0.055,
      seed: i * 0.6180339887,
    });
  }
  return pts;
}

function rotateY(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return {
    x: p.x * c + p.z * s,
    y: p.y,
    z: -p.x * s + p.z * c,
    w: p.w,
    seed: p.seed,
  };
}

function rotateX(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return {
    x: p.x,
    y: p.y * c - p.z * s,
    z: p.y * s + p.z * c,
    w: p.w,
    seed: p.seed,
  };
}

/**
 * Cinematic particle star — first light → birth → cosmic dance.
 * Timeline locked to HERO beats so typography can choreograph with it.
 */
export function HeroOrb({ className }: HeroOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let raf = 0;
    let running = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let shell: Vec3[] = [];
    let motes: Mote[] = [];
    let dust: Array<{ x: number; y: number; r: number; a: number; s: number }> =
      [];
    let start = performance.now();
    let mouseTX = 0;
    let mouseTY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let ringProgress = 0;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent!.clientWidth;
      height = parent!.clientHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = mobile ? 920 : 2100;
      const baseR = Math.min(width, height) * (mobile ? 0.31 : 0.36);
      shell = fibonacciSphere(count, baseR);

      const moteCount = mobile ? 14 : 28;
      motes = Array.from({ length: moteCount }, (_, i) => ({
        angle: (i / moteCount) * Math.PI * 2,
        radius: baseR * (1.08 + (i % 6) * 0.07),
        speed: 0.1 + (i % 5) * 0.035,
        size: 0.55 + (i % 4) * 0.28,
        phase: i * 1.618,
        elev: 0.38 + (i % 3) * 0.08,
      }));

      const dustCount = mobile ? 40 : 90;
      dust = Array.from({ length: dustCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.1,
        a: 0.02 + Math.random() * 0.05,
        s: 0.15 + Math.random() * 0.35,
      }));
    }

    function onMove(e: PointerEvent) {
      if (!fine) return;
      const rect = canvas!.getBoundingClientRect();
      mouseTX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseTY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }

    function drawFrame(now: number) {
      if (!running) return;
      const t = (now - start) / 1000;

      mouseX += (mouseTX - mouseX) * 0.025;
      mouseY += (mouseTY - mouseY) * 0.025;

      const spark = prefersReducedMotion
        ? 1
        : easeOutExpo(clamp01((t - HERO.silence) / (HERO.spark - HERO.silence)));
      const gather = prefersReducedMotion
        ? 1
        : easeInOutQuint(clamp01((t - HERO.spark) / (HERO.gather - HERO.spark)));
      const awaken = prefersReducedMotion
        ? 1
        : easeInOutCubic(
            clamp01((t - HERO.gather) / (HERO.awaken - HERO.gather)),
          );
      const live = prefersReducedMotion
        ? 1
        : easeOutExpo(clamp01((t - HERO.awaken) / (HERO.live - HERO.awaken)));

      const form = clamp01(gather * 0.5 + awaken * 0.5);
      const worldScale = lerp(
        0.06,
        1.02,
        easeInOutQuint(awaken * 0.88 + live * 0.12),
      );
      const presence = spark;
      const breath = live > 0.8 ? 1 + Math.sin(t * 0.42) * 0.012 : 1;
      const scale = worldScale * breath;

      // Cosmic waltz — two tempos, never a flat spin
      const waltz = t * (0.11 + (1 - awaken) * 0.18);
      const sway = t * 0.075;
      const rotY =
        waltz * 1.2 +
        Math.sin(sway) * 0.42 * gather +
        Math.sin(t * 0.23) * 0.08 * live +
        mouseX * 0.2;
      const rotX =
        Math.sin(t * 0.15) * 0.18 * gather +
        Math.cos(t * 0.095) * 0.1 * gather +
        mouseY * 0.11;

      const cx = width * 0.5 + mouseX * 8;
      const cy = height * 0.46 + mouseY * 5;
      const perspective = Math.min(width, height) * 1.85;

      ctx!.clearRect(0, 0, width, height);

      if (t < HERO.silence && !prefersReducedMotion) {
        raf = requestAnimationFrame(drawFrame);
        return;
      }

      if (presence < 0.01) {
        raf = requestAnimationFrame(drawFrame);
        return;
      }

      // Far dust — depth of space
      if (gather > 0.05) {
        for (let i = 0; i < dust.length; i++) {
          const d = dust[i]!;
          const dx = (d.x + t * d.s * 4) % width;
          const dy = (d.y + Math.sin(t * 0.2 + i) * 2 + height) % height;
          ctx!.beginPath();
          ctx!.fillStyle = `rgba(255,255,255,${d.a * presence * gather})`;
          ctx!.arc(dx, dy, d.r, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Soft nebula atmosphere
      const atmR = Math.min(width, height) * (0.22 + awaken * 0.42) * scale;
      const atm = ctx!.createRadialGradient(cx, cy, 0, cx, cy, atmR);
      atm.addColorStop(0, `rgba(255,255,255,${0.065 * presence * spark})`);
      atm.addColorStop(0.35, `rgba(255,255,255,${0.022 * presence})`);
      atm.addColorStop(0.7, `rgba(255,255,255,${0.006 * presence})`);
      atm.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = atm;
      ctx!.fillRect(0, 0, width, height);

      // Living heart of creation
      const corePulse =
        spark < 1
          ? 0.65 + Math.sin(t * 3.4) * 0.35
          : 0.82 + Math.sin(t * 0.85) * 0.18;
      const coreR =
        Math.min(width, height) *
        (0.016 + spark * 0.038 + awaken * 0.055) *
        scale;
      const heart = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.6);
      heart.addColorStop(
        0,
        `rgba(255,255,255,${0.82 * presence * corePulse})`,
      );
      heart.addColorStop(
        0.1,
        `rgba(255,255,255,${0.32 * presence * spark})`,
      );
      heart.addColorStop(0.28, `rgba(255,255,255,${0.09 * presence})`);
      heart.addColorStop(0.55, `rgba(255,255,255,${0.025 * presence})`);
      heart.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = heart;
      ctx!.beginPath();
      ctx!.arc(cx, cy, coreR * 3.6, 0, Math.PI * 2);
      ctx!.fill();

      // Single intentional orbit — draws during gathering
      if (!mobile && gather > 0.02) {
        ringProgress = Math.max(ringProgress, gather);
        const ringR = Math.min(width, height) * 0.37 * scale;
        ctx!.save();
        ctx!.translate(cx, cy);
        ctx!.rotate(t * 0.065 + Math.sin(t * 0.2) * 0.05);
        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(255,255,255,${0.12 * presence * gather})`;
        ctx!.lineWidth = 0.85;
        ctx!.ellipse(
          0,
          0,
          ringR,
          ringR * 0.4,
          0.38,
          -Math.PI * 0.12,
          -Math.PI * 0.12 + Math.PI * 2 * ringProgress,
        );
        ctx!.stroke();
        ctx!.restore();
      }

      // Shell — born from the spark
      type Proj = { x: number; y: number; z: number; r: number; a: number };
      const projected: Proj[] = new Array(shell.length);

      for (let i = 0; i < shell.length; i++) {
        const src = shell[i]!;
        const delay = (src.seed % 1) * 0.5;
        const localForm = easeOutExpo(
          clamp01((form - delay) / Math.max(0.15, 1 - delay * 0.45)),
        );

        const bx = src.x * 0.03;
        const by = src.y * 0.03;
        const bz = src.z * 0.03;
        let v: Vec3 = {
          x: lerp(bx, src.x, localForm),
          y: lerp(by, src.y, localForm),
          z: lerp(bz, src.z, localForm),
          w: src.w,
          seed: src.seed,
        };

        v = rotateY(v, rotY);
        v = rotateX(v, rotX);

        const life =
          Math.sin(t * 0.85 + src.seed * 6.2) *
          0.45 *
          (0.2 + gather * 0.8);
        v = {
          x: (v.x + life * 0.12) * scale,
          y: (v.y + life * 0.08) * scale,
          z: v.z * scale,
          w: v.w,
          seed: v.seed,
        };

        const depth = perspective / (perspective + v.z);
        const fog = clamp01((v.z + Math.min(width, height) * 0.4) /
          (Math.min(width, height) * 0.8));
        const born = localForm * presence;
        projected[i] = {
          x: cx + v.x * depth,
          y: cy + v.y * depth,
          z: v.z,
          r: Math.max(0.22, depth * v.w * (mobile ? 0.72 : 0.95)),
          a:
            (0.12 + depth * 0.72) *
            born *
            (0.55 + awaken * 0.45) *
            (0.55 + fog * 0.45),
        };
      }

      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i]!;
        if (p.a < 0.018) continue;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Orbiting light motes
      if (gather > 0.12) {
        for (let i = 0; i < motes.length; i++) {
          const e = motes[i]!;
          const ang = e.angle + t * e.speed * (0.55 + awaken * 0.55);
          const er = e.radius * scale * (0.92 + gather * 0.12);
          const ex = cx + Math.cos(ang) * er;
          const ey =
            cy +
            Math.sin(ang) * er * e.elev +
            Math.sin(t * 0.6 + e.phase) * 3;
          const ea =
            (0.1 + Math.sin(t * 1.3 + e.phase) * 0.07) * presence * gather;
          ctx!.beginPath();
          ctx!.fillStyle = `rgba(255,255,255,${ea})`;
          ctx!.arc(ex, ey, e.size, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Awakening bloom — one brief, powerful moment
      if (!prefersReducedMotion && awaken > 0.7 && awaken < 0.95) {
        const peak = 1 - Math.abs(awaken - 0.82) / 0.13;
        const bloom = Math.max(0, peak) ** 2 * 0.13 * presence;
        if (bloom > 0.002) {
          const g = ctx!.createRadialGradient(
            cx,
            cy,
            0,
            cx,
            cy,
            Math.min(width, height) * 0.58 * scale,
          );
          g.addColorStop(0, `rgba(255,255,255,${bloom})`);
          g.addColorStop(0.35, `rgba(255,255,255,${bloom * 0.28})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx!.fillStyle = g;
          ctx!.fillRect(0, 0, width, height);
        }
      }

      raf = requestAnimationFrame(drawFrame);
    }

    function drawStatic() {
      const cx = width * 0.5;
      const cy = height * 0.46;
      ctx!.clearRect(0, 0, width, height);
      const g = ctx!.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        Math.min(width, height) * 0.4,
      );
      g.addColorStop(0, "rgba(255,255,255,0.35)");
      g.addColorStop(0.28, "rgba(255,255,255,0.09)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, width, height);
      for (const p of shell) {
        ctx!.beginPath();
        ctx!.fillStyle = "rgba(255,255,255,0.5)";
        ctx!.arc(cx + p.x, cy + p.y * 0.95, 0.8, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        running = Boolean(entry?.isIntersecting);
        if (running && !prefersReducedMotion) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(drawFrame);
        }
      },
      { threshold: 0.02 },
    );
    io.observe(parent);

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });

    if (prefersReducedMotion) {
      drawStatic();
    } else {
      start = performance.now();
      raf = requestAnimationFrame(drawFrame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    />
  );
}

export const HeroField = HeroOrb;
