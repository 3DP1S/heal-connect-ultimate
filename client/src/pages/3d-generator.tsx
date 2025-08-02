import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  Box, 
  Palette, 
  Play, 
  Pause,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Layers,
  Sun,
  Moon,
  TreePine,
  Waves,
  Mountain,
  Flower,
  Sparkles,
  Zap,
  Heart,
  Compass,
  Settings
} from "lucide-react";

interface Scene3D {
  id: string;
  name: string;
  category: string;
  environment: string;
  objects: any[];
  lighting: any;
  atmosphere: any;
  healing_properties: string[];
  created_at: Date;
}

const environmentPresets = [
  {
    id: 'forest',
    name: 'Healing Forest',
    description: 'Ancient trees with sacred energy',
    icon: TreePine,
    color: 'from-green-500 to-emerald-600',
    healing_properties: ['Grounding', 'Nature Connection', 'Stress Relief']
  },
  {
    id: 'ocean',
    name: 'Tranquil Ocean',
    description: 'Peaceful waves and calming sounds',
    icon: Waves,
    color: 'from-blue-500 to-cyan-600',
    healing_properties: ['Emotional Cleansing', 'Flow State', 'Relaxation']
  },
  {
    id: 'mountain',
    name: 'Sacred Mountain',
    description: 'High-altitude spiritual sanctuary',
    icon: Mountain,
    color: 'from-purple-500 to-indigo-600',
    healing_properties: ['Clarity', 'Elevation', 'Inner Strength']
  },
  {
    id: 'garden',
    name: 'Healing Garden',
    description: 'Blooming flowers and gentle breeze',
    icon: Flower,
    color: 'from-pink-500 to-rose-600',
    healing_properties: ['Joy', 'Renewal', 'Self-Love']
  },
  {
    id: 'cosmic',
    name: 'Cosmic Space',
    description: 'Infinite stars and cosmic energy',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-600',
    healing_properties: ['Expansion', 'Universal Connection', 'Transcendence']
  },
  {
    id: 'crystal',
    name: 'Crystal Cave',
    description: 'Luminous crystals and healing energy',
    icon: Zap,
    color: 'from-cyan-500 to-blue-600',
    healing_properties: ['Energy Alignment', 'Chakra Balancing', 'Purification']
  }
];

function EnvironmentCard({ preset, isSelected, onSelect }: {
  preset: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = preset.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(preset.id)}
      className={`cursor-pointer ${isSelected ? 'ring-2 ring-purple-400' : ''}`}
    >
      <Card className={`glass-morphism-enhanced border-white/20 ${isSelected ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${preset.color} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{preset.name}</h3>
              <p className="text-xs text-white/70">{preset.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {preset.healing_properties.map((property: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                {property}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Scene3DViewer({ environment, isPlaying }: { environment: string; isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Animated 3D-like visualization placeholder
    let animationId: number;
    let rotation = 0;
    
    const animate = () => {
      if (!isPlaying && rotation % 360 < 5) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient based on environment
      const gradients = {
        forest: ['#22c55e', '#16a34a', '#15803d'],
        ocean: ['#06b6d4', '#0891b2', '#0e7490'],
        mountain: ['#8b5cf6', '#7c3aed', '#6d28d9'],
        garden: ['#f472b6', '#ec4899', '#db2777'],
        cosmic: ['#a855f7', '#9333ea', '#7e22ce'],
        crystal: ['#06b6d4', '#0891b2', '#3b82f6']
      };
      
      const colors = gradients[environment as keyof typeof gradients] || gradients.forest;
      const gradient = ctx.createRadialGradient(300, 200, 50, 300, 200, 250);
      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
      });
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw animated elements
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let i = 0; i < 6; i++) {
        const angle = (rotation + i * 60) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * (80 + Math.sin(rotation * 0.02) * 20);
        const y = centerY + Math.sin(angle) * (80 + Math.cos(rotation * 0.02) * 20);
        
        ctx.beginPath();
        ctx.arc(x, y, 15 + Math.sin(rotation * 0.05 + i) * 5, 0, 2 * Math.PI);
        ctx.fillStyle = `hsla(${(rotation + i * 60) % 360}, 70%, 60%, 0.8)`;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      rotation += isPlaying ? 2 : 0.5;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [environment, isPlaying]);
  
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className="bg-black/50 text-white border-white/20">
              {environmentPresets.find(p => p.id === environment)?.name || 'Environment'}
            </Badge>
            <Badge variant="outline" className="bg-black/30 text-white border-white/20">
              {isPlaying ? 'Playing' : 'Paused'}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/70">Real-time 3D</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Generator3DPage() {
  const [selectedEnvironment, setSelectedEnvironment] = useState('forest');
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneSettings, setSceneSettings] = useState({
    lighting: [50],
    atmosphere: [30],
    density: [20],
    animation_speed: [25],
    healing_intensity: [70]
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { toast } = useToast();
  
  const handleGenerate3D = () => {
    toast({ 
      title: "Generating 3D Environment", 
      description: `Creating your ${environmentPresets.find(p => p.id === selectedEnvironment)?.name} healing space...` 
    });
  };
  
  const handleExport = () => {
    toast({ 
      title: "Exporting Scene", 
      description: "Your 3D healing environment is being prepared for download..." 
    });
  };

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
            <Box className="w-10 h-10 mr-3 text-purple-400" />
            3D Healing Environment Generator
          </h1>
          <p className="text-white/70 text-lg">Create immersive therapeutic spaces for healing and wellness</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Environment Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="glass-morphism-enhanced border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-purple-400" />
                  Environment Presets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {environmentPresets.map((preset) => (
                  <EnvironmentCard
                    key={preset.id}
                    preset={preset}
                    isSelected={selectedEnvironment === preset.id}
                    onSelect={setSelectedEnvironment}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Scene Controls */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-400" />
                  Scene Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Lighting Intensity</label>
                  <Slider
                    value={sceneSettings.lighting}
                    onValueChange={(value) => setSceneSettings(prev => ({ ...prev, lighting: value }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>Dim</span>
                    <span>Bright</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Atmosphere Density</label>
                  <Slider
                    value={sceneSettings.atmosphere}
                    onValueChange={(value) => setSceneSettings(prev => ({ ...prev, atmosphere: value }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Healing Intensity</label>
                  <Slider
                    value={sceneSettings.healing_intensity}
                    onValueChange={(value) => setSceneSettings(prev => ({ ...prev, healing_intensity: value }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 3D Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="glass-morphism-enhanced border-white/20 h-[600px]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-purple-400" />
                    3D Preview
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleGenerate3D}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Generate
                    </Button>
                    <Button
                      onClick={handleExport}
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full pb-6">
                <Scene3DViewer environment={selectedEnvironment} isPlaying={isPlaying} />
              </CardContent>
            </Card>

            {/* Healing Properties */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6"
            >
              <Card className="glass-morphism-enhanced border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-400" />
                    Healing Properties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {environmentPresets.find(p => p.id === selectedEnvironment)?.healing_properties.map((property, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 glass-morphism rounded-lg text-center"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm font-medium text-white">{property}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}