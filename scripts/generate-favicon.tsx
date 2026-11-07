/**
 * Writes src/app/favicon.ico: the same "SK" monogram as src/app/icon.tsx,
 * rendered at 16, 32 and 48 px with next/og and packed as a PNG-in-ICO.
 *
 * favicon.ico has to be a static file (Next serves it as-is), so it cannot
 * read the CMS like icon.tsx does. Re-run after changing the site name:
 *   npx tsx scripts/generate-favicon.tsx
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "../src/config/site";

const SIZES = [16, 32, 48] as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

/** Mirrors src/app/icon.tsx (designed at 32 px), scaled to `size`. */
async function renderPng(size: number, initials: string): Promise<Buffer> {
  const scale = size / 32;
  // At 16 px a 1 px frame leaves no room for legible letters, so drop it.
  const framed = size >= 32;

  const response = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          padding: framed ? 2 * scale : 0,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: framed ? `${1.5 * scale}px solid #f5f5f5` : "none",
            borderRadius: 4 * scale,
            color: "#f5f5f5",
            fontSize: framed ? 14 * scale : 9,
            fontWeight: 700,
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
        >
          {initials}
        </div>
      </div>
    ),
    { width: size, height: size },
  );

  return Buffer.from(await response.arrayBuffer());
}

/** ICO container whose entries are PNGs (supported by every current browser). */
function packIco(images: Array<{ size: number; png: Buffer }>): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const entries: Buffer[] = [];
  let offset = 6 + 16 * images.length;

  for (const { size, png } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((image) => image.png)]);
}

async function main() {
  const initials = getInitials(siteConfig.name);
  const images = [];

  for (const size of SIZES) {
    images.push({ size, png: await renderPng(size, initials) });
  }

  const target = path.join(__dirname, "..", "src", "app", "favicon.ico");
  writeFileSync(target, packIco(images));
  console.log(`Wrote ${target} (${initials}; ${SIZES.join(", ")} px)`);
}

void main();
