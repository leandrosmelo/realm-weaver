import { Heart, Zap, Star } from "lucide-react";

interface StatusBarsProps {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
}

export function StatusBars({ 
  health = 850, 
  maxHealth = 1000, 
  mana = 450, 
  maxMana = 600, 
  stamina = 80, 
  maxStamina = 100 
}: Partial<StatusBarsProps>) {
  return (
    <div className="glass-panel p-4 space-y-3">
      {/* Health */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
          <Heart className="w-4 h-4 text-red-400 fill-red-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Health</span>
            <span className="text-red-400">{health}/{maxHealth}</span>
          </div>
          <div className="stat-bar stat-bar-health">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${(health / maxHealth) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mana */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Mana</span>
            <span className="text-blue-400">{mana}/{maxMana}</span>
          </div>
          <div className="stat-bar stat-bar-mana">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${(mana / maxMana) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stamina */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
          <Star className="w-4 h-4 text-green-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Stamina</span>
            <span className="text-green-400">{stamina}/{maxStamina}</span>
          </div>
          <div className="stat-bar stat-bar-stamina">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${(stamina / maxStamina) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
