import { IBM_Plex_Sans, JetBrains_Mono, Mona_Sans } from "next/font/google";

/**
 * Display: Mona Sans (GitHub, SIL OFL), a variable grotesque with weight and
 * width axes. Headlines use its semi-expanded width (`font-stretch-semi-expanded`),
 * which gives the type a voice of its own; Space Grotesk, the previous
 * display face, is one of the most common "developer portfolio" fonts.
 * Preloaded because the hero headline is above the fold on every visit.
 *
 * Body: IBM Plex Sans (preloaded for LCP). Data and labels: JetBrains Mono.
 */
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  preload: true,
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

export const fontVariables = [
  monaSans.variable,
  ibmPlexSans.variable,
  jetbrainsMono.variable,
].join(" ");
