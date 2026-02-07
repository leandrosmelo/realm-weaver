import { useRef, useEffect, useCallback, useState } from "react";
import {
  getTerrainAt,
  getTileColor,
  TERRAIN_EDGE_COLORS,
  TERRAIN_SHADOW_COLORS,
  MAP_LOCATIONS,
  PLAYER_POSITION,
  TerrainType,
  type MapLocation,
} from "./terrainGenerator";

const MAP_SIZE = 500;
const TILE_W = 32;
const TILE_H = 16;

// Chunk-based caching
const CHUNK_SIZE = 16;

interface ChunkData {
  terrain: TerrainType[][];
}

const chunkCache = new Map<string, ChunkData>();

function getChunkKey(cx: number, cy: number): string {
  return `${cx},${cy}`;
}

function getChunk(cx: number, cy: number, seed: number): ChunkData {
  const key = getChunkKey(cx, cy);
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

// Isometric projection
function toScreen(col: number, row: number, zoom: number): [number, number] {
  const x = (col - row) * (TILE_W / 2) * zoom;
  const y = (col + row) * (TILE_H / 2) * zoom;
  return [x, y];
}

// Reverse projection
function toTile(sx: number, sy: number, zoom: number): [number, number] {
  const tw = (TILE_W / 2) * zoom;
  const th = (TILE_H / 2) * zoom;
  const col = (sx / tw + sy / th) / 2;
  const row = (sy / th - sx / tw) / 2;
  return [Math.floor(col), Math.floor(row)];
}

// Draw a single isometric tile
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

  // Top face
  ctx.beginPath();
  ctx.moveTo(sx, sy - h - th);
  ctx.lineTo(sx + tw, sy - h);
  ctx.lineTo(sx, sy - h + th);
  ctx.lineTo(sx - tw, sy - h);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Draw pixel-art style edges (right face)
  if (height > 0) {
    ctx.beginPath();
    ctx.moveTo(sx, sy - h + th);
    ctx.lineTo(sx + tw, sy - h);
    ctx.lineTo(sx + tw, sy);
    ctx.lineTo(sx, sy + th);
    ctx.closePath();
    ctx.fillStyle = shadowColor;
    ctx.fill();

    // Left face
    ctx.beginPath();
    ctx.moveTo(sx, sy - h + th);
    ctx.lineTo(sx - tw, sy - h);
    ctx.lineTo(sx - tw, sy);
    ctx.lineTo(sx, sy + th);
    ctx.closePath();
    ctx.fillStyle = edgeColor;
    ctx.fill();
  }

  // Top face edge lines for pixel art feel
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

  const cameraRef = useRef({ x: 0, y: 0, zoom: 0.8 });
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0 });
  const [hoveredTile, setHoveredTile] = useState<[number, number] | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  const seed = 42;

  // Center camera on player at start
  useEffect(() => {
    const [px, py] = toScreen(PLAYER_POSITION.col, PLAYER_POSITION.row, 1);
    cameraRef.current.x = -px;
    cameraRef.current.y = -py;
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    // Clear with background
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, w, h);

    const cam = cameraRef.current;
    const cx = w / 2 + cam.x;
    const cy = h / 2 + cam.y;

    // Calculate visible tile range
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

    // Determine which chunks are needed
    const startChunkCol = Math.floor(minCol / CHUNK_SIZE);
    const endChunkCol = Math.floor(maxCol / CHUNK_SIZE);
    const startChunkRow = Math.floor(minRow / CHUNK_SIZE);
    const endChunkRow = Math.floor(maxRow / CHUNK_SIZE);

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

        // Skip tiles clearly off screen
        if (screenX < -TILE_W * cam.zoom || screenX > w + TILE_W * cam.zoom) continue;
        if (screenY < -40 * cam.zoom || screenY > h + 40 * cam.zoom) continue;

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
      }
    }

    // Draw location markers
    for (const loc of MAP_LOCATIONS) {
      if (loc.col < minCol - 5 || loc.col > maxCol + 5) continue;
      if (loc.row < minRow - 5 || loc.row > maxRow + 5) continue;

      const [sx, sy] = toScreen(loc.col, loc.row, cam.zoom);
      const screenX = sx + cx;
      const screenY = sy + cy;
      const terrain = getTerrainAt(loc.col, loc.row, seed);
      const h = Math.max(0, getTerrainHeight(terrain)) * cam.zoom;

      const isPlayer = loc.col === PLAYER_POSITION.col && loc.row === PLAYER_POSITION.row;
      const isHovered = hoveredLocation?.col === loc.col && hoveredLocation?.row === loc.row;
      const isSelected = selectedLocation?.col === loc.col && selectedLocation?.row === loc.row;

      // Marker glow
      const markerSize = (isHovered || isSelected ? 20 : 16) * cam.zoom;
      ctx.beginPath();
      ctx.arc(screenX, screenY - h - markerSize, markerSize * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = loc.discovered
        ? isPlayer
          ? "rgba(212, 168, 68, 0.4)"
          : isHovered || isSelected
            ? "rgba(212, 168, 68, 0.3)"
            : "rgba(100, 100, 120, 0.5)"
        : "rgba(50, 50, 60, 0.3)";
      ctx.fill();

      // Marker border
      ctx.strokeStyle = loc.discovered
        ? isPlayer ? "#d4a844" : "rgba(212, 168, 68, 0.6)"
        : "rgba(100, 100, 120, 0.3)";
      ctx.lineWidth = isPlayer ? 2.5 : 1.5;
      ctx.stroke();

      // Icon emoji
      const fontSize = Math.max(10, Math.round(14 * cam.zoom));
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        loc.discovered ? loc.icon : "❓",
        screenX,
        screenY - h - markerSize
      );

      // Player pulse ring
      if (isPlayer) {
        const t = (Date.now() % 2000) / 2000;
        const pulseR = markerSize * (1 + t * 0.6);
        ctx.beginPath();
        ctx.arc(screenX, screenY - h - markerSize, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 168, 68, ${0.5 * (1 - t)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Name label
      if ((isHovered || isSelected || isPlayer) && loc.discovered) {
        const labelFont = Math.max(9, Math.round(11 * cam.zoom));
        ctx.font = `bold ${labelFont}px 'Inter', sans-serif`;
        ctx.textAlign = "center";
        
        const text = loc.name;
        const metrics = ctx.measureText(text);
        const px = 6 * cam.zoom;
        const py = 3 * cam.zoom;
        const lx = screenX;
        const ly = screenY - h - markerSize * 2.2;

        ctx.fillStyle = "rgba(13, 17, 23, 0.85)";
        ctx.beginPath();
        ctx.roundRect(
          lx - metrics.width / 2 - px,
          ly - labelFont / 2 - py,
          metrics.width + px * 2,
          labelFont + py * 2,
          4
        );
        ctx.fill();
        ctx.strokeStyle = "rgba(212, 168, 68, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "#d4a844";
        ctx.fillText(text, lx, ly);

        // Type label
        ctx.font = `${Math.max(7, Math.round(9 * cam.zoom))}px 'Inter', sans-serif`;
        ctx.fillStyle = "rgba(180, 180, 200, 0.7)";
        ctx.fillText(loc.type.toUpperCase(), lx, ly + labelFont + 2);
      }
    }

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

    // Mini viewport indicator
    const viewScale = miniW / MAP_SIZE;
    const viewCenterCol = (minCol + maxCol) / 2;
    const viewCenterRow = (minRow + maxRow) / 2;
    const viewW = (maxCol - minCol) * viewScale;
    const viewH = (maxRow - minRow) * viewScale;
    
    ctx.strokeStyle = "rgba(212, 168, 68, 0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      miniX + viewCenterCol * viewScale - viewW / 2,
      miniY + viewCenterRow * viewScale - viewH / 2,
      viewW,
      viewH
    );

    // Mini location dots
    for (const loc of MAP_LOCATIONS) {
      if (!loc.discovered) continue;
      const mx = miniX + loc.col * viewScale;
      const my = miniY + loc.row * viewScale;
      const isPlayer = loc.col === PLAYER_POSITION.col && loc.row === PLAYER_POSITION.row;
      
      ctx.beginPath();
      ctx.arc(mx, my, isPlayer ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isPlayer ? "#d4a844" : "rgba(212, 168, 68, 0.5)";
      ctx.fill();
    }

    // Coordinate display
    if (hoveredTile) {
      ctx.font = "11px 'Inter', sans-serif";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(180, 180, 200, 0.7)";
      ctx.fillText(`Tile: ${hoveredTile[0]}, ${hoveredTile[1]}`, 12, h - 12);
    }
  }, [hoveredTile, hoveredLocation, selectedLocation]);

  // Animation loop
  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      render();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [render]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const drag = dragRef.current;
    if (drag.dragging) {
      const dx = e.clientX - drag.lastX;
      const dy = e.clientY - drag.lastY;
      cameraRef.current.x += dx;
      cameraRef.current.y += dy;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
    }

    // Calculate hovered tile
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cam = cameraRef.current;
    const cx = container.clientWidth / 2 + cam.x;
    const cy = container.clientHeight / 2 + cam.y;
    
    const [col, row] = toTile(mx - cx, my - cy, cam.zoom);
    
    if (col >= 0 && col < MAP_SIZE && row >= 0 && row < MAP_SIZE) {
      setHoveredTile([col, row]);
      
      // Check location hover
      const loc = MAP_LOCATIONS.find(
        l => Math.abs(l.col - col) < 4 && Math.abs(l.row - row) < 4
      );
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
    const newZoom = Math.max(0.2, Math.min(3, cam.zoom * delta));
    cam.zoom = newZoom;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hoveredLocation) {
      setSelectedLocation(
        selectedLocation?.col === hoveredLocation.col && selectedLocation?.row === hoveredLocation.row
          ? null
          : hoveredLocation
      );
    } else {
      setSelectedLocation(null);
    }
  }, [hoveredLocation, selectedLocation]);

  // Center on player
  const centerOnPlayer = useCallback(() => {
    const [px, py] = toScreen(PLAYER_POSITION.col, PLAYER_POSITION.row, 1);
    cameraRef.current.x = -px;
    cameraRef.current.y = -py;
    cameraRef.current.zoom = 0.8;
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className ?? ""}`}>
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

      {/* Selected location info panel */}
      {selectedLocation && selectedLocation.discovered && (
        <div className="absolute bottom-4 left-4 glass-panel p-4 rounded-lg z-10 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{selectedLocation.icon}</span>
            <div>
              <h3 className="font-cinzel text-sm text-primary">{selectedLocation.name}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{selectedLocation.type}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Position: ({selectedLocation.col}, {selectedLocation.row})
          </p>
          <button className="mt-2 w-full glass-panel px-3 py-1.5 text-xs text-primary hover:bg-primary/10 transition-colors rounded">
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
