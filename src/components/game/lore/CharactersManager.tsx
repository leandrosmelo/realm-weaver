import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, User } from "lucide-react";
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

interface GameCharacter {
  id: string;
  name: string;
  bio: string;
  characteristics: string;
  skills: string[];
}

const initialCharacters: GameCharacter[] = [
  {
    id: "1",
    name: "Aldric the Brave",
    bio: "A legendary knight who once served the High King before his fall.",
    characteristics: "Tall, silver hair, battle-scarred, wears ancient armor",
    skills: ["Swordsmanship", "Leadership", "Tactics"],
  },
  {
    id: "2",
    name: "Lyra Shadowmend",
    bio: "A mysterious healer from the eastern forests with knowledge of forbidden magic.",
    characteristics: "Ethereal beauty, violet eyes, speaks in riddles",
    skills: ["Healing", "Dark Magic", "Herbalism"],
  },
  {
    id: "3",
    name: "Grom Ironhide",
    bio: "An exiled dwarven smith seeking redemption for his clan.",
    characteristics: "Stocky build, fiery beard, missing left eye",
    skills: ["Blacksmithing", "Mining", "Combat"],
  },
];

export function CharactersManager() {
  const [characters, setCharacters] = useState<GameCharacter[]>(initialCharacters);
  const [selectedCharacter, setSelectedCharacter] = useState<GameCharacter | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<GameCharacter | null>(null);
  const [newSkill, setNewSkill] = useState("");

  const handleCreate = () => {
    setEditForm({
      id: Date.now().toString(),
      name: "",
      bio: "",
      characteristics: "",
      skills: [],
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleEdit = (character: GameCharacter) => {
    setEditForm({ ...character });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!editForm) return;
    
    if (isCreating) {
      setCharacters([...characters, editForm]);
    } else {
      setCharacters(characters.map(c => c.id === editForm.id ? editForm : c));
    }
    
    setSelectedCharacter(editForm);
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
    setCharacters(characters.filter(c => c.id !== id));
    if (selectedCharacter?.id === id) {
      setSelectedCharacter(null);
    }
  };

  const addSkill = () => {
    if (editForm && newSkill.trim()) {
      setEditForm({
        ...editForm,
        skills: [...editForm.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillIndex: number) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        skills: editForm.skills.filter((_, i) => i !== skillIndex),
      });
    }
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Character List */}
      <div className="w-1/3 glass-panel p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-cinzel text-lg">Characters</h3>
          <Button size="sm" onClick={handleCreate} className="gap-1">
            <Plus className="w-4 h-4" /> New
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedCharacter?.id === character.id
                    ? "bg-primary/20 border-primary/50"
                    : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{character.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{character.bio.slice(0, 40)}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Character Details */}
      <div className="flex-1 glass-panel p-4">
        {selectedCharacter ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cinzel text-lg">{selectedCharacter.name}</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(selectedCharacter)}>
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(selectedCharacter.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bio</p>
                  <p className="text-sm">{selectedCharacter.bio}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Characteristics</p>
                  <p className="text-sm">{selectedCharacter.characteristics}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a character to view details
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-lg bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="font-cinzel">
              {isCreating ? "Create New Character" : "Edit Character"}
            </DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Character name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Bio</label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Character backstory and description"
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Characteristics</label>
                <Textarea
                  value={editForm.characteristics}
                  onChange={(e) => setEditForm({ ...editForm, characteristics: e.target.value })}
                  placeholder="Physical appearance and personality traits"
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editForm.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(index)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
                </div>
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
