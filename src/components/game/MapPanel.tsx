import { Compass, MapPin } from "lucide-react";
import { IsometricCanvas } from "./map/IsometricCanvas";

export function MapPanel() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20 shrink-0">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <h2 className="font-cinzel text-lg text-primary">World Map</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>Exploring</span>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-[10px]">500×500 blocks</span>
        </div>
      </div>

      {/* Isometric Map Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <IsometricCanvas />
      </div>
    </div>
  );
}
