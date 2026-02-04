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
    <div className="flex items-center gap-6">
      {/* Health */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
          <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
        </div>
        <div className="flex items-center gap-2">
          <div className="stat-bar stat-bar-health w-24">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${(health / maxHealth) * 100}%` }}
            />
          </div>
          <span className="text-xs text-red-400 whitespace-nowrap">{health}/{maxHealth}</span>
        </div>
      </div>

      {/* Mana */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div className="flex items-center gap-2">
          <div className="stat-bar stat-bar-mana w-24">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${(mana / maxMana) * 100}%` }}
            />
          </div>
          <span className="text-xs text-blue-400 whitespace-nowrap">{mana}/{maxMana}</span>
        </div>
      </div>

      {/* Stamina */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
          <Star className="w-3.5 h-3.5 text-green-400" />
        </div>
        <div className="flex items-center gap-2">
          <div className="stat-bar stat-bar-stamina w-24">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${(stamina / maxStamina) * 100}%` }}
            />
          </div>
          <span className="text-xs text-green-400 whitespace-nowrap">{stamina}/{maxStamina}</span>
        </div>
      </div>
    </div>
  );
}
