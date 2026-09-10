import { compareRawSpeed } from "./raw-speed-comparison.ts";
import type { SpeedNatureModifier } from "./speed-nature.ts";
import { calculateSpeedStat } from "./speed-stat.ts";

export type MinimumSpeedEvInput = {
    baseSpeed: number;
    speedIv: number;
    level: number;
    natureModifier: SpeedNatureModifier;
    threatSpeed: number;
};

export type MinimumSpeedEvResult =
  | {
      attainable: true;
      requiredSpeedEv: number;
      candidateSpeed: number;
      threatSpeed: number;
      speedMargin: number;
    }
  | {
      attainable: false;
      requiredSpeedEv: null;
      candidateSpeed: number;
      threatSpeed: number;
      speedMargin: number;
    };

export function findMinimumSpeedEv(
    input: MinimumSpeedEvInput,
): MinimumSpeedEvResult {
    const { baseSpeed, speedIv, level, natureModifier, threatSpeed } = input;
    let maximumCandidateSpeed = 0;
    let maximumSpeedMargin = 0;

    for (let speedEv = 0; speedEv <= 252; speedEv += 4) {
        const candidateSpeed = calculateSpeedStat({
            baseSpeed,
            iv: speedIv,
            ev: speedEv,
            level,
            natureModifier,
        });

        const comparison = compareRawSpeed({
            candidateSpeed,
            threatSpeed,
        });

        maximumCandidateSpeed = candidateSpeed;
        maximumSpeedMargin = comparison.speedMargin;

        if (comparison.outcome === "faster") {
            return {
                attainable: true,
                requiredSpeedEv: speedEv,
                candidateSpeed,
                threatSpeed,
                speedMargin: comparison.speedMargin,
            };
        }
    }

    return {
        attainable: false,
        requiredSpeedEv: null,
        candidateSpeed: maximumCandidateSpeed,
        threatSpeed,
        speedMargin: maximumSpeedMargin,
    };
}