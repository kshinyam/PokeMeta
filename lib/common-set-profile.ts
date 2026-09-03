import type {
  NormalizedSmogonPokemon,
  WeightedOption,
} from "./smogon-importer";

export type CommonSetProfile = {
  name: string;
  usage: number;
  ability: WeightedOption | null;
  item: WeightedOption | null;
  moves: WeightedOption[];
  spread: WeightedOption | null;
  teraType: WeightedOption | null;
};

function sortOptions(options: WeightedOption[]): WeightedOption[] {
  return [...options].sort(
    (left, right) =>
      right.weight - left.weight || left.id.localeCompare(right.id),
  );
}

function getTopOption(options: WeightedOption[]): WeightedOption | null {
  return sortOptions(options)[0] ?? null;
}

/**
 * Builds a deterministic marginal profile from normalized Smogon usage data.
 */

export function buildCommonSetProfile(
  pokemon: NormalizedSmogonPokemon,
): CommonSetProfile {

  return {
    name: pokemon.name,
    usage: pokemon.usage,
    ability: getTopOption(pokemon.abilities),
    item: getTopOption(pokemon.items),
    moves: sortOptions(pokemon.moves).slice(0, 4),
    spread: getTopOption(pokemon.spreads),
    teraType: getTopOption(pokemon.teraTypes),
  };
}
