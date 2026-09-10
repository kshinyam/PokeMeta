import { parseSmogonSpread } from "./spread-parser.ts";
import {
  getSpeedNatureModifier,
  type SpeedNatureModifier,
} from "./speed-nature.ts";
import { calculateSpeedStat } from "./speed-stat.ts";

export type SmogonSpreadSpeedInput = {
  spread: string;
  baseSpeed: number;
  speedIv: number;
  level: number;
};

export type SmogonSpreadSpeedResult = {
  nature: string;
  natureModifier: SpeedNatureModifier;
  speedEv: number;
  speed: number;
};

/**
 * Calculates an explainable raw Speed result from a Smogon spread.
 */
export function calculateSmogonSpreadSpeed(
  input: SmogonSpreadSpeedInput,
): SmogonSpreadSpeedResult {
  const parsed = parseSmogonSpread(input.spread);
  const natureModifier = getSpeedNatureModifier(parsed.nature);
  const speedEv = parsed.evs.spe;

  const speed = calculateSpeedStat({
    baseSpeed: input.baseSpeed,
    iv: input.speedIv,
    ev: speedEv,
    level: input.level,
    natureModifier,
  });

  return {
    nature: parsed.nature,
    natureModifier,
    speedEv,
    speed,
  };
}
