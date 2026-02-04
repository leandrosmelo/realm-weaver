import { Crown, Star, Clock, Trophy, Coins, Gem } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function UserPanel() {
  const stats = {
    level: 42,
    xp: 75,
    gold: 12450,
    gems: 89,
    playtime: "127h 45m",
    achievements: 34,
    rank: "Champion",
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto scrollbar-thin">
      <div>
        <h2 className="font-cinzel text-2xl text-primary mb-2">User Profile</h2>
        <p className="text-sm text-muted-foreground">Your adventure statistics</p>
      </div>

      {/* Profile Card */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center animate-pulse-glow">
            <Crown className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-cinzel text-xl">ShadowKnight</h3>
            <p className="text-muted-foreground">The Vanquisher</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full border border-primary/30">
                {stats.rank}
              </span>
              <span className="text-sm text-muted-foreground">
                Level {stats.level}
              </span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Experience</span>
            <span className="text-primary">{stats.xp}%</span>
          </div>
          <div className="stat-bar stat-bar-xp h-3">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${stats.xp}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            2,450 XP to Level 43
          </p>
        </div>
      </div>

      {/* Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gold</p>
              <p className="font-semibold text-lg">{stats.gold.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Gem className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gems</p>
              <p className="font-semibold text-lg">{stats.gems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="glass-panel p-4">
        <h4 className="font-cinzel text-lg mb-4">Statistics</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Total Playtime</span>
            </div>
            <span className="text-primary font-medium">{stats.playtime}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Achievements</span>
            </div>
            <span className="text-primary font-medium">{stats.achievements}/50</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Quests Completed</span>
            </div>
            <span className="text-primary font-medium">156</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel p-4">
        <h4 className="font-cinzel text-lg mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {[
            { action: "Defeated the Dragon of Ashfall", time: "2h ago" },
            { action: "Reached Level 42", time: "5h ago" },
            { action: "Completed Quest: The Lost Artifact", time: "1d ago" },
          ].map((activity, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{activity.action}</span>
              <span className="text-xs text-muted-foreground/60">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
