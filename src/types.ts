export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
export type Rarity = typeof RARITIES[number];

export const SPECIES = ['cat', 'dragon', 'duck', 'robot', 'ghost'] as const;
export type Species = typeof SPECIES[number];

export const EYES = ['·', '✦', '◉', '@', '°', '×'] as const;
export type Eye = typeof EYES[number];

export const HATS = ['none', 'crown', 'beanie', 'wizard', 'propeller'] as const;
export type Hat = typeof HATS[number];

export const STAT_NAMES = ['DEBUGGING', 'PATIENCE', 'CHAOS', 'WISDOM', 'SNARK'] as const;
export type StatName = typeof STAT_NAMES[number];

export type CompanionBones = {
  name: string;
  rarity: Rarity;
  species: Species;
  eye: Eye;
  hat: Hat;
  shiny: boolean;
  stats: Record<StatName, number>;
};

export type CompanionSoul = {
  name: string;
  personality: string;
};

export type Companion = CompanionBones & CompanionSoul & {
  level: number;
  xp: number;
  hatchedAt: number;
};

export type BuddyFile = {
  version: 1;
  owner: string;
  hatchedAt: number;
  bones: CompanionBones;
  sig: string;
};

export type BuddyLoadResult = {
  bones: CompanionBones;
  corrupted: boolean;
};

export const RARITY_WEIGHTS = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
} as const satisfies Record<Rarity, number>;
