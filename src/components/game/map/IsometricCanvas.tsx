import { useRef, useEffect, useCallback, useState } from "react";
import {
  getTerrainAt,
  getTileColor,
  TERRAIN_EDGE_COLORS,
  TERRAIN_SHADOW_COLORS,
  MAP_LOCATIONS,
  PLAYER_START,
  TerrainType,
  type MapLocation,
} from "./terrainGenerator";
import { drawBuilding } from "./buildingRenderer";
import {
  createPlayerState,
  updatePlayer,
  drawPlayer,
  isWalkable,
  type PlayerState,
  type KeyState,
} from "./playerController";

const MAP_SIZE = 500;
const TILE_W = 32;
const TILE_H = 16;
const CHUNK_SIZE = 16;

interface ChunkData {
  terrain: TerrainType[][];
}

const chunkCache = new Map<string, ChunkData>();

function getChunk(cx: number, cy: number, seed: number): ChunkData {
  const key = `${cx},${cy}`;
  if (chunkCache.has(key)) return chunkCache.get(key)!;

  const terrain: TerrainType[][] = [];
  const baseCol = cx * CHUNK_SIZE;
  const baseRow = cy * CHUNK_SIZE;

  for (let r = 0; r < CHUNK_SIZE; r++) {
    terrain[r] = [];
    for (let c = 0; c < CHUNK_SIZE; c++) {
      const col = baseCol + c;
      const row = baseRow + r;
      if (col >= 0 && col < MAP_SIZE && row >= 0 && row < MAP_SIZE) {
        terrain[r][c] = getTerrainAt(col, row, seed);
      } else {
        terrain[r][c] = TerrainType.DeepWater;
      }
    }
  }

  const chunk = { terrain };
  chunkCache.set(key, chunk);
  return chunk;
}

function toScreen(col: number, row: number, zoom: number): [number, number] {
  const x = (col - row) * (TILE_W / 2) * zoom;
  const y = (col + row) * (TILE_H / 2) * zoom;
  return [x, y];
}

function toTile(sx: number, sy: number, zoom: number): [number, number] {
  const tw = (TILE_W / 2) * zoom;
  const th = (TILE_H / 2) * zoom;
  const col = (sx / tw + sy / th) / 2;
  const row = (sy / th - sx / tw) / 2;
  return [Math.floor(col), Math.floor(row)];
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  zoom: number,
  fillColor: string,
  edgeColor: string,
  shadowColor: string,
  height: number = 0
) {
  const tw = (TILE_W / 2) * zoom;
  const th = (TILE_H / 2) * zoom;
  const h = height * zoom;

  ctx.beginPath();
  ctx.moveTo(sx, sy - h - th);
  ctx.lineTo(sx + tw, sy - h);
  ctx.lineTo(sx, sy - h + th);
  ctx.lineTo(sx - tw, sy - h);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();

  if (height > 0) {
    ctx.beginPath();
    ctx.moveTo(sx, sy - h + th);
    ctx.lineTo(sx + tw, sy - h);
    ctx.lineTo(sx + tw, sy);
    ctx.lineTo(sx, sy + th);
    ctx.closePath();
    ctx.fillStyle = shadowColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(sx, sy - h + th);
    ctx.lineTo(sx - tw, sy - h);
    ctx.lineTo(sx - tw, sy);
    ctx.lineTo(sx, sy + th);
    ctx.closePath();
    ctx.fillStyle = edgeColor;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.moveTo(sx, sy - h - th);
  ctx.lineTo(sx + tw, sy - h);
  ctx.lineTo(sx, sy - h + th);
  ctx.lineTo(sx - tw, sy - h);
  ctx.closePath();
  ctx.strokeStyle = edgeColor;
  ctx.lineWidth = Math.max(0.5, 0.5 * zoom);
  ctx.stroke();
}

function getTerrainHeight(terrain: TerrainType): number {
  switch (terrain) {
    case TerrainType.Mountain: return 6;
    case TerrainType.Snow: return 8;
    case TerrainType.Stone: return 3;
    case TerrainType.Forest: return 2;
    case TerrainType.DenseForest: return 3;
    case TerrainType.DeepWater: return -2;
    case TerrainType.ShallowWater: return -1;
    default: return 0;
  }
}

interface Props {
  className?: string;
}

export function IsometricCanvas({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const cameraRef = useRef({ x: 0, y: 0, zoom: 0.8 });
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0 });
  const keysRef = useRef<KeyState>({ up: false, down: false, left: false, right: false });
  const playerRef = useRef<PlayerState>(createPlayerState(PLAYER_START.col, PLAYER_START.row));
  const followPlayerRef = useRef(true);

  const [hoveredTile, setHoveredTile] = useState<[number, number] | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [playerPos, setPlayerPos] = useState({ col: PLAYER_START.col, row: PLAYER_START.row });

  const seed = 42;

  // Center camera on player at start
  useEffect(() => {
    const [px, py] = toScreen(PLAYER_START.col, PLAYER_START.row, 1);
    cameraRef.current.x = -px;
    cameraRef.current.y = -py;
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = keysRef.current;
      switch (e.key) {
        case "w": case "W": case "ArrowUp": k.up = true; e.preventDefault(); break;
        case "s": case "S": case "ArrowDown": k.down = true; e.preventDefault(); break;
        case "a": case "A": case "ArrowLeft": k.left = true; e.preventDefault(); break;
        case "d": case "D": case "ArrowRight": k.right = true; e.preventDefault(); break;
      }
      followPlayerRef.current = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = keysRef.current;
      switch (e.key) {
        case "w": case "W": case "ArrowUp": k.up = false; break;
        case "s": case "S": case "ArrowDown": k.down = false; break;
        case "a": case "A": case "ArrowLeft": k.left = false; break;
        case "d": case "D": case "ArrowRight": k.right = false; break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Main render + game loop
  useEffect(() => {
    let running = true;

    const loop = (timestamp: number) => {
      if (!running) return;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      // Delta time
      const dt = lastTimeRef.current ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.1) : 0.016;
      lastTimeRef.current = timestamp;

      // Update player
      const keys = keysRef.current;
      playerRef.current = updatePlayer(playerRef.current, keys, dt, seed);
      const player = playerRef.current;

      // Update React state sparingly (every ~10 frames)
      if (Math.round(timestamp) % 5 === 0) {
        setPlayerPos({ col: player.col, row: player.row });
      }

      // Camera follow
      if (followPlayerRef.current) {
        const [px, py] = toScreen(player.visualCol, player.visualRow, 1);
        const targetX = -px;
        const targetY = -py;
        cameraRef.current.x += (targetX - cameraRef.current.x) * 0.08;
        cameraRef.current.y += (targetY - cameraRef.current.y) * 0.08;
      }

      // Render
      const ctx = canvas.getContext("2d");
      if (!ctx) { animFrameRef.current = requestAnimationFrame(loop); return; }

      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, w, h);

      const cam = cameraRef.current;
      const cx = w / 2 + cam.x * cam.zoom;
      const cy = h / 2 + cam.y * cam.zoom;

      // Visible tile range
      const margin = 4;
      const corners = [
        toTile(-cx, -cy, cam.zoom),
        toTile(w - cx, -cy, cam.zoom),
        toTile(-cx, h - cy, cam.zoom),
        toTile(w - cx, h - cy, cam.zoom),
      ];

      let minCol = MAP_SIZE, maxCol = 0, minRow = MAP_SIZE, maxRow = 0;
      for (const [c, r] of corners) {
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
      }

      minCol = Math.max(0, minCol - margin);
      maxCol = Math.min(MAP_SIZE - 1, maxCol + margin);
      minRow = Math.max(0, minRow - margin);
      maxRow = Math.min(MAP_SIZE - 1, maxRow + margin);

      // Collect buildings and player in visible range for correct draw order
      const buildingsToDraw: { col: number; row: number; loc: MapLocation }[] = [];
      for (const loc of MAP_LOCATIONS) {
        if (loc.col >= minCol - 5 && loc.col <= maxCol + 5 && loc.row >= minRow - 5 && loc.row <= maxRow + 5) {
          buildingsToDraw.push({ col: loc.col, row: loc.row, loc });
        }
      }

      // Draw tiles (painter's algorithm: back to front)
      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const chunkX = Math.floor(col / CHUNK_SIZE);
          const chunkY = Math.floor(row / CHUNK_SIZE);
          const chunk = getChunk(chunkX, chunkY, seed);
          const localCol = col % CHUNK_SIZE;
          const localRow = row % CHUNK_SIZE;
          const terrain = chunk.terrain[localRow]?.[localCol] ?? TerrainType.DeepWater;

          const [sx, sy] = toScreen(col, row, cam.zoom);
          const screenX = sx + cx;
          const screenY = sy + cy;

          if (screenX < -TILE_W * cam.zoom || screenX > w + TILE_W * cam.zoom) continue;
          if (screenY < -50 * cam.zoom || screenY > h + 50 * cam.zoom) continue;

          const height = getTerrainHeight(terrain);
          const color = getTileColor(col, row, terrain);
          const edge = TERRAIN_EDGE_COLORS[terrain];
          const shadow = TERRAIN_SHADOW_COLORS[terrain];

          drawTile(ctx, screenX, screenY, cam.zoom, color, edge, shadow, Math.max(0, height));

          // Highlight hovered tile
          if (hoveredTile && hoveredTile[0] === col && hoveredTile[1] === row) {
            ctx.beginPath();
            const tw = (TILE_W / 2) * cam.zoom;
            const th = (TILE_H / 2) * cam.zoom;
            const hOff = Math.max(0, height) * cam.zoom;
            ctx.moveTo(screenX, screenY - hOff - th);
            ctx.lineTo(screenX + tw, screenY - hOff);
            ctx.lineTo(screenX, screenY - hOff + th);
            ctx.lineTo(screenX - tw, screenY - hOff);
            ctx.closePath();
            ctx.strokeStyle = "#d4a844";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "rgba(212, 168, 68, 0.15)";
            ctx.fill();
          }

          // Draw buildings at this tile position
          for (const b of buildingsToDraw) {
            if (b.col === col && b.row === row) {
              const terrainH = Math.max(0, getTerrainHeight(terrain)) * cam.zoom;
              drawBuilding(ctx, screenX, screenY - terrainH, cam.zoom, b.loc.building);

              // Name label
              const isHovered = hoveredLocation?.col === b.loc.col && hoveredLocation?.row === b.loc.row;
              const isSelected = selectedLocation?.col === b.loc.col && selectedLocation?.row === b.loc.row;
              if ((isHovered || isSelected) && b.loc.discovered) {
                const labelFont = Math.max(9, 11 * cam.zoom);
                ctx.font = `bold ${labelFont}px 'Inter', sans-serif`;
                ctx.textAlign = "center";

                const text = b.loc.name;
                const metrics = ctx.measureText(text);
                const px = 6 * cam.zoom;
                const py2 = 3 * cam.zoom;
                const lx = screenX;
                const ly = screenY - terrainH - 40 * cam.zoom;

                ctx.fillStyle = "rgba(13, 17, 23, 0.9)";
                ctx.beginPath();
                ctx.roundRect(lx - metrics.width / 2 - px, ly - labelFont / 2 - py2, metrics.width + px * 2, labelFont + py2 * 2, 4);
                ctx.fill();
                ctx.strokeStyle = "rgba(212, 168, 68, 0.5)";
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = "#d4a844";
                ctx.fillText(text, lx, ly);

                ctx.font = `${Math.max(7, 9 * cam.zoom)}px 'Inter', sans-serif`;
                ctx.fillStyle = "rgba(180, 180, 200, 0.7)";
                ctx.fillText(b.loc.type.toUpperCase(), lx, ly + labelFont + 2);
              }

              // Undiscovered fog
              if (!b.loc.discovered) {
                ctx.fillStyle = "rgba(13, 17, 23, 0.5)";
                ctx.beginPath();
                ctx.arc(screenX, screenY - terrainH - 10 * cam.zoom, 15 * cam.zoom, 0, Math.PI * 2);
                ctx.fill();
                ctx.font = `${Math.max(8, 10 * cam.zoom)}px sans-serif`;
                ctx.textAlign = "center";
                ctx.fillStyle = "rgba(150,150,170,0.6)";
                ctx.fillText("?", screenX, screenY - terrainH - 8 * cam.zoom);
              }
            }
          }

          // Draw player at correct depth
          const pCol = Math.round(player.visualCol);
          const pRow = Math.round(player.visualRow);
          if (pCol === col && pRow === row) {
            const [psx, psy] = toScreen(player.visualCol, player.visualRow, cam.zoom);
            const playerScreenX = psx + cx;
            const playerScreenY = psy + cy;
            const pTerrain = getTerrainAt(pCol, pRow, seed);
            const pHeight = Math.max(0, getTerrainHeight(pTerrain)) * cam.zoom;
            drawPlayer(ctx, playerScreenX, playerScreenY - pHeight, cam.zoom, player.direction, timestamp / 1000);
          }
        }
      }

      // === HUD overlays ===

      // Minimap
      const miniW = 120;
      const miniH = 120;
      const miniX = w - miniW - 12;
      const miniY = 12;

      ctx.fillStyle = "rgba(13, 17, 23, 0.8)";
      ctx.strokeStyle = "rgba(212, 168, 68, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(miniX, miniY, miniW, miniH, 6);
      ctx.fill();
      ctx.stroke();

      const viewScale = miniW / MAP_SIZE;
      const viewCenterCol = (minCol + maxCol) / 2;
      const viewCenterRow = (minRow + maxRow) / 2;
      const viewW2 = (maxCol - minCol) * viewScale;
      const viewH2 = (maxRow - minRow) * viewScale;

      ctx.strokeStyle = "rgba(212, 168, 68, 0.6)";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        miniX + viewCenterCol * viewScale - viewW2 / 2,
        miniY + viewCenterRow * viewScale - viewH2 / 2,
        viewW2,
        viewH2
      );

      // Mini location dots
      for (const loc of MAP_LOCATIONS) {
        if (!loc.discovered) continue;
        const mx = miniX + loc.col * viewScale;
        const my = miniY + loc.row * viewScale;
        ctx.beginPath();
        ctx.arc(mx, my, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212, 168, 68, 0.5)";
        ctx.fill();
      }

      // Player dot on minimap
      ctx.beginPath();
      ctx.arc(miniX + player.visualCol * viewScale, miniY + player.visualRow * viewScale, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#d4a844";
      ctx.fill();

      // Coordinate display
      if (hoveredTile) {
        ctx.font = "11px 'Inter', sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(180, 180, 200, 0.7)";
        ctx.fillText(`Tile: ${hoveredTile[0]}, ${hoveredTile[1]}`, 12, h - 12);
      }

      // Player position
      ctx.font = "11px 'Inter', sans-serif";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(212, 168, 68, 0.8)";
      ctx.fillText(`Player: ${player.col}, ${player.row}`, 12, h - 28);

      // Movement hint
      ctx.font = "10px 'Inter', sans-serif";
      ctx.fillStyle = "rgba(150, 150, 170, 0.5)";
      ctx.fillText("WASD / Arrows to move • Click to travel", 12, h - 44);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [hoveredTile, hoveredLocation, selectedLocation]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const drag = dragRef.current;
    if (drag.dragging) {
      const dx = e.clientX - drag.lastX;
      const dy = e.clientY - drag.lastY;
      cameraRef.current.x += dx / cameraRef.current.zoom;
      cameraRef.current.y += dy / cameraRef.current.zoom;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      followPlayerRef.current = false;
    }

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cam = cameraRef.current;
    const centerX = container.clientWidth / 2 + cam.x * cam.zoom;
    const centerY = container.clientHeight / 2 + cam.y * cam.zoom;

    const [col, row] = toTile(mx - centerX, my - centerY, cam.zoom);

    if (col >= 0 && col < MAP_SIZE && row >= 0 && row < MAP_SIZE) {
      setHoveredTile([col, row]);
      const loc = MAP_LOCATIONS.find(l => Math.abs(l.col - col) < 4 && Math.abs(l.row - row) < 4);
      setHoveredLocation(loc || null);
    } else {
      setHoveredTile(null);
      setHoveredLocation(null);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    dragRef.current.dragging = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    dragRef.current.dragging = false;
    setHoveredTile(null);
    setHoveredLocation(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const cam = cameraRef.current;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    cam.zoom = Math.max(0.2, Math.min(3, cam.zoom * delta));
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cam = cameraRef.current;
    const centerX = container.clientWidth / 2 + cam.x * cam.zoom;
    const centerY = container.clientHeight / 2 + cam.y * cam.zoom;

    const [col, row] = toTile(mx - centerX, my - centerY, cam.zoom);

    if (col >= 0 && col < MAP_SIZE && row >= 0 && row < MAP_SIZE) {
      // Check if clicking a location
      const loc = MAP_LOCATIONS.find(l => Math.abs(l.col - col) < 4 && Math.abs(l.row - row) < 4);
      if (loc) {
        setSelectedLocation(
          selectedLocation?.col === loc.col && selectedLocation?.row === loc.row ? null : loc
        );
      } else {
        setSelectedLocation(null);
      }

      // Click-to-move: set target if walkable
      if (isWalkable(getTerrainAt(col, row, seed))) {
        playerRef.current = {
          ...playerRef.current,
          targetCol: col,
          targetRow: row,
          moving: true,
        };
        followPlayerRef.current = true;
      }
    }
  }, [selectedLocation]);

  const centerOnPlayer = useCallback(() => {
    const player = playerRef.current;
    const [px, py] = toScreen(player.visualCol, player.visualRow, 1);
    cameraRef.current.x = -px;
    cameraRef.current.y = -py;
    cameraRef.current.zoom = 0.8;
    followPlayerRef.current = true;
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className ?? ""}`} tabIndex={0}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ imageRendering: "pixelated" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onClick={handleClick}
      />

      {/* Controls overlay */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        <button
          onClick={centerOnPlayer}
          className="glass-panel px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
          title="Center on player"
        >
          📍 Find Player
        </button>
        <button
          onClick={() => { cameraRef.current.zoom = Math.min(3, cameraRef.current.zoom * 1.3); }}
          className="glass-panel px-3 py-2 text-xs font-medium text-foreground hover:bg-primary/10 transition-colors"
        >
          ＋ Zoom In
        </button>
        <button
          onClick={() => { cameraRef.current.zoom = Math.max(0.2, cameraRef.current.zoom * 0.7); }}
          className="glass-panel px-3 py-2 text-xs font-medium text-foreground hover:bg-primary/10 transition-colors"
        >
          － Zoom Out
        </button>
      </div>

      {/* Selected location info */}
      {selectedLocation && selectedLocation.discovered && (
        <div className="absolute bottom-4 left-4 glass-panel p-4 rounded-lg z-10 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <div>
              <h3 className="font-cinzel text-sm text-primary">{selectedLocation.name}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{selectedLocation.type}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Position: ({selectedLocation.col}, {selectedLocation.row})
          </p>
          <p className="text-xs text-muted-foreground">
            Distance: {Math.round(Math.sqrt(Math.pow(selectedLocation.col - playerPos.col, 2) + Math.pow(selectedLocation.row - playerPos.row, 2)))} blocks
          </p>
          <button
            onClick={() => {
              if (isWalkable(getTerrainAt(selectedLocation.col, selectedLocation.row, seed))) {
                playerRef.current = {
                  ...playerRef.current,
                  targetCol: selectedLocation.col,
                  targetRow: selectedLocation.row,
                  moving: true,
                };
                followPlayerRef.current = true;
              }
            }}
            className="mt-2 w-full glass-panel px-3 py-1.5 text-xs text-primary hover:bg-primary/10 transition-colors rounded"
          >
            Travel Here
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 glass-panel p-3 rounded-lg z-10 text-[10px] space-y-1.5">
        <p className="text-xs font-medium text-primary font-cinzel mb-2">Terrain</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[
            { color: "#3a5a2e", label: "Grassland" },
            { color: "#1e3a16", label: "Forest" },
            { color: "#2a4a6b", label: "Water" },
            { color: "#4a4a4a", label: "Mountain" },
            { color: "#8b7355", label: "Sand" },
            { color: "#6b5a42", label: "Path" },
            { color: "#c8c8d0", label: "Snow" },
            { color: "#8b2500", label: "Lava" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
