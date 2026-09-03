import assert from "node:assert/strict";
import test from "node:test";

import { parseSmogonSpread } from "../lib/spread-parser.ts";

test("parses a Smogon EV spread identifier", () => {
  const spread = parseSmogonSpread("Timid:0/0/0/252/4/252");

  assert.deepEqual(spread, {
    nature: "Timid",
    evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
  });
});

test("rejects identifiers without six EV values", () => {
  assert.throws(
    () => parseSmogonSpread("Timid:0/0/0/252"),
    /six EV values/,
  );
});

test("rejects EV values that are not whole numbers", () => {
  const invalidIdentifiers = [
    "Timid:0/0/not-a-number/252/4/252",
    "Timid:0/0/0/252.5/4/252",
    "Timid:0//0/252/4/252",
  ];

  for (const identifier of invalidIdentifiers) {
    assert.throws(
      () => parseSmogonSpread(identifier),
      /whole numbers/,
    );
  }
});

test("rejects EV values outside the legal per-stat range", () => {
  assert.throws(
    () => parseSmogonSpread("Timid:253/0/0/0/0/0"),
    /between 0 and 252/,
  );

  assert.throws(
    () => parseSmogonSpread("Timid:-1/0/0/0/0/0"),
    /between 0 and 252/,
  );
});

test("rejects EV totals above 510", () => {
  assert.throws(
    () => parseSmogonSpread("Timid:252/252/252/0/0/0"),
    /510/,
  );
});

test("accepts exactly 510 total EVs", () => {
  const spread = parseSmogonSpread("Adamant:252/252/6/0/0/0");
  const total = Object.values(spread.evs).reduce(
    (sum, value) => sum + value,
    0,
  );

  assert.equal(total, 510);
});

test("rejects identifiers with multiple separators", () => {
  assert.throws(
    () =>
      parseSmogonSpread(
        "Timid:0/0/0/252/4/252:unexpected",
      ),
    /one nature and one EV section/,
  );
});
