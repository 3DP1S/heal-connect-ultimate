import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface MeditationSession {
  id: string;
  name: string;
  duration: number;
  type: string;
  backgroundSound: string | null;
  completedAt: Date | null;
  notes: string | null;
  createdAt: Date;
}

interface BreathingCircleProps {
  isActive: boolean;
  breathingPhase: 'inhale' | 'hold' | 'exhale' | 'pause';
  size?: number;
}

function BreathingCircle({ isActive, breathingPhase, size = 200 }: BreathingCircleProps) {
  const getScale = () => {
    if (!isActive) return 1;
    switch (breathingPhase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 0.8;
      case 'pause': return 0.8;
      default: return 1;
    }
  };

  const getOpacity = () => {
    if (!isActive) return 0.7;
    switch (breathingPhase) {
      case 'inhale': return 1;
      case 'hold': return 1;
      case 'exhale': return 0.5;
      case 'pause': return 0.5;
      default: return 0.7;
    }
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size * 2, height: size * 2 }}>
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-purple-600/30 backdrop-blur-xl border border-white/20"
        style={{ width: size, height: size }}
        animate={{
          scale: getScale(),
          opacity: getOpacity(),
          rotate: isActive ? 360 : 0,
        }}
        transition={{
          scale: { duration: 4, ease: "easeInOut" },
          opacity: { duration: 2, ease: "easeInOut" },
          rotate: { duration: 20, ease: "linear", repeat: Infinity }
        }}
      />
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-green-400/40 via-cyan-500/40 to-blue-600/40 backdrop-blur-xl"
        style={{ width: size * 0.7, height: size * 0.7 }}
        animate={{
          scale: getScale() * 0.8,
          opacity: getOpacity() * 0.8,
        }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-white/50 via-cyan-200/50 to-blue-300/50 animate-pulse"
        style={{ width: size * 0.4, height: size * 0.4 }}
        animate={{
          scale: getScale() * 0.6,
          opacity: getOpacity(),
        }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      
      {/* Breathing guide text */}
      <motion.div
        className="absolute text-center text-white font-light"
        animate={{ opacity: isActive ? 1 : 0.7 }}
      >
        <div className="text-2xl font-semibold mb-2">
          {isActive ? (
            breathingPhase === 'inhale' ? 'Breathe In' :
            breathingPhase === 'hold' ? 'Hold' :
            breathingPhase === 'exhale' ? 'Breathe Out' :
            'Rest'
          ) : 'Ready'}
        </div>
        <div className="text-sm opacity-70">
          {isActive ? 'Follow the circle' : 'Press play to begin'}
        </div>
      </motion.div>
    </div>
  );
}

export default function MeditationPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState("10");
  const [selectedType, setSelectedType] = useState("guided");
  const [selectedSound, setSelectedSound] = useState("forest");
  const [isMuted, setIsMuted] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [notes, setNotes] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions = [] } = useQuery<MeditationSession[]>({
    queryKey: ['/api/meditation-sessions', 'user-1'], // Using hardcoded user for demo
    queryFn: () => fetch('/api/meditation-sessions?userId=user-1').then(res => res.json())
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await fetch('/api/meditation-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      if (!response.ok) throw new Error('Failed to create session');
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSessionId(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/meditation-sessions'] });
    }
  });

  const completeSessionMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const response = await fetch(`/api/meditation-sessions/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (!response.ok) throw new Error('Failed to complete session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meditation-sessions'] });
      toast({ title: "Session completed!", description: "Your meditation session has been saved." });
    }
  });

  // Breathing pattern cycle (4-7-8 breathing)
  useEffect(() => {
    if (isPlaying) {
      const phases = [
        { phase: 'inhale' as const, duration: 4000 },
        { phase: 'hold' as const, duration: 7000 },
        { phase: 'exhale' as const, duration: 8000 },
        { phase: 'pause' as const, duration: 1000 }
      ];
      
      let currentPhaseIndex = 0;
      
      const cycleBreathing = () => {
        const currentPhase = phases[currentPhaseIndex];
        setBreathingPhase(currentPhase.phase);
        
        breathingTimerRef.current = setTimeout(() => {
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
          cycleBreathing();
        }, currentPhase.duration);
      };
      
      cycleBreathing();
    } else {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }
      setBreathingPhase('inhale');
    }

    return () => {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }
    };
  }, [isPlaying]);

  // Main timer countdown
  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isPlaying) {
      handleSessionComplete();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    const duration = parseInt(selectedDuration);
    setTimeRemaining(duration * 60);
    setIsPlaying(true);
    
    // Create new session
    const sessionData = {
      userId: 'user-1', // Hardcoded for demo
      name: `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Meditation`,
      duration,
      type: selectedType,
      backgroundSound: selectedSound,
      notes: ""
    };
    
    createSessionMutation.mutate(sessionData);
    
    toast({ 
      title: "Meditation started", 
      description: `${duration} minute ${selectedType} session beginning now.` 
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setTimeRemaining(0);
    setCurrentSessionId(null);
  };

  const handleSessionComplete = () => {
    setIsPlaying(false);
    if (currentSessionId) {
      completeSessionMutation.mutate({ id: currentSessionId, notes });
    }
    setCurrentSessionId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Guided Meditation</h1>
          <p className="text-lg text-white/70">Find peace and clarity in the present moment</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Breathing Circle - Main Focus */}
          <motion.div
            className="lg:col-span-2 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glass-morphism-enhanced border-white/20 p-8">
              <CardContent className="flex flex-col items-center space-y-6">
                <BreathingCircle 
                  isActive={isPlaying} 
                  breathingPhase={breathingPhase}
                  size={150}
                />
                
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-white">
                    {formatTime(timeRemaining)}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {!isPlaying && timeRemaining === 0 ? (
                      <Button
                        onClick={handleStart}
                        className="liquid-button bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
                        disabled={createSessionMutation.isPending}
                      >
                        <Play className="w-6 h-6 mr-2" />
                        Start Meditation
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
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Controls Panel */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Session Settings */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Session Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Duration</label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration} disabled={isPlaying}>
                    <SelectTrigger className="glass-morphism border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Meditation Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType} disabled={isPlaying}>
                    <SelectTrigger className="glass-morphism border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guided">Guided</SelectItem>
                      <SelectItem value="silent">Silent</SelectItem>
                      <SelectItem value="breathing">Breathing Focus</SelectItem>
                      <SelectItem value="body_scan">Body Scan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Background Sound</label>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedSound} onValueChange={setSelectedSound} disabled={isPlaying}>
                      <SelectTrigger className="glass-morphism border-white/30 text-white flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="silence">Silence</SelectItem>
                        <SelectItem value="ocean">Ocean Waves</SelectItem>
                        <SelectItem value="forest">Forest Sounds</SelectItem>
                        <SelectItem value="rain">Rain</SelectItem>
                        <SelectItem value="ambient">Ambient Tones</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:bg-white/10"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Notes */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Session Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="How are you feeling? Any insights or intentions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="glass-morphism border-white/30 text-white placeholder:text-white/50 resize-none h-24"
                />
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {sessions.slice(0, 5).map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center p-3 rounded-lg glass-morphism hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <div className="text-sm text-white font-medium">{session.name}</div>
                        <div className="text-xs text-white/60">{session.duration} min • {session.type}</div>
                      </div>
                      <div className="text-xs text-white/50">
                        {session.completedAt ? '✓' : '○'}
                      </div>
                    </motion.div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-sm text-white/50 text-center py-4">
                      No sessions yet. Start your first meditation!
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