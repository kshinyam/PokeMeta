import assert from "node:assert/strict";
import test from "node:test";

import {
  compareRawSpeed,
} from "../lib/raw-speed-comparison.ts";

test("reports when the candidate is faster", () => {
  const result = compareRawSpeed({
    candidateSpeed: 169,
    threatSpeed: 167,
  });

  assert.deepEqual(result, {
    candidateSpeed: 169,
    threatSpeed: 167,
    outcome: "faster",
    speedMargin: 2,
  });
});

test("reports when the candidate is slower", () => {
  const result = compareRawSpeed({
    candidateSpeed: 154,
    threatSpeed: 169,
  });

  assert.deepEqual(result, {
    candidateSpeed: 154,
    threatSpeed: 169,
    outcome: "slower",
    speedMargin: -15,
  });
});

test("reports when raw Speed is tied", () => {
  const result = compareRawSpeed({
    candidateSpeed: 169,
    threatSpeed: 169,
  });

  assert.deepEqual(result, {
    candidateSpeed: 169,
    threatSpeed: 169,
    outcome: "tied",
    speedMargin: 0,
  });
});

test("rejects invalid candidate Speed values", () => {
  for (const candidateSpeed of [0, -1, 169.5, Number.NaN]) {
    assert.throws(
      () =>
        compareRawSpeed({
          candidateSpeed,
          threatSpeed: 167,
        }),
      /candidate Speed must be a positive whole number/,
    );
  }
});

test("rejects invalid threat Speed values", () => {
  for (const threatSpeed of [0, -1, 167.5, Number.NaN]) {
    assert.throws(
      () =>
        compareRawSpeed({
          candidateSpeed: 169,
          threatSpeed,
        }),
      /threat Speed must be a positive whole number/,
    );
  }
});

test("accepts the smallest positive whole-number Speed", () => {
  assert.deepEqual(
    compareRawSpeed({
      candidateSpeed: 1,
      threatSpeed: 1,
    }),
    {
      candidateSpeed: 1,
      threatSpeed: 1,
      outcome: "tied",
      speedMargin: 0,
    },
  );
});

test("does not mutate the comparison input", () => {
  const input = {
    candidateSpeed: 169,
    threatSpeed: 167,
  };
  const originalInput = structuredClone(input);

  compareRawSpeed(input);

  assert.deepEqual(input, originalInput);
});
