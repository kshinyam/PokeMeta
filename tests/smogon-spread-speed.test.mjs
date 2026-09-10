import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateSmogonSpreadSpeed,
} from "../lib/smogon-spread-speed.ts";

test("calculates an explainable Speed result from a Smogon spread", () => {
  const result = calculateSmogonSpreadSpeed({
    spread: "Jolly:0/252/0/0/4/252",
    baseSpeed: 102,
    speedIv: 31,
    level: 50,
  });

  assert.deepEqual(result, {
    nature: "Jolly",
    natureModifier: 1.1,
    speedEv: 252,
    speed: 169,
  });
});

test("uses neutral and Speed-decreasing natures", () => {
  const cases = [
    {
      nature: "Hardy",
      expectedModifier: 1,
      expectedSpeed: 154,
    },
    {
      nature: "Brave",
      expectedModifier: 0.9,
      expectedSpeed: 138,
    },
  ];

  for (const {
    nature,
    expectedModifier,
    expectedSpeed,
  } of cases) {
    const result = calculateSmogonSpreadSpeed({
      spread: `${nature}:0/252/0/0/4/252`,
      baseSpeed: 102,
      speedIv: 31,
      level: 50,
    });

    assert.equal(result.natureModifier, expectedModifier);
    assert.equal(result.speed, expectedSpeed);
  }
});

test("preserves validation errors from composed modules", () => {
  const validInput = {
    spread: "Jolly:0/252/0/0/4/252",
    baseSpeed: 102,
    speedIv: 31,
    level: 50,
  };

  const cases = [
    {
      input: { ...validInput, spread: "Jolly:0/0" },
      expectedError: /six EV values/,
    },
    {
      input: {
        ...validInput,
        spread: "Unknown:0/252/0/0/4/252",
      },
      expectedError: /Unknown nature/,
    },
    {
      input: { ...validInput, baseSpeed: 0 },
      expectedError: /Base Speed must be a positive whole number/,
    },
    {
      input: { ...validInput, speedIv: 32 },
      expectedError: /IV must be a whole number between 0 and 31/,
    },
    {
      input: { ...validInput, level: 0 },
      expectedError: /level must be a whole number between 1 and 100/,
    },
  ];

  for (const { input, expectedError } of cases) {
    assert.throws(
      () => calculateSmogonSpreadSpeed(input),
      expectedError,
    );
  }
});
