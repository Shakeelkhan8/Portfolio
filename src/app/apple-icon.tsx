import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/content";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export default async function AppleIcon() {
  const site = await getSiteConfig();
  const initials = getInitials(site.name);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          padding: 14,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid #f5f5f5",
            borderRadius: 28,
            color: "#f5f5f5",
            fontSize: 72,
            fontWeight: 700,
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          {initials}
        </div>
      </div>
    ),
    { ...size },
  );
}
