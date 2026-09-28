import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { publishedProjects } from "../lib/projects.ts";

describe("publishedProjects", () => {
  it("keeps only portfolio entries with a real destination", () => {
    const projects = [
      { title: "Live", href: "/projects/live" },
      { title: "External", href: "https://example.com" },
      { title: "Placeholder" },
      { title: "Empty", href: "" },
    ];

    assert.deepEqual(
      publishedProjects(projects).map((project) => project.title),
      ["Live", "External"],
    );
  });
});
