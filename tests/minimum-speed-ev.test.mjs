import assert from "node:assert/strict";
import test from "node:test";

import {
  findMinimumSpeedEv,
} from "../lib/minimum-speed-ev.ts";

test("returns zero EVs when the candidate already exceeds the threat", () => {
  const result = findMinimumSpeedEv({
    baseSpeed: 102,
    speedIv: 31,
    level: 50,
    natureModifier: 1.1,
    threatSpeed: 133,
  });

  assert.deepEqual(result, {
    attainable: true,
    requiredSpeedEv: 0,
    candidateSpeed: 134,
    threatSpeed: 133,
    speedMargin: 1,
  });
});

test("returns the minimum EV investment that exceeds the threat", () => {
  const result = findMinimumSpeedEv({
    baseSpeed: 102,
    speedIv: 31,
    level: 50,
    natureModifier: 1.1,
    threatSpeed: 150,
  });

  assert.deepEqual(result, {
    attainable: true,
    requiredSpeedEv: 124,
    candidateSpeed: 151,
    threatSpeed: 150,
    speedMargin: 1,
  });
});

test("reports when the target cannot be exceeded", () => {
  const result = findMinimumSpeedEv({
    baseSpeed: 102,
    speedIv: 31,
    level: 50,
    natureModifier: 1.1,
    threatSpeed: 200,
  });

  assert.deepEqual(result, {
    attainable: false,
    requiredSpeedEv: null,
    candidateSpeed: 169,
    threatSpeed: 200,
    speedMargin: -31,
  });
});

test("treats a maximum-Speed tie as unattainable", () => {
  const result = findMinimumSpeedEv({
    baseSpeed: 102,
    speedIv: 31,
    level: 50,
    natureModifier: 1.1,
    threatSpeed: 169,
  });

  assert.deepEqual(result, {
    attainable: false,
    requiredSpeedEv: null,
    candidateSpeed: 169,
    threatSpeed: 169,
    speedMargin: 0,
  });
});

test("preserves validation errors from composed modules", () => {
  const validInput = {
    baseSpeed: 102,
    speedIv: 31,
    level: 50,
    natureModifier: 1.1,
    threatSpeed: 150,
  };

  const cases = [
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
    {
      input: { ...validInput, natureModifier: 1.2 },
      expectedError: /nature modifier must be 0.9, 1, or 1.1/,
    },
    {
      input: { ...validInput, threatSpeed: 0 },
      expectedError: /threat Speed must be a positive whole number/,
    },
  ];

  for (const { input, expectedError } of cases) {
    assert.throws(
      () => findMinimumSpeedEv(input),
      expectedError,
    );
  }
});

test("does not mutate the optimizer input", () => {
  const input = {
    baseSpeed: 102,
    speedIv: 31,
    level: 50,
    natureModifier: 1.1,
    threatSpeed: 150,
  };
  const originalInput = structuredClone(input);

  findMinimumSpeedEv(input);

  assert.deepEqual(input, originalInput);
});
