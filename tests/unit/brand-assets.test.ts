import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const PNG_SIGNATURE = "89504e470d0a1a0a";

function readIcoEntries(file: string) {
  const ico = readFileSync(file);
  const count = ico.readUInt16LE(4);

  return Array.from({ length: count }, (_, index) => {
    const entry = 6 + 16 * index;
    const offset = ico.readUInt32LE(entry + 12);
    return {
      size: ico.readUInt8(entry) || 256,
      isPng: ico.subarray(offset, offset + 8).toString("hex") === PNG_SIGNATURE,
    };
  });
}

describe("brand assets", () => {
  it("favicon.ico is the generated SK monogram, not the Next.js scaffold icon", () => {
    // scripts/generate-favicon.tsx writes PNG entries at exactly these sizes;
    // the scaffold icon held bitmap entries instead.
    const entries = readIcoEntries(
      path.join(__dirname, "..", "..", "src", "app", "favicon.ico"),
    );

    expect(entries).toEqual([
      { size: 16, isPng: true },
      { size: 32, isPng: true },
      { size: 48, isPng: true },
    ]);
  });

});
