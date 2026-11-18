import {
  calculateSmogonSpreadSpeed,
  type SmogonSpreadSpeedResult,
} from "./smogon-spread-speed.ts";
import { resolveSpeciesProfile } from "./species-profile.ts";

export type SpeciesSpreadSpeedInput = {
  name: string;
  generation: number;
  spread: string;
  speedIv: number;
  level: number;
};

export type SpeciesSpreadSpeedResult =
  SmogonSpreadSpeedResult & {
    id: string;
    name: string;
    generation: number;
    baseSpeed: number;
  };

export function calculateSpeciesSpreadSpeed(
  input: SpeciesSpreadSpeedInput,
): SpeciesSpreadSpeedResult {
  const species = resolveSpeciesProfile({
    name: input.name,
    generation: input.generation,
  });

  const speedResult = calculateSmogonSpreadSpeed({
    spread: input.spread,
    baseSpeed: species.baseStats.spe,
    speedIv: input.speedIv,
    level: input.level,
  });

  return {
    id: species.id,
    name: species.name,
    generation: species.generation,
    baseSpeed: species.baseStats.spe,
    ...speedResult,
  };
}
