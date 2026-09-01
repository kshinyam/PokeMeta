export type PokemonType =
  | "Normal" | "Fire" | "Water" | "Electric" | "Grass" | "Ice"
  | "Fighting" | "Poison" | "Ground" | "Flying" | "Psychic" | "Bug"
  | "Rock" | "Ghost" | "Dragon" | "Dark" | "Steel" | "Fairy";

export type Role =
  | "Hazards" | "Removal" | "Speed" | "Physical" | "Special"
  | "Pivot" | "Recovery" | "Win condition" | "Wall" | "Priority";

export type Pokemon = {
  name: string;
  types: PokemonType[];
  roles: Role[];
  hardChecks: string[];
  softChecks: string[];
  note: string;
};

type Threat = {
  name: string;
  usage: number;
  types: PokemonType[];
};

export const TYPE_COLORS: Record<PokemonType, string> = {
  Normal: "#a8a77a", Fire: "#ee8130", Water: "#6390f0",
  Electric: "#f7d02c", Grass: "#7ac74c", Ice: "#96d9d6",
  Fighting: "#c22e28", Poison: "#a33ea1", Ground: "#e2bf65",
  Flying: "#a98ff3", Psychic: "#f95587", Bug: "#a6b91a",
  Rock: "#b6a136", Ghost: "#735797", Dragon: "#6f35fc",
  Dark: "#705746", Steel: "#b7b7ce", Fairy: "#d685ad",
};

const TYPES = Object.keys(TYPE_COLORS) as PokemonType[];

const TYPE_CHART: Partial<Record<PokemonType, Partial<Record<PokemonType, number>>>> = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 },
};

export const THREATS: Threat[] = [
  { name: "Great Tusk", usage: 32.1653, types: ["Ground", "Fighting"] },
  { name: "Gholdengo", usage: 26.08067, types: ["Steel", "Ghost"] },
  { name: "Kingambit", usage: 25.14462, types: ["Dark", "Steel"] },
  { name: "Zamazenta", usage: 21.2709, types: ["Fighting"] },
  { name: "Dragonite", usage: 19.48575, types: ["Dragon", "Flying"] },
  { name: "Kyurem", usage: 17.64979, types: ["Dragon", "Ice"] },
  { name: "Ogerpon-Wellspring", usage: 16.73141, types: ["Grass", "Water"] },
  { name: "Raging Bolt", usage: 15.97289, types: ["Electric", "Dragon"] },
  { name: "Iron Valiant", usage: 15.59213, types: ["Fairy", "Fighting"] },
  { name: "Hatterene", usage: 14.74568, types: ["Psychic", "Fairy"] },
  { name: "Slowking-Galar", usage: 14.16261, types: ["Poison", "Psychic"] },
  { name: "Ting-Lu", usage: 13.05937, types: ["Dark", "Ground"] },
  { name: "Gliscor", usage: 12.93407, types: ["Ground", "Flying"] },
  { name: "Iron Treads", usage: 12.88232, types: ["Ground", "Steel"] },
  { name: "Cinderace", usage: 12.76128, types: ["Fire"] },
];

export const POKEMON: Pokemon[] = [
  { name: "Great Tusk", types: ["Ground", "Fighting"], roles: ["Hazards", "Removal", "Physical", "Wall"], hardChecks: ["Kingambit", "Iron Treads"], softChecks: ["Gholdengo", "Cinderace", "Ting-Lu"], note: "Compresses hazards, removal, and physical pressure into one slot." },
  { name: "Gholdengo", types: ["Steel", "Ghost"], roles: ["Special", "Win condition"], hardChecks: ["Hatterene", "Iron Valiant"], softChecks: ["Zamazenta", "Slowking-Galar"], note: "Blocks common removal and pressures bulky teams." },
  { name: "Kingambit", types: ["Dark", "Steel"], roles: ["Physical", "Priority", "Win condition"], hardChecks: ["Gholdengo", "Hatterene", "Slowking-Galar"], softChecks: ["Kyurem"], note: "Late-game cleaner with priority and strong defensive typing." },
  { name: "Zamazenta", types: ["Fighting"], roles: ["Speed", "Physical", "Wall", "Win condition"], hardChecks: ["Kingambit"], softChecks: ["Great Tusk", "Iron Treads", "Kyurem"], note: "Fast physical blanket check that can become a win condition." },
  { name: "Dragonite", types: ["Dragon", "Flying"], roles: ["Physical", "Priority", "Win condition"], hardChecks: ["Ogerpon-Wellspring"], softChecks: ["Great Tusk", "Cinderace", "Raging Bolt"], note: "Multiscale and priority create both safety and closing power." },
  { name: "Kyurem", types: ["Dragon", "Ice"], roles: ["Special", "Win condition"], hardChecks: ["Gliscor", "Great Tusk"], softChecks: ["Ogerpon-Wellspring", "Raging Bolt"], note: "Breaks common Ground- and Flying-type defensive cores." },
  { name: "Ogerpon-Wellspring", types: ["Grass", "Water"], roles: ["Speed", "Physical", "Win condition"], hardChecks: ["Great Tusk", "Gliscor", "Ting-Lu"], softChecks: ["Ogerpon-Wellspring", "Cinderace"], note: "Punishes Ground-heavy structures while keeping offensive tempo." },
  { name: "Raging Bolt", types: ["Electric", "Dragon"], roles: ["Special", "Priority", "Win condition"], hardChecks: ["Ogerpon-Wellspring"], softChecks: ["Dragonite", "Cinderace"], note: "Bulky special attacker with valuable priority into offense." },
  { name: "Iron Valiant", types: ["Fairy", "Fighting"], roles: ["Speed", "Physical", "Special", "Win condition"], hardChecks: ["Kingambit", "Kyurem", "Ting-Lu"], softChecks: ["Dragonite", "Zamazenta"], note: "Flexible mixed attacker that forces progress." },
  { name: "Hatterene", types: ["Psychic", "Fairy"], roles: ["Special", "Recovery", "Win condition"], hardChecks: ["Great Tusk", "Zamazenta"], softChecks: ["Iron Valiant", "Ting-Lu"], note: "Magic Bounce deters hazards while Calm Mind offers a win path." },
  { name: "Slowking-Galar", types: ["Poison", "Psychic"], roles: ["Pivot", "Recovery", "Wall", "Special"], hardChecks: ["Iron Valiant", "Zamazenta"], softChecks: ["Kyurem", "Raging Bolt", "Hatterene"], note: "Special sponge and slow pivot that safely brings attackers in." },
  { name: "Ting-Lu", types: ["Dark", "Ground"], roles: ["Hazards", "Wall"], hardChecks: ["Gholdengo", "Raging Bolt"], softChecks: ["Cinderace"], note: "Special bulk, hazards, and phazing stabilize aggressive teams." },
  { name: "Gliscor", types: ["Ground", "Flying"], roles: ["Hazards", "Recovery", "Wall"], hardChecks: ["Great Tusk", "Iron Treads"], softChecks: ["Zamazenta", "Cinderace", "Kingambit"], note: "Long-term physical utility with status absorption and recovery." },
  { name: "Iron Treads", types: ["Ground", "Steel"], roles: ["Hazards", "Removal", "Speed", "Physical"], hardChecks: ["Gholdengo", "Raging Bolt"], softChecks: ["Kingambit", "Hatterene"], note: "Faster utility with hazard control and momentum." },
  { name: "Cinderace", types: ["Fire"], roles: ["Speed", "Removal", "Pivot", "Physical"], hardChecks: ["Gholdengo"], softChecks: ["Kingambit", "Iron Valiant", "Hatterene"], note: "Fast pivot with Court Change to reverse hazard pressure." },
  { name: "Samurott-Hisui", types: ["Water", "Dark"], roles: ["Hazards", "Physical"], hardChecks: ["Gholdengo", "Ting-Lu"], softChecks: ["Cinderace", "Slowking-Galar"], note: "Creates hazards while attacking, preserving tempo." },
  { name: "Dragapult", types: ["Dragon", "Ghost"], roles: ["Speed", "Pivot", "Special"], hardChecks: ["Iron Valiant"], softChecks: ["Cinderace", "Ogerpon-Wellspring"], note: "Elite speed control and flexible pivoting." },
  { name: "Corviknight", types: ["Flying", "Steel"], roles: ["Removal", "Pivot", "Recovery", "Wall"], hardChecks: ["Great Tusk", "Gliscor", "Iron Treads"], softChecks: ["Dragonite", "Iron Valiant"], note: "Reliable physical wall, remover, and slow pivot." },
  { name: "Landorus-Therian", types: ["Ground", "Flying"], roles: ["Hazards", "Pivot", "Physical"], hardChecks: ["Great Tusk", "Iron Treads"], softChecks: ["Kingambit", "Zamazenta", "Cinderace"], note: "Intimidate, Stealth Rock, and U-turn supply role compression." },
  { name: "Alomomola", types: ["Water"], roles: ["Pivot", "Recovery", "Wall"], hardChecks: ["Cinderace"], softChecks: ["Great Tusk", "Kingambit", "Zamazenta"], note: "Wish support and Regenerator extend defensive lifespan." },
  { name: "Moltres", types: ["Fire", "Flying"], roles: ["Pivot", "Recovery", "Wall", "Special"], hardChecks: ["Zamazenta"], softChecks: ["Great Tusk", "Iron Valiant", "Cinderace"], note: "Checks physical attackers while threatening burns." },
  { name: "Zapdos", types: ["Electric", "Flying"], roles: ["Pivot", "Recovery", "Wall", "Special"], hardChecks: ["Great Tusk", "Zamazenta"], softChecks: ["Ogerpon-Wellspring", "Iron Valiant"], note: "Ground immunity, recovery, and Static punish contact." },
  { name: "Clefable", types: ["Fairy"], roles: ["Hazards", "Recovery", "Wall", "Special"], hardChecks: ["Dragonite", "Kyurem"], softChecks: ["Iron Valiant", "Ting-Lu"], note: "Flexible glue with recovery, rocks, and Dragon immunity." },
  { name: "Primarina", types: ["Water", "Fairy"], roles: ["Special"], hardChecks: ["Dragonite", "Kyurem"], softChecks: ["Great Tusk", "Cinderace", "Ting-Lu"], note: "Strong special breaker with useful defensive matchups." },
  { name: "Heatran", types: ["Fire", "Steel"], roles: ["Hazards", "Special", "Wall"], hardChecks: ["Gholdengo", "Hatterene"], softChecks: ["Kyurem", "Cinderace", "Slowking-Galar"], note: "Traps passive targets and checks many special attackers." },
];

export const REQUIRED_ROLES: Role[] = [
  "Hazards", "Removal", "Speed", "Physical",
  "Special", "Pivot", "Recovery", "Win condition",
];

export const DEFAULT_TEAM = [
  "Great Tusk", "Gholdengo", "Dragonite",
  "Ogerpon-Wellspring", "Slowking-Galar", "Kingambit",
];

export const BULKY_TEAM = [
  "Gliscor", "Corviknight", "Slowking-Galar",
  "Clefable", "Zamazenta", "Dragapult",
];

function effectiveness(attack: PokemonType, defender: PokemonType[]) {
  return defender.reduce(
    (multiplier, type) => multiplier * (TYPE_CHART[attack]?.[type] ?? 1),
    1,
  );
}

function answerScore(candidate: Pokemon, threat: Threat) {
  if (candidate.hardChecks.includes(threat.name)) return 0.95;
  if (candidate.softChecks.includes(threat.name)) return 0.72;

  const incoming = Math.max(
    ...threat.types.map((type) => effectiveness(type, candidate.types)),
  );
  const pressure = Math.max(
    ...candidate.types.map((type) => effectiveness(type, threat.types)),
  );

  if (incoming <= 0.5 && pressure >= 2) return 0.64;
  if (incoming <= 0.5) return 0.5;
  if (incoming <= 1 && pressure >= 2) return 0.56;
  if (pressure >= 2) return 0.42;
  if (incoming <= 1) return 0.28;
  return 0.1;
}

export function analyze(teamNames: string[]) {
  const team = teamNames
    .map((name) => POKEMON.find((pokemon) => pokemon.name === name))
    .filter(Boolean) as Pokemon[];
  const totalUsage = THREATS.reduce((sum, threat) => sum + threat.usage, 0);

  const threatRows = THREATS.map((threat) => {
    const answers = team
      .map((pokemon) => ({ pokemon, score: answerScore(pokemon, threat) }))
      .sort((a, b) => b.score - a.score);
    const best = answers[0];
    const backup = answers[1];
    const coverage = best
      ? Math.min(0.98, best.score + (backup?.score ?? 0) * 0.12)
      : 0;
    return { ...threat, coverage, best, backup };
  });

  const metaCoverage = team.length
    ? (threatRows.reduce(
        (sum, threat) => sum + threat.coverage * threat.usage,
        0,
      ) / totalUsage) * 100
    : 0;

  const presentRoles = new Set(team.flatMap((pokemon) => pokemon.roles));
  const roleScore =
    (REQUIRED_ROLES.filter((role) => presentRoles.has(role)).length /
      REQUIRED_ROLES.length) *
    100;

  const resilience = team.length
    ? (TYPES.reduce((sum, attackType) => {
        const weaknesses = team.filter(
          (pokemon) => effectiveness(attackType, pokemon.types) > 1,
        ).length;
        const resists = team.filter(
          (pokemon) => effectiveness(attackType, pokemon.types) < 1,
        ).length;
        const overload = Math.max(0, weaknesses - resists - 1);
        return sum + Math.max(0.25, 1 - overload * 0.22);
      }, 0) /
        TYPES.length) *
      100
    : 0;

  const completeness = Math.min(1, team.length / 6);
  const overall =
    (metaCoverage * 0.55 + roleScore * 0.25 + resilience * 0.2) *
    completeness;

  return {
    team,
    threatRows,
    metaCoverage,
    roleScore,
    resilience,
    overall,
    presentRoles,
    missingRoles: REQUIRED_ROLES.filter((role) => !presentRoles.has(role)),
  };
}
