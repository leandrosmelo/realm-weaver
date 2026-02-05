import { useState } from "react";
import { Sword, Shield, Heart, Zap, Brain, Eye, ChevronUp, ChevronDown, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const characterClasses = ["Warrior", "Mage", "Rogue", "Paladin", "Ranger", "Necromancer"];
const spiritCollections = ["None", "Phoenix Flames", "Shadow Wraith", "Storm Guardian", "Forest Spirit", "Ice Dragon"];

interface CharacterInfo {
  name: string;
  bio: string;
  characterClass: string;
  spiritCollection: string;
}

export function CharacterPanel() {
  const [stats, setStats] = useState(baseStats);
  const [availablePoints, setAvailablePoints] = useState(5);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [characterInfo, setCharacterInfo] = useState<CharacterInfo>({
    name: "ShadowKnight",
    bio: "A legendary warrior who emerged from the shadows of the fallen kingdom, seeking redemption and glory.",
    characterClass: "Warrior",
    spiritCollection: "None",
  });
  const [editForm, setEditForm] = useState<CharacterInfo>(characterInfo);

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

  const handleEditInfo = () => {
    setEditForm(characterInfo);
    setIsEditingInfo(true);
  };

  const handleSaveInfo = () => {
    setCharacterInfo(editForm);
    setIsEditingInfo(false);
  };

  const handleCancelEdit = () => {
    setIsEditingInfo(false);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="font-cinzel text-2xl text-primary">Character Editor</h2>
          <p className="text-sm text-muted-foreground">Customize your hero</p>
        </div>

        {/* Character Preview */}
        <div className="glass-panel p-6">
          {isEditingInfo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-cinzel text-lg">Edit Character</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={handleSaveInfo}>
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Class</label>
                  <Select 
                    value={editForm.characterClass}
                    onValueChange={(value) => setEditForm({ ...editForm, characterClass: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-primary/20">
                      {characterClasses.map((cls) => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Bio</label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Spirit Collection (Optional)</label>
                <Select 
                  value={editForm.spiritCollection}
                  onValueChange={(value) => setEditForm({ ...editForm, spiritCollection: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-primary/20">
                    {spiritCollections.map((spirit) => (
                      <SelectItem key={spirit} value={spirit}>{spirit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-6">
              <div className="w-32 h-40 rounded-lg bg-gradient-to-b from-secondary to-muted flex items-center justify-center relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                <Sword className="w-16 h-16 text-primary animate-float" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-cinzel text-xl mb-1">{characterInfo.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Level 42 {characterInfo.characterClass}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleEditInfo}>
                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{characterInfo.bio}</p>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Class</p>
                    <p className="font-medium">{characterInfo.characterClass}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Race</p>
                    <p className="font-medium">Human</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Spirit</p>
                    <p className="font-medium">{characterInfo.spiritCollection === "None" ? "—" : characterInfo.spiritCollection}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
