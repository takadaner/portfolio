import test from "node:test";
import assert from "node:assert/strict";
import { getConciergeScenario } from "../lib/night-concierge.ts";

test("concierge demo offers the same scenarios in both languages", () => {
  assert.deepEqual(
    ["late-checkin", "breakfast", "local-guide"].map((id) =>
      getConciergeScenario(id, "en")?.guestMessage,
    ),
    [
      "I’ll arrive after midnight. Is that okay?",
      "Do you have a good breakfast option for vegans?",
      "I have two hours free. What should I see nearby?",
    ],
  );
  assert.equal(
    getConciergeScenario("late-checkin", "ro")?.guestMessage,
    "Voi ajunge după miezul nopții. Este în regulă?",
  );
});

test("unknown scenarios are safely ignored", () => {
  assert.equal(getConciergeScenario("delete-booking", "en"), null);
});
