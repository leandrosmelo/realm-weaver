import { useState } from "react";
import { Plus, Sparkles, Clock, Brain, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface NPC {
  id: string;
  name: string;
  personality: string;
  dailyRoutine: string;
  memory: string[];
}

const initialNPCs: NPC[] = [
  {
    id: "1",
    name: "Bartender Marcus",
    personality: "Friendly but observant. Speaks in a gruff voice but has a soft spot for regulars. Knows everyone's secrets but keeps them close. Loyal to those who treat him well.",
    dailyRoutine: "Dawn: Opens tavern, cleans mugs. Morning: Prepares food, receives deliveries. Afternoon: Serves lunch crowd, gossips with merchants. Evening: Peak hours, serves dinner and drinks. Night: Closes late, counts earnings.",
    memory: [
      "Player helped him find his lost cat last week",
      "Knows about the secret smuggling route through the cellar",
      "Remembers player ordered the strongest ale twice",
    ],
  },
  {
    id: "2",
    name: "Guard Captain Helena",
    personality: "Stern and disciplined. Former adventurer who settled down after an injury. Suspicious of strangers but respects proven warriors. Has a hidden fear of magic.",
    dailyRoutine: "Dawn: Morning patrol inspection. Morning: Training recruits, reviewing reports. Afternoon: Meetings with city officials. Evening: Night watch assignment. Night: Personal sword practice.",
    memory: [
      "Player showed respect to her guards",
      "Witnessed player defeating bandits outside town",
      "Suspects player knows something about the missing merchant",
    ],
  },
  {
    id: "3",
    name: "Herbalist Willow",
    personality: "Eccentric and mysterious. Talks to plants as if they respond. Has an encyclopedic knowledge of rare ingredients. Bargains hard but is fair.",
    dailyRoutine: "Dawn: Tends garden, harvests herbs. Morning: Prepares potions and remedies. Afternoon: Opens shop, serves customers. Evening: Experiments with new formulas. Night: Meditates under moonlight.",
    memory: [
      "Player bought rare healing potion for full price",
      "Shared secret about moonpetal flowers",
      "Player asked about poison—found suspicious",
    ],
  },
];

export function NPCConsole() {
  const [npcs, setNpcs] = useState<NPC[]>(initialNPCs);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newNPCDialog, setNewNPCDialog] = useState(false);
  const [newNPCForm, setNewNPCForm] = useState({
    name: "",
    personality: "",
    dailyRoutine: "",
  });

  const generateNPC = () => {
    setIsGenerating(true);
    
    // Simulate NPC generation
    setTimeout(() => {
      const names = ["Merchant Theo", "Blacksmith Hilda", "Scholar Erasmus", "Bard Melody", "Hunter Fenris"];
      const personalities = [
        "Cheerful and talkative. Always has a story to share.",
        "Quiet and brooding. Speaks in short sentences.",
        "Wise and patient. Gives cryptic advice.",
        "Playful and mischievous. Loves riddles.",
        "Grumpy but helpful. Complains about everything.",
      ];
      const routines = [
        "Works from dawn to dusk with a lunch break at the market.",
        "Active at night, sleeps during the day.",
        "Travels between locations, unpredictable schedule.",
        "Follows a strict religious schedule with prayer times.",
        "Works in bursts, often found idle at the tavern.",
      ];
      
      const newNPC: NPC = {
        id: Date.now().toString(),
        name: names[Math.floor(Math.random() * names.length)],
        personality: personalities[Math.floor(Math.random() * personalities.length)],
        dailyRoutine: routines[Math.floor(Math.random() * routines.length)],
        memory: [],
      };
      
      setNpcs([...npcs, newNPC]);
      setSelectedNPC(newNPC);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCreateNPC = () => {
    const newNPC: NPC = {
      id: Date.now().toString(),
      name: newNPCForm.name,
      personality: newNPCForm.personality,
      dailyRoutine: newNPCForm.dailyRoutine,
      memory: [],
    };
    
    setNpcs([...npcs, newNPC]);
    setSelectedNPC(newNPC);
    setNewNPCDialog(false);
    setNewNPCForm({ name: "", personality: "", dailyRoutine: "" });
  };

  const addMemory = (memory: string) => {
    if (selectedNPC && memory.trim()) {
      const updatedNPC = {
        ...selectedNPC,
        memory: [...selectedNPC.memory, memory.trim()],
      };
      setNpcs(npcs.map(n => n.id === selectedNPC.id ? updatedNPC : n));
      setSelectedNPC(updatedNPC);
    }
  };

  const [newMemory, setNewMemory] = useState("");

  return (
    <div className="flex gap-4 h-full">
      {/* NPC List */}
      <div className="w-1/3 glass-panel p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-cinzel text-lg">NPCs</h3>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setNewNPCDialog(true)}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={generateNPC}
              disabled={isGenerating}
              className="gap-1"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? "..." : "Generate"}
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {npcs.map((npc) => (
              <div
                key={npc.id}
                onClick={() => setSelectedNPC(npc)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedNPC?.id === npc.id
                    ? "bg-primary/20 border-primary/50"
                    : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mystic/40 to-primary/40 flex items-center justify-center">
                    <User2 className="w-5 h-5 text-mystic" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{npc.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Brain className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{npc.memory.length} memories</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* NPC Details */}
      <div className="flex-1 glass-panel p-4">
        {selectedNPC ? (
          <ScrollArea className="h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mystic/40 to-primary/40 flex items-center justify-center">
                  <User2 className="w-8 h-8 text-mystic" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl">{selectedNPC.name}</h3>
                  <p className="text-sm text-muted-foreground">Game NPC</p>
                </div>
              </div>

              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h4 className="font-medium">Personality</h4>
                </div>
                <p className="text-sm text-muted-foreground">{selectedNPC.personality}</p>
              </div>

              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-accent" />
                  <h4 className="font-medium">Daily Routine</h4>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedNPC.dailyRoutine}</p>
              </div>

              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-mystic" />
                  <h4 className="font-medium">Memory</h4>
                </div>
                <div className="space-y-2 mb-4">
                  {selectedNPC.memory.length > 0 ? (
                    selectedNPC.memory.map((mem, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-sm">{mem}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No memories recorded yet</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newMemory}
                    onChange={(e) => setNewMemory(e.target.value)}
                    placeholder="Add a new memory..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newMemory.trim()) {
                        addMemory(newMemory);
                        setNewMemory("");
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (newMemory.trim()) {
                        addMemory(newMemory);
                        setNewMemory("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select an NPC to view details
          </div>
        )}
      </div>

      {/* Create NPC Dialog */}
      <Dialog open={newNPCDialog} onOpenChange={setNewNPCDialog}>
        <DialogContent className="max-w-lg bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="font-cinzel">Create New NPC</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <Input
                value={newNPCForm.name}
                onChange={(e) => setNewNPCForm({ ...newNPCForm, name: e.target.value })}
                placeholder="NPC name and title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Personality</label>
              <Textarea
                value={newNPCForm.personality}
                onChange={(e) => setNewNPCForm({ ...newNPCForm, personality: e.target.value })}
                placeholder="Describe their personality traits, speaking style, and quirks..."
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Daily Routine</label>
              <Textarea
                value={newNPCForm.dailyRoutine}
                onChange={(e) => setNewNPCForm({ ...newNPCForm, dailyRoutine: e.target.value })}
                placeholder="Describe their schedule and activities throughout the day..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewNPCDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateNPC} disabled={!newNPCForm.name.trim()}>
              Create NPC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
