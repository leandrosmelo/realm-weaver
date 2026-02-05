import { useState } from "react";
import { Plus, Edit2, Trash2, Save, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface LoreEntry {
  id: string;
  title: string;
  content: string;
  linkedCharacters: string[];
  createdAt: string;
  updatedAt: string;
}

const availableCharacters = [
  "Aldric the Brave",
  "Lyra Shadowmend",
  "Grom Ironhide",
  "The Dark Lord",
  "Queen Elara",
];

const initialLoreEntries: LoreEntry[] = [
  {
    id: "1",
    title: "The Fall of the High Kingdom",
    content: "Long ago, the High Kingdom stood as a beacon of hope across the realm. Under the rule of King Aldric I, prosperity flourished for three centuries. But darkness crept from the eastern mountains...\n\nThe armies of shadow swept across the land, and despite the valiant efforts of the knights, the kingdom fell. Only remnants of the old guard remain, scattered across the wilderness.",
    linkedCharacters: ["Aldric the Brave", "Queen Elara"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    title: "The Forbidden Arts",
    content: "In the depths of the Shadowfen Forest, ancient rituals are practiced by those who dare to seek power beyond mortal understanding. The forbidden arts were once the domain of the High Mages, but after the Sundering, they were scattered to the winds.\n\nLyra Shadowmend is one of the few who still remembers the old ways.",
    linkedCharacters: ["Lyra Shadowmend"],
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    title: "Dwarven Exile Traditions",
    content: "When a dwarf is exiled from their clan, they undergo the Rite of Severance. Their beard is cut short, and their clan mark is struck from the records. They become Ironless—without home or heritage.\n\nYet some exiles find new purpose, forging their own legacy in the world above.",
    linkedCharacters: ["Grom Ironhide"],
    createdAt: "2024-01-22",
    updatedAt: "2024-01-25",
  },
];

export function LoreManagement() {
  const [loreEntries, setLoreEntries] = useState<LoreEntry[]>(initialLoreEntries);
  const [selectedEntry, setSelectedEntry] = useState<LoreEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<LoreEntry | null>(null);

  const handleCreate = () => {
    const now = new Date().toISOString().split("T")[0];
    setEditForm({
      id: Date.now().toString(),
      title: "",
      content: "",
      linkedCharacters: [],
      createdAt: now,
      updatedAt: now,
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleEdit = (entry: LoreEntry) => {
    setEditForm({ ...entry });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!editForm) return;
    
    const now = new Date().toISOString().split("T")[0];
    const updatedForm = { ...editForm, updatedAt: now };
    
    if (isCreating) {
      setLoreEntries([...loreEntries, updatedForm]);
    } else {
      setLoreEntries(loreEntries.map(e => e.id === editForm.id ? updatedForm : e));
    }
    
    setSelectedEntry(updatedForm);
    setIsEditing(false);
    setIsCreating(false);
    setEditForm(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditForm(null);
  };

  const handleDelete = (id: string) => {
    setLoreEntries(loreEntries.filter(e => e.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };

  const addCharacter = (character: string) => {
    if (editForm && !editForm.linkedCharacters.includes(character)) {
      setEditForm({
        ...editForm,
        linkedCharacters: [...editForm.linkedCharacters, character],
      });
    }
  };

  const removeCharacter = (character: string) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        linkedCharacters: editForm.linkedCharacters.filter(c => c !== character),
      });
    }
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Lore List */}
      <div className="w-1/3 glass-panel p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-cinzel text-lg">Lore Entries</h3>
          <Button size="sm" onClick={handleCreate} className="gap-1">
            <Plus className="w-4 h-4" /> New
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {loreEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedEntry?.id === entry.id
                    ? "bg-primary/20 border-primary/50"
                    : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-accent/40 to-mystic/40 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">Updated: {entry.updatedAt}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{entry.linkedCharacters.length} characters</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Lore Details */}
      <div className="flex-1 glass-panel p-4">
        {selectedEntry ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cinzel text-lg">{selectedEntry.title}</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(selectedEntry)}>
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(selectedEntry.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Linked Characters</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.linkedCharacters.map((char, index) => (
                      <Badge key={index} variant="outline" className="border-primary/50">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Content</p>
                  <div className="prose prose-invert prose-sm max-w-none">
                    {selectedEntry.content.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="text-sm mb-3">{paragraph}</p>
                    ))}
                  </div>
                </div>
                <div className="flex gap-6 text-xs text-muted-foreground pt-4 border-t border-border">
                  <span>Created: {selectedEntry.createdAt}</span>
                  <span>Updated: {selectedEntry.updatedAt}</span>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a lore entry to view details
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-2xl bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="font-cinzel">
              {isCreating ? "Create New Lore Entry" : "Edit Lore Entry"}
            </DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-muted-foreground">Title</label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Lore entry title"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Content</label>
                <Textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="Write your lore content here... Use double line breaks for paragraphs."
                  className="mt-1 min-h-[200px] font-mono text-sm"
                  rows={10}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Linked Characters</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editForm.linkedCharacters.map((char, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="gap-1 cursor-pointer"
                      onClick={() => removeCharacter(char)}
                    >
                      {char} ×
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addCharacter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add a character..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-primary/20">
                    {availableCharacters
                      .filter(c => !editForm.linkedCharacters.includes(c))
                      .map((char) => (
                        <SelectItem key={char} value={char}>{char}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
