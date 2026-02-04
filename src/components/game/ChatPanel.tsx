import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    text: "The Lich King has awakened from his thousand-year slumber. His undead armies march upon our lands. Only a hero of your caliber can stop him.",
    timestamp: new Date(),
  },
];

export function ChatPanel() {
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
    
    // Simulate NPC response
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
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-primary/20">
        <h2 className="font-cinzel text-xl text-primary flex items-center gap-2">
          <Bot className="w-5 h-5" />
          NPC Interaction
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Speaking with Elder Morrigan
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "player" ? "justify-end" : "justify-start"}`}
            >
              <div className={`chat-bubble ${msg.sender}`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender === "npc" ? (
                    <Bot className="w-4 h-4 text-accent" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                  <span className={`text-xs font-medium ${
                    msg.sender === "npc" ? "text-accent" : "text-primary"
                  }`}>
                    {msg.name}
                  </span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-primary/20">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your response..."
            className="flex-1 bg-secondary/50 border-border focus:border-primary"
          />
          <Button onClick={handleSend} className="bg-primary hover:bg-primary/80">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-3">
          {["Accept Quest", "Ask for Help", "Trade"].map((action) => (
            <button
              key={action}
              className="px-3 py-1.5 text-xs bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/30 rounded-lg transition-all"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
