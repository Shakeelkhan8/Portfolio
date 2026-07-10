import { IBM_Plex_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";

// Body font is preloaded for LCP. Display/mono fonts stay available via CSS
// variables but skip preload to avoid unused-preload console warnings.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  preload: false,
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
  spaceGrotesk.variable,
  ibmPlexSans.variable,
  jetbrainsMono.variable,
].join(" ");
