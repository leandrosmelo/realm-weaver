import { useState } from "react";
import { Sparkles, Lock, Zap, Sword, Shield, Flame, Snowflake, Wind } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Skill {
  id: number;
  name: string;
  icon: React.ElementType;
  tier: number;
  unlocked: boolean;
  level: number;
  maxLevel: number;
  description: string;
  cost: number;
  connections: number[];
}

const skills: Skill[] = [
  { id: 1, name: "Power Strike", icon: Sword, tier: 1, unlocked: true, level: 5, maxLevel: 5, description: "A powerful melee attack", cost: 1, connections: [2, 3] },
  { id: 2, name: "Shield Bash", icon: Shield, tier: 2, unlocked: true, level: 3, maxLevel: 5, description: "Stun enemies with your shield", cost: 2, connections: [4] },
  { id: 3, name: "Flame Strike", icon: Flame, tier: 2, unlocked: true, level: 2, maxLevel: 5, description: "Engulf your weapon in flames", cost: 2, connections: [5] },
  { id: 4, name: "Frost Armor", icon: Snowflake, tier: 3, unlocked: false, level: 0, maxLevel: 5, description: "Surround yourself with ice", cost: 3, connections: [6] },
  { id: 5, name: "Whirlwind", icon: Wind, tier: 3, unlocked: false, level: 0, maxLevel: 5, description: "Spin attack hitting all nearby", cost: 3, connections: [6] },
  { id: 6, name: "Lightning Fury", icon: Zap, tier: 4, unlocked: false, level: 0, maxLevel: 5, description: "Ultimate lightning attack", cost: 5, connections: [] },
];

const tierPositions: { [key: number]: string } = {
  1: "top-[10%]",
  2: "top-[35%]",
  3: "top-[60%]",
  4: "top-[85%]",
};

export function SkillsPanel() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillPoints] = useState(8);

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center glow-mystic">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-cinzel text-2xl text-primary">Skills</h2>
            <p className="text-sm text-muted-foreground">Unlock powerful abilities</p>
          </div>
        </div>
        <div className="glass-panel px-4 py-2">
          <span className="text-sm text-muted-foreground">Skill Points: </span>
          <span className="text-lg font-semibold text-accent">{skillPoints}</span>
        </div>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Skill Tree */}
        <ScrollArea className="flex-1">
          <div className="glass-panel p-6 min-h-[500px]">
            <div className="grid grid-cols-3 gap-8">
              {/* Tier Labels */}
              {[1, 2, 3, 4].map((tier) => (
                <div key={tier} className="col-span-3 flex items-center gap-4 mb-2">
                  <span className="text-xs text-muted-foreground">Tier {tier}</span>
                  <div className="flex-1 h-px bg-border/50" />
                </div>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-3 gap-6">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className={`col-span-1 ${skill.tier === 1 ? "col-start-2" : ""}`}
                >
                  <button
                    onClick={() => setSelectedSkill(skill)}
                    className={`skill-node ${skill.unlocked ? "unlocked" : "locked"} ${
                      selectedSkill?.id === skill.id ? "ring-2 ring-accent" : ""
                    }`}
                  >
                    {skill.unlocked ? (
                      <skill.icon className="w-6 h-6 text-primary" />
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  <p className={`text-xs text-center mt-2 ${
                    skill.unlocked ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {skill.name}
                  </p>
                  {skill.unlocked && (
                    <p className="text-xs text-center text-primary">
                      {skill.level}/{skill.maxLevel}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Skill Details */}
        <div className="w-72">
          {selectedSkill ? (
            <div className="glass-panel-accent p-4 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  selectedSkill.unlocked 
                    ? "bg-primary/20 glow-gold" 
                    : "bg-secondary"
                }`}>
                  {selectedSkill.unlocked ? (
                    <selectedSkill.icon className="w-7 h-7 text-primary" />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-cinzel text-lg">{selectedSkill.name}</h3>
                  <p className="text-xs text-muted-foreground">Tier {selectedSkill.tier}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {selectedSkill.description}
                </p>

                {selectedSkill.unlocked ? (
                  <>
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Level</span>
                        <span className="text-accent">{selectedSkill.level}/{selectedSkill.maxLevel}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full"
                          style={{ width: `${(selectedSkill.level / selectedSkill.maxLevel) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/30 rounded-lg space-y-2">
                      <p className="text-xs text-muted-foreground">Current Effects</p>
                      <p className="text-sm text-accent">+{selectedSkill.level * 10}% Damage</p>
                      <p className="text-sm text-blue-400">-{selectedSkill.level * 2}% Cooldown</p>
                    </div>

                    {selectedSkill.level < selectedSkill.maxLevel && (
                      <button className="w-full py-3 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors">
                        Upgrade (1 Point)
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-2">Requirements</p>
                      <p className="text-sm">• Reach Tier {selectedSkill.tier}</p>
                      <p className="text-sm">• {selectedSkill.cost} Skill Points</p>
                    </div>

                    <button 
                      disabled={skillPoints < selectedSkill.cost}
                      className="w-full py-3 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Unlock ({selectedSkill.cost} Points)
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel-accent p-4 h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">
                Select a skill to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
