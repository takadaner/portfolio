import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFile } from "node:fs/promises";

describe("MPC song registry", () => {
  it("publishes only the complete Runaway machine", async () => {
    const source = await readFile(new URL("../lib/mcp-songs.ts", import.meta.url), "utf8");
    const publishedSlugs = [...source.matchAll(/^\s{4}slug: "([^"]+)",$/gm)].map(
      (match) => match[1],
    );

    assert.deepEqual(publishedSlugs, ["runaway"]);
  });
});
