import { 
  User, Shield, Save, Users, Scroll, Backpack, Sparkles, 
  Settings, Crown, Swords, ChevronLeft, ChevronRight, Map
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GameSidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const menuItems = [
  { id: "map", label: "World Map", icon: Map },
  { id: "user", label: "User Panel", icon: User },
  { id: "character", label: "Character", icon: Users },
  { id: "quests", label: "Quests", icon: Scroll },
  { id: "inventory", label: "Inventory", icon: Backpack },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "lore", label: "Lore", icon: Scroll },
  { id: "saves", label: "Game Saves", icon: Save },
  { id: "admin", label: "Admin", icon: Shield },
];

export function GameSidebar({ activePanel, onPanelChange, collapsed, onCollapsedChange }: GameSidebarProps) {
  return (
    <aside className={cn(
      "glass-panel border-r border-primary/20 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-56"
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-gold shrink-0">
            <Swords className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-cinzel text-lg text-primary tracking-wide">
                Realm
              </h1>
              <p className="text-xs text-muted-foreground">of Legends</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPanelChange(item.id)}
            className={cn(
              "nav-item w-full",
              activePanel === item.id && "active",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Info Footer */}
      <div className="p-2 border-t border-primary/20">
        {!collapsed ? (
          <div className="glass-panel p-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">ShadowKnight</p>
              <p className="text-[10px] text-muted-foreground">Level 42</p>
            </div>
            <button className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors">
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center">
              <Crown className="w-4 h-4 text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="p-2 border-t border-primary/20 flex items-center justify-center hover:bg-secondary/50 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}
