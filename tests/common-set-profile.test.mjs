import assert from "node:assert/strict";
import test from "node:test";

import { buildCommonSetProfile } from "../lib/common-set-profile.ts";

const pokemon = {
  name: "Testmon",
  usage: 25,
  rawCount: 100,
  abilities: [
    { id: "Rare Ability", weight: 20 },
    { id: "Common Ability", weight: 80 },
  ],
  items: [{ id: "Leftovers", weight: 70 }],
  moves: [
    { id: "Move C", weight: 50 },
    { id: "Move A", weight: 90 },
    { id: "Move E", weight: 10 },
    { id: "Move B", weight: 70 },
    { id: "Move D", weight: 30 },
  ],
  spreads: [{ id: "Timid:0/0/0/252/4/252", weight: 60 }],
  teammates: [],
  teraTypes: [{ id: "Water", weight: 50 }],
  
};

test("builds a profile from the highest-weight options", () => {
  const profile = buildCommonSetProfile(pokemon);

  assert.equal(profile.name, "Testmon");
  assert.equal(profile.usage, 25);
  assert.equal(profile.ability?.id, "Common Ability");
  assert.equal(profile.item?.id, "Leftovers");
  assert.deepEqual(
    profile.moves.map((move) => move.id),
    ["Move A", "Move B", "Move C", "Move D"],
  );
  assert.equal(profile.spread?.id, "Timid:0/0/0/252/4/252");
  assert.equal(profile.teraType?.id, "Water");
});

test("breaks equal-weight move ties alphabetically", () => {
  const profile = buildCommonSetProfile({
    ...pokemon,
    moves: [
      { id: "Z Move", weight: 50 },
      { id: "A Move", weight: 50 },
      { id: "B Move", weight: 40 },
    ],
  });

  assert.deepEqual(
    profile.moves.map((move) => move.id),
    ["A Move", "Z Move", "B Move"],
  );
});

test("returns null when optional categories are empty", () => {
  const profile = buildCommonSetProfile({
    ...pokemon,
    abilities: [],
    items: [],
    moves: [],
    spreads: [],
    teraTypes: [],
  });

  assert.equal(profile.ability, null);
  assert.equal(profile.item, null);
  assert.deepEqual(profile.moves, []);
  assert.equal(profile.spread, null);
  assert.equal(profile.teraType, null);
});

test("does not mutate the source Pokemon", () => {
  const originalPokemon = structuredClone(pokemon);

  buildCommonSetProfile(pokemon);

  assert.deepEqual(pokemon, originalPokemon);
});
