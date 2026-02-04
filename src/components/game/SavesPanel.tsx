import { Save, Upload, Trash2, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SaveGame {
  id: number;
  name: string;
  level: number;
  location: string;
  playtime: string;
  date: string;
  thumbnail?: string;
}

const savedGames: SaveGame[] = [
  { id: 1, name: "Main Quest Progress", level: 42, location: "Dragon's Peak", playtime: "45h 23m", date: "2024-01-15" },
  { id: 2, name: "Before Boss Fight", level: 41, location: "Shadow Keep", playtime: "42h 10m", date: "2024-01-14" },
  { id: 3, name: "Early Game Backup", level: 15, location: "Starter Village", playtime: "12h 05m", date: "2024-01-05" },
  { id: 4, name: "Auto-Save", level: 42, location: "Crystal Caverns", playtime: "47h 12m", date: "2024-01-15" },
];

export function SavesPanel() {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-cinzel text-2xl text-primary">Game Saves</h2>
          <p className="text-sm text-muted-foreground">Manage your saved games</p>
        </div>
        <Button className="bg-primary hover:bg-primary/80 gap-2">
          <Save className="w-4 h-4" />
          New Save
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button className="glass-panel p-4 hover:border-primary/40 transition-all group">
          <Save className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm text-center">Quick Save</p>
        </button>
        <button className="glass-panel p-4 hover:border-primary/40 transition-all group">
          <Upload className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm text-center">Quick Load</p>
        </button>
        <button className="glass-panel p-4 hover:border-accent/40 transition-all group">
          <Star className="w-6 h-6 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm text-center">Auto-Saves</p>
        </button>
      </div>

      {/* Saved Games List */}
      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {savedGames.map((save) => (
            <div 
              key={save.id}
              className="glass-panel p-4 hover:border-primary/40 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-secondary to-muted flex items-center justify-center shrink-0 overflow-hidden">
                  <MapPin className="w-6 h-6 text-muted-foreground" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{save.name}</h3>
                    {save.name === "Auto-Save" && (
                      <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-xs rounded">
                        AUTO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Level {save.level}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {save.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground/60 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {save.playtime}
                    </span>
                    <span>{save.date}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary">
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-destructive/20 hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Storage Info */}
      <div className="mt-4 glass-panel p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Storage Used</span>
          <span className="text-primary">4 / 20 slots</span>
        </div>
        <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full w-[20%] bg-gradient-to-r from-primary to-primary/60 rounded-full" />
        </div>
      </div>
    </div>
  );
}
