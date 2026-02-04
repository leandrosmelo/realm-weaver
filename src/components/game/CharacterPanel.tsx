import { useState } from "react";
import { Sword, Shield, Heart, Zap, Brain, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Stat {
  name: string;
  value: number;
  maxValue: number;
  icon: React.ElementType;
  color: string;
}

const baseStats: Stat[] = [
  { name: "Strength", value: 45, maxValue: 100, icon: Sword, color: "text-red-400" },
  { name: "Defense", value: 38, maxValue: 100, icon: Shield, color: "text-blue-400" },
  { name: "Vitality", value: 52, maxValue: 100, icon: Heart, color: "text-green-400" },
  { name: "Agility", value: 41, maxValue: 100, icon: Zap, color: "text-yellow-400" },
  { name: "Intelligence", value: 35, maxValue: 100, icon: Brain, color: "text-purple-400" },
  { name: "Perception", value: 28, maxValue: 100, icon: Eye, color: "text-cyan-400" },
];

const equipment = [
  { slot: "Weapon", item: "Shadowbane Sword", rarity: "legendary" },
  { slot: "Armor", item: "Dragon Scale Mail", rarity: "epic" },
  { slot: "Helmet", item: "Helm of Valor", rarity: "rare" },
  { slot: "Boots", item: "Swift Striders", rarity: "epic" },
  { slot: "Gloves", item: "Gauntlets of Power", rarity: "rare" },
  { slot: "Ring", item: "Ring of Protection", rarity: "rare" },
];

export function CharacterPanel() {
  const [stats, setStats] = useState(baseStats);
  const [availablePoints, setAvailablePoints] = useState(5);

  const increaseStat = (index: number) => {
    if (availablePoints > 0 && stats[index].value < stats[index].maxValue) {
      const newStats = [...stats];
      newStats[index].value += 1;
      setStats(newStats);
      setAvailablePoints(availablePoints - 1);
    }
  };

  const decreaseStat = (index: number) => {
    if (stats[index].value > baseStats[index].value) {
      const newStats = [...stats];
      newStats[index].value -= 1;
      setStats(newStats);
      setAvailablePoints(availablePoints + 1);
    }
  };

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "border-primary/70 text-primary";
      case "epic": return "border-accent/60 text-accent";
      case "rare": return "border-rare/50 text-rare";
      default: return "border-border text-foreground";
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="font-cinzel text-2xl text-primary">Character Editor</h2>
          <p className="text-sm text-muted-foreground">Customize your hero</p>
        </div>

        {/* Character Preview */}
        <div className="glass-panel p-6 flex items-center gap-6">
          <div className="w-32 h-40 rounded-lg bg-gradient-to-b from-secondary to-muted flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            <Sword className="w-16 h-16 text-primary animate-float" />
          </div>
          <div className="flex-1">
            <h3 className="font-cinzel text-xl mb-1">ShadowKnight</h3>
            <p className="text-sm text-muted-foreground mb-3">Level 42 Warrior</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Class</p>
                <p className="font-medium">Warrior</p>
              </div>
              <div>
                <p className="text-muted-foreground">Race</p>
                <p className="font-medium">Human</p>
              </div>
              <div>
                <p className="text-muted-foreground">Guild</p>
                <p className="font-medium">Shadow Legion</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="stats">Attributes</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-4 space-y-4">
            {/* Available Points */}
            <div className="glass-panel p-3 flex items-center justify-between">
              <span className="text-sm">Available Stat Points</span>
              <span className="text-lg font-semibold text-primary">{availablePoints}</span>
            </div>

            {/* Stats List */}
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={stat.name} className="glass-panel p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="font-medium">{stat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => decreaseStat(index)}
                        disabled={stats[index].value <= baseStats[index].value}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{stat.value}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => increaseStat(index)}
                        disabled={availablePoints === 0 || stat.value >= stat.maxValue}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="stat-bar">
                    <div 
                      className="stat-bar-fill bg-gradient-to-r from-primary/80 to-primary/40"
                      style={{ width: `${(stat.value / stat.maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {equipment.map((item) => (
                <div 
                  key={item.slot}
                  className={`glass-panel p-4 border-2 ${getRarityClass(item.rarity)} cursor-pointer hover:scale-[1.02] transition-transform`}
                >
                  <p className="text-xs text-muted-foreground mb-1">{item.slot}</p>
                  <p className="font-medium text-sm">{item.item}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Combat Stats */}
        <div className="glass-panel p-4">
          <h4 className="font-cinzel text-lg mb-4">Combat Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Attack Power</span>
              <span className="text-primary font-medium">1,245</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Defense Rating</span>
              <span className="text-blue-400 font-medium">892</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Critical Chance</span>
              <span className="text-yellow-400 font-medium">24.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dodge Chance</span>
              <span className="text-green-400 font-medium">18.2%</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
