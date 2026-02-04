import { useState } from "react";
import { Send, Bot, User, ChevronUp, ChevronDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  sender: "npc" | "player";
  name: string;
  text: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "npc",
    name: "Elder Morrigan",
    text: "Greetings, brave adventurer. The realm is in grave danger. Dark forces gather at the Shadow Keep...",
    timestamp: new Date(),
  },
  {
    id: 2,
    sender: "player",
    name: "You",
    text: "What kind of danger threatens the realm?",
    timestamp: new Date(),
  },
  {
    id: 3,
    sender: "npc",
    name: "Elder Morrigan",
    text: "The Lich King has awakened from his thousand-year slumber. His undead armies march upon our lands.",
    timestamp: new Date(),
  },
];

interface ChatPanelProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export function ChatPanel({ expanded, onExpandedChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const playerMessage: Message = {
      id: messages.length + 1,
      sender: "player",
      name: "You",
      text: input,
      timestamp: new Date(),
    };
    
    setMessages([...messages, playerMessage]);
    setInput("");
    
    setTimeout(() => {
      const npcResponses = [
        "Indeed, your wisdom grows, adventurer. The path ahead will test your courage.",
        "Such insight! Perhaps you are the one the prophecy foretold...",
        "The ancient texts speak of this. You must seek the Crystal of Dawn.",
        "Beware, young hero. Not all who offer aid are trustworthy in these dark times.",
      ];
      const npcMessage: Message = {
        id: messages.length + 2,
        sender: "npc",
        name: "Elder Morrigan",
        text: npcResponses[Math.floor(Math.random() * npcResponses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, npcMessage]);
    }, 1000);
  };

  return (
    <div className={cn(
      "glass-panel border-t border-primary/20 transition-all duration-300 flex flex-col",
      expanded ? "h-72" : "h-12"
    )}>
      {/* Header - Always visible */}
      <button
        onClick={() => onExpandedChange(!expanded)}
        className="flex items-center justify-between px-4 py-2 hover:bg-secondary/30 transition-colors shrink-0"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="font-cinzel text-sm text-primary">NPC Chat</span>
          <span className="text-xs text-muted-foreground">- Elder Morrigan</span>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Chat Content - Shown when expanded */}
      {expanded && (
        <>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-3 py-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "player" ? "justify-end" : "justify-start"}`}
                >
                  <div className={cn(
                    "max-w-[70%] p-2 rounded-lg text-sm",
                    msg.sender === "npc" 
                      ? "bg-accent/20 border border-accent/30 rounded-tl-none" 
                      : "bg-primary/20 border border-primary/30 rounded-tr-none"
                  )}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {msg.sender === "npc" ? (
                        <Bot className="w-3 h-3 text-accent" />
                      ) : (
                        <User className="w-3 h-3 text-primary" />
                      )}
                      <span className={cn(
                        "text-[10px] font-medium",
                        msg.sender === "npc" ? "text-accent" : "text-primary"
                      )}>
                        {msg.name}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-primary/20 shrink-0">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your response..."
                className="flex-1 h-8 text-sm bg-secondary/50 border-border focus:border-primary"
              />
              <Button onClick={handleSend} size="sm" className="h-8 bg-primary hover:bg-primary/80">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              {["Accept Quest", "Ask for Help", "Trade"].map((action) => (
                <button
                  key={action}
                  className="px-2 py-1 text-[10px] bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/30 rounded transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
