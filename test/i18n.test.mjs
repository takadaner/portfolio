import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  languageAlternates,
  normalizeLang,
  withLanguage,
} from "../lib/i18n.ts";

describe("language helpers", () => {
  it("normalizes supported values and rejects unknown locales", () => {
    assert.equal(normalizeLang("en"), "en");
    assert.equal(normalizeLang("RO"), "ro");
    assert.equal(normalizeLang("fr"), null);
    assert.equal(normalizeLang(null), null);
  });

  it("adds or replaces the language query without dropping other state", () => {
    assert.equal(
      withLanguage("/projects?view=grid#work", "en"),
      "/projects?view=grid&lang=en#work",
    );
    assert.equal(withLanguage("/about?lang=en", "ro"), "/about?lang=ro");
  });

  it("creates distinct canonical language alternates", () => {
    assert.deepEqual(languageAlternates("/contact"), {
      "ro-RO": "/contact?lang=ro",
      "en-US": "/contact?lang=en",
      "x-default": "/contact?lang=ro",
    });
  });
});
