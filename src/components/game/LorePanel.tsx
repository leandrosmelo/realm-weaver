import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CharactersManager } from "./lore/CharactersManager";
import { LoreManagement } from "./lore/LoreManagement";
import { NPCConsole } from "./lore/NPCConsole";

export function LorePanel() {
  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h2 className="font-cinzel text-2xl text-primary">Lore & World Building</h2>
        <p className="text-sm text-muted-foreground">Manage your game's narrative elements</p>
      </div>

      <Tabs defaultValue="characters" className="w-full h-[calc(100%-5rem)]">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="lore">Lore</TabsTrigger>
          <TabsTrigger value="npc">NPC Console</TabsTrigger>
        </TabsList>

        <TabsContent value="characters" className="mt-4 h-[calc(100%-3rem)]">
          <CharactersManager />
        </TabsContent>

        <TabsContent value="lore" className="mt-4 h-[calc(100%-3rem)]">
          <LoreManagement />
        </TabsContent>

        <TabsContent value="npc" className="mt-4 h-[calc(100%-3rem)]">
          <NPCConsole />
        </TabsContent>
      </Tabs>
    </div>
  );
}
