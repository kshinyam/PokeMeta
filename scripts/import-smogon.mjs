#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { gunzipSync } from "node:zlib";

import { normalizeSmogonChaos } from "../lib/smogon-importer.ts";

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

function positiveInteger(name, fallback) {
  const value = Number(argument(name, String(fallback)));
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`--${name} must be a positive integer`);
  }
  return value;
}

const period = argument("period", "2026-07");
const format = argument("format", "gen9ou");
const cutoff = positiveInteger("cutoff", 1825);
const limit = positiveInteger("limit", 50);
const inputPath = argument("input", null);
const sourceUrl = argument(
  "source-url",
  `https://www.smogon.com/stats/${period}/chaos/${format}-${cutoff}.json.gz`,
);
const outputPath = resolve(
  argument(
    "output",
    `data/smogon/${format}-${cutoff}-${period}.json`,
  ),
);

let bytes;
let retrievedAt = argument("retrieved-at", null);

if (inputPath) {
  bytes = await readFile(resolve(inputPath));
  if (!retrievedAt) {
    throw new Error("--retrieved-at is required with --input for reproducible output");
  }
} else {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Smogon download failed: ${response.status} ${response.statusText}`);
  }
  bytes = Buffer.from(await response.arrayBuffer());
  retrievedAt = retrievedAt
    ?? new Date(response.headers.get("last-modified") ?? Date.now()).toISOString();
}

const isGzip = bytes[0] === 0x1f && bytes[1] === 0x8b;
const jsonBytes = isGzip ? gunzipSync(bytes) : bytes;
let raw;

try {
  raw = JSON.parse(jsonBytes.toString("utf8"));
} catch (error) {
  throw new Error(`Smogon payload is not valid JSON: ${error.message}`);
}

const normalized = normalizeSmogonChaos(raw, {
  period,
  sourceUrl,
  retrievedAt,
  sha256: createHash("sha256").update(bytes).digest("hex"),
  limit,
});

if (normalized.source.format !== format || normalized.source.cutoff !== cutoff) {
  throw new Error(
    `Dataset identity mismatch: expected ${format}-${cutoff}, received ${normalized.source.format}-${normalized.source.cutoff}`,
  );
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(normalized, null, 2)}\n`);

console.log(
  `Imported ${normalized.pokemon.length} Pokémon from ${period} ${format} at ${cutoff} into ${outputPath}`,
);
