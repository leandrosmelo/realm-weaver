import { MapPin, Compass, Mountain, Castle, Trees, Skull, Gem } from "lucide-react";

const locations = [
  { id: 1, name: "Elderwood Village", type: "town", x: 20, y: 30, icon: Castle, discovered: true },
  { id: 2, name: "Shadow Keep", type: "dungeon", x: 70, y: 25, icon: Skull, discovered: true },
  { id: 3, name: "Crystal Caverns", type: "mine", x: 45, y: 60, icon: Gem, discovered: true },
  { id: 4, name: "Misty Mountains", type: "mountain", x: 80, y: 70, icon: Mountain, discovered: false },
  { id: 5, name: "Ancient Forest", type: "forest", x: 30, y: 75, icon: Trees, discovered: true },
  { id: 6, name: "Dragon's Lair", type: "boss", x: 55, y: 15, icon: Skull, discovered: false },
];

const currentLocation = { x: 20, y: 30 };

export function MapPanel() {
  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <h2 className="font-cinzel text-lg text-primary">World Map</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>Elderwood Village</span>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 glass-panel relative overflow-hidden rounded-lg">
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Fog of war for undiscovered areas */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-background/80" />

        {/* Location markers */}
        {locations.map((loc) => {
          const Icon = loc.icon;
          const isCurrentLocation = loc.x === currentLocation.x && loc.y === currentLocation.y;
          
          return (
            <div
              key={loc.id}
              className="absolute group cursor-pointer"
              style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Marker */}
              <div className={`
                relative w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${loc.discovered 
                  ? isCurrentLocation
                    ? 'bg-primary/30 border-2 border-primary animate-pulse-glow'
                    : 'bg-secondary/80 border border-primary/40 hover:border-primary hover:scale-110'
                  : 'bg-muted/50 border border-muted-foreground/30 opacity-50'
                }
              `}>
                <Icon className={`w-5 h-5 ${
                  loc.discovered 
                    ? isCurrentLocation ? 'text-primary' : 'text-foreground'
                    : 'text-muted-foreground'
                }`} />
                
                {/* Current location indicator */}
                {isCurrentLocation && (
                  <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-primary animate-bounce" />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="glass-panel px-3 py-1.5 rounded whitespace-nowrap">
                  <p className="text-xs font-medium">{loc.discovered ? loc.name : "???"}</p>
                  {loc.discovered && (
                    <p className="text-[10px] text-muted-foreground capitalize">{loc.type}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Decorative paths between locations */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <pattern id="path-pattern" patternUnits="userSpaceOnUse" width="8" height="8">
              <circle cx="2" cy="2" r="1" fill="hsl(var(--primary) / 0.3)" />
            </pattern>
          </defs>
          <path
            d="M 20% 30% Q 35% 45% 45% 60%"
            stroke="url(#path-pattern)"
            strokeWidth="3"
            fill="none"
            className="opacity-50"
          />
          <path
            d="M 20% 30% L 70% 25%"
            stroke="url(#path-pattern)"
            strokeWidth="3"
            fill="none"
            className="opacity-50"
          />
          <path
            d="M 45% 60% L 30% 75%"
            stroke="url(#path-pattern)"
            strokeWidth="3"
            fill="none"
            className="opacity-50"
          />
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 glass-panel p-2 rounded text-[10px] space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/30 border border-primary" />
            <span>Current Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary/80 border border-primary/40" />
            <span>Discovered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted/50 border border-muted-foreground/30 opacity-50" />
            <span>Undiscovered</span>
          </div>
        </div>

        {/* Compass */}
        <div className="absolute top-3 right-3 w-12 h-12 glass-panel rounded-full flex items-center justify-center">
          <Compass className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
