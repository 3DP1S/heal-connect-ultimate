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
  Play, 
  Search, 
  Filter, 
  Heart,
  Share,
  Clock,
  Eye,
  ThumbsUp,
  MoreVertical,
  Video,
  Users,
  TrendingUp,
  Star,
  Bookmark
} from "lucide-react";

interface Video {
  id: string;
  creatorId: string;
  categoryId: string;
  title: string;
  description: string | null;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  tags: string | null;
  isPublic: boolean;
  isPremium: boolean;
  premiumPrice: string | null;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  shareCount: number;
  monetizationEnabled: boolean;
  adRevenue: string;
  premiumRevenue: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
}

interface Creator {
  id: string;
  userId: string;
  channelName: string;
  description: string | null;
  avatar: string | null;
  banner: string | null;
  isVerified: boolean;
  subscriberCount: number;
  totalViews: number;
  totalVideos: number;
  monetizationEnabled: boolean;
  revenueShareRate: string;
  paypalEmail: string | null;
  stripeAccountId: string | null;
  socialLinks: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface VideoCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

function VideoCard({ video, creator }: { video: Video; creator?: Creator }) {
  const tags = video.tags ? JSON.parse(video.tags) : [];
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
    >
      <Card className="glass-morphism-enhanced border-white/20 overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Button
              size="lg"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 hover:bg-white/30 backdrop-blur-xl"
            >
              <Play className="w-6 h-6 text-white" />
            </Button>
          </div>
          
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
          
          {video.isPremium && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                Premium
              </Badge>
            </div>
          )}
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              {creator?.avatar ? (
                <img src={creator.avatar} alt={creator.channelName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white line-clamp-2 mb-1">{video.title}</h3>
              
              <div className="flex items-center space-x-1 mb-2">
                <span className="text-sm text-white/70">{creator?.channelName}</span>
                {creator?.isVerified && (
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-white/50">
                <span>{formatViews(video.viewCount)} views</span>
                <span>•</span>
                <span>{new Date(video.publishedAt || video.createdAt).toLocaleDateString()}</span>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.slice(0, 2).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                <ThumbsUp className="w-4 h-4 mr-1" />
                {formatViews(video.likeCount)}
              </Button>
              <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
            
            <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CreatorCard({ creator }: { creator: Creator }) {
  const formatSubscribers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Card className="glass-morphism-enhanced border-white/20 hover:border-purple-400/50 transition-colors cursor-pointer">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
          {creator.avatar ? (
            <img src={creator.avatar} alt={creator.channelName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center space-x-1 mb-2">
          <h3 className="font-semibold text-white">{creator.channelName}</h3>
          {creator.isVerified && (
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-white/70 line-clamp-2 mb-3">{creator.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div>
            <p className="text-lg font-bold text-white">{formatSubscribers(creator.subscriberCount)}</p>
            <p className="text-xs text-white/50">subscribers</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{creator.totalVideos}</p>
            <p className="text-xs text-white/50">videos</p>
          </div>
        </div>
        
        <Button size="sm" className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
          Subscribe
        </Button>
      </CardContent>
    </Card>
  );
}

function CategoryFilter({ categories, selectedCategory, onCategoryChange }: {
  categories: VideoCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === "" ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange("")}
        className={selectedCategory === "" ? 
          "bg-gradient-to-r from-purple-500 to-pink-500" : 
          "border-white/20 text-white hover:bg-white/10"
        }
      >
        All Videos
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className={selectedCategory === category.id ? 
            "bg-gradient-to-r from-purple-500 to-pink-500" : 
            "border-white/20 text-white hover:bg-white/10"
          }
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}

export default function VideoPlatformPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("videos");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ['/api/videos', selectedCategory, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (searchQuery) return fetch(`/api/videos/search?q=${encodeURIComponent(searchQuery)}&limit=50`).then(res => res.json());
      return fetch(`/api/videos?${params.toString()}&limit=50`).then(res => res.json());
    }
  });

  const { data: categories = [] } = useQuery<VideoCategory[]>({
    queryKey: ['/api/video-categories'],
    queryFn: () => fetch('/api/video-categories').then(res => res.json())
  });

  const { data: creators = [] } = useQuery<Creator[]>({
    queryKey: ['/api/creators'],
    queryFn: () => fetch('/api/creators?limit=20').then(res => res.json())
  });

  // Create a map of creators for easy lookup
  const creatorMap = creators.reduce((map, creator) => {
    map[creator.id] = creator;
    return map;
  }, {} as Record<string, Creator>);

  const filteredVideos = videos
    .sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.viewCount - a.viewCount;
        case "likes":
          return b.likeCount - a.likeCount;
        case "duration":
          return b.duration - a.duration;
        default: // newest
          return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
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
            <Video className="w-10 h-10 mr-3 text-purple-400" />
            Healing Video Platform
          </h1>
          <p className="text-lg text-white/70">Discover inspiring content for your wellness journey</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          {["videos", "creators", "trending"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 
                "bg-gradient-to-r from-purple-500 to-pink-500" : 
                "text-white hover:bg-white/10"
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Search and Filters */}
        {activeTab === "videos" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 space-y-6"
          >
            <Card className="glass-morphism-enhanced border-white/20">
              <CardContent className="p-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <Input
                    placeholder="Search healing videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 glass-morphism border-white/30 text-white placeholder:text-white/50"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Categories</label>
                  <CategoryFilter 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-white/70">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 glass-morphism border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                      <SelectItem value="likes">Most Liked</SelectItem>
                      <SelectItem value="duration">Longest Duration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Content Based on Active Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "videos" && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Videos {searchQuery && `for "${searchQuery}"`}
                </h2>
                <p className="text-white/70">{filteredVideos.length} videos found</p>
              </div>

              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVideos.map((video) => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      creator={creatorMap[video.creatorId]}
                    />
                  ))}
                </div>
              ) : (
                <Card className="glass-morphism-enhanced border-white/20">
                  <CardContent className="p-12 text-center">
                    <Video className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
                    <p className="text-white/70 mb-4">Try adjusting your search or filters</p>
                    <Button 
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === "creators" && (
            <motion.div
              key="creators"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Featured Creators</h2>
                <p className="text-white/70">{creators.length} creators</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {creators.map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "trending" && (
            <motion.div
              key="trending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-red-400" />
                  Trending Videos
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos
                  .sort((a, b) => b.viewCount - a.viewCount)
                  .slice(0, 12)
                  .map((video) => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      creator={creatorMap[video.creatorId]}
                    />
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}