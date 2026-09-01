import assert from "node:assert/strict";
import test from "node:test";

import {
  analyze,
  DEFAULT_TEAM,
  POKEMON,
  REQUIRED_ROLES,
  THREATS,
} from "../app/meta-engine.ts";

test("the seed dataset has unique candidates and descending usage", () => {
  const names = POKEMON.map((pokemon) => pokemon.name);
  assert.equal(new Set(names).size, names.length);

  for (let index = 1; index < THREATS.length; index += 1) {
    assert.ok(THREATS[index - 1].usage >= THREATS[index].usage);
  }
});

test("an empty team produces a zero score", () => {
  const result = analyze([]);
  assert.equal(result.overall, 0);
  assert.equal(result.metaCoverage, 0);
  assert.equal(result.missingRoles.length, REQUIRED_ROLES.length);
});

test("the sample team is complete and every threat has an answer", () => {
  const result = analyze(DEFAULT_TEAM);
  assert.equal(result.team.length, 6);
  assert.equal(result.missingRoles.length, 0);
  assert.equal(result.threatRows.length, THREATS.length);
  assert.ok(result.threatRows.every((threat) => threat.best));
  assert.ok(result.overall > 0 && result.overall <= 100);
});

test("incomplete teams receive a completeness penalty", () => {
  const partial = analyze(DEFAULT_TEAM.slice(0, 3));
  const complete = analyze(DEFAULT_TEAM);
  assert.ok(partial.overall < complete.overall);
});
