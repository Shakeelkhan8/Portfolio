import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/content";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export default async function Icon() {
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
          padding: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid #f5f5f5",
            borderRadius: 4,
            color: "#f5f5f5",
            fontSize: 14,
            fontWeight: 700,
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
            letterSpacing: "0.02em",
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
