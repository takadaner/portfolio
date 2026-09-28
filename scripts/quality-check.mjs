import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const roots = ["app", "components", "lib"];
const extensions = new Set([".ts", ".tsx", ".mjs"]);
const violations = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }
    if (!extensions.has(path.extname(entry.name))) continue;

    const source = await readFile(fullPath, "utf8");
    source.split(/\r?\n/).forEach((line, index) => {
      if (/\bconsole\.log\s*\(/.test(line)) {
        violations.push(`${fullPath}:${index + 1} console.log is not allowed`);
      }
      if (/reducedMotion=["']never["']/.test(line)) {
        violations.push(`${fullPath}:${index + 1} reduced-motion preference is ignored`);
      }
    });
  }
}

for (const root of roots) await walk(root);

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Quality check passed.");
}
