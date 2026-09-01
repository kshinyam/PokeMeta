import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { normalizeSmogonChaos } from "../lib/smogon-importer.ts";

const fixture = JSON.parse(
  await readFile(
    new URL("./fixtures/smogon-chaos-sample.json", import.meta.url),
    "utf8",
  ),
);

const options = {
  period: "2026-07",
  sourceUrl: "https://example.test/gen9ou-1825.json.gz",
  retrievedAt: "2026-08-01T13:17:00.000Z",
  sha256: "fixture-sha",
};

test("normalizes and sorts a Smogon chaos payload deterministically", () => {
  const normalized = normalizeSmogonChaos(fixture, options);

  assert.equal(normalized.schemaVersion, 1);
  assert.equal(normalized.source.format, "gen9ou");
  assert.equal(normalized.source.cutoff, 1825);
  assert.equal(normalized.source.battles, 1200);
  assert.deepEqual(
    normalized.pokemon.map((pokemon) => pokemon.name),
    ["Higher Usage", "Lower Usage"],
  );
  assert.equal(normalized.pokemon[0].usage, 45);
  assert.deepEqual(normalized.pokemon[0].moves[0], {
    id: "movea",
    weight: 12,
  });
  assert.ok(!normalized.pokemon[0].moves.some((move) => move.id === "movezero"));
});

test("rejects malformed upstream data at the importer boundary", () => {
  assert.throws(
    () => normalizeSmogonChaos({ info: {}, data: {} }, options),
    /metagame|cutoff|number of battles/,
  );
});

test("rejects ambiguous periods", () => {
  assert.throws(
    () => normalizeSmogonChaos(fixture, { ...options, period: "July 2026" }),
    /YYYY-MM/,
  );
});
