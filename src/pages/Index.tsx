import { useState } from "react";
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

const Index = () => {
  const [activePanel, setActivePanel] = useState("chat");

  const renderPanel = () => {
    switch (activePanel) {
      case "chat":
        return <ChatPanel />;
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
      default:
        return <ChatPanel />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <GameSidebar activePanel={activePanel} onPanelChange={setActivePanel} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Status */}
        <header className="p-4 border-b border-primary/20">
          <div className="max-w-md">
            <StatusBars />
          </div>
        </header>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default Index;
