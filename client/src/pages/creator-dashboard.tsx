import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Video, 
  Plus, 
  Edit, 
  Trash2,
  Upload,
  Eye,
  DollarSign,
  TrendingUp,
  Users,
  PlayCircle,
  BarChart3,
  Settings,
  Calendar,
  Clock,
  Heart,
  Share,
  MessageCircle
} from "lucide-react";

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

function StatsCard({ icon: Icon, label, value, change, color }: {
  icon: any;
  label: string;
  value: string | number;
  change?: string;
  color: string;
}) {
  return (
    <Card className="glass-morphism-enhanced border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && (
              <p className={`text-sm flex items-center mt-1 ${color}`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color.includes('red') ? 'from-red-400/20 to-red-600/20' : 'from-purple-400/20 to-purple-600/20'}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VideoCard({ video, onEdit, onDelete }: {
  video: Video;
  onEdit: (video: Video) => void;
  onDelete: (videoId: string) => void;
}) {
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
    <Card className="glass-morphism-enhanced border-white/20">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
              {formatDuration(video.duration)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white truncate">{video.title}</h3>
                <p className="text-sm text-white/70 line-clamp-2">{video.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-white/50" />
                    <span className="text-sm text-white/70">{formatViews(video.viewCount)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-white/50" />
                    <span className="text-sm text-white/70">{formatViews(video.likeCount)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-white/50" />
                    <span className="text-sm text-white/70">{video.commentCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={video.status === "active" ? "default" : "secondary"}>
                  {video.status}
                </Badge>
                {video.isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                    Premium
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(video)}
                  className="text-white hover:bg-white/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(video.id)}
                  className="text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VideoForm({ video, categories, onSubmit, onCancel }: {
  video?: Video;
  categories: VideoCategory[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: video?.title || "",
    description: video?.description || "",
    thumbnail: video?.thumbnail || "",
    videoUrl: video?.videoUrl || "",
    duration: video?.duration || 0,
    categoryId: video?.categoryId || "",
    tags: video?.tags ? JSON.parse(video.tags).join(", ") : "",
    isPublic: video?.isPublic !== false,
    isPremium: video?.isPremium || false,
    premiumPrice: video?.premiumPrice || "",
    monetizationEnabled: video?.monetizationEnabled || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags ? JSON.stringify(formData.tags.split(",").map(tag => tag.trim())) : null,
      premiumPrice: formData.premiumPrice ? parseFloat(formData.premiumPrice) : null
    });
  };

  return (
    <Card className="glass-morphism-enhanced border-white/20">
      <CardHeader>
        <CardTitle className="text-white">
          {video ? "Edit Video" : "Upload New Video"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Video Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="glass-morphism border-white/30 text-white"
                required
              />
            </div>
            
            <div>
              <label className="text-sm text-white/70 mb-2 block">Category</label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger className="glass-morphism border-white/30 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="glass-morphism border-white/30 text-white"
              rows={4}
              placeholder="Describe your video..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Video URL</label>
              <Input
                value={formData.videoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                className="glass-morphism border-white/30 text-white"
                placeholder="https://..."
                required
              />
            </div>
            
            <div>
              <label className="text-sm text-white/70 mb-2 block">Thumbnail URL</label>
              <Input
                value={formData.thumbnail}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                className="glass-morphism border-white/30 text-white"
                placeholder="https://..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Duration (seconds)</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                className="glass-morphism border-white/30 text-white"
                required
              />
            </div>
            
            <div>
              <label className="text-sm text-white/70 mb-2 block">Premium Price ($)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.premiumPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, premiumPrice: e.target.value }))}
                className="glass-morphism border-white/30 text-white"
                placeholder="0.00"
                disabled={!formData.isPremium}
              />
            </div>
            
            <div>
              <label className="text-sm text-white/70 mb-2 block">Tags (comma separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="glass-morphism border-white/30 text-white"
                placeholder="meditation, healing..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-white/70">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded"
                />
                <span>Public Video</span>
              </label>
              
              <label className="flex items-center space-x-2 text-white/70">
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPremium: e.target.checked }))}
                  className="rounded"
                />
                <span>Premium Content</span>
              </label>
              
              <label className="flex items-center space-x-2 text-white/70">
                <input
                  type="checkbox"
                  checked={formData.monetizationEnabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, monetizationEnabled: e.target.checked }))}
                  className="rounded"
                />
                <span>Enable Monetization</span>
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                {video ? "Update Video" : "Upload Video"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function CreatorDashboardPage() {
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: creator } = useQuery<Creator>({
    queryKey: ['/api/creators/me', 'user-1'],
    queryFn: () => fetch('/api/creators/me?userId=user-1').then(res => res.json())
  });

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ['/api/videos', creator?.id],
    queryFn: () => creator ? fetch(`/api/videos?creatorId=${creator.id}&limit=100`).then(res => res.json()) : [],
    enabled: !!creator
  });

  const { data: categories = [] } = useQuery<VideoCategory[]>({
    queryKey: ['/api/video-categories'],
    queryFn: () => fetch('/api/video-categories').then(res => res.json())
  });

  const createCreatorMutation = useMutation({
    mutationFn: async (creatorData: any) => {
      const response = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creatorData)
      });
      if (!response.ok) throw new Error('Failed to create creator');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/creators/me'] });
      toast({ title: "Channel created!", description: "Welcome to the video platform!" });
    }
  });

  const createVideoMutation = useMutation({
    mutationFn: async (videoData: any) => {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...videoData, creatorId: creator?.id })
      });
      if (!response.ok) throw new Error('Failed to create video');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({ title: "Video uploaded!", description: "Your video is now live." });
      setShowVideoForm(false);
    }
  });

  const updateVideoMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update video');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({ title: "Video updated!", description: "Changes saved successfully." });
      setEditingVideo(null);
      setShowVideoForm(false);
    }
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete video');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({ title: "Video deleted", description: "Video removed from platform." });
    }
  });

  const handleCreateCreator = () => {
    createCreatorMutation.mutate({
      userId: 'user-1',
      channelName: "My Healing Channel",
      description: "Sharing healing content to inspire wellness and transformation."
    });
  };

  const handleVideoSubmit = (data: any) => {
    if (editingVideo) {
      updateVideoMutation.mutate({ id: editingVideo.id, ...data });
    } else {
      createVideoMutation.mutate({ ...data, categoryId: data.categoryId });
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setShowVideoForm(true);
  };

  const handleDeleteVideo = (videoId: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      deleteVideoMutation.mutate(videoId);
    }
  };

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Card className="glass-morphism-enhanced border-white/20 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Video className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Start Creating</h2>
            <p className="text-white/70 mb-6">Create your healing content channel and start sharing videos that inspire transformation.</p>
            <Button 
              onClick={handleCreateCreator}
              disabled={createCreatorMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {createCreatorMutation.isPending ? "Creating..." : "Create My Channel"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
  const totalRevenue = videos.reduce((sum, video) => sum + (parseFloat(video.adRevenue) + parseFloat(video.premiumRevenue)), 0);
  const avgEngagement = videos.length > 0 ? videos.reduce((sum, video) => sum + video.likeCount, 0) / videos.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Creator Dashboard</h1>
          <p className="text-lg text-white/70">Manage your {creator.channelName} channel</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          {["overview", "videos", "analytics"].map((tab) => (
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

        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={Eye}
                label="Total Views"
                value={totalViews.toLocaleString()}
                change="+15.3%"
                color="text-purple-400"
              />
              <StatsCard
                icon={Users}
                label="Subscribers"
                value={creator.subscriberCount.toLocaleString()}
                change="+8.7%"
                color="text-blue-400"
              />
              <StatsCard
                icon={Video}
                label="Videos"
                value={videos.length}
                change="+2 this month"
                color="text-green-400"
              />
              <StatsCard
                icon={DollarSign}
                label="Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                change="+22.1%"
                color="text-yellow-400"
              />
            </div>

            {/* Quick Actions */}
            <Card className="glass-morphism-enhanced border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setShowVideoForm(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Settings className="w-4 h-4 mr-2" />
                    Channel Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "videos" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">My Videos</h2>
              <Button
                onClick={() => {
                  setEditingVideo(null);
                  setShowVideoForm(true);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
            </div>

            {showVideoForm && (
              <VideoForm
                video={editingVideo || undefined}
                categories={categories}
                onSubmit={handleVideoSubmit}
                onCancel={() => {
                  setShowVideoForm(false);
                  setEditingVideo(null);
                }}
              />
            )}

            <div className="space-y-4">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onEdit={handleEditVideo}
                  onDelete={handleDeleteVideo}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="glass-morphism-enhanced border-white/20">
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Analytics Coming Soon</h3>
                <p className="text-white/70">Detailed video analytics and insights will be available here.</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}