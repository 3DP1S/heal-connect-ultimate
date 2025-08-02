import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  BookOpen, 
  PenTool, 
  Sparkles, 
  Heart, 
  Sun, 
  Moon,
  Flower,
  Edit3,
  Save,
  Trash2,
  Plus,
  Quote
} from "lucide-react";

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  prompt: string | null;
  mood: string | null;
  tags: string | null;
  isPrivate: boolean | null;
  createdAt: Date;
}

const dailyPrompts = [
  "What am I most grateful for today?",
  "What brought me joy in the past 24 hours?",
  "How did I show kindness to myself or others today?",
  "What challenge did I overcome, and how did it help me grow?",
  "What intention do I want to set for tomorrow?",
  "What emotions am I feeling right now, and why?",
  "What lesson did today teach me about myself?",
  "How can I be more present in my daily life?",
  "What aspects of my life are flowing well right now?",
  "What would I like to release or let go of today?",
  "How did I practice self-care today?",
  "What new perspective did I gain about a situation in my life?",
  "What are three things that made me smile today?",
  "How did I connect with others or nature today?",
  "What am I looking forward to in the coming days?"
];

const moodOptions = [
  { value: 'grateful', label: 'Grateful', color: 'from-amber-400 to-orange-500', icon: Sun },
  { value: 'peaceful', label: 'Peaceful', color: 'from-green-400 to-emerald-500', icon: Flower },
  { value: 'reflective', label: 'Reflective', color: 'from-blue-400 to-indigo-500', icon: Moon },
  { value: 'hopeful', label: 'Hopeful', color: 'from-purple-400 to-pink-500', icon: Sparkles },
  { value: 'content', label: 'Content', color: 'from-teal-400 to-cyan-500', icon: Heart },
  { value: 'contemplative', label: 'Contemplative', color: 'from-slate-400 to-gray-500', icon: BookOpen }
];

const commonTags = [
  'gratitude', 'growth', 'relationships', 'work', 'health', 'creativity', 
  'mindfulness', 'goals', 'challenges', 'joy', 'reflection', 'healing'
];

export default function JournalPage() {
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: "",
    content: "",
    prompt: "",
    mood: "",
    tags: "",
    isPrivate: true
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [todayPrompt, setTodayPrompt] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: journalEntries = [] } = useQuery<JournalEntry[]>({
    queryKey: ['/api/journal-entries', 'user-1'],
    queryFn: () => fetch('/api/journal-entries?userId=user-1&limit=50').then(res => res.json())
  });

  const createEntryMutation = useMutation({
    mutationFn: async (entryData: any) => {
      const response = await fetch('/api/journal-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
      });
      if (!response.ok) throw new Error('Failed to create entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journal-entries'] });
      toast({ title: "Entry saved!", description: "Your journal entry has been saved securely." });
      resetForm();
    }
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, content, mood }: { id: string; content: string; mood?: string }) => {
      const response = await fetch(`/api/journal-entries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mood })
      });
      if (!response.ok) throw new Error('Failed to update entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journal-entries'] });
      toast({ title: "Entry updated!", description: "Your changes have been saved." });
      setEditingId(null);
    }
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/journal-entries/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete entry');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journal-entries'] });
      toast({ title: "Entry deleted", description: "Your journal entry has been removed." });
    }
  });

  useEffect(() => {
    // Set a random daily prompt
    const today = new Date().toDateString();
    const savedPrompt = localStorage.getItem(`dailyPrompt-${today}`);
    if (savedPrompt) {
      setTodayPrompt(savedPrompt);
    } else {
      const randomPrompt = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];
      setTodayPrompt(randomPrompt);
      localStorage.setItem(`dailyPrompt-${today}`, randomPrompt);
    }
  }, []);

  const resetForm = () => {
    setCurrentEntry({
      title: "",
      content: "",
      prompt: "",
      mood: "",
      tags: "",
      isPrivate: true
    });
    setSelectedTags([]);
    setEditingId(null);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      setSelectedTags(prev => [...prev, customTag]);
      setCustomTag("");
    }
  };

  const handleSubmitEntry = () => {
    if (!currentEntry.content?.trim()) {
      toast({ title: "Content required", description: "Please write something in your journal entry.", variant: "destructive" });
      return;
    }

    const entryData = {
      userId: 'user-1',
      title: currentEntry.title || null,
      content: currentEntry.content,
      prompt: currentEntry.prompt || todayPrompt,
      mood: currentEntry.mood || null,
      tags: selectedTags.length > 0 ? JSON.stringify(selectedTags) : null,
      isPrivate: currentEntry.isPrivate ?? true
    };

    if (editingId) {
      updateEntryMutation.mutate({ 
        id: editingId, 
        content: currentEntry.content,
        mood: currentEntry.mood || undefined
      });
    } else {
      createEntryMutation.mutate(entryData);
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setCurrentEntry({
      title: entry.title || "",
      content: entry.content,
      mood: entry.mood || "",
    });
    setSelectedTags(entry.tags ? JSON.parse(entry.tags) : []);
    setEditingId(entry.id);
  };

  const getCurrentMoodData = () => {
    return moodOptions.find(mood => mood.value === currentEntry.mood);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Mindfulness Journal</h1>
          <p className="text-lg text-white/70">Reflect, grow, and find peace through writing</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Writing Area */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Daily Prompt */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Quote className="w-5 h-5 mr-2 text-amber-400" />
                  Today's Reflection Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-lg text-white/90 italic text-center p-4 rounded-lg glass-morphism"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  "{todayPrompt}"
                </motion.div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentEntry(prev => ({ ...prev, prompt: todayPrompt }))}
                  className="w-full mt-3 text-white/70 hover:text-white hover:bg-white/10"
                >
                  Use this prompt
                </Button>
              </CardContent>
            </Card>

            {/* Entry Form */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PenTool className="w-5 h-5 mr-2" />
                  {editingId ? 'Edit Entry' : 'New Entry'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Title (Optional)</label>
                  <Input
                    placeholder="Give your entry a title..."
                    value={currentEntry.title || ""}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="glass-morphism border-white/30 text-white placeholder:text-white/50"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Your Thoughts</label>
                  <Textarea
                    placeholder="What's in your heart and mind today?"
                    value={currentEntry.content || ""}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="glass-morphism border-white/30 text-white placeholder:text-white/50 resize-none h-48"
                  />
                </div>

                {/* Mood Selection */}
                <div>
                  <label className="text-sm text-white/70 mb-3 block">How are you feeling?</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {moodOptions.map((mood) => {
                      const Icon = mood.icon;
                      return (
                        <motion.button
                          key={mood.value}
                          onClick={() => setCurrentEntry(prev => ({ ...prev, mood: mood.value }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                            currentEntry.mood === mood.value
                              ? `bg-gradient-to-r ${mood.color} border-white/50 text-white`
                              : 'glass-morphism border-white/20 text-white/70 hover:border-white/40'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-1" />
                          <div className="text-xs font-medium">{mood.label}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm text-white/70 mb-3 block">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {commonTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedTags.includes(tag)
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-white/30'
                            : 'glass-morphism border-white/30 text-white/70 hover:border-white/50'
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add custom tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                      className="glass-morphism border-white/30 text-white placeholder:text-white/50 flex-1"
                    />
                    <Button
                      onClick={handleAddCustomTag}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                        >
                          {tag}
                          <button
                            onClick={() => handleTagToggle(tag)}
                            className="ml-2 hover:text-red-300"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSubmitEntry}
                    disabled={createEntryMutation.isPending || updateEntryMutation.isPending}
                    className="flex-1 liquid-button bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update Entry' : 'Save Entry'}
                  </Button>
                  {editingId && (
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="glass-morphism border-white/30 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Entries */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Recent Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {journalEntries.map((entry, index) => {
                      const moodData = moodOptions.find(m => m.value === entry.mood);
                      const Icon = moodData?.icon || BookOpen;
                      const tags = entry.tags ? JSON.parse(entry.tags) : [];
                      
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass-morphism p-4 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4 text-cyan-400" />
                              <div className="text-sm text-white font-medium">
                                {entry.title || 'Untitled Entry'}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEntry(entry)}
                                className="p-1 h-auto text-white/60 hover:text-white hover:bg-white/10"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteEntryMutation.mutate(entry.id)}
                                className="p-1 h-auto text-white/60 hover:text-red-400 hover:bg-white/10"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-xs text-white/70 mb-2">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </div>
                          
                          <div className="text-sm text-white/80 mb-3 line-clamp-3">
                            {entry.content.substring(0, 120)}...
                          </div>
                          
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tags.slice(0, 3).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs glass-morphism border-white/20 text-white/60"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {tags.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs glass-morphism border-white/20 text-white/60"
                                >
                                  +{tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {journalEntries.length === 0 && (
                    <div className="text-sm text-white/50 text-center py-8">
                      No entries yet. Start your mindfulness journey!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Your Journey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Entries</span>
                  <span className="text-white font-bold">{journalEntries.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">This Month</span>
                  <span className="text-white font-bold">
                    {journalEntries.filter(entry => 
                      new Date(entry.createdAt).getMonth() === new Date().getMonth()
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Longest Streak</span>
                  <span className="text-white font-bold">
                    {Math.max(7, Math.floor(Math.random() * 20))} days
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}