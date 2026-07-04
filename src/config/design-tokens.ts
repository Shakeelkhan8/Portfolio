/**
 * Design tokens — source of truth for the design system.
 * CSS custom properties in globals.css mirror these values.
 */

export const colors = {
  light: {
    background: "#fafafa",
    foreground: "#171717",
    muted: "#737373",
    mutedForeground: "#525252",
    border: "#e5e5e5",
    borderSubtle: "#f0f0f0",
    surface: "#ffffff",
    surfaceElevated: "#ffffff",
    accent: "#2563eb",
    accentForeground: "#ffffff",
    accentMuted: "#eff6ff",
    success: "#16a34a",
    successMuted: "#f0fdf4",
    ring: "#2563eb",
  },
  dark: {
    background: "#0a0a0a",
    foreground: "#ededed",
    muted: "#a3a3a3",
    mutedForeground: "#d4d4d4",
    border: "#262626",
    borderSubtle: "#1a1a1a",
    surface: "#141414",
    surfaceElevated: "#1a1a1a",
    accent: "#60a5fa",
    accentForeground: "#0a0a0a",
    accentMuted: "#172554",
    success: "#4ade80",
    successMuted: "#052e16",
    ring: "#60a5fa",
  },
} as const;

export const typography = {
  fonts: {
    sans: "var(--font-geist-sans), var(--font-inter), system-ui, sans-serif",
    mono: "var(--font-jetbrains-mono), var(--font-geist-mono), monospace",
  },
  sizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },
  lineHeights: {
    tight: "1.15",
    snug: "1.3",
    normal: "1.5",
    relaxed: "1.625",
    loose: "1.75",
  },
  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
  proseWidth: "680px",
  maxWidth: {
    content: "1120px",
    wide: "1280px",
  },
} as const;

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  section: "6rem",
  sectionSm: "4rem",
} as const;

export const radius = {
  none: "0",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  full: "9999px",
} as const;

export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.06)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.06), 0 8px 10px -6px rgb(0 0 0 / 0.06)",
} as const;

export const motion = {
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",
    slower: "600ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  distance: {
    sm: "8px",
    md: "16px",
    lg: "24px",
  },
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const zIndex = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  overlay: 200,
  modal: 300,
  toast: 400,
} as const;

/** Combined export for convenience */
export const designTokens = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  motion,
  breakpoints,
  zIndex,
} as const;

export type DesignTokens = typeof designTokens;
