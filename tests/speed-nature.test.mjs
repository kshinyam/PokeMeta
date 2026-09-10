import assert from "node:assert/strict";
import test from "node:test";

import { getSpeedNatureModifier } from "../lib/speed-nature.ts";

test("resolves Speed-increasing natures", () => {
  for (const nature of ["Hasty", "Jolly", "Naive", "Timid"]) {
    assert.equal(getSpeedNatureModifier(nature), 1.1);
  }
});

test("resolves Speed-decreasing natures", () => {
  for (const nature of ["Brave", "Relaxed", "Quiet", "Sassy"]) {
    assert.equal(getSpeedNatureModifier(nature), 0.9);
  }
});

test("resolves natures that do not affect Speed as neutral", () => {
  const neutralNatures = [
    "Hardy",
    "Lonely",
    "Adamant",
    "Naughty",
    "Bold",
    "Docile",
    "Impish",
    "Lax",
    "Serious",
    "Modest",
    "Mild",
    "Bashful",
    "Rash",
    "Calm",
    "Gentle",
    "Careful",
    "Quirky",
  ];

  for (const nature of neutralNatures) {
    assert.equal(getSpeedNatureModifier(nature), 1);
  }
});

test("rejects unknown or malformed nature names", () => {
  for (const nature of ["", "timid", " Timid ", "Unknown"]) {
    assert.throws(
      () => getSpeedNatureModifier(nature),
      /Unknown nature/,
    );
  }
});
