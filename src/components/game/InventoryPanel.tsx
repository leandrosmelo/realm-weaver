import { useState } from "react";
import { Backpack, Sword, Shield, FlaskConical, Gem, Scroll, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Item {
  id: number;
  name: string;
  type: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  quantity: number;
  icon: React.ElementType;
}

const inventoryItems: Item[] = [
  { id: 1, name: "Shadowbane Sword", type: "weapon", rarity: "legendary", quantity: 1, icon: Sword },
  { id: 2, name: "Dragon Scale Mail", type: "armor", rarity: "epic", quantity: 1, icon: Shield },
  { id: 3, name: "Health Potion", type: "consumable", rarity: "common", quantity: 15, icon: FlaskConical },
  { id: 4, name: "Mana Crystal", type: "consumable", rarity: "rare", quantity: 8, icon: Gem },
  { id: 5, name: "Ancient Scroll", type: "material", rarity: "epic", quantity: 3, icon: Scroll },
  { id: 6, name: "Steel Shield", type: "armor", rarity: "rare", quantity: 1, icon: Shield },
  { id: 7, name: "Fire Elixir", type: "consumable", rarity: "rare", quantity: 5, icon: FlaskConical },
  { id: 8, name: "Mystic Gem", type: "material", rarity: "legendary", quantity: 2, icon: Gem },
];

const getRarityStyle = (rarity: string) => {
  switch (rarity) {
    case "legendary": return "legendary";
    case "epic": return "epic";
    case "rare": return "rare";
    default: return "";
  }
};

const getRarityBorder = (rarity: string) => {
  switch (rarity) {
    case "legendary": return "border-primary";
    case "epic": return "border-accent";
    case "rare": return "border-rare";
    default: return "border-border";
  }
};

export function InventoryPanel() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Backpack className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-cinzel text-2xl text-primary">Inventory</h2>
            <p className="text-sm text-muted-foreground">36/50 slots used</p>
          </div>
        </div>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <Filter className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 flex gap-4">
        {/* Item Grid */}
        <div className="flex-1">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 bg-secondary/50 mb-4">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="weapon" className="text-xs">Weapons</TabsTrigger>
              <TabsTrigger value="armor" className="text-xs">Armor</TabsTrigger>
              <TabsTrigger value="consumable" className="text-xs">Consumables</TabsTrigger>
              <TabsTrigger value="material" className="text-xs">Materials</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-5 gap-2">
                  {inventoryItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`item-slot ${getRarityStyle(item.rarity)} ${
                        selectedItem?.id === item.id ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <div className="relative">
                        <item.icon className={`w-6 h-6 ${
                          item.rarity === "legendary" ? "text-primary" :
                          item.rarity === "epic" ? "text-accent" :
                          item.rarity === "rare" ? "text-rare" : "text-foreground"
                        }`} />
                        {item.quantity > 1 && (
                          <span className="absolute -bottom-1 -right-1 text-[10px] bg-background/80 px-1 rounded">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                  {/* Empty slots */}
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={`empty-${i}`} className="item-slot opacity-30" />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {["weapon", "armor", "consumable", "material"].map((type) => (
              <TabsContent key={type} value={type}>
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-5 gap-2">
                    {inventoryItems
                      .filter((item) => item.type === type)
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`item-slot ${getRarityStyle(item.rarity)} ${
                            selectedItem?.id === item.id ? "ring-2 ring-primary" : ""
                          }`}
                        >
                          <div className="relative">
                            <item.icon className={`w-6 h-6 ${
                              item.rarity === "legendary" ? "text-primary" :
                              item.rarity === "epic" ? "text-accent" :
                              item.rarity === "rare" ? "text-rare" : "text-foreground"
                            }`} />
                            {item.quantity > 1 && (
                              <span className="absolute -bottom-1 -right-1 text-[10px] bg-background/80 px-1 rounded">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Item Details */}
        <div className="w-64">
          {selectedItem ? (
            <div className={`glass-panel p-4 h-full border-2 ${getRarityBorder(selectedItem.rarity)}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedItem.rarity === "legendary" ? "bg-primary/20" :
                  selectedItem.rarity === "epic" ? "bg-accent/20" :
                  selectedItem.rarity === "rare" ? "bg-rare/20" : "bg-secondary"
                }`}>
                  <selectedItem.icon className={`w-6 h-6 ${
                    selectedItem.rarity === "legendary" ? "text-primary" :
                    selectedItem.rarity === "epic" ? "text-accent" :
                    selectedItem.rarity === "rare" ? "text-rare" : "text-foreground"
                  }`} />
                </div>
                <div>
                  <h3 className={`font-medium ${
                    selectedItem.rarity === "legendary" ? "text-primary" :
                    selectedItem.rarity === "epic" ? "text-accent" :
                    selectedItem.rarity === "rare" ? "text-rare" : ""
                  }`}>
                    {selectedItem.name}
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedItem.rarity} {selectedItem.type}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-2 bg-secondary/30 rounded">
                  <p className="text-muted-foreground text-xs mb-1">Stats</p>
                  <p className="text-primary">+45 Attack Power</p>
                  <p className="text-blue-400">+12 Critical Rate</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Description</p>
                  <p className="text-xs">A legendary blade forged in the fires of Mount Doom, capable of cutting through any armor.</p>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Sell Price</span>
                  <span className="text-yellow-400">2,500 Gold</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="py-2 px-3 text-xs bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors">
                  Equip
                </button>
                <button className="py-2 px-3 text-xs bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  Drop
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-4 h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">
                Select an item to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
