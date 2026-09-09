export type SpeedStatInput = {
  baseSpeed: number;
  iv: number;
  ev: number;
  level: number;
  natureModifier: 0.9 | 1 | 1.1;
};

function assertWholeNumberInRange(
  value: number,
  label: string,
  minimum: number,
  maximum: number,
): void {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(
      `${label} must be a whole number between ${minimum} and ${maximum}`,
    );
  }
}

export function calculateSpeedStat(input: SpeedStatInput): number {
  const {
    baseSpeed,
    iv,
    ev,
    level,
    natureModifier,
  } = input;

  if (!Number.isInteger(baseSpeed) || baseSpeed <= 0) {
    throw new Error(
      "Base Speed must be a positive whole number",
    );
  }

  assertWholeNumberInRange(iv, "IV", 0, 31);
  assertWholeNumberInRange(ev, "EV", 0, 252);
  assertWholeNumberInRange(level, "level", 1, 100);

  if (![0.9, 1, 1.1].includes(natureModifier)) {
    throw new Error(
      "nature modifier must be 0.9, 1, or 1.1",
    );
  }

  const evContribution = Math.floor(ev / 4);
  const baseValue =
    Math.floor(
      ((2 * baseSpeed + iv + evContribution) * level) / 100,
    ) + 5;

  return Math.floor(baseValue * natureModifier);
}
