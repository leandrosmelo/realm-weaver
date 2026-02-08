// Pixel-art isometric building renderer
// Draws buildings using canvas primitives in isometric perspective

const TILE_W = 32;
const TILE_H = 16;

interface DrawContext {
  ctx: CanvasRenderingContext2D;
  x: number; // screen center X of the tile
  y: number; // screen center Y of the tile
  zoom: number;
}

// Helper: draw an isometric box (base building block)
function drawIsoBox(
  { ctx, x, y, zoom }: DrawContext,
  width: number,
  depth: number,
  height: number,
  topColor: string,
  rightColor: string,
  leftColor: string,
  offsetY: number = 0
) {
  const w = width * zoom;
  const d = depth * zoom;
  const h = height * zoom;
  const oy = offsetY * zoom;

  // Calculate isometric corners for the box
  const tw = (TILE_W / 2) * zoom;
  const th = (TILE_H / 2) * zoom;

  // Scale ratios
  const wr = width / TILE_W;
  const dr = depth / TILE_W;

  const topY = y - oy - h;

  // Top face
  ctx.beginPath();
  ctx.moveTo(x, topY - th * dr);
  ctx.lineTo(x + tw * wr, topY);
  ctx.lineTo(x, topY + th * dr);
  ctx.lineTo(x - tw * wr, topY);
  ctx.closePath();
  ctx.fillStyle = topColor;
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(x + tw * wr, topY);
  ctx.lineTo(x, topY + th * dr);
  ctx.lineTo(x, topY + th * dr + h);
  ctx.lineTo(x + tw * wr, topY + h);
  ctx.closePath();
  ctx.fillStyle = rightColor;
  ctx.fill();

  // Left face
  ctx.beginPath();
  ctx.moveTo(x - tw * wr, topY);
  ctx.lineTo(x, topY + th * dr);
  ctx.lineTo(x, topY + th * dr + h);
  ctx.lineTo(x - tw * wr, topY + h);
  ctx.closePath();
  ctx.fillStyle = leftColor;
  ctx.fill();

  // Outline
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = Math.max(0.5, 0.5 * zoom);
  
  // Top outline
  ctx.beginPath();
  ctx.moveTo(x, topY - th * dr);
  ctx.lineTo(x + tw * wr, topY);
  ctx.lineTo(x, topY + th * dr);
  ctx.lineTo(x - tw * wr, topY);
  ctx.closePath();
  ctx.stroke();
}

// Helper: draw a pointed roof (pyramid)
function drawPointedRoof(
  { ctx, x, y, zoom }: DrawContext,
  width: number,
  height: number,
  baseOffset: number,
  color: string,
  shadowColor: string
) {
  const tw = (TILE_W / 2) * zoom * (width / TILE_W);
  const th = (TILE_H / 2) * zoom * (width / TILE_W);
  const h = height * zoom;
  const oy = baseOffset * zoom;

  const baseY = y - oy;
  const peakY = baseY - h;

  // Right slope
  ctx.beginPath();
  ctx.moveTo(x, peakY);
  ctx.lineTo(x + tw, baseY);
  ctx.lineTo(x, baseY + th);
  ctx.closePath();
  ctx.fillStyle = shadowColor;
  ctx.fill();

  // Left slope
  ctx.beginPath();
  ctx.moveTo(x, peakY);
  ctx.lineTo(x - tw, baseY);
  ctx.lineTo(x, baseY + th);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Back slopes
  ctx.beginPath();
  ctx.moveTo(x, peakY);
  ctx.lineTo(x + tw, baseY);
  ctx.lineTo(x, baseY - th);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x, peakY);
  ctx.lineTo(x - tw, baseY);
  ctx.lineTo(x, baseY - th);
  ctx.closePath();
  ctx.fillStyle = shadowColor;
  ctx.fill();
}

// Helper: draw a window on the right face
function drawWindow(
  { ctx, x, y, zoom }: DrawContext,
  offsetX: number,
  offsetY: number,
  size: number,
  glowColor: string
) {
  const wx = x + offsetX * zoom;
  const wy = y - offsetY * zoom;
  const s = size * zoom;

  ctx.fillStyle = glowColor;
  ctx.fillRect(wx - s / 2, wy - s / 2, s, s);
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = Math.max(0.5, 0.5 * zoom);
  ctx.strokeRect(wx - s / 2, wy - s / 2, s, s);
}

// === BUILDING TYPES ===

export function drawHouse(dc: DrawContext) {
  const { ctx, zoom } = dc;
  // Stone foundation
  drawIsoBox(dc, 20, 20, 2, "#6b6b6b", "#555555", "#4a4a4a", 0);
  // Wooden walls
  drawIsoBox(dc, 18, 18, 14, "#8b7355", "#7a6348", "#6b5a42", 2);
  // Roof
  drawPointedRoof(dc, 22, 10, 16, "#8b2020", "#6b1515");
  // Door
  const doorX = dc.x + 2 * zoom;
  const doorY = dc.y - 4 * zoom;
  ctx.fillStyle = "#4a3020";
  ctx.fillRect(doorX - 2 * zoom, doorY - 5 * zoom, 4 * zoom, 5 * zoom);
  // Windows
  drawWindow(dc, 6, 12, 3, "#e8d070");
  drawWindow(dc, -5, 12, 3, "#e8d070");
}

export function drawCastle(dc: DrawContext) {
  const { ctx, x, y, zoom } = dc;
  // Main keep
  drawIsoBox(dc, 28, 28, 28, "#7a7a7a", "#5a5a5a", "#4a4a4a", 0);
  // Battlements (crenellations) - small blocks on top
  const tw = (TILE_W / 2) * zoom;
  const th = (TILE_H / 2) * zoom;
  for (let i = -1; i <= 1; i += 2) {
    for (let j = -1; j <= 1; j += 2) {
      const bx = x + i * 6 * zoom;
      const by = y - 28 * zoom + j * 3 * zoom;
      ctx.fillStyle = "#8a8a8a";
      ctx.fillRect(bx - 2 * zoom, by - 4 * zoom, 4 * zoom, 4 * zoom);
      ctx.fillStyle = "#6a6a6a";
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 0.5 * zoom;
      ctx.strokeRect(bx - 2 * zoom, by - 4 * zoom, 4 * zoom, 4 * zoom);
    }
  }

  // Left tower
  const towerDc = { ...dc, x: x - 10 * zoom, y: y + 2 * zoom };
  drawIsoBox(towerDc, 10, 10, 36, "#808080", "#606060", "#505050", 0);
  drawPointedRoof(towerDc, 12, 8, 36, "#2a4080", "#1a3060");

  // Right tower
  const towerDc2 = { ...dc, x: x + 10 * zoom, y: y - 2 * zoom };
  drawIsoBox(towerDc2, 10, 10, 36, "#808080", "#606060", "#505050", 0);
  drawPointedRoof(towerDc2, 12, 8, 36, "#2a4080", "#1a3060");

  // Gate
  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(x - 3 * zoom, y - 8 * zoom, 6 * zoom, 8 * zoom);
  // Gate arch
  ctx.beginPath();
  ctx.arc(x, y - 8 * zoom, 3 * zoom, Math.PI, 0);
  ctx.fillStyle = "#3a2a1a";
  ctx.fill();

  // Windows
  drawWindow(dc, 5, 18, 2.5, "#e8d070");
  drawWindow(dc, -5, 20, 2.5, "#e8d070");
  drawWindow(dc, 5, 24, 2.5, "#e8d070");
  drawWindow(dc, -5, 14, 2.5, "#e8d070");

  // Flag on left tower
  ctx.fillStyle = "#444";
  ctx.fillRect(towerDc.x, towerDc.y - 46 * zoom, 1 * zoom, 8 * zoom);
  ctx.fillStyle = "#cc2020";
  ctx.beginPath();
  ctx.moveTo(towerDc.x + 1 * zoom, towerDc.y - 46 * zoom);
  ctx.lineTo(towerDc.x + 7 * zoom, towerDc.y - 43 * zoom);
  ctx.lineTo(towerDc.x + 1 * zoom, towerDc.y - 40 * zoom);
  ctx.closePath();
  ctx.fill();
}

export function drawFarm(dc: DrawContext) {
  const { ctx, x, y, zoom } = dc;
  // Barn
  drawIsoBox(dc, 22, 16, 12, "#8b5530", "#7a4825", "#6b3d1e", 0);
  drawPointedRoof(dc, 24, 7, 12, "#6b2020", "#4b1010");

  // Barn door
  ctx.fillStyle = "#4a2510";
  ctx.fillRect(x - 3 * zoom, y - 4 * zoom, 6 * zoom, 6 * zoom);

  // Fence posts around
  ctx.strokeStyle = "#6b5030";
  ctx.lineWidth = Math.max(1, 1.5 * zoom);
  for (let i = -3; i <= 3; i++) {
    const fx = x + i * 5 * zoom;
    const fy = y + 10 * zoom;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx, fy - 4 * zoom);
    ctx.stroke();
  }
  // Fence horizontal
  ctx.beginPath();
  ctx.moveTo(x - 15 * zoom, y + 8 * zoom);
  ctx.lineTo(x + 15 * zoom, y + 8 * zoom);
  ctx.stroke();

  // Crop rows (small green dots)
  ctx.fillStyle = "#5a8030";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      const cx2 = x - 12 * zoom + c * 5 * zoom;
      const cy2 = y + 14 * zoom + r * 3 * zoom;
      ctx.fillRect(cx2 - zoom, cy2 - zoom, 2 * zoom, 2 * zoom);
    }
  }
}

export function drawTavern(dc: DrawContext) {
  const { ctx, x, y, zoom } = dc;
  // Main building
  drawIsoBox(dc, 24, 20, 16, "#9b7850", "#8a6a45", "#7b5c3a", 0);
  drawPointedRoof(dc, 26, 8, 16, "#5a3020", "#3a1a10");

  // Door
  ctx.fillStyle = "#4a3020";
  ctx.fillRect(x - 2.5 * zoom, y - 5 * zoom, 5 * zoom, 6 * zoom);

  // Sign board
  ctx.fillStyle = "#6b5030";
  ctx.fillRect(x + 8 * zoom, y - 18 * zoom, 1 * zoom, 10 * zoom);
  ctx.fillStyle = "#8b7040";
  ctx.fillRect(x + 5 * zoom, y - 20 * zoom, 8 * zoom, 5 * zoom);
  ctx.strokeStyle = "#4a3020";
  ctx.lineWidth = 0.5 * zoom;
  ctx.strokeRect(x + 5 * zoom, y - 20 * zoom, 8 * zoom, 5 * zoom);
  // Mug icon on sign
  ctx.fillStyle = "#d4a844";
  ctx.font = `${Math.max(4, 6 * zoom)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("🍺", x + 9 * zoom, y - 16 * zoom);

  // Chimney
  ctx.fillStyle = "#5a5050";
  ctx.fillRect(x - 6 * zoom, y - 28 * zoom, 3 * zoom, 6 * zoom);
  // Smoke
  ctx.fillStyle = "rgba(150,150,150,0.3)";
  const t = (Date.now() % 3000) / 3000;
  ctx.beginPath();
  ctx.arc(x - 5 * zoom, y - (30 + t * 8) * zoom, 2 * zoom, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 4 * zoom, y - (34 + t * 6) * zoom, 1.5 * zoom, 0, Math.PI * 2);
  ctx.fill();

  // Windows with warm glow
  drawWindow(dc, 7, 10, 3, "#f0c050");
  drawWindow(dc, -6, 10, 3, "#f0c050");
}

export function drawTemple(dc: DrawContext) {
  const { ctx, x, y, zoom } = dc;
  // Base platform
  drawIsoBox(dc, 30, 30, 3, "#c8c0b0", "#b0a898", "#a09888", 0);
  // Main building
  drawIsoBox(dc, 22, 22, 20, "#d8d0c0", "#c0b8a8", "#b0a898", 3);

  // Columns (front)
  for (let i = -1; i <= 1; i++) {
    const cx2 = x + i * 6 * zoom;
    const cy2 = y + 2 * zoom;
    ctx.fillStyle = "#d0c8b8";
    ctx.fillRect(cx2 - 1 * zoom, cy2 - 22 * zoom, 2 * zoom, 20 * zoom);
  }

  // Triangular pediment
  ctx.beginPath();
  ctx.moveTo(x - 12 * zoom, y - 22 * zoom);
  ctx.lineTo(x, y - 30 * zoom);
  ctx.lineTo(x + 12 * zoom, y - 22 * zoom);
  ctx.closePath();
  ctx.fillStyle = "#d8d0c0";
  ctx.fill();
  ctx.strokeStyle = "#a09888";
  ctx.lineWidth = 0.5 * zoom;
  ctx.stroke();

  // Dome on top
  ctx.beginPath();
  ctx.arc(x, y - 30 * zoom, 5 * zoom, Math.PI, 0);
  ctx.fillStyle = "#c0a060";
  ctx.fill();

  // Glowing entrance
  ctx.fillStyle = "rgba(212, 168, 68, 0.3)";
  ctx.fillRect(x - 3 * zoom, y - 8 * zoom, 6 * zoom, 6 * zoom);
}

export function drawTower(dc: DrawContext) {
  const { ctx, x, y, zoom } = dc;
  // Base
  drawIsoBox(dc, 12, 12, 32, "#6a6a7a", "#5a5a6a", "#4a4a5a", 0);
  // Top section slightly wider
  drawIsoBox(dc, 14, 14, 4, "#7a7a8a", "#6a6a7a", "#5a5a6a", 32);
  // Cone roof
  drawPointedRoof(dc, 16, 12, 36, "#3a2060", "#2a1050");

  // Windows spiraling up
  drawWindow(dc, 3, 10, 2, "#90c0ff");
  drawWindow(dc, -3, 18, 2, "#90c0ff");
  drawWindow(dc, 3, 26, 2, "#90c0ff");

  // Magic glow at top
  const t = (Date.now() % 2000) / 2000;
  ctx.beginPath();
  ctx.arc(x, y - 48 * zoom, (3 + Math.sin(t * Math.PI * 2) * 1.5) * zoom, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(140, 100, 255, ${0.3 + Math.sin(t * Math.PI * 2) * 0.15})`;
  ctx.fill();
}

export function drawMine(dc: DrawContext) {
  const { ctx, x, y, zoom } = dc;
  // Cave entrance frame
  ctx.fillStyle = "#5a4a3a";
  ctx.fillRect(x - 7 * zoom, y - 10 * zoom, 14 * zoom, 10 * zoom);

  // Cave opening (dark)
  ctx.fillStyle = "#1a1520";
  ctx.beginPath();
  ctx.arc(x, y - 5 * zoom, 5 * zoom, Math.PI, 0);
  ctx.fillRect(x - 5 * zoom, y - 5 * zoom, 10 * zoom, 5 * zoom);
  ctx.fill();

  // Support beams
  ctx.fillStyle = "#6b5030";
  ctx.fillRect(x - 6 * zoom, y - 10 * zoom, 2 * zoom, 10 * zoom);
  ctx.fillRect(x + 4 * zoom, y - 10 * zoom, 2 * zoom, 10 * zoom);
  ctx.fillRect(x - 6 * zoom, y - 10 * zoom, 12 * zoom, 2 * zoom);

  // Minecart tracks
  ctx.strokeStyle = "#707070";
  ctx.lineWidth = Math.max(1, 1 * zoom);
  ctx.beginPath();
  ctx.moveTo(x - 3 * zoom, y);
  ctx.lineTo(x - 4 * zoom, y + 8 * zoom);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 3 * zoom, y);
  ctx.lineTo(x + 2 * zoom, y + 8 * zoom);
  ctx.stroke();

  // Crystal sparkles inside
  ctx.fillStyle = "#80c0ff";
  ctx.fillRect(x - 2 * zoom, y - 6 * zoom, 1.5 * zoom, 1.5 * zoom);
  ctx.fillStyle = "#a0d0ff";
  ctx.fillRect(x + 1 * zoom, y - 4 * zoom, 1 * zoom, 1 * zoom);
}

export function drawDungeon(dc: DrawContext) {
  const { ctx, x, y, zoom } = dc;
  // Ruined walls
  drawIsoBox(dc, 24, 24, 14, "#4a4a4a", "#3a3a3a", "#2a2a2a", 0);

  // Broken top (jagged)
  ctx.fillStyle = "#4a4a4a";
  const heights = [3, 6, 2, 5, 4, 7, 3, 5];
  for (let i = 0; i < heights.length; i++) {
    const bx = x - 8 * zoom + i * 2.3 * zoom;
    const bh = heights[i] * zoom;
    ctx.fillRect(bx, y - 14 * zoom - bh, 2 * zoom, bh);
  }

  // Gate with skull
  ctx.fillStyle = "#1a1015";
  ctx.fillRect(x - 4 * zoom, y - 8 * zoom, 8 * zoom, 8 * zoom);
  ctx.beginPath();
  ctx.arc(x, y - 8 * zoom, 4 * zoom, Math.PI, 0);
  ctx.fill();

  // Skull emoji
  ctx.font = `${Math.max(6, 8 * zoom)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("💀", x, y - 6 * zoom);

  // Green eerie glow
  const t = (Date.now() % 3000) / 3000;
  ctx.fillStyle = `rgba(50, 200, 50, ${0.1 + Math.sin(t * Math.PI * 2) * 0.05})`;
  ctx.beginPath();
  ctx.arc(x, y - 4 * zoom, 8 * zoom, 0, Math.PI * 2);
  ctx.fill();
}

export function drawCity(dc: DrawContext) {
  const { ctx, x, y, zoom } = dc;

  // Multiple buildings clustered
  // Back-left building
  const bl = { ...dc, x: x - 8 * zoom, y: y - 3 * zoom };
  drawIsoBox(bl, 14, 12, 16, "#9a8570", "#8a7560", "#7a6550", 0);
  drawPointedRoof(bl, 16, 6, 16, "#7a3525", "#5a2015");

  // Back-right building (taller)
  const br = { ...dc, x: x + 7 * zoom, y: y - 5 * zoom };
  drawIsoBox(br, 12, 12, 22, "#8a7a6a", "#7a6a5a", "#6a5a4a", 0);
  drawPointedRoof(br, 14, 7, 22, "#6a3020", "#4a1a10");

  // Front building
  const fr = { ...dc, x: x, y: y + 2 * zoom };
  drawIsoBox(fr, 16, 14, 14, "#a09080", "#907a68", "#806a58", 0);
  drawPointedRoof(fr, 18, 6, 14, "#8a3525", "#6a2015");

  // Market stall (small)
  ctx.fillStyle = "#c0a060";
  ctx.fillRect(x - 14 * zoom, y + 4 * zoom, 8 * zoom, 1 * zoom);
  ctx.fillStyle = "#8a6030";
  ctx.fillRect(x - 14 * zoom, y + 4 * zoom, 1 * zoom, 5 * zoom);
  ctx.fillRect(x - 7 * zoom, y + 4 * zoom, 1 * zoom, 5 * zoom);

  // Windows
  drawWindow(bl, 3, 10, 2, "#e8d070");
  drawWindow(br, -2, 14, 2, "#e8d070");
  drawWindow(br, -2, 8, 2, "#e8d070");
  drawWindow(fr, 4, 8, 2.5, "#f0c050");
  drawWindow(fr, -4, 8, 2.5, "#f0c050");
}

export function drawBossLair(dc: DrawContext) {
  const { ctx, x, y, zoom } = dc;

  // Dark rocky base
  drawIsoBox(dc, 30, 30, 8, "#3a2a2a", "#2a1a1a", "#1a0a0a", 0);

  // Jagged spires
  for (let i = -1; i <= 1; i++) {
    const sx = x + i * 10 * zoom;
    const sy = y - 8 * zoom;
    const spireH = (20 + Math.abs(i) * -6) * zoom;
    ctx.fillStyle = "#2a1a1a";
    ctx.beginPath();
    ctx.moveTo(sx - 3 * zoom, sy);
    ctx.lineTo(sx, sy - spireH);
    ctx.lineTo(sx + 3 * zoom, sy);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#4a2a2a";
    ctx.lineWidth = 0.5 * zoom;
    ctx.stroke();
  }

  // Lava glow
  const t = (Date.now() % 2500) / 2500;
  ctx.fillStyle = `rgba(200, 60, 20, ${0.2 + Math.sin(t * Math.PI * 2) * 0.1})`;
  ctx.beginPath();
  ctx.arc(x, y - 4 * zoom, 12 * zoom, 0, Math.PI * 2);
  ctx.fill();

  // Skull entrance
  ctx.font = `${Math.max(8, 12 * zoom)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🐉", x, y - 18 * zoom);

  // Fire particles
  for (let p = 0; p < 3; p++) {
    const pt = ((Date.now() + p * 800) % 2000) / 2000;
    const px = x + (Math.sin(pt * Math.PI * 4 + p) * 5) * zoom;
    const py = y - (12 + pt * 15) * zoom;
    ctx.fillStyle = `rgba(255, ${100 + pt * 100}, 20, ${0.6 * (1 - pt)})`;
    ctx.beginPath();
    ctx.arc(px, py, (1.5 - pt) * zoom, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Building type to renderer map
export type BuildingType = "house" | "castle" | "farm" | "tavern" | "temple" | "tower" | "mine" | "dungeon" | "city" | "boss_lair";

const BUILDING_RENDERERS: Record<BuildingType, (dc: DrawContext) => void> = {
  house: drawHouse,
  castle: drawCastle,
  farm: drawFarm,
  tavern: drawTavern,
  temple: drawTemple,
  tower: drawTower,
  mine: drawMine,
  dungeon: drawDungeon,
  city: drawCity,
  boss_lair: drawBossLair,
};

export function drawBuilding(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  zoom: number,
  buildingType: BuildingType
) {
  const dc: DrawContext = { ctx, x: screenX, y: screenY, zoom };
  const renderer = BUILDING_RENDERERS[buildingType];
  if (renderer) {
    ctx.save();
    renderer(dc);
    ctx.restore();
  }
}
