import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GameSidebar } from "@/components/game/GameSidebar";
import { ChatPanel } from "@/components/game/ChatPanel";
import { UserPanel } from "@/components/game/UserPanel";
import { AdminPanel } from "@/components/game/AdminPanel";
import { SavesPanel } from "@/components/game/SavesPanel";
import { CharacterPanel } from "@/components/game/CharacterPanel";
import { QuestsPanel } from "@/components/game/QuestsPanel";
import { InventoryPanel } from "@/components/game/InventoryPanel";
import { SkillsPanel } from "@/components/game/SkillsPanel";
import { StatusBars } from "@/components/game/StatusBars";
import { MapPanel } from "@/components/game/MapPanel";
import { LorePanel } from "@/components/game/LorePanel";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState("map");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "map":
        return <MapPanel />;
      case "user":
        return <UserPanel />;
      case "admin":
        return <AdminPanel />;
      case "saves":
        return <SavesPanel />;
      case "character":
        return <CharacterPanel />;
      case "quests":
        return <QuestsPanel />;
      case "inventory":
        return <InventoryPanel />;
      case "skills":
        return <SkillsPanel />;
      case "lore":
        return <LorePanel />;
      default:
        return <MapPanel />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <GameSidebar 
        activePanel={activePanel} 
        onPanelChange={setActivePanel}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Inline Status */}
        <header className="px-4 py-2 border-b border-primary/20 glass-panel shrink-0 flex items-center justify-between">
          <StatusBars />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </header>

        {/* Panel Content */}
        <div className="flex-1 overflow-auto">
          {renderPanel()}
        </div>

        {/* Chat Panel at Bottom */}
        <ChatPanel 
          expanded={chatExpanded} 
          onExpandedChange={setChatExpanded} 
        />
      </main>
    </div>
  );
};

export default Index;
