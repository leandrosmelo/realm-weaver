import { 
  User, Shield, Save, Users, Scroll, Backpack, Sparkles, 
  MessageSquare, Settings, Crown, Swords
} from "lucide-react";

interface GameSidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const menuItems = [
  { id: "chat", label: "NPC Chat", icon: MessageSquare },
  { id: "user", label: "User Panel", icon: User },
  { id: "character", label: "Character", icon: Users },
  { id: "quests", label: "Quests", icon: Scroll },
  { id: "inventory", label: "Inventory", icon: Backpack },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "saves", label: "Game Saves", icon: Save },
  { id: "admin", label: "Admin", icon: Shield },
];

export function GameSidebar({ activePanel, onPanelChange }: GameSidebarProps) {
  return (
    <aside className="w-64 glass-panel border-r border-primary/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center glow-gold">
            <Swords className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="font-cinzel text-xl text-primary tracking-wide">
              Realm
            </h1>
            <p className="text-xs text-muted-foreground">of Legends</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPanelChange(item.id)}
            className={`nav-item w-full ${activePanel === item.id ? "active" : ""}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info Footer */}
      <div className="p-4 border-t border-primary/20">
        <div className="glass-panel p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">ShadowKnight</p>
            <p className="text-xs text-muted-foreground">Level 42 Warrior</p>
          </div>
          <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
}
