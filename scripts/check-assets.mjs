/**
 * Pre-build guard: every "/images/..." path referenced in source or locale
 * files must (a) exist in public/ and (b) be tracked in git with the exact
 * same path & casing. Fails the build otherwise — a missing or uncommitted
 * asset should break the deploy loudly, not ship as a broken <img>.
 *
 * Runs automatically via the "prebuild" npm script (locally and on Vercel).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib", "locales"];
const SCAN_EXT = /\.(tsx?|jsx?|json|css)$/;
const REF_RE = /["'`](\/images\/[^"'`]+)["'`]/g;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry !== "node_modules") yield* walk(full);
    } else if (SCAN_EXT.test(entry)) {
      yield full;
    }
  }
}

// path (decoded, without query/hash) -> Set of files referencing it
const refs = new Map();
for (const dir of SCAN_DIRS) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) continue;
  for (const file of walk(abs)) {
    const source = relative(ROOT, file).replaceAll("\\", "/");
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(REF_RE)) {
      const path = decodeURIComponent(match[1].split(/[?#]/)[0]);
      if (!refs.has(path)) refs.set(path, new Set());
      refs.get(path).add(source);
    }
  }
}

// Exact repo paths (and casing) of everything tracked under public/.
// If git isn't available (some CI containers), skip this half of the check —
// there the on-disk check is equivalent, since only committed files exist.
let tracked = null;
try {
  tracked = new Set(
    execFileSync("git", ["ls-files", "-z", "public"], { encoding: "utf8" })
      .split("\0")
      .filter(Boolean)
      .map((p) => p.replaceAll("\\", "/"))
  );
} catch {
  console.warn("check-assets: git unavailable, checking disk presence only");
}

const problems = [];
for (const [path, sources] of [...refs.entries()].sort()) {
  const repoPath = `public${path}`;
  const where = [...sources].join(", ");
  if (!existsSync(join(ROOT, repoPath))) {
    problems.push(`MISSING ON DISK  ${repoPath}  (referenced in: ${where})`);
  } else if (tracked !== null && !tracked.has(repoPath)) {
    problems.push(
      `NOT IN GIT       ${repoPath}  (exists locally but is not committed — ` +
        `it will 404 on the deployed site; referenced in: ${where})`
    );
  }
}

if (problems.length > 0) {
  console.error("\n✗ check-assets: broken image references found:\n");
  for (const p of problems) console.error("  " + p);
  console.error(
    "\nFix the path or `git add` the file. The build is blocked so this" +
      " cannot reach the deployed site.\n"
  );
  process.exit(1);
}

console.log(`✓ check-assets: ${refs.size} referenced image paths OK (on disk + in git)`);
