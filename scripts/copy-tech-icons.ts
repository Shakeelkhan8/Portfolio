import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { DEVICON_FILES } from "../src/lib/tech-icons";

/**
 * Copies the Devicon logos the tech stack uses (src/lib/tech-icons.ts) from
 * the pinned devicon package into public/icons/tech, with its MIT licence.
 * Run after changing the icon table: npx tsx scripts/copy-tech-icons.ts
 * Files no longer used are removed, so the folder matches the table.
 */
const source = join("node_modules", "devicon", "icons");
const target = join("public", "icons", "tech");
mkdirSync(target, { recursive: true });

for (const file of DEVICON_FILES) {
  const from = join(source, file.split("-")[0], file);
  if (!existsSync(from)) throw new Error(`Devicon has no ${from}`);
  copyFileSync(from, join(target, file));
}
copyFileSync(join("node_modules", "devicon", "LICENSE"), join(target, "LICENSE-devicon.txt"));

for (const file of readdirSync(target)) {
  if (file.endsWith(".svg") && !DEVICON_FILES.includes(file)) rmSync(join(target, file));
}
console.log(`Copied ${DEVICON_FILES.length} logos to ${target}`);
