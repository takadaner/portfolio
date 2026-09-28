import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildContactEmail,
  buildContactMailto,
  readBoundedJson,
  validateContactPayload,
} from "../lib/contact.ts";

const validPayload = {
  interest: "Web Development",
  name: "Ana Example",
  email: "ana@example.com",
  phone: "+40 700 000 000",
  message: "I would like a new website for my studio.",
  companyWebsite: "",
};

describe("readBoundedJson", () => {
  it("parses small JSON bodies even when content-length is absent", async () => {
    const request = new Request("https://example.test/api/contact", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    assert.deepEqual(await readBoundedJson(request, 1024), {
      ok: true,
      value: validPayload,
    });
  });

  it("rejects oversized bodies by actual streamed bytes", async () => {
    const request = new Request("https://example.test/api/contact", {
      method: "POST",
      headers: { "content-length": "1" },
      body: JSON.stringify(validPayload),
    });

    assert.deepEqual(await readBoundedJson(request, 8), {
      ok: false,
      reason: "too_large",
    });
  });

  it("rejects malformed JSON and declared oversized bodies", async () => {
    const malformed = new Request("https://example.test/api/contact", {
      method: "POST",
      body: "{not json}",
    });
    const declaredTooLarge = new Request("https://example.test/api/contact", {
      method: "POST",
      headers: { "content-length": "5000" },
      body: "{}",
    });

    assert.deepEqual(await readBoundedJson(malformed, 1024), {
      ok: false,
      reason: "invalid",
    });
    assert.deepEqual(await readBoundedJson(declaredTooLarge, 1024), {
      ok: false,
      reason: "too_large",
    });
  });
});

describe("validateContactPayload", () => {
  it("accepts and trims a valid enquiry", () => {
    const result = validateContactPayload({
      ...validPayload,
      name: "  Ana Example  ",
    });

    assert.equal(result.ok, true);
    assert.equal(result.data.name, "Ana Example");
  });

  it("rejects invalid and oversized fields", () => {
    const invalid = [
      { ...validPayload, interest: "" },
      { ...validPayload, email: "not-an-email" },
      { ...validPayload, message: "hello" },
      { ...validPayload, name: "x".repeat(121) },
    ];

    for (const payload of invalid) {
      assert.equal(validateContactPayload(payload).ok, false);
    }
  });

  it("rejects malformed request bodies and field types", () => {
    assert.equal(validateContactPayload(null).ok, false);
    assert.equal(validateContactPayload([]).ok, false);
    assert.equal(validateContactPayload({ ...validPayload, name: 42 }).ok, false);
    assert.equal(
      validateContactPayload({ ...validPayload, companyWebsite: "x".repeat(301) }).ok,
      false,
    );
  });

  it("marks honeypot submissions without exposing their content", () => {
    assert.deepEqual(
      validateContactPayload({
        ...validPayload,
        companyWebsite: "https://spam.example",
      }),
      { ok: true, bot: true },
    );
  });
});

describe("contact email formatting", () => {
  it("escapes user-controlled HTML", () => {
    const email = buildContactEmail({
      ...validPayload,
      name: "<script>alert(1)</script>",
    });

    assert.equal(email.html.includes("<script>"), false);
    assert.equal(email.html.includes("&lt;script&gt;"), true);
    assert.equal(email.replyTo, validPayload.email);
  });

  it("creates a usable encoded email fallback", () => {
    const mailto = buildContactMailto(validPayload, "owner@example.com");

    assert.match(mailto, /^mailto:owner@example\.com\?/);
    assert.equal(decodeURIComponent(mailto).includes(validPayload.message), true);
  });
});
