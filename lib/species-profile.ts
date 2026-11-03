import { Dex } from "@pkmn/dex";

export type SpeciesProfileInput = {
  name: string;
  generation: number;
};

export type PokemonBaseStats = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
};

export type SpeciesProfile = {
  id: string;
  name: string;
  generation: number;
  types: string[];
  baseStats: PokemonBaseStats;
};

export function resolveSpeciesProfile(
  input: SpeciesProfileInput,
): SpeciesProfile {
  const maximumGeneration = Dex.gen;
  if (
    !Number.isInteger(input.generation) ||
    input.generation < 1 ||
    input.generation > maximumGeneration
  ) {
    throw new Error(
      `generation must be a whole number between 1 and ${maximumGeneration}`,
    );
  }
  const dex = Dex.forGen(input.generation);
  const species = dex.species.get(input.name);
  if (!species.exists) {
    throw new Error(`Unknown species: ${input.name}`);
  }

  return {
    id: species.id,
    name: species.name,
    generation: input.generation,
    types: [...species.types],
    baseStats: {
      hp: species.baseStats.hp,
      atk: species.baseStats.atk,
      def: species.baseStats.def,
      spa: species.baseStats.spa,
      spd: species.baseStats.spd,
      spe: species.baseStats.spe,
    },
  };
}
