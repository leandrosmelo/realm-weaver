// Deterministic pseudo-random hash for procedural terrain
function hash(x: number, y: number, seed: number = 42): number {
  let h = seed;
  h = ((h << 5) + h + x) | 0;
  h = ((h << 5) + h + y) | 0;
  h = ((h << 5) + h + (x * 31)) | 0;
  h = ((h << 5) + h + (y * 17)) | 0;
  return ((h & 0x7fffffff) % 1000) / 1000;
}

// Simple value noise for smoother terrain
function noise2D(x: number, y: number, scale: number, seed: number): number {
  const sx = x / scale;
  const sy = y / scale;
  const ix = Math.floor(sx);
  const iy = Math.floor(sy);
  const fx = sx - ix;
  const fy = sy - iy;

  const a = hash(ix, iy, seed);
  const b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed);
  const d = hash(ix + 1, iy + 1, seed);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
}

// Layered noise for more natural terrain
function fractalNoise(x: number, y: number, seed: number): number {
  let val = 0;
  val += noise2D(x, y, 40, seed) * 0.5;
  val += noise2D(x, y, 20, seed + 100) * 0.3;
  val += noise2D(x, y, 10, seed + 200) * 0.15;
  val += noise2D(x, y, 5, seed + 300) * 0.05;
  return val;
}

export enum TerrainType {
  DeepWater = 0,
  ShallowWater = 1,
  Sand = 2,
  Grass = 3,
  DarkGrass = 4,
  Forest = 5,
  DenseForest = 6,
  Stone = 7,
  Mountain = 8,
  Snow = 9,
  Path = 10,
  Lava = 11,
}

// Color palettes for pixel art (dark fantasy theme)
export const TERRAIN_COLORS: Record<TerrainType, string[]> = {
  [TerrainType.DeepWater]:   ["#1a2744", "#1e2d4d", "#162240"],
  [TerrainType.ShallowWater]:["#2a4a6b", "#2e5070", "#264565"],
  [TerrainType.Sand]:        ["#8b7355", "#937b5d", "#836b4d"],
  [TerrainType.Grass]:       ["#3a5a2e", "#3f6032", "#35542a"],
  [TerrainType.DarkGrass]:   ["#2d4a22", "#325026", "#28441e"],
  [TerrainType.Forest]:      ["#1e3a16", "#234018", "#193414"],
  [TerrainType.DenseForest]: ["#142e10", "#183412", "#10280e"],
  [TerrainType.Stone]:       ["#5a5a5a", "#606060", "#545454"],
  [TerrainType.Mountain]:    ["#4a4a4a", "#505050", "#444444"],
  [TerrainType.Snow]:        ["#c8c8d0", "#d0d0d8", "#c0c0c8"],
  [TerrainType.Path]:        ["#6b5a42", "#73624a", "#63523a"],
  [TerrainType.Lava]:        ["#8b2500", "#a03000", "#7a2000"],
};

// Highlight colors for tile edges (lighter shade)
export const TERRAIN_EDGE_COLORS: Record<TerrainType, string> = {
  [TerrainType.DeepWater]:   "#243560",
  [TerrainType.ShallowWater]:"#3a6090",
  [TerrainType.Sand]:        "#a08868",
  [TerrainType.Grass]:       "#4a7038",
  [TerrainType.DarkGrass]:   "#3a6030",
  [TerrainType.Forest]:      "#2a5020",
  [TerrainType.DenseForest]: "#204018",
  [TerrainType.Stone]:       "#707070",
  [TerrainType.Mountain]:    "#606060",
  [TerrainType.Snow]:        "#e0e0e8",
  [TerrainType.Path]:        "#806848",
  [TerrainType.Lava]:        "#c04010",
};

// Shadow colors for tile edges (darker shade)
export const TERRAIN_SHADOW_COLORS: Record<TerrainType, string> = {
  [TerrainType.DeepWater]:   "#101830",
  [TerrainType.ShallowWater]:"#1a3050",
  [TerrainType.Sand]:        "#6b5a40",
  [TerrainType.Grass]:       "#2a4020",
  [TerrainType.DarkGrass]:   "#1e3515",
  [TerrainType.Forest]:      "#122a0e",
  [TerrainType.DenseForest]: "#0a1e08",
  [TerrainType.Stone]:       "#404040",
  [TerrainType.Mountain]:    "#353535",
  [TerrainType.Snow]:        "#9090a0",
  [TerrainType.Path]:        "#504030",
  [TerrainType.Lava]:        "#601800",
};

export function getTerrainAt(col: number, row: number, seed: number = 42): TerrainType {
  const elevation = fractalNoise(col, row, seed);
  const moisture = fractalNoise(col, row, seed + 500);
  const temperature = fractalNoise(col, row, seed + 1000);

  // Generate paths along certain corridors
  const pathNoise = noise2D(col, row, 60, seed + 2000);
  if (pathNoise > 0.48 && pathNoise < 0.52 && elevation > 0.25 && elevation < 0.7) {
    return TerrainType.Path;
  }

  // Lava in hot low areas
  if (temperature > 0.8 && elevation > 0.55 && elevation < 0.65) {
    return TerrainType.Lava;
  }

  if (elevation < 0.2) return TerrainType.DeepWater;
  if (elevation < 0.28) return TerrainType.ShallowWater;
  if (elevation < 0.32) return TerrainType.Sand;
  if (elevation < 0.45) {
    if (moisture > 0.55) return TerrainType.Forest;
    if (moisture > 0.4) return TerrainType.DarkGrass;
    return TerrainType.Grass;
  }
  if (elevation < 0.6) {
    if (moisture > 0.6) return TerrainType.DenseForest;
    if (moisture > 0.45) return TerrainType.Forest;
    return TerrainType.DarkGrass;
  }
  if (elevation < 0.72) return TerrainType.Stone;
  if (elevation < 0.85) return TerrainType.Mountain;
  return TerrainType.Snow;
}

// Get the tile color with slight per-tile variation
export function getTileColor(col: number, row: number, terrain: TerrainType): string {
  const colors = TERRAIN_COLORS[terrain];
  const idx = Math.abs((col * 7 + row * 13) % colors.length);
  return colors[idx];
}

// Special locations on the map
export interface MapLocation {
  col: number;
  row: number;
  name: string;
  type: "town" | "dungeon" | "mine" | "forest" | "boss" | "mountain";
  discovered: boolean;
  icon: string;
}

export const MAP_LOCATIONS: MapLocation[] = [
  { col: 80, row: 100, name: "Elderwood Village", type: "town", discovered: true, icon: "🏰" },
  { col: 300, row: 80, name: "Shadow Keep", type: "dungeon", discovered: true, icon: "💀" },
  { col: 200, row: 250, name: "Crystal Caverns", type: "mine", discovered: true, icon: "💎" },
  { col: 380, row: 350, name: "Misty Mountains", type: "mountain", discovered: false, icon: "⛰️" },
  { col: 120, row: 350, name: "Ancient Forest", type: "forest", discovered: true, icon: "🌲" },
  { col: 250, row: 50, name: "Dragon's Lair", type: "boss", discovered: false, icon: "🐉" },
  { col: 400, row: 200, name: "Forgotten Temple", type: "dungeon", discovered: true, icon: "🏛️" },
  { col: 60, row: 220, name: "Mystic Lake", type: "forest", discovered: true, icon: "🌊" },
  { col: 320, row: 420, name: "Obsidian Fortress", type: "dungeon", discovered: false, icon: "🏴" },
  { col: 180, row: 150, name: "Trader's Rest", type: "town", discovered: true, icon: "🏪" },
];

export const PLAYER_POSITION = { col: 80, row: 100 };
