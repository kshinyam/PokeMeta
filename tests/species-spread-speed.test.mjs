import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateSpeciesSpreadSpeed,
} from "../lib/species-spread-speed.ts";

test("calculates Speed using canonical species data", () => {
  const result = calculateSpeciesSpreadSpeed({
    name: "Garchomp",
    generation: 9,
    spread: "Jolly:0/252/0/0/4/252",
    speedIv: 31,
    level: 50,
  });

  assert.deepEqual(result, {
    id: "garchomp",
    name: "Garchomp",
    generation: 9,
    baseSpeed: 102,
    nature: "Jolly",
    natureModifier: 1.1,
    speedEv: 252,
    speed: 169,
  });
});

test("normalizes the species name before calculating Speed", () => {
  const result = calculateSpeciesSpreadSpeed({
    name: "garchomp",
    generation: 9,
    spread: "Jolly:0/252/0/0/4/252",
    speedIv: 31,
    level: 50,
  });

  assert.equal(result.id, "garchomp");
  assert.equal(result.name, "Garchomp");
  assert.equal(result.baseSpeed, 102);
  assert.equal(result.speed, 169);
});

test("preserves validation errors from composed modules", () => {
  const validInput = {
    name: "Garchomp",
    generation: 9,
    spread: "Jolly:0/252/0/0/4/252",
    speedIv: 31,
    level: 50,
  };

  const cases = [
    {
      input: { ...validInput, name: "Not A Real Pokemon" },
      expectedError: /Unknown species/,
    },
    {
      input: { ...validInput, generation: 0 },
      expectedError: /generation must be a whole number/,
    },
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
      () => calculateSpeciesSpreadSpeed(input),
      expectedError,
    );
  }
});

test("uses generation-specific Base Speed data", () => {
  const input = {
    name: "Raichu",
    spread: "Timid:0/0/0/252/4/252",
    speedIv: 31,
    level: 50,
  };

  const generationFive = calculateSpeciesSpreadSpeed({
    ...input,
    generation: 5,
  });

  const generationNine = calculateSpeciesSpreadSpeed({
    ...input,
    generation: 9,
  });

  assert.equal(generationFive.baseSpeed, 100);
  assert.equal(generationFive.speed, 167);

  assert.equal(generationNine.baseSpeed, 110);
  assert.equal(generationNine.speed, 178);
});

test("does not mutate the integration input", () => {
  const input = {
    name: "Garchomp",
    generation: 9,
    spread: "Jolly:0/252/0/0/4/252",
    speedIv: 31,
    level: 50,
  };
  const originalInput = structuredClone(input);

  calculateSpeciesSpreadSpeed(input);

  assert.deepEqual(input, originalInput);
});
