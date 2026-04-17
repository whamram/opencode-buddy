import os from "node:os";
import type { CompanionBones, Rarity, Species, StatName } from "./types.js";
import {
  EYES,
  HATS,
  RARITIES,
  RARITY_WEIGHTS,
  SPECIES,
  STAT_NAMES
} from "./types.js";

const SPECIES_NAMES: Record<Species, string[]> = {
  duck: [
    "Waddle", "Quackers", "Puddle", "Noodle", "Mallard",
    "Dabble", "Pebble", "Splash", "Bill", "Marsh",
    "Pond", "Ripple", "Dewey", "Paddles", "Drake",
    "Muddy", "Reeds", "Brooks", "Plop", "Ducky",
  ],
  goose: [
    "Honk", "Gander", "Gosling", "Branta", "Cob",
    "Tundra", "Flock", "Beak", "Feather", "Migrate",
    "Nest", "Skyes", "Wings", "Snowgoose", "Glider",
    "Trumpet", "Lake", "Cornfield", "Winter", "Wader",
  ],
  blob: [
    "Blobby", "Squish", "Jello", "Pudding", "Goo",
    "Drip", "Wobble", "Mochi", "Slime", "Glop",
    "Gummy", "Plop", "Shmear", "Ooze", "Wiggle",
    "Bloop", "Squash", "Jiggle", "Mush", "Droplet",
  ],
  cat: [
    "Whiskers", "Patches", "Mittens", "Shadow", "Luna",
    "Mochi", "Cleo", "Noodle", "Beans", "Pixel",
    "Ziggy", "Hazel", "Tuna", "Velvet", "Marmalade",
    "Socks", "Biscuit", "Pip", "Fig", "Dot",
  ],
  dragon: [
    "Ember", "Fafnir", "Smauglet", "Drift", "Pyra",
    "Ashwick", "Scorch", "Talon", "Flint", "Vortex",
    "Cinder", "Ignis", "Blaze", "Stormscale", "Furnace",
    "Falkor", "Drak", "Magma", "Kindle", "Ash",
  ],
  octopus: [
    "Inky", "Squiggles", "Tentacle", "Coral", "Kelp",
    "Bubbles", "Nautilus", "Squirt", "Suction", "Pearl",
    "Titan", "Kraken", "Gilly", "Wave", "Marina",
    "Sushi", "Dive", "Sebastian", "Abyss", "Neptune",
  ],
  owl: [
    "Hedwig", "Athene", "Noctis", "Plume", "Hooter",
    "Wiseacre", "Tyto", "Barnaby", "Pallid", "Sova",
    "Beaker", "Screech", "Pudgy", "Owliver", "Feather",
    "Twilight", "Pellet", "Hoot", "Moonbeam", "Who",
  ],
  penguin: [
    "Waddle", "Chillie", "Igloo", "Tux", "Frost",
    "Pebble", "Slide", "Arctic", "Icecap", "Puddles",
    "Skipper", "Kowalski", "Rico", "Glider", "Apten",
    "Blizzard", "Snowball", "Sleet", "Boreal", "Jolly",
  ],
  turtle: [
    "Shelldon", "Turbo", "Tank", "Clementine", "Moosh",
    "Crawl", "Pebble", "Mossy", "Slowpoke", "Snapper",
    "River", "Pond", "Lakeside", "Crush", "Archy",
    "Marble", "Jade", "Olive", "Map", "Leatherback",
  ],
  snail: [
    "Sheldon", "Slimey", "Gastropod", "Trail", "Glacier",
    "Slick", "Winston", "Drip", "Crawl", "Coil",
    "Helix", "Escargot", "Snippy", "Spira", "Goober",
    "Nimbus", "Slither", "Dash", "Turbo", "Mellow",
  ],
  ghost: [
    "Specter", "Breeze", "Wisp", "Hollow", "Phantom",
    "Echo", "Shade", "Murmur", "Misty", "Chill",
    "Veil", "Wraith", "Frost", "Shimmer", "Fog",
    "Cold", "Moan", "Glimmer", "Trace", "Void",
  ],
  axolotl: [
    "Gill", "Lottie", "Neoteny", "Reggie", "Frills",
    "Ambystoma", "Canal", "Xochi", "Agua", "Tenoch",
    "Waters", "Gills", "Smiles", "Mud", "Lake",
    "Salamander", "Coral", "Bubbles", "Weed", "Zen",
  ],
  capybara: [
    "Cappy", "Bara", "Chillston", "Meadow", "Hydro",
    "Puddle", "Grass", "Therapy", "Naptime", "Zen",
    "Marshy", "River", "Pal", "Buddy", "Mongo",
    "Rodrigo", "Hammock", "Pillow", "Slowday", "Ponder",
  ],
  cactus: [
    "Spike", "Prickle", "Saguaro", "Barrel", "Cholla",
    "Pincushion", "Needles", "Thorn", "Poker", "Petal",
    "Aloe", "Pads", "Bloom", "Desert", "Flora",
    "Sandstorm", "Oasis", "Tumble", "Sunburn", "Cactoad",
  ],
  robot: [
    "Bolt", "Unit", "Pixel", "Zero", "Circuit",
    "Glitch", "Byte", "Spark", "Rusty", "Servo",
    "Relay", "Diode", "Matrix", "Chip", "Probe",
    "Weld", "Socket", "Qubit", "Arc", "Fuse",
  ],
  rabbit: [
    "Cottontail", "Thumper", "Clover", "Dandelion", "Bun",
    "Carrots", "Flopsy", "Hazel", "Fiver", "Briar",
    "Nibbles", "Patches", "Whisker", "Binky", "Digger",
    "Spring", "Twitch", "Bounce", "Lop", "Hopper",
  ],
  mushroom: [
    "Spore", "Cap", "Gills", "Morel", "Truffle",
    "Chanterelle", "Shiitake", "Porto", "Button", "Enoki",
    "Fungus", "Mycel", "Mycelium", "Shroomy", "Toadstool",
    "FairyRing", "Puffball", "Agaric", "Oyster", "Lichen",
  ],
  chonk: [
    "Biggs", "Chonk", "Muffin", "Dumpling", "Pudge",
    "Girth", "Fluff", "Hefty", "Boulder", "Giblet",
    "Pudgeball", "Squishy", "Thiccy", "Loaf", "Pillow",
    "Gordo", "Plump", "Roly", "Butterball", "Chunk",
  ],
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  return Number(BigInt(Bun.hash(s)) & 0xffffffffn);
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)] as T;
}

function rollRarity(rng: () => number): Rarity {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (const rarity of RARITIES) {
    roll -= RARITY_WEIGHTS[rarity];
    if (roll < 0) return rarity;
  }
  return "common";
}

const RARITY_FLOOR: Record<Rarity, number> = {
  common: 5,
  uncommon: 15,
  rare: 25,
  epic: 35,
  legendary: 50,
};

function rollStats(rng: () => number, rarity: Rarity): Record<StatName, number> {
  const floor = RARITY_FLOOR[rarity];
  const peak = pick(rng, STAT_NAMES);
  let dump = pick(rng, STAT_NAMES);
  while (dump === peak) dump = pick(rng, STAT_NAMES);

  const stats = {} as Record<StatName, number>;
  for (const name of STAT_NAMES) {
    if (name === peak) {
      stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30));
    } else if (name === dump) {
      stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15));
    } else {
      stats[name] = floor + Math.floor(rng() * 40);
    }
  }
  return stats;
}

export const SALT = "friend-2026-opencode";

export function generateBones(identifier: string): CompanionBones {
  const seedHash = hashString(identifier + SALT);
  const rng = mulberry32(seedHash);

  const rarity = rollRarity(rng);
  const species = pick(rng, SPECIES);

  return {
    name: pick(rng, SPECIES_NAMES[species]),
    rarity,
    species,
    eye: pick(rng, EYES),
    hat: rarity === "common" ? "none" : pick(rng, HATS),
    shiny: rng() < 0.01,
    stats: rollStats(rng, rarity),
  };
}

export function getMyBones(): CompanionBones {
  const username = os.userInfo().username || "defaultUser";
  return generateBones(username);
}