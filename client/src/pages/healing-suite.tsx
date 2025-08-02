import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Leaf,
  Heart,
  Brain,
  Wind,
  Sun,
  Moon,
  Star,
  Waves,
  TreePine,
  Flower2,
  Sparkles,
  Download,
  Play,
  Eye,
  Share,
  Filter,
  Search,
  Zap,
  Target,
  Timer
} from "lucide-react";

interface HealingTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  features: string[];
  healing_focus: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  downloads: number;
  rating: number;
  color_scheme: string;
  created_at: Date;
}

const healingTemplates: HealingTemplate[] = [
  {
    id: 'meditation-garden',
    name: 'Meditation Garden',
    category: 'Mindfulness',
    description: 'A serene garden environment for deep meditation and inner peace',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    features: ['Guided Meditation', 'Nature Sounds', 'Progress Tracking', 'Custom Timers'],
    healing_focus: ['Stress Relief', 'Mindfulness', 'Inner Peace'],
    difficulty: 'beginner',
    duration: '10-60 min',
    downloads: 1234,
    rating: 4.8,
    color_scheme: 'from-green-500 to-emerald-600',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'anxiety-relief',
    name: 'Anxiety Relief Sanctuary',
    category: 'Mental Health',
    description: 'Comprehensive anxiety management with breathing exercises and CBT techniques',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop',
    features: ['Panic Attack Support', 'Breathing Exercises', 'CBT Tools', 'Emergency Resources'],
    healing_focus: ['Anxiety Relief', 'Panic Management', 'Emotional Regulation'],
    difficulty: 'intermediate',
    duration: '5-45 min',
    downloads: 2156,
    rating: 4.9,
    color_scheme: 'from-blue-500 to-cyan-600',
    created_at: new Date('2024-01-20')
  },
  {
    id: 'chakra-balancer',
    name: 'Chakra Alignment Studio',
    category: 'Energy Healing',
    description: 'Advanced chakra balancing with frequency therapy and crystal healing',
    thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
    features: ['7 Chakra System', 'Frequency Therapy', 'Crystal Healing', 'Energy Assessment'],
    healing_focus: ['Energy Balance', 'Spiritual Alignment', 'Chakra Healing'],
    difficulty: 'advanced',
    duration: '20-90 min',
    downloads: 892,
    rating: 4.7,
    color_scheme: 'from-purple-500 to-violet-600',
    created_at: new Date('2024-01-25')
  },
  {
    id: 'sleep-sanctuary',
    name: 'Deep Sleep Sanctuary',
    category: 'Sleep & Recovery',
    description: 'Comprehensive sleep improvement with bedtime stories and white noise',
    thumbnail: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop',
    features: ['Sleep Stories', 'White Noise', 'Sleep Tracking', 'Wake-up Light'],
    healing_focus: ['Sleep Quality', 'Insomnia Relief', 'Dream Enhancement'],
    difficulty: 'beginner',
    duration: '30-480 min',
    downloads: 3421,
    rating: 4.9,
    color_scheme: 'from-indigo-500 to-purple-600',
    created_at: new Date('2024-01-30')
  },
  {
    id: 'pain-management',
    name: 'Holistic Pain Relief',
    category: 'Physical Healing',
    description: 'Multi-modal pain management combining meditation, movement, and visualization',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    features: ['Pain Visualization', 'Gentle Movement', 'Acupressure Guide', 'Progress Journal'],
    healing_focus: ['Pain Relief', 'Body Awareness', 'Healing Visualization'],
    difficulty: 'intermediate',
    duration: '15-60 min',
    downloads: 1687,
    rating: 4.6,
    color_scheme: 'from-orange-500 to-red-600',
    created_at: new Date('2024-02-05')
  },
  {
    id: 'grief-support',
    name: 'Grief & Loss Support',
    category: 'Emotional Healing',
    description: 'Compassionate support for processing grief and finding healing',
    thumbnail: 'https://images.unsplash.com/photo-1516380904893-4fd0c1fafcf8?w=400&h=300&fit=crop',
    features: ['Grief Journal', 'Memory Sharing', 'Support Groups', 'Healing Rituals'],
    healing_focus: ['Grief Processing', 'Emotional Healing', 'Memory Honoring'],
    difficulty: 'intermediate',
    duration: '10-120 min',
    downloads: 756,
    rating: 4.8,
    color_scheme: 'from-gray-500 to-blue-600',
    created_at: new Date('2024-02-10')
  }
];

const categories = ['All', 'Mindfulness', 'Mental Health', 'Energy Healing', 'Sleep & Recovery', 'Physical Healing', 'Emotional Healing'];

function TemplateCard({ template }: { template: HealingTemplate }) {
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({ 
      title: "Template Downloaded", 
      description: `${template.name} has been added to your healing apps.` 
    });
  };

  const handlePreview = () => {
    toast({ 
      title: "Preview Loading", 
      description: `Opening preview for ${template.name}...` 
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-morphism-enhanced border-white/20 overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={template.thumbnail} 
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-2 left-2">
            <Badge className={getDifficultyColor(template.difficulty)}>
              {template.difficulty}
            </Badge>
          </div>
          
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            <div className="flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-white">{template.rating}</span>
            </div>
          </div>
          
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center justify-between text-white/80 text-xs">
              <div className="flex items-center space-x-1">
                <Timer className="w-3 h-3" />
                <span>{template.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-3 h-3" />
                <span>{template.downloads.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
              <Button
                size="sm"
                onClick={handlePreview}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-xl"
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                className="bg-purple-500/80 hover:bg-purple-600/80 backdrop-blur-xl"
              >
                <Download className="w-4 h-4 mr-1" />
                Use
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-white mb-1">{template.name}</h3>
              <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                {template.category}
              </Badge>
            </div>
          </div>
          
          <p className="text-sm text-white/70 mb-3 line-clamp-2">{template.description}</p>
          
          <div className="space-y-2">
            <div>
              <span className="text-xs text-white/50 mb-1 block">Healing Focus:</span>
              <div className="flex flex-wrap gap-1">
                {template.healing_focus.map((focus, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-purple-500/20 text-purple-300 border-purple-400/30">
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-xs text-white/50 mb-1 block">Features:</span>
              <div className="flex flex-wrap gap-1">
                {template.features.slice(0, 2).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                    {feature}
                  </Badge>
                ))}
                {template.features.length > 2 && (
                  <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                    +{template.features.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function HealingSuitePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  
  const { toast } = useToast();

  const filteredTemplates = healingTemplates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.healing_focus.some(focus => focus.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

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
            <Leaf className="w-10 h-10 mr-3 text-green-400" />
            Healing App Suite
          </h1>
          <p className="text-white/70 text-lg">Pre-built wellness app templates for instant healing solutions</p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-morphism-enhanced border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search healing templates..."
                    className="pl-10 glass-morphism border-white/30 text-white"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 glass-morphism border-white/30 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 glass-morphism border-white/30 text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 
                  "bg-gradient-to-r from-purple-500 to-pink-500" : 
                  "border-white/20 text-white hover:bg-white/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-morphism-enhanced border-white/20 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white">{healingTemplates.length}</div>
                <div className="text-sm text-white/50">Templates</div>
              </CardContent>
            </Card>
            <Card className="glass-morphism-enhanced border-white/20 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
                <div className="text-sm text-white/50">Categories</div>
              </CardContent>
            </Card>
            <Card className="glass-morphism-enhanced border-white/20 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white">
                  {healingTemplates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()}
                </div>
                <div className="text-sm text-white/50">Downloads</div>
              </CardContent>
            </Card>
            <Card className="glass-morphism-enhanced border-white/20 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white">4.8</div>
                <div className="text-sm text-white/50">Avg Rating</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TemplateCard template={template} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Card className="glass-morphism-enhanced border-white/20 text-center py-12">
              <CardContent>
                <Sparkles className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
                <p className="text-white/70">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}