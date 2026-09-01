import { z } from "zod";

const weightedRecordSchema = z.record(z.string(), z.number().finite()).default({});

const pokemonSchema = z.object({
  "Raw count": z.number().int().nonnegative(),
  usage: z.number().finite().min(0).max(1),
  Abilities: weightedRecordSchema,
  Items: weightedRecordSchema,
  Moves: weightedRecordSchema,
  Spreads: weightedRecordSchema,
  Teammates: weightedRecordSchema,
  "Tera Types": weightedRecordSchema,
}).passthrough();

export const smogonChaosSchema = z.object({
  info: z.object({
    metagame: z.string().min(1),
    cutoff: z.number().int().nonnegative(),
    "number of battles": z.number().int().nonnegative(),
  }).passthrough(),
  data: z.record(z.string(), pokemonSchema),
});

export type WeightedOption = {
  id: string;
  weight: number;
};

export type NormalizedSmogonPokemon = {
  name: string;
  usage: number;
  rawCount: number;
  abilities: WeightedOption[];
  items: WeightedOption[];
  moves: WeightedOption[];
  spreads: WeightedOption[];
  teammates: WeightedOption[];
  teraTypes: WeightedOption[];
};

export type NormalizedSmogonDataset = {
  schemaVersion: 1;
  source: {
    provider: "Smogon";
    period: string;
    format: string;
    cutoff: number;
    battles: number;
    url: string;
    retrievedAt: string;
    sha256: string;
  };
  pokemon: NormalizedSmogonPokemon[];
};

type NormalizeOptions = {
  period: string;
  sourceUrl: string;
  retrievedAt: string;
  sha256: string;
  limit?: number;
  optionLimit?: number;
};

function round(value: number, places = 6) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function topWeighted(
  values: Record<string, number>,
  limit: number,
): WeightedOption[] {
  return Object.entries(values)
    .filter(([, weight]) => Number.isFinite(weight) && weight > 0)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([id, weight]) => ({ id, weight: round(weight) }));
}

export function normalizeSmogonChaos(
  input: unknown,
  options: NormalizeOptions,
): NormalizedSmogonDataset {
  if (!/^\d{4}-\d{2}$/.test(options.period)) {
    throw new Error("period must use YYYY-MM format");
  }

  const parsed = smogonChaosSchema.parse(input);
  const limit = options.limit ?? 50;
  const optionLimit = options.optionLimit ?? 5;

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("limit must be a positive integer");
  }

  const pokemon = Object.entries(parsed.data)
    .sort(
      ([leftName, left], [rightName, right]) =>
        right.usage - left.usage || leftName.localeCompare(rightName),
    )
    .slice(0, limit)
    .map(([name, record]) => ({
      name,
      usage: round(record.usage * 100),
      rawCount: record["Raw count"],
      abilities: topWeighted(record.Abilities, optionLimit),
      items: topWeighted(record.Items, optionLimit),
      moves: topWeighted(record.Moves, optionLimit),
      spreads: topWeighted(record.Spreads, optionLimit),
      teammates: topWeighted(record.Teammates, optionLimit),
      teraTypes: topWeighted(record["Tera Types"], optionLimit),
    }));

  return {
    schemaVersion: 1,
    source: {
      provider: "Smogon",
      period: options.period,
      format: parsed.info.metagame,
      cutoff: parsed.info.cutoff,
      battles: parsed.info["number of battles"],
      url: options.sourceUrl,
      retrievedAt: options.retrievedAt,
      sha256: options.sha256,
    },
    pokemon,
  };
}
