import { Scroll, Star, MapPin, Clock, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Quest {
  id: number;
  title: string;
  description: string;
  type: "main" | "side" | "daily";
  status: "active" | "completed";
  progress: number;
  maxProgress: number;
  location: string;
  rewards: { xp: number; gold: number };
  objectives: { text: string; completed: boolean }[];
}

const quests: Quest[] = [
  {
    id: 1,
    title: "The Awakening Darkness",
    description: "Investigate the strange occurrences at Shadow Keep and confront the source of evil.",
    type: "main",
    status: "active",
    progress: 2,
    maxProgress: 5,
    location: "Shadow Keep",
    rewards: { xp: 5000, gold: 2500 },
    objectives: [
      { text: "Speak with Elder Morrigan", completed: true },
      { text: "Travel to Shadow Keep", completed: true },
      { text: "Investigate the Dark Portal", completed: false },
      { text: "Defeat the Shadow Guardians", completed: false },
      { text: "Confront the Lich King", completed: false },
    ],
  },
  {
    id: 2,
    title: "Dragon's Bane",
    description: "Slay the dragon terrorizing the northern villages.",
    type: "side",
    status: "active",
    progress: 1,
    maxProgress: 3,
    location: "Dragon's Peak",
    rewards: { xp: 2000, gold: 1000 },
    objectives: [
      { text: "Find the dragon's lair", completed: true },
      { text: "Collect fire-resistant herbs", completed: false },
      { text: "Defeat Ashwing the Destroyer", completed: false },
    ],
  },
  {
    id: 3,
    title: "Daily Hunt",
    description: "Defeat 10 monsters in the wilderness.",
    type: "daily",
    status: "active",
    progress: 7,
    maxProgress: 10,
    location: "Anywhere",
    rewards: { xp: 500, gold: 250 },
    objectives: [
      { text: "Defeat 10 monsters (7/10)", completed: false },
    ],
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "main": return "bg-primary/20 text-primary border-primary/30";
    case "side": return "bg-accent/20 text-accent border-accent/30";
    case "daily": return "bg-green-500/20 text-green-400 border-green-500/30";
    default: return "bg-secondary text-foreground";
  }
};

export function QuestsPanel() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Scroll className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-cinzel text-2xl text-primary">Quest Log</h2>
            <p className="text-sm text-muted-foreground">Track your adventures</p>
          </div>
        </div>

        {/* Quest Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-panel p-3 text-center">
            <p className="text-2xl font-semibold text-primary">3</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="glass-panel p-3 text-center">
            <p className="text-2xl font-semibold text-green-400">156</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="glass-panel p-3 text-center">
            <p className="text-2xl font-semibold text-accent">12</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="active">Active Quests</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4 space-y-4">
            {quests.map((quest) => (
              <div key={quest.id} className="quest-item group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${getTypeColor(quest.type)}`}>
                        {quest.type.charAt(0).toUpperCase() + quest.type.slice(1)}
                      </span>
                      {quest.type === "main" && (
                        <Star className="w-4 h-4 text-primary fill-primary" />
                      )}
                    </div>
                    <h3 className="font-cinzel text-lg group-hover:text-primary transition-colors">
                      {quest.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {quest.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{quest.progress}/{quest.maxProgress}</span>
                  </div>
                  <Progress 
                    value={(quest.progress / quest.maxProgress) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Objectives */}
                <div className="space-y-1.5 mb-3">
                  {quest.objectives.slice(0, 3).map((obj, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {obj.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={obj.completed ? "line-through text-muted-foreground" : ""}>
                        {obj.text}
                      </span>
                    </div>
                  ))}
                  {quest.objectives.length > 3 && (
                    <p className="text-xs text-muted-foreground pl-6">
                      +{quest.objectives.length - 3} more objectives...
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {quest.location}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-primary">+{quest.rewards.xp} XP</span>
                    <span className="text-yellow-400">+{quest.rewards.gold} Gold</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>156 quests completed</p>
              <p className="text-sm">View your legendary achievements</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
