import assert from "node:assert/strict";
import test from "node:test";

import { calculateSpeedStat } from "../lib/speed-stat.ts";

test("calculates Garchomp's level-50 Speed benchmark", () => {
  const speed = calculateSpeedStat({
    baseSpeed: 102,
    iv: 31,
    ev: 252,
    level: 50,
    natureModifier: 1.1,
  });

  assert.equal(speed, 169);
});

test("calculates Regieleki's level-50 Speed benchmark", () => {
  const speed = calculateSpeedStat({
    baseSpeed: 200,
    iv: 31,
    ev: 252,
    level: 50,
    natureModifier: 1.1,
  });

  assert.equal(speed, 277);
});

test("discards EVs that do not complete a group of four", () => {
  const input = {
    baseSpeed: 85,
    iv: 31,
    level: 99,
    natureModifier: 1,
  };

  for (const ev of [0, 1, 2, 3]) {
    assert.equal(
      calculateSpeedStat({ ...input, ev }),
      203,
    );
  }

  assert.equal(
    calculateSpeedStat({ ...input, ev: 4 }),
    204,
  );
});

test("applies each nature modifier after calculating base Speed", () => {
  const input = {
    baseSpeed: 102,
    iv: 31,
    ev: 252,
    level: 50,
  };

  const cases = [
    { natureModifier: 0.9, expected: 138 },
    { natureModifier: 1, expected: 154 },
    { natureModifier: 1.1, expected: 169 },
  ];

  for (const { natureModifier, expected } of cases) {
    assert.equal(
      calculateSpeedStat({
        ...input,
        natureModifier,
      }),
      expected,
    );
  }
});

test("rejects invalid Base Speed values", () => {
  const input = {
    iv: 31,
    ev: 252,
    level: 50,
    natureModifier: 1,
  };

  for (const baseSpeed of [0, -1, 85.5, Number.NaN]) {
    assert.throws(
      () =>
        calculateSpeedStat({
          ...input,
          baseSpeed,
        }),
      /Base Speed must be a positive whole number/,
    );
  }
});

test("rejects invalid IV values", () => {
  const input = {
    baseSpeed: 102,
    ev: 252,
    level: 50,
    natureModifier: 1,
  };

  for (const iv of [-1, 32, 30.5, Number.NaN]) {
    assert.throws(
      () => calculateSpeedStat({ ...input, iv }),
      /IV must be a whole number between 0 and 31/,
    );
  }
});

test("rejects invalid EV values", () => {
  const input = {
    baseSpeed: 102,
    iv: 31,
    level: 50,
    natureModifier: 1,
  };

  for (const ev of [-1, 253, 4.5, Number.NaN]) {
    assert.throws(
      () => calculateSpeedStat({ ...input, ev }),
      /EV must be a whole number between 0 and 252/,
    );
  }
});

test("rejects invalid level values", () => {
  const input = {
    baseSpeed: 102,
    iv: 31,
    ev: 252,
    natureModifier: 1,
  };

  for (const level of [0, 101, 50.5, Number.NaN]) {
    assert.throws(
      () => calculateSpeedStat({ ...input, level }),
      /level must be a whole number between 1 and 100/,
    );
  }
});

test("rejects invalid nature modifiers", () => {
  const input = {
    baseSpeed: 102,
    iv: 31,
    ev: 252,
    level: 50,
  };

  for (const natureModifier of [0.8, 0.95, 1.2, Number.NaN]) {
    assert.throws(
      () =>
        calculateSpeedStat({
          ...input,
          natureModifier,
        }),
      /nature modifier must be 0.9, 1, or 1.1/,
    );
  }
});

test("accepts legal numeric boundaries", () => {
  assert.equal(
    calculateSpeedStat({
      baseSpeed: 1,
      iv: 0,
      ev: 0,
      level: 1,
      natureModifier: 1,
    }),
    5,
  );

  assert.equal(
    calculateSpeedStat({
      baseSpeed: 200,
      iv: 31,
      ev: 252,
      level: 100,
      natureModifier: 1.1,
    }),
    548,
  );
});
