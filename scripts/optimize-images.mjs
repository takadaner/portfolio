// One-off image optimizer. Converts large source PNG/JPG under public/images
// into right-sized WebP so next/image has tiny sources to work from.
// Run with: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

// Max width per folder (display size × ~2 for retina). Never upscales.
const maxWidthFor = (path) => {
  if (path.includes("eu")) return 1024;        // profile photo, shown <=512px
  if (path.includes("darkroom")) return 1600;  // gallery + lightbox
  return 1280;
};

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    if ((await stat(full)).isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const fmt = (b) => (b / 1024 / 1024).toFixed(2) + "MB";

const files = (await walk(root)).filter((f) =>
  [".png", ".jpg", ".jpeg"].includes(extname(f).toLowerCase())
);

let before = 0, after = 0;
for (const file of files) {
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const srcSize = (await stat(file)).size;
  await sharp(file)
    .resize({ width: maxWidthFor(file), withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(out);
  const dstSize = (await stat(out)).size;
  before += srcSize;
  after += dstSize;
  console.log(`${fmt(srcSize).padStart(8)} -> ${fmt(dstSize).padStart(8)}  ${file.replace(root, "")}`);
  await unlink(file); // drop the heavy original
}
console.log(`\nTOTAL  ${fmt(before)} -> ${fmt(after)}  (saved ${fmt(before - after)})`);
