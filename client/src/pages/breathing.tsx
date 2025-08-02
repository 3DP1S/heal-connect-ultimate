import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Play, 
  Pause, 
  Square, 
  Wind,
  Heart,
  Waves,
  Timer,
  Star,
  RotateCcw,
  Settings
} from "lucide-react";

interface BreathingExercise {
  id: string;
  name: string;
  pattern: string;
  inhaleCount: number;
  holdCount: number | null;
  exhaleCount: number;
  pauseCount: number | null;
  duration: number;
  completedAt: Date | null;
  effectivenessRating: number | null;
  createdAt: Date;
}

const breathingPatterns = [
  {
    id: '4-7-8',
    name: '4-7-8 Calming',
    description: 'Deeply relaxing breathing pattern',
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 0,
    benefit: 'Reduces anxiety and promotes sleep'
  },
  {
    id: '4-4-4-4',
    name: 'Box Breathing',
    description: 'Equal timing for balance',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
    benefit: 'Improves focus and reduces stress'
  },
  {
    id: '6-2-6-2',
    name: 'Coherent Breathing',
    description: 'Heart rate variability optimization',
    inhale: 6,
    hold: 2,
    exhale: 6,
    pause: 2,
    benefit: 'Balances autonomic nervous system'
  },
  {
    id: '4-0-6-0',
    name: 'Simple Calm',
    description: 'No holding, just flow',
    inhale: 4,
    hold: 0,
    exhale: 6,
    pause: 0,
    benefit: 'Easy relaxation for beginners'
  },
  {
    id: 'custom',
    name: 'Custom Pattern',
    description: 'Create your own rhythm',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
    benefit: 'Personalized to your needs'
  }
];

interface BreathingVisualizerProps {
  isActive: boolean;
  currentPhase: 'inhale' | 'hold' | 'exhale' | 'pause';
  pattern: any;
  timeRemaining: number;
}

function BreathingVisualizer({ isActive, currentPhase, pattern, timeRemaining }: BreathingVisualizerProps) {
  const getVisualizerState = () => {
    if (!isActive) return { scale: 1, opacity: 0.6, color: 'from-slate-400 to-gray-500' };
    
    switch (currentPhase) {
      case 'inhale':
        return { 
          scale: 2.2, 
          opacity: 0.9, 
          color: 'from-cyan-400 via-blue-500 to-indigo-600' 
        };
      case 'hold':
        return { 
          scale: 2.2, 
          opacity: 1, 
          color: 'from-purple-400 via-pink-500 to-rose-600' 
        };
      case 'exhale':
        return { 
          scale: 0.8, 
          opacity: 0.4, 
          color: 'from-green-400 via-emerald-500 to-teal-600' 
        };
      case 'pause':
        return { 
          scale: 0.8, 
          opacity: 0.3, 
          color: 'from-amber-400 via-orange-500 to-red-600' 
        };
      default:
        return { scale: 1, opacity: 0.6, color: 'from-slate-400 to-gray-500' };
    }
  };

  const { scale, opacity, color } = getVisualizerState();

  const getPhaseInstruction = () => {
    if (!isActive) return 'Ready to begin';
    const counts = {
      inhale: pattern.inhale,
      hold: pattern.hold,
      exhale: pattern.exhale,
      pause: pattern.pause
    };
    return `${currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} for ${counts[currentPhase]} seconds`;
  };

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Outer ripple effects */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/10"
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.3, 0.1, 0.3] : 0.1
        }}
        transition={{ duration: 3, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-white/5"
        animate={{
          scale: isActive ? [1, 1.3, 1] : 1,
          opacity: isActive ? [0.2, 0.05, 0.2] : 0.05
        }}
        transition={{ duration: 4, repeat: isActive ? Infinity : 0, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Main breathing circle */}
      <motion.div
        className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${color} backdrop-blur-xl border border-white/20`}
        animate={{
          scale,
          opacity,
          rotate: isActive ? 360 : 0,
        }}
        transition={{
          scale: { duration: isActive ? 
            (currentPhase === 'inhale' ? pattern.inhale :
             currentPhase === 'hold' ? pattern.hold :
             currentPhase === 'exhale' ? pattern.exhale :
             pattern.pause) : 1, ease: "easeInOut" },
          opacity: { duration: 2, ease: "easeInOut" },
          rotate: { duration: 30, ease: "linear", repeat: Infinity }
        }}
      />

      {/* Center orb */}
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-xl"
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          boxShadow: isActive ? [
            "0 0 20px rgba(255, 255, 255, 0.3)",
            "0 0 40px rgba(255, 255, 255, 0.6)",
            "0 0 20px rgba(255, 255, 255, 0.3)"
          ] : "0 0 10px rgba(255, 255, 255, 0.2)"
        }}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
      />

      {/* Phase indicator and timer */}
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <motion.div
          className="text-xl font-semibold text-white mb-2"
          animate={{ opacity: isActive ? 1 : 0.7 }}
        >
          {getPhaseInstruction()}
        </motion.div>
        <div className="text-sm text-white/60">
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} remaining
        </div>
      </div>
    </div>
  );
}

export default function BreathingPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPattern, setCurrentPattern] = useState(breathingPatterns[0]);
  const [customPattern, setCustomPattern] = useState({ inhale: 4, hold: 4, exhale: 4, pause: 4 });
  const [duration, setDuration] = useState([5]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [effectiveness, setEffectiveness] = useState([3]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exercises = [] } = useQuery<BreathingExercise[]>({
    queryKey: ['/api/breathing-exercises', 'user-1'],
    queryFn: () => fetch('/api/breathing-exercises?userId=user-1').then(res => res.json())
  });

  const createExerciseMutation = useMutation({
    mutationFn: async (exerciseData: any) => {
      const response = await fetch('/api/breathing-exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseData)
      });
      if (!response.ok) throw new Error('Failed to create exercise');
      return response.json();
    },
    onSuccess: (data) => {
      setSessionId(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/breathing-exercises'] });
    }
  });

  const completeExerciseMutation = useMutation({
    mutationFn: async ({ id, rating }: { id: string; rating: number }) => {
      const response = await fetch(`/api/breathing-exercises/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ effectivenessRating: rating })
      });
      if (!response.ok) throw new Error('Failed to complete exercise');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/breathing-exercises'] });
      toast({ title: "Exercise completed!", description: "Your breathing session has been saved." });
    }
  });

  // Main session timer
  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isPlaying) {
      handleSessionComplete();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeRemaining]);

  // Breathing phase cycle
  useEffect(() => {
    if (isPlaying) {
      const pattern = currentPattern.id === 'custom' ? customPattern : currentPattern;
      const phases = [
        { phase: 'inhale' as const, duration: pattern.inhale },
        ...(pattern.hold > 0 ? [{ phase: 'hold' as const, duration: pattern.hold }] : []),
        { phase: 'exhale' as const, duration: pattern.exhale },
        ...(pattern.pause > 0 ? [{ phase: 'pause' as const, duration: pattern.pause }] : [])
      ];
      
      let currentPhaseIndex = 0;
      
      const cyclePhases = () => {
        const currentPhaseData = phases[currentPhaseIndex];
        setCurrentPhase(currentPhaseData.phase);
        setPhaseTimeLeft(currentPhaseData.duration);
        
        let phaseTimer = currentPhaseData.duration;
        const countdown = () => {
          phaseTimer--;
          setPhaseTimeLeft(phaseTimer);
          
          if (phaseTimer > 0) {
            phaseTimerRef.current = setTimeout(countdown, 1000);
          } else {
            currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
            cyclePhases();
          }
        };
        
        countdown();
      };
      
      cyclePhases();
    } else {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      setCurrentPhase('inhale');
      setPhaseTimeLeft(0);
    }

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [isPlaying, currentPattern, customPattern]);

  const handleStart = async () => {
    const selectedDuration = duration[0];
    setTimeRemaining(selectedDuration * 60);
    setIsPlaying(true);

    const pattern = currentPattern.id === 'custom' ? customPattern : currentPattern;
    const exerciseData = {
      userId: 'user-1',
      name: currentPattern.name,
      pattern: currentPattern.id,
      inhaleCount: pattern.inhale,
      holdCount: pattern.hold || null,
      exhaleCount: pattern.exhale,
      pauseCount: pattern.pause || null,
      duration: selectedDuration
    };

    createExerciseMutation.mutate(exerciseData);
    toast({ title: "Breathing session started", description: `${selectedDuration} minutes of ${currentPattern.name}` });
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setTimeRemaining(0);
    setSessionId(null);
  };

  const handleSessionComplete = () => {
    setIsPlaying(false);
    if (sessionId) {
      completeExerciseMutation.mutate({ id: sessionId, rating: effectiveness[0] });
    }
    setSessionId(null);
  };

  const getPatternToUse = () => {
    return currentPattern.id === 'custom' ? customPattern : currentPattern;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Breathing Exercises</h1>
          <p className="text-lg text-white/70">Harness the power of conscious breathing</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Breathing Visualizer */}
          <motion.div
            className="lg:col-span-2 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glass-morphism-enhanced border-white/20 p-8 w-full max-w-2xl">
              <CardContent className="flex flex-col items-center space-y-8">
                <BreathingVisualizer
                  isActive={isPlaying}
                  currentPhase={currentPhase}
                  pattern={getPatternToUse()}
                  timeRemaining={timeRemaining}
                />

                <div className="flex items-center space-x-4">
                  {!isPlaying && timeRemaining === 0 ? (
                    <Button
                      onClick={handleStart}
                      className="liquid-button bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
                      disabled={createExerciseMutation.isPending}
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Start Breathing
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={isPlaying ? handlePause : () => setIsPlaying(true)}
                        className="liquid-button bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      
                      <Button
                        onClick={handleStop}
                        variant="outline"
                        className="glass-morphism border-white/30 text-white hover:bg-white/10 px-6 py-3"
                      >
                        <Square className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Controls & Settings */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Pattern Selection */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wind className="w-5 h-5 mr-2" />
                  Breathing Pattern
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select 
                  value={currentPattern.id} 
                  onValueChange={(value) => {
                    const pattern = breathingPatterns.find(p => p.id === value);
                    if (pattern) setCurrentPattern(pattern);
                  }}
                  disabled={isPlaying}
                >
                  <SelectTrigger className="glass-morphism border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {breathingPatterns.map((pattern) => (
                      <SelectItem key={pattern.id} value={pattern.id}>
                        {pattern.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-sm text-white/70 p-3 rounded-lg glass-morphism">
                  <div className="font-medium mb-1">{currentPattern.description}</div>
                  <div className="text-xs text-white/50">{currentPattern.benefit}</div>
                </div>

                {/* Custom Pattern Controls */}
                <AnimatePresence>
                  {currentPattern.id === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      {['inhale', 'hold', 'exhale', 'pause'].map((phase) => (
                        <div key={phase}>
                          <label className="text-xs text-white/70 capitalize">{phase}: {customPattern[phase as keyof typeof customPattern]}s</label>
                          <Slider
                            value={[customPattern[phase as keyof typeof customPattern]]}
                            onValueChange={(value) => setCustomPattern(prev => ({ ...prev, [phase]: value[0] }))}
                            max={10}
                            min={0}
                            step={1}
                            className="mt-1"
                            disabled={isPlaying}
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Session Settings */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Timer className="w-5 h-5 mr-2" />
                  Session Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">
                    Duration: {duration[0]} minutes
                  </label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={30}
                    min={1}
                    step={1}
                    disabled={isPlaying}
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">
                    How effective do you expect this session to be?
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        onClick={() => setEffectiveness([rating])}
                        className={`p-2 rounded ${effectiveness[0] >= rating ? 'text-yellow-400' : 'text-white/30'}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={isPlaying}
                      >
                        <Star className="w-4 h-4" fill="currentColor" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {exercises.slice(0, 6).map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex justify-between items-center p-3 rounded-lg glass-morphism hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <div className="text-sm text-white font-medium">{exercise.name}</div>
                        <div className="text-xs text-white/60">
                          {exercise.duration} min • {exercise.pattern}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {exercise.effectivenessRating && (
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < exercise.effectivenessRating! ? 'text-yellow-400' : 'text-white/20'}`}
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-white/50">
                          {exercise.completedAt ? '✓' : '○'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {exercises.length === 0 && (
                    <div className="text-sm text-white/50 text-center py-4">
                      No sessions yet. Start your first breathing exercise!
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