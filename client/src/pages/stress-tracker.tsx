import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Heart, 
  Brain, 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  Plus,
  Target,
  Zap,
  Wind,
  Flower,
  Sun
} from "lucide-react";

interface StressLog {
  id: string;
  stressLevel: number;
  mood: string;
  triggers: string | null;
  notes: string | null;
  exerciseCompleted: string | null;
  createdAt: Date;
}

const moodOptions = [
  { value: 'peaceful', label: 'Peaceful', color: 'from-green-400 to-emerald-500', icon: Flower },
  { value: 'calm', label: 'Calm', color: 'from-blue-400 to-cyan-500', icon: Wind },
  { value: 'content', label: 'Content', color: 'from-purple-400 to-indigo-500', icon: Sun },
  { value: 'neutral', label: 'Neutral', color: 'from-gray-400 to-slate-500', icon: Target },
  { value: 'restless', label: 'Restless', color: 'from-yellow-400 to-orange-500', icon: Zap },
  { value: 'anxious', label: 'Anxious', color: 'from-orange-400 to-red-500', icon: TrendingUp },
  { value: 'overwhelmed', label: 'Overwhelmed', color: 'from-red-400 to-pink-500', icon: Brain },
];

const triggerOptions = [
  'Work/School', 'Relationships', 'Finance', 'Health', 'Family', 
  'Social Media', 'News', 'Sleep', 'Time Pressure', 'Uncertainty'
];

const calmingExercises = [
  { id: 'deep-breathing', name: '4-7-8 Breathing', description: 'Calming breath pattern', duration: '5 min' },
  { id: 'body-scan', name: 'Body Scan', description: 'Progressive relaxation', duration: '10 min' },
  { id: 'grounding', name: '5-4-3-2-1 Grounding', description: 'Sensory awareness', duration: '3 min' },
  { id: 'visualization', name: 'Safe Place Visualization', description: 'Mental sanctuary', duration: '8 min' },
  { id: 'progressive-muscle', name: 'Progressive Muscle Relaxation', description: 'Tension release', duration: '15 min' },
];

function StressLevelIndicator({ level, animated = true }: { level: number; animated?: boolean }) {
  const getColor = (stress: number) => {
    if (stress <= 3) return 'from-green-400 to-emerald-500';
    if (stress <= 6) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getIntensity = (stress: number) => {
    if (stress <= 3) return 'Low';
    if (stress <= 6) return 'Moderate';
    return 'High';
  };

  return (
    <div className="relative">
      <motion.div
        className={`h-3 rounded-full bg-gradient-to-r ${getColor(level)} relative overflow-hidden`}
        initial={{ width: 0 }}
        animate={{ width: animated ? `${(level / 10) * 100}%` : `${(level / 10) * 100}%` }}
        transition={{ duration: animated ? 1.5 : 0, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          animate={{ 
            x: animated ? ['0%', '100%', '0%'] : '0%',
            opacity: animated ? [0.5, 0.8, 0.5] : 0.5
          }}
          transition={{ 
            duration: 2, 
            repeat: animated ? Infinity : 0, 
            ease: "easeInOut" 
          }}
        />
      </motion.div>
      <div className="flex justify-between text-xs text-white/70 mt-1">
        <span>1</span>
        <span className="font-medium">{getIntensity(level)}</span>
        <span>10</span>
      </div>
    </div>
  );
}

function MoodChart({ logs }: { logs: StressLog[] }) {
  const chartData = logs.slice(0, 7).reverse().map((log, index) => ({
    day: new Date(log.createdAt).toLocaleDateString('en', { weekday: 'short' }),
    stress: log.stressLevel,
    mood: log.mood
  }));

  return (
    <div className="h-40 flex items-end justify-between space-x-2 p-4">
      {chartData.map((data, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center space-y-2 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div
            className={`w-6 rounded-t-lg bg-gradient-to-t ${
              data.stress <= 3 ? 'from-green-400 to-emerald-500' :
              data.stress <= 6 ? 'from-yellow-400 to-orange-500' :
              'from-red-400 to-pink-500'
            }`}
            style={{ height: `${(data.stress / 10) * 100}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${(data.stress / 10) * 100}%` }}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
            whileHover={{ scale: 1.1 }}
          />
          <span className="text-xs text-white/70">{data.day}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function StressTrackerPage() {
  const [currentStressLevel, setCurrentStressLevel] = useState([5]);
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [completedExercise, setCompletedExercise] = useState("");
  const [showExercises, setShowExercises] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stressLogs = [] } = useQuery<StressLog[]>({
    queryKey: ['/api/stress-logs', 'user-1'],
    queryFn: () => fetch('/api/stress-logs?userId=user-1&limit=30').then(res => res.json())
  });

  const createStressLogMutation = useMutation({
    mutationFn: async (logData: any) => {
      const response = await fetch('/api/stress-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });
      if (!response.ok) throw new Error('Failed to create stress log');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stress-logs'] });
      toast({ title: "Stress log saved!", description: "Your entry has been recorded." });
      // Reset form
      setCurrentStressLevel([5]);
      setSelectedMood("");
      setSelectedTriggers([]);
      setNotes("");
      setCompletedExercise("");
    }
  });

  const handleTriggerToggle = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmitLog = () => {
    if (!selectedMood) {
      toast({ title: "Mood required", description: "Please select your current mood.", variant: "destructive" });
      return;
    }

    const logData = {
      userId: 'user-1',
      stressLevel: currentStressLevel[0],
      mood: selectedMood,
      triggers: selectedTriggers.length > 0 ? JSON.stringify(selectedTriggers) : null,
      notes: notes || null,
      exerciseCompleted: completedExercise || null
    };

    createStressLogMutation.mutate(logData);
  };

  const getCurrentMoodData = () => {
    return moodOptions.find(mood => mood.value === selectedMood);
  };

  const getAverageStress = () => {
    if (stressLogs.length === 0) return 0;
    return Math.round(stressLogs.reduce((sum, log) => sum + log.stressLevel, 0) / stressLogs.length);
  };

  const getStressTrend = () => {
    if (stressLogs.length < 2) return 'stable';
    const recent = stressLogs.slice(0, 3);
    const older = stressLogs.slice(3, 6);
    const recentAvg = recent.reduce((sum, log) => sum + log.stressLevel, 0) / recent.length;
    const olderAvg = older.reduce((sum, log) => sum + log.stressLevel, 0) / older.length;
    
    if (recentAvg < olderAvg - 0.5) return 'improving';
    if (recentAvg > olderAvg + 0.5) return 'increasing';
    return 'stable';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Stress Relief & Tracking</h1>
          <p className="text-lg text-white/70">Monitor your wellbeing and find your calm</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Stats */}
          <motion.div
            className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glass-morphism-enhanced border-white/20">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{getAverageStress()}/10</div>
                <div className="text-sm text-white/70">Average Stress</div>
              </CardContent>
            </Card>

            <Card className="glass-morphism-enhanced border-white/20">
              <CardContent className="p-6 text-center">
                {getStressTrend() === 'improving' ? (
                  <TrendingDown className="w-8 h-8 text-green-400 mx-auto mb-3" />
                ) : getStressTrend() === 'increasing' ? (
                  <TrendingUp className="w-8 h-8 text-red-400 mx-auto mb-3" />
                ) : (
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                )}
                <div className="text-2xl font-bold text-white mb-1 capitalize">{getStressTrend()}</div>
                <div className="text-sm text-white/70">7-Day Trend</div>
              </CardContent>
            </Card>

            <Card className="glass-morphism-enhanced border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stressLogs.length}</div>
                <div className="text-sm text-white/70">Total Entries</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Log Entry Form */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  How are you feeling right now?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stress Level Slider */}
                <div>
                  <label className="text-sm text-white/70 mb-4 block">
                    Current Stress Level: <span className="font-bold text-white">{currentStressLevel[0]}/10</span>
                  </label>
                  <Slider
                    value={currentStressLevel}
                    onValueChange={setCurrentStressLevel}
                    max={10}
                    min={1}
                    step={1}
                    className="mb-4"
                  />
                  <StressLevelIndicator level={currentStressLevel[0]} />
                </div>

                {/* Mood Selection */}
                <div>
                  <label className="text-sm text-white/70 mb-3 block">Current Mood</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {moodOptions.map((mood) => {
                      const Icon = mood.icon;
                      return (
                        <motion.button
                          key={mood.value}
                          onClick={() => setSelectedMood(mood.value)}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                            selectedMood === mood.value
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

                {/* Trigger Selection */}
                <div>
                  <label className="text-sm text-white/70 mb-3 block">What's causing stress? (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {triggerOptions.map((trigger) => (
                      <Badge
                        key={trigger}
                        variant={selectedTriggers.includes(trigger) ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedTriggers.includes(trigger)
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-white/30'
                            : 'glass-morphism border-white/30 text-white/70 hover:border-white/50'
                        }`}
                        onClick={() => handleTriggerToggle(trigger)}
                      >
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Notes (Optional)</label>
                  <Textarea
                    placeholder="What's on your mind? Any additional thoughts..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="glass-morphism border-white/30 text-white placeholder:text-white/50 resize-none h-20"
                  />
                </div>

                {/* Calming Exercise */}
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Completed any calming exercises? (Optional)</label>
                  <Select value={completedExercise} onValueChange={setCompletedExercise}>
                    <SelectTrigger className="glass-morphism border-white/30 text-white">
                      <SelectValue placeholder="Select an exercise..." />
                    </SelectTrigger>
                    <SelectContent>
                      {calmingExercises.map((exercise) => (
                        <SelectItem key={exercise.id} value={exercise.id}>
                          {exercise.name} - {exercise.duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSubmitLog}
                  disabled={createStressLogMutation.isPending}
                  className="w-full liquid-button bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3"
                >
                  Save Entry
                </Button>
              </CardContent>
            </Card>

            {/* Calming Exercises */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Calming Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {calmingExercises.slice(0, 4).map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      className="glass-morphism p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="font-medium text-white text-sm">{exercise.name}</div>
                      <div className="text-xs text-white/60 mb-2">{exercise.description}</div>
                      <div className="text-xs text-cyan-400">{exercise.duration}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats & Charts */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Weekly Chart */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Weekly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodChart logs={stressLogs} />
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {stressLogs.slice(0, 8).map((log, index) => {
                    const moodData = moodOptions.find(m => m.value === log.mood);
                    const Icon = moodData?.icon || Target;
                    
                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg glass-morphism hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-cyan-400" />
                          <div>
                            <div className="text-sm text-white font-medium capitalize">{log.mood}</div>
                            <div className="text-xs text-white/60">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-white/70">Stress:</div>
                          <div className={`text-sm font-bold ${
                            log.stressLevel <= 3 ? 'text-green-400' :
                            log.stressLevel <= 6 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {log.stressLevel}/10
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  {stressLogs.length === 0 && (
                    <div className="text-sm text-white/50 text-center py-8">
                      No entries yet. Start tracking your wellbeing!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}