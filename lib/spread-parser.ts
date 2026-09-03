export type PokemonEVs = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
};

export type ParsedSmogonSpread = {
  nature: string;
  evs: PokemonEVs;
};

export function parseSmogonSpread(spread: string): ParsedSmogonSpread {
    const sections = spread.split(":");

    if (
    sections.length !== 2 ||
    !sections[0] ||
    !sections[1]
    ) {
    throw new Error(
        "spread identifier must contain one nature and one EV section",
    );
    }

const [nature, evString] = sections as [string, string];

    const evParts = evString.split("/");

    if (evParts.length !== 6) {
    throw new Error("spread identifier must contain six EV values");
    }

    if (evParts.some((value) => value.trim() === "")) {
    throw new Error("EV values must be whole numbers");
    }

    const evValues = evParts.map(Number);

    if (!evValues.every(Number.isInteger)) {
    throw new Error("EV values must be whole numbers");
    }

    if (evValues.some((value) => value < 0 || value > 252)) {
    throw new Error("EV values must be between 0 and 252");
    }

    const total = evValues.reduce((sum, value) => sum + value, 0);

    if (total > 510) {
    throw new Error("EV total must not exceed 510");
    }

    const [hp, atk, def, spa, spd, spe] = evValues as [
    number,
    number,
    number,
    number,
    number,
    number,
    ];

    return {
        nature,
        evs: {
        hp,
        atk,
        def,
        spa,
        spd,
        spe,
        },
    };
}