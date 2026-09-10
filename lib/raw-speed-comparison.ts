export type RawSpeedComparisonInput = {
  candidateSpeed: number;
  threatSpeed: number;
};

export type RawSpeedOutcome = "faster" | "slower" | "tied";

export type RawSpeedComparisonResult = {
  candidateSpeed: number;
  threatSpeed: number;
  outcome: RawSpeedOutcome;
  speedMargin: number;
};

function assertPositiveWholeNumber(
  value: number,
  role: "candidate" | "threat",
): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(
      `${role} Speed must be a positive whole number`,
    );
  }
}

/**
 * Compares raw Speed values without battle-context effects.
 *
 * A positive margin favors the candidate, a negative margin favors the threat,
 * and zero means their raw Speed values are tied.
 */
export function compareRawSpeed(
  input: RawSpeedComparisonInput,
): RawSpeedComparisonResult {
  const { candidateSpeed, threatSpeed } = input;

  assertPositiveWholeNumber(candidateSpeed, "candidate");
  assertPositiveWholeNumber(threatSpeed, "threat");

  const speedMargin = candidateSpeed - threatSpeed;
  let outcome: RawSpeedOutcome;

  if (speedMargin > 0) {
    outcome = "faster";
  } else if (speedMargin < 0) {
    outcome = "slower";
  } else {
    outcome = "tied";
  }

  return {
    candidateSpeed,
    threatSpeed,
    outcome,
    speedMargin,
  };
}
