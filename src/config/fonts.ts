import {
  IBM_Plex_Sans,
  JetBrains_Mono,
  Newsreader,
  Space_Grotesk,
} from "next/font/google";

// Body and display fonts are preloaded: the home page's LCP element is a
// Newsreader heading. Space Grotesk is the admin panel's heading face and is
// only downloaded when admin pages render it.
// Upright only and no optical-size axis: italics are unused, and the opsz axis
// roughly doubles the file for a refinement few readers would notice.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

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
  newsreader.variable,
  spaceGrotesk.variable,
  ibmPlexSans.variable,
  jetbrainsMono.variable,
].join(" ");
