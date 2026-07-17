// Converts animated GIFs under public/images to animated WebP (much smaller,
// keeps animation). Run with: node scripts/optimize-gifs.mjs
import sharp from "sharp";
import { existsSync } from "node:fs";
import { readdir, stat, unlink } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
const fmt = (b) => (b / 1024 / 1024).toFixed(2) + "MB";

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    if ((await stat(full)).isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const gifs = (await walk(root)).filter((f) => extname(f).toLowerCase() === ".gif");

let before = 0, after = 0;
for (const file of gifs) {
  const out = file.replace(/\.gif$/i, ".webp");
  const srcSize = (await stat(file)).size;
  if (!existsSync(out)) {
    await sharp(file, { animated: true, limitInputPixels: false })
      .resize({ width: 1000, withoutEnlargement: true })
      .webp({ quality: 55, effort: 4 })
      .toFile(out);
  }
  const dstSize = (await stat(out)).size;
  before += srcSize;
  after += dstSize;
  console.log(`${fmt(srcSize).padStart(8)} -> ${fmt(dstSize).padStart(8)}  ${file.replace(root, "")}`);
  try { await unlink(file); } catch { console.log("   (could not delete original — delete manually)"); }
}
console.log(`\nTOTAL  ${fmt(before)} -> ${fmt(after)}  (saved ${fmt(before - after)})`);
