import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { languageAlternates, withLanguage } from "../lib/i18n.ts";

describe("localized SEO URLs", () => {
  it("uses a self-canonical URL for each language version", () => {
    const alternates = languageAlternates("/about");
    assert.equal(withLanguage("/about", "en"), alternates["en-US"]);
    assert.equal(withLanguage("/about", "ro"), alternates["ro-RO"]);
    assert.notEqual(alternates["en-US"], alternates["ro-RO"]);
  });

  it("keeps route-specific state while setting the selected language", () => {
    assert.equal(withLanguage("/about?view=profile#experience", "en"), "/about?view=profile&lang=en#experience");
  });
});
