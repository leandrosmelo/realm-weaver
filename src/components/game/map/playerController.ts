// Player movement controller
// Handles WASD/arrow keys and click-to-move

import { TerrainType, getTerrainAt } from "./terrainGenerator";

const MAP_SIZE = 500;

export interface PlayerState {
  col: number;
  row: number;
  targetCol: number;
  targetRow: number;
  // Smooth interpolation position
  visualCol: number;
  visualRow: number;
  moving: boolean;
  direction: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "idle";
  speed: number; // tiles per second
}

export function createPlayerState(col: number, row: number): PlayerState {
  return {
    col,
    row,
    targetCol: col,
    targetRow: row,
    visualCol: col,
    visualRow: row,
    moving: false,
    direction: "idle",
    speed: 6,
  };
}

// Check if terrain is walkable
export function isWalkable(terrain: TerrainType): boolean {
  switch (terrain) {
    case TerrainType.DeepWater:
    case TerrainType.Lava:
    case TerrainType.Mountain:
      return false;
    default:
      return true;
  }
}

// Get terrain movement speed modifier
export function getSpeedModifier(terrain: TerrainType): number {
  switch (terrain) {
    case TerrainType.Path: return 1.5;
    case TerrainType.Grass: return 1.0;
    case TerrainType.DarkGrass: return 0.9;
    case TerrainType.Sand: return 0.7;
    case TerrainType.ShallowWater: return 0.5;
    case TerrainType.Forest: return 0.6;
    case TerrainType.DenseForest: return 0.4;
    case TerrainType.Stone: return 0.8;
    case TerrainType.Snow: return 0.6;
    default: return 1.0;
  }
}

export type KeyState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export function getDirectionFromKeys(keys: KeyState): { dx: number; dy: number; dir: PlayerState["direction"] } {
  let dx = 0;
  let dy = 0;

  // Isometric: up = -col,-row; down = +col,+row; left = -col,+row; right = +col,-row
  if (keys.up) { dx -= 1; dy -= 1; }
  if (keys.down) { dx += 1; dy += 1; }
  if (keys.left) { dx -= 1; dy += 1; }
  if (keys.right) { dx += 1; dy -= 1; }

  // Clamp
  if (dx !== 0 && dy !== 0) {
    // Normalize for diagonal movement
    const len = Math.sqrt(dx * dx + dy * dy);
    dx /= len;
    dy /= len;
  }

  let dir: PlayerState["direction"] = "idle";
  if (dx < 0 && dy < 0) dir = "nw";
  else if (dx > 0 && dy > 0) dir = "se";
  else if (dx < 0 && dy > 0) dir = "sw";
  else if (dx > 0 && dy < 0) dir = "ne";
  else if (dx < 0) dir = "w";
  else if (dx > 0) dir = "e";
  else if (dy < 0) dir = "n";
  else if (dy > 0) dir = "s";

  return { dx, dy, dir };
}

export function updatePlayer(
  player: PlayerState,
  keys: KeyState,
  deltaTime: number,
  seed: number
): PlayerState {
  const { dx, dy, dir } = getDirectionFromKeys(keys);

  if (dx === 0 && dy === 0 && !player.moving) {
    // Smooth visual lerp even when idle
    return {
      ...player,
      direction: "idle",
      visualCol: player.visualCol + (player.col - player.visualCol) * 0.2,
      visualRow: player.visualRow + (player.row - player.visualRow) * 0.2,
    };
  }

  let newCol = player.col;
  let newRow = player.row;

  if (dx !== 0 || dy !== 0) {
    // Keyboard movement
    const terrain = getTerrainAt(player.col, player.row, seed);
    const speedMod = getSpeedModifier(terrain);
    const moveAmount = player.speed * speedMod * deltaTime;

    const candidateCol = player.visualCol + dx * moveAmount;
    const candidateRow = player.visualRow + dy * moveAmount;

    // Check walkability at destination
    const destCol = Math.round(candidateCol);
    const destRow = Math.round(candidateRow);

    if (
      destCol >= 0 && destCol < MAP_SIZE &&
      destRow >= 0 && destRow < MAP_SIZE &&
      isWalkable(getTerrainAt(destCol, destRow, seed))
    ) {
      newCol = destCol;
      newRow = destRow;

      return {
        ...player,
        col: newCol,
        row: newRow,
        visualCol: candidateCol,
        visualRow: candidateRow,
        moving: true,
        direction: dir,
      };
    } else {
      // Blocked - try sliding along one axis
      const slideCol = Math.round(player.visualCol + dx * moveAmount);
      const slideRow = player.row;
      if (
        slideCol >= 0 && slideCol < MAP_SIZE &&
        isWalkable(getTerrainAt(slideCol, slideRow, seed))
      ) {
        return {
          ...player,
          col: slideCol,
          row: slideRow,
          visualCol: player.visualCol + dx * moveAmount,
          visualRow: player.visualRow + (player.row - player.visualRow) * 0.2,
          moving: true,
          direction: dir,
        };
      }
      const slideCol2 = player.col;
      const slideRow2 = Math.round(player.visualRow + dy * moveAmount);
      if (
        slideRow2 >= 0 && slideRow2 < MAP_SIZE &&
        isWalkable(getTerrainAt(slideCol2, slideRow2, seed))
      ) {
        return {
          ...player,
          col: slideCol2,
          row: slideRow2,
          visualCol: player.visualCol + (player.col - player.visualCol) * 0.2,
          visualRow: player.visualRow + dy * moveAmount,
          moving: true,
          direction: dir,
        };
      }
    }
  }

  // Click-to-move: smooth lerp towards target
  if (player.moving && (player.targetCol !== player.col || player.targetRow !== player.row)) {
    const tdx = player.targetCol - player.visualCol;
    const tdy = player.targetRow - player.visualRow;
    const dist = Math.sqrt(tdx * tdx + tdy * tdy);

    if (dist < 0.3) {
      return {
        ...player,
        col: player.targetCol,
        row: player.targetRow,
        visualCol: player.targetCol,
        visualRow: player.targetRow,
        moving: false,
        direction: "idle",
      };
    }

    const terrain = getTerrainAt(Math.round(player.visualCol), Math.round(player.visualRow), seed);
    const speedMod = getSpeedModifier(terrain);
    const moveSpeed = player.speed * speedMod * deltaTime;
    const ndx = (tdx / dist) * moveSpeed;
    const ndy = (tdy / dist) * moveSpeed;

    const nextVisCol = player.visualCol + ndx;
    const nextVisRow = player.visualRow + ndy;
    const nextCol = Math.round(nextVisCol);
    const nextRow = Math.round(nextVisRow);

    if (isWalkable(getTerrainAt(nextCol, nextRow, seed))) {
      return {
        ...player,
        col: nextCol,
        row: nextRow,
        visualCol: nextVisCol,
        visualRow: nextVisRow,
        moving: true,
        direction: tdx > 0 ? (tdy > 0 ? "se" : "ne") : (tdy > 0 ? "sw" : "nw"),
      };
    } else {
      return { ...player, moving: false, targetCol: player.col, targetRow: player.row, direction: "idle" };
    }
  }

  // Smooth visual approach
  return {
    ...player,
    visualCol: player.visualCol + (player.col - player.visualCol) * 0.15,
    visualRow: player.visualRow + (player.row - player.visualRow) * 0.15,
    moving: false,
    direction: dir === "idle" ? player.direction : dir,
  };
}

// Draw the player character (pixel art knight)
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  zoom: number,
  direction: PlayerState["direction"],
  time: number
) {
  const z = zoom;
  const bobOffset = Math.sin(time * 6) * 1.5 * z;
  const py = screenY - 4 * z + (direction !== "idle" ? bobOffset : 0);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(screenX, screenY + 2 * z, 5 * z, 2 * z, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = "#3a5090";
  ctx.fillRect(screenX - 3 * z, py - 10 * z, 6 * z, 8 * z);

  // Armor highlight
  ctx.fillStyle = "#5070b0";
  ctx.fillRect(screenX - 2 * z, py - 9 * z, 4 * z, 3 * z);

  // Head
  ctx.fillStyle = "#d4a870";
  ctx.fillRect(screenX - 2.5 * z, py - 14 * z, 5 * z, 4 * z);

  // Helmet
  ctx.fillStyle = "#707080";
  ctx.fillRect(screenX - 3 * z, py - 15 * z, 6 * z, 2 * z);
  ctx.fillStyle = "#808090";
  ctx.fillRect(screenX - 1 * z, py - 16.5 * z, 2 * z, 2 * z);

  // Eyes (direction-based)
  ctx.fillStyle = "#2a2a3a";
  if (direction === "w" || direction === "sw" || direction === "nw") {
    ctx.fillRect(screenX - 2 * z, py - 12.5 * z, 1 * z, 1 * z);
  } else if (direction === "e" || direction === "se" || direction === "ne") {
    ctx.fillRect(screenX + 1 * z, py - 12.5 * z, 1 * z, 1 * z);
  } else {
    ctx.fillRect(screenX - 1.5 * z, py - 12.5 * z, 1 * z, 1 * z);
    ctx.fillRect(screenX + 0.5 * z, py - 12.5 * z, 1 * z, 1 * z);
  }

  // Shield (left side)
  ctx.fillStyle = "#8a6030";
  ctx.fillRect(screenX - 5 * z, py - 9 * z, 2 * z, 5 * z);
  ctx.fillStyle = "#d4a844";
  ctx.fillRect(screenX - 4.5 * z, py - 8 * z, 1 * z, 3 * z);

  // Sword (right side, animated)
  const swordAngle = direction !== "idle" ? Math.sin(time * 8) * 0.3 : 0;
  ctx.save();
  ctx.translate(screenX + 4 * z, py - 6 * z);
  ctx.rotate(swordAngle);
  ctx.fillStyle = "#c0c0d0";
  ctx.fillRect(-0.5 * z, -8 * z, 1 * z, 7 * z);
  ctx.fillStyle = "#8a7030";
  ctx.fillRect(-1 * z, -1 * z, 2 * z, 1.5 * z);
  ctx.restore();

  // Legs (walking animation)
  ctx.fillStyle = "#2a3060";
  if (direction !== "idle") {
    const legOffset = Math.sin(time * 8) * 2 * z;
    ctx.fillRect(screenX - 2 * z, py - 2 * z + legOffset, 2 * z, 3 * z);
    ctx.fillRect(screenX, py - 2 * z - legOffset, 2 * z, 3 * z);
  } else {
    ctx.fillRect(screenX - 2 * z, py - 2 * z, 2 * z, 3 * z);
    ctx.fillRect(screenX, py - 2 * z, 2 * z, 3 * z);
  }

  // Boots
  ctx.fillStyle = "#5a4030";
  if (direction !== "idle") {
    const legOffset = Math.sin(time * 8) * 2 * z;
    ctx.fillRect(screenX - 2.5 * z, py + 1 * z + legOffset, 2.5 * z, 1.5 * z);
    ctx.fillRect(screenX, py + 1 * z - legOffset, 2.5 * z, 1.5 * z);
  } else {
    ctx.fillRect(screenX - 2.5 * z, py + 1 * z, 2.5 * z, 1.5 * z);
    ctx.fillRect(screenX, py + 1 * z, 2.5 * z, 1.5 * z);
  }

  // Name tag
  ctx.font = `bold ${Math.max(7, 9 * z)}px 'Inter', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#d4a844";
  ctx.fillText("You", screenX, py - 18 * z);
}
