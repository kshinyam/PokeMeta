import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveSpeciesProfile,
} from "../lib/species-profile.ts";

test("resolves a generation-aware Garchomp profile", () => {
  const profile = resolveSpeciesProfile({
    name: "Garchomp",
    generation: 9,
  });

  assert.deepEqual(profile, {
    id: "garchomp",
    name: "Garchomp",
    generation: 9,
    types: ["Dragon", "Ground"],
    baseStats: {
      hp: 108,
      atk: 130,
      def: 95,
      spa: 80,
      spd: 85,
      spe: 102,
    },
  });
});

test("normalizes supported Showdown-style species names", () => {
  const profile = resolveSpeciesProfile({
    name: "garchomp",
    generation: 9,
  });

  assert.equal(profile.id, "garchomp");
  assert.equal(profile.name, "Garchomp");
});

test("resolves species data for the selected generation", () => {
  const generationThree = resolveSpeciesProfile({
    name: "Clefable",
    generation: 3,
  });

  const generationNine = resolveSpeciesProfile({
    name: "Clefable",
    generation: 9,
  });

  assert.deepEqual(generationThree.types, ["Normal"]);
  assert.deepEqual(generationNine.types, ["Fairy"]);
  assert.equal(generationThree.generation, 3);
  assert.equal(generationNine.generation, 9);
});

test("rejects empty or unknown species names", () => {
  for (const name of ["", "Not A Real Pokemon"]) {
    assert.throws(
      () =>
        resolveSpeciesProfile({
          name,
          generation: 9,
        }),
      /Unknown species/,
    );
  }
});

test("rejects invalid generation values", () => {
  for (const generation of [0, -1, 1.5, 10, Number.NaN]) {
    assert.throws(
      () =>
        resolveSpeciesProfile({
          name: "Garchomp",
          generation,
        }),
      /generation must be a whole number between 1 and 9/,
    );
  }
});

test("does not mutate the lookup input", () => {
  const input = {
    name: "Garchomp",
    generation: 9,
  };
  const originalInput = structuredClone(input);

  resolveSpeciesProfile(input);

  assert.deepEqual(input, originalInput);
});

test("returns defensive copies of mutable species data", () => {
  const firstProfile = resolveSpeciesProfile({
    name: "Garchomp",
    generation: 9,
  });

  firstProfile.types[0] = "Water";
  firstProfile.baseStats.spe = 1;

  const secondProfile = resolveSpeciesProfile({
    name: "Garchomp",
    generation: 9,
  });

  assert.deepEqual(secondProfile.types, ["Dragon", "Ground"]);
  assert.equal(secondProfile.baseStats.spe, 102);
});
