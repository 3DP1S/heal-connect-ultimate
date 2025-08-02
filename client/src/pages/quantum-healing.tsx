import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Zap, 
  Play, 
  Pause,
  RotateCcw,
  Activity,
  Heart,
  Eye,
  Sparkles,
  Waves,
  Sun,
  Moon,
  Star,
  Circle,
  Triangle,
  Square,
  Settings,
  Download,
  Target
} from "lucide-react";

interface QuantumSession {
  id: string;
  frequency: number;
  duration: number;
  pattern: string;
  intensity: number;
  target_chakra: string;
  healing_intention: string;
  started_at: Date;
  completed_at?: Date;
  effectiveness_rating?: number;
}

interface ChakraPoint {
  id: string;
  name: string;
  color: string;
  frequency: number;
  position: { x: number; y: number };
  element: string;
  affirmation: string;
}

const chakraPoints: ChakraPoint[] = [
  {
    id: 'crown',
    name: 'Crown Chakra',
    color: '#9333ea',
    frequency: 963,
    position: { x: 50, y: 10 },
    element: 'Cosmic Energy',
    affirmation: 'I am connected to universal wisdom'
  },
  {
    id: 'third_eye',
    name: 'Third Eye Chakra',
    color: '#4f46e5',
    frequency: 852,
    position: { x: 50, y: 20 },
    element: 'Light',
    affirmation: 'I trust my intuition and inner wisdom'
  },
  {
    id: 'throat',
    name: 'Throat Chakra',
    color: '#06b6d4',
    frequency: 741,
    position: { x: 50, y: 30 },
    element: 'Sound',
    affirmation: 'I express my truth with confidence'
  },
  {
    id: 'heart',
    name: 'Heart Chakra',
    color: '#10b981',
    frequency: 639,
    position: { x: 50, y: 45 },
    element: 'Air',
    affirmation: 'I am love, I give love, I receive love'
  },
  {
    id: 'solar_plexus',
    name: 'Solar Plexus Chakra',
    color: '#f59e0b',
    frequency: 528,
    position: { x: 50, y: 60 },
    element: 'Fire',
    affirmation: 'I am confident and powerful'
  },
  {
    id: 'sacral',
    name: 'Sacral Chakra',
    color: '#f97316',
    frequency: 417,
    position: { x: 50, y: 75 },
    element: 'Water',
    affirmation: 'I embrace my creativity and passion'
  },
  {
    id: 'root',
    name: 'Root Chakra',
    color: '#dc2626',
    frequency: 396,
    position: { x: 50, y: 85 },
    element: 'Earth',
    affirmation: 'I am grounded, safe, and secure'
  }
];

const quantumPatterns = [
  { id: 'solfeggio', name: 'Solfeggio Frequencies', description: 'Ancient healing frequencies' },
  { id: 'binaural', name: 'Binaural Beats', description: 'Brainwave entrainment' },
  { id: 'fibonacci', name: 'Fibonacci Sequence', description: 'Golden ratio healing' },
  { id: 'schumann', name: 'Schumann Resonance', description: 'Earth\'s natural frequency' },
  { id: 'crystalline', name: 'Crystalline Grid', description: 'Sacred geometry patterns' }
];

function ChakraVisualizer({ selectedChakra, isActive, intensity }: {
  selectedChakra: string;
  isActive: boolean;
  intensity: number;
}) {
  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-black to-purple-900/20 rounded-xl overflow-hidden">
      {/* Energy Field Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: isActive 
            ? [
                'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
                'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 70%)'
              ]
            : 'radial-gradient(circle at 50% 50%, rgba(100, 100, 100, 0.1) 0%, transparent 70%)'
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Chakra Points */}
      {chakraPoints.map((chakra, index) => {
        const isSelected = selectedChakra === 'all' || selectedChakra === chakra.id;
        const isTargeted = selectedChakra === chakra.id;
        
        return (
          <motion.div
            key={chakra.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${chakra.position.x}%`,
              top: `${chakra.position.y}%`
            }}
            animate={{
              scale: isActive && isSelected ? [1, 1.5, 1.2, 1.8, 1] : 1,
              opacity: isSelected ? 1 : 0.4
            }}
            transition={{
              duration: 2,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          >
            {/* Main Chakra Circle */}
            <motion.div
              className="w-8 h-8 rounded-full border-2 border-white/30"
              style={{ backgroundColor: chakra.color, boxShadow: `0 0 20px ${chakra.color}` }}
              animate={{
                boxShadow: isActive && isSelected 
                  ? [
                      `0 0 10px ${chakra.color}`,
                      `0 0 30px ${chakra.color}`,
                      `0 0 50px ${chakra.color}`,
                      `0 0 30px ${chakra.color}`,
                      `0 0 10px ${chakra.color}`
                    ]
                  : `0 0 5px ${chakra.color}`
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Energy Rings */}
            {isActive && isSelected && (
              <motion.div
                className="absolute inset-0 rounded-full border border-white/20"
                animate={{
                  scale: [1, 2, 3],
                  opacity: [0.8, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            )}
            
            {/* Frequency Label */}
            {isTargeted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center"
              >
                <Badge className="bg-black/50 text-white border-white/20 text-xs">
                  {chakra.frequency}Hz
                </Badge>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Quantum Field Lines */}
      {isActive && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {chakraPoints.map((chakra, index) => {
            if (index === chakraPoints.length - 1) return null;
            const nextChakra = chakraPoints[index + 1];
            
            return (
              <motion.line
                key={`line-${index}`}
                x1={`${chakra.position.x}%`}
                y1={`${chakra.position.y}%`}
                x2={`${nextChakra.position.x}%`}
                y2={`${nextChakra.position.y}%`}
                stroke="rgba(147, 51, 234, 0.5)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 2, delay: index * 0.3 }}
              />
            );
          })}
        </svg>
      )}

      {/* Center Energy Point */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: isActive ? [1, 1.5, 1] : 1,
          rotate: isActive ? 360 : 0
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
      >
        <div className="w-4 h-4 rounded-full bg-white/80 shadow-lg" style={{
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)'
        }} />
      </motion.div>
    </div>
  );
}

export default function QuantumHealingPage() {
  const [isActive, setIsActive] = useState(false);
  const [selectedChakra, setSelectedChakra] = useState('all');
  const [selectedPattern, setSelectedPattern] = useState('solfeggio');
  const [settings, setSettings] = useState({
    frequency: [528],
    intensity: [50],
    duration: [15],
    harmonics: [3]
  });
  const [sessionTime, setSessionTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('preparation');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;
          const targetDuration = settings.duration[0] * 60;
          
          if (newTime >= targetDuration) {
            handleStopSession();
            return 0;
          }
          
          // Update phase based on time
          const phaseProgress = newTime / targetDuration;
          if (phaseProgress < 0.2) setCurrentPhase('preparation');
          else if (phaseProgress < 0.8) setCurrentPhase('active_healing');
          else setCurrentPhase('integration');
          
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, settings.duration]);

  const handleStartSession = () => {
    setIsActive(true);
    setSessionTime(0);
    setCurrentPhase('preparation');
    toast({ 
      title: "Quantum Healing Session Started", 
      description: `Tuning to ${settings.frequency[0]}Hz frequency for chakra alignment...` 
    });
  };

  const handleStopSession = () => {
    setIsActive(false);
    setSessionTime(0);
    setCurrentPhase('preparation');
    if (timerRef.current) clearInterval(timerRef.current);
    toast({ 
      title: "Session Complete", 
      description: "Your quantum healing session has ended. Take a moment to integrate the energy." 
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedChakraData = chakraPoints.find(c => c.id === selectedChakra);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Brain className="w-10 h-10 mr-3 text-purple-400" />
            Quantum Healing Simulator
          </h1>
          <p className="text-white/70 text-lg">Advanced frequency therapy and chakra alignment</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Session Controls */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Session Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {formatTime(sessionTime)}
                  </div>
                  <Badge variant={isActive ? 'default' : 'secondary'} className="mb-4">
                    {currentPhase.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={isActive ? handleStopSession : handleStartSession}
                    className={`flex-1 ${
                      isActive 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Square className="w-4 h-4 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/20 text-white hover:bg-white/10"
                    disabled={isActive}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chakra Selection */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-pink-400" />
                  Target Chakra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedChakra} onValueChange={setSelectedChakra}>
                  <SelectTrigger className="glass-morphism border-white/30 text-white">
                    <SelectValue placeholder="Select chakra" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chakras</SelectItem>
                    {chakraPoints.map((chakra) => (
                      <SelectItem key={chakra.id} value={chakra.id}>
                        {chakra.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedChakraData && (
                  <div className="p-3 glass-morphism rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: selectedChakraData.color }}
                      />
                      <span className="text-white font-medium">{selectedChakraData.name}</span>
                    </div>
                    <p className="text-xs text-white/70 mb-2">{selectedChakraData.affirmation}</p>
                    <div className="flex justify-between text-xs text-white/50">
                      <span>Frequency: {selectedChakraData.frequency}Hz</span>
                      <span>Element: {selectedChakraData.element}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Frequency Settings */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-cyan-400" />
                  Frequency Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Base Frequency (Hz)</label>
                  <Slider
                    value={settings.frequency}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, frequency: value }))}
                    min={396}
                    max={963}
                    step={1}
                    className="w-full"
                    disabled={isActive}
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>396Hz</span>
                    <span className="font-medium">{settings.frequency[0]}Hz</span>
                    <span>963Hz</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Intensity</label>
                  <Slider
                    value={settings.intensity}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, intensity: value }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Duration (minutes)</label>
                  <Slider
                    value={settings.duration}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, duration: value }))}
                    min={5}
                    max={60}
                    step={5}
                    className="w-full"
                    disabled={isActive}
                  />
                  <div className="text-center text-xs text-white/50 mt-1">
                    {settings.duration[0]} minutes
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Pattern</label>
                  <Select value={selectedPattern} onValueChange={setSelectedPattern} disabled={isActive}>
                    <SelectTrigger className="glass-morphism border-white/30 text-white">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {quantumPatterns.map((pattern) => (
                        <SelectItem key={pattern.id} value={pattern.id}>
                          {pattern.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quantum Visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="glass-morphism-enhanced border-white/20 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-400" />
                    Quantum Field Visualization
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-black/30 text-white border-white/20">
                      {settings.frequency[0]}Hz
                    </Badge>
                    <Badge variant="outline" className="bg-black/30 text-white border-white/20">
                      {quantumPatterns.find(p => p.id === selectedPattern)?.name}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChakraVisualizer 
                  selectedChakra={selectedChakra}
                  isActive={isActive}
                  intensity={settings.intensity[0]}
                />

                {/* Session Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 glass-morphism rounded-lg">
                    <div className="text-lg font-bold text-white">{settings.frequency[0]}</div>
                    <div className="text-xs text-white/50">Hz</div>
                  </div>
                  <div className="text-center p-3 glass-morphism rounded-lg">
                    <div className="text-lg font-bold text-white">{settings.intensity[0]}%</div>
                    <div className="text-xs text-white/50">Intensity</div>
                  </div>
                  <div className="text-center p-3 glass-morphism rounded-lg">
                    <div className="text-lg font-bold text-white">{Math.round((sessionTime / (settings.duration[0] * 60)) * 100)}%</div>
                    <div className="text-xs text-white/50">Progress</div>
                  </div>
                  <div className="text-center p-3 glass-morphism rounded-lg">
                    <div className="text-lg font-bold text-white">{selectedChakra === 'all' ? 7 : 1}</div>
                    <div className="text-xs text-white/50">Chakras</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}