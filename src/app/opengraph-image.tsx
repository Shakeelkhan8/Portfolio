import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/content";

// Use the Node.js runtime: the Edge runtime has a 1 MB bundle limit on Vercel,
// and next/og's ImageResponse (WASM renderer + font handling) exceeds it.
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata() {
  const site = await getSiteConfig();
  return [
    {
      id: "default",
      alt: `${site.name} — ${site.title}`,
    },
  ];
}

export default async function OpenGraphImage() {
  const site = await getSiteConfig();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1e293b 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#60a5fa",
            marginBottom: 16,
          }}
        >
          {site.title}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a3a3a3",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          {site.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
