export type SpeedNatureModifier = 0.9 | 1 | 1.1;

const SPEED_INCREASING_NATURES: ReadonlySet<string> = new Set([
  "Hasty",
  "Jolly",
  "Naive",
  "Timid",
]);

const SPEED_DECREASING_NATURES: ReadonlySet<string> = new Set([
  "Brave",
  "Relaxed",
  "Quiet",
  "Sassy",
]);

const SPEED_NEUTRAL_NATURES: ReadonlySet<string> = new Set([
  "Hardy",
  "Docile",
  "Lonely",
  "Adamant",
  "Naughty",
  "Bold",
  "Impish",
  "Lax",
  "Serious",
  "Modest",
  "Mild",
  "Bashful",
  "Rash",
  "Calm",
  "Gentle",
  "Careful",
  "Quirky",
]);

export function getSpeedNatureModifier(
  nature: string,
): SpeedNatureModifier {
  if (SPEED_INCREASING_NATURES.has(nature)) {
    return 1.1;
  }

  if (SPEED_DECREASING_NATURES.has(nature)) {
    return 0.9;
  }

  if (SPEED_NEUTRAL_NATURES.has(nature)) {
    return 1;
  }
  throw new Error(`Unknown nature: ${nature}`);
}
