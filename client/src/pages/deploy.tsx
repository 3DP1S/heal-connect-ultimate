import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Rocket,
  Globe,
  Smartphone,
  Monitor,
  Cloud,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Settings,
  ExternalLink,
  Download,
  Share,
  BarChart3,
  Users,
  Star,
  Clock,
  MapPin,
  Wifi,
  Server
} from "lucide-react";

interface DeploymentConfig {
  appName: string;
  description: string;
  platform: 'web' | 'mobile' | 'both';
  environment: 'staging' | 'production';
  domain?: string;
  ssl: boolean;
  cdn: boolean;
  analytics: boolean;
  monitoring: boolean;
  backup: boolean;
  scaling: 'basic' | 'auto' | 'premium';
}

interface Deployment {
  id: string;
  name: string;
  status: 'building' | 'deployed' | 'failed' | 'pending';
  url?: string;
  platform: string;
  environment: string;
  created_at: Date;
  last_updated: Date;
  visits: number;
  uptime: number;
}

const mockDeployments: Deployment[] = [
  {
    id: '1',
    name: 'Meditation Garden',
    status: 'deployed',
    url: 'https://meditation-garden.elohim-o.app',
    platform: 'web',
    environment: 'production',
    created_at: new Date('2024-01-15'),
    last_updated: new Date('2024-02-01'),
    visits: 2456,
    uptime: 99.9
  },
  {
    id: '2',
    name: 'Anxiety Relief Mobile',
    status: 'building',
    platform: 'mobile',
    environment: 'staging',
    created_at: new Date('2024-02-10'),
    last_updated: new Date(),
    visits: 0,
    uptime: 0
  },
  {
    id: '3',
    name: 'Chakra Balancer',
    status: 'deployed',
    url: 'https://chakra-balancer.elohim-o.app',
    platform: 'both',
    environment: 'production',
    created_at: new Date('2024-01-25'),
    last_updated: new Date('2024-01-30'),
    visits: 1832,
    uptime: 98.7
  }
];

function DeploymentCard({ deployment }: { deployment: Deployment }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'building': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'pending': return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="w-4 h-4" />;
      case 'building': return <Clock className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className="glass-morphism-enhanced border-white/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white mb-1">{deployment.name}</h3>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(deployment.status)}>
                {getStatusIcon(deployment.status)}
                <span className="ml-1 capitalize">{deployment.status}</span>
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                {deployment.platform}
              </Badge>
            </div>
          </div>
          
          {deployment.url && (
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => window.open(deployment.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{deployment.visits.toLocaleString()}</div>
            <div className="text-xs text-white/50">Visits</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{deployment.uptime}%</div>
            <div className="text-xs text-white/50">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {Math.floor((Date.now() - deployment.created_at.getTime()) / (1000 * 60 * 60 * 24))}d
            </div>
            <div className="text-xs text-white/50">Age</div>
          </div>
        </div>

        <div className="text-xs text-white/50">
          Last updated: {deployment.last_updated.toLocaleDateString()}
        </div>

        {deployment.url && (
          <div className="mt-3 p-2 glass-morphism rounded text-xs text-white/70 truncate">
            {deployment.url}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DeploymentForm({ onSubmit }: { onSubmit: (config: DeploymentConfig) => void }) {
  const [config, setConfig] = useState<DeploymentConfig>({
    appName: '',
    description: '',
    platform: 'web',
    environment: 'staging',
    domain: '',
    ssl: true,
    cdn: true,
    analytics: true,
    monitoring: true,
    backup: false,
    scaling: 'basic'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  return (
    <Card className="glass-morphism-enhanced border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Rocket className="w-5 h-5 mr-2 text-purple-400" />
          Deploy New App
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">App Name</label>
              <Input
                value={config.appName}
                onChange={(e) => setConfig(prev => ({ ...prev, appName: e.target.value }))}
                className="glass-morphism border-white/30 text-white"
                placeholder="my-healing-app"
                required
              />
            </div>
            
            <div>
              <label className="text-sm text-white/70 mb-2 block">Platform</label>
              <Select value={config.platform} onValueChange={(value: any) => setConfig(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger className="glass-morphism border-white/30 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Web App
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile">
                    <div className="flex items-center">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Mobile App
                    </div>
                  </SelectItem>
                  <SelectItem value="both">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-2" />
                      Web + Mobile
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">Description</label>
            <Textarea
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              className="glass-morphism border-white/30 text-white"
              rows={3}
              placeholder="Brief description of your healing app..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Environment</label>
              <Select value={config.environment} onValueChange={(value: any) => setConfig(prev => ({ ...prev, environment: value }))}>
                <SelectTrigger className="glass-morphism border-white/30 text-white">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staging">Staging (Testing)</SelectItem>
                  <SelectItem value="production">Production (Live)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-white/70 mb-2 block">Scaling</label>
              <Select value={config.scaling} onValueChange={(value: any) => setConfig(prev => ({ ...prev, scaling: value }))}>
                <SelectTrigger className="glass-morphism border-white/30 text-white">
                  <SelectValue placeholder="Select scaling" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (Fixed resources)</SelectItem>
                  <SelectItem value="auto">Auto (Scale on demand)</SelectItem>
                  <SelectItem value="premium">Premium (High availability)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">Custom Domain (Optional)</label>
            <Input
              value={config.domain}
              onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value }))}
              className="glass-morphism border-white/30 text-white"
              placeholder="myapp.healing-domain.com"
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">Features</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 glass-morphism rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">SSL Certificate</span>
                </div>
                <Switch
                  checked={config.ssl}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, ssl: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-3 glass-morphism rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white">CDN</span>
                </div>
                <Switch
                  checked={config.cdn}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, cdn: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-3 glass-morphism rounded-lg">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white">Analytics</span>
                </div>
                <Switch
                  checked={config.analytics}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, analytics: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-3 glass-morphism rounded-lg">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-white">Monitoring</span>
                </div>
                <Switch
                  checked={config.monitoring}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, monitoring: checked }))}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={!config.appName.trim()}
          >
            <Rocket className="w-4 h-4 mr-2" />
            Deploy App
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function DeployPage() {
  const [showForm, setShowForm] = useState(false);
  const [deployments, setDeployments] = useState<Deployment[]>(mockDeployments);
  
  const { toast } = useToast();

  const handleDeploy = (config: DeploymentConfig) => {
    const newDeployment: Deployment = {
      id: Date.now().toString(),
      name: config.appName,
      status: 'building',
      platform: config.platform,
      environment: config.environment,
      created_at: new Date(),
      last_updated: new Date(),
      visits: 0,
      uptime: 0
    };

    setDeployments(prev => [newDeployment, ...prev]);
    setShowForm(false);
    
    toast({ 
      title: "Deployment Started", 
      description: `${config.appName} is being deployed. This may take a few minutes.` 
    });

    // Simulate deployment completion
    setTimeout(() => {
      setDeployments(prev => prev.map(d => 
        d.id === newDeployment.id 
          ? { 
              ...d, 
              status: 'deployed' as const, 
              url: `https://${config.appName.toLowerCase().replace(/\s+/g, '-')}.elohim-o.app`,
              uptime: 100 
            }
          : d
      ));
      
      toast({ 
        title: "Deployment Complete!", 
        description: `${config.appName} is now live and accessible.` 
      });
    }, 5000);
  };

  const activeDeployments = deployments.filter(d => d.status === 'deployed').length;
  const totalVisits = deployments.reduce((sum, d) => sum + d.visits, 0);
  const avgUptime = deployments.length > 0 
    ? deployments.reduce((sum, d) => sum + d.uptime, 0) / deployments.length 
    : 0;

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
            <Rocket className="w-10 h-10 mr-3 text-orange-400" />
            Deploy Healing Apps
          </h1>
          <p className="text-white/70 text-lg">Launch your healing applications to help the world</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass-morphism-enhanced border-white/20 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{activeDeployments}</div>
              <div className="text-sm text-white/50">Active Apps</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism-enhanced border-white/20 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{totalVisits.toLocaleString()}</div>
              <div className="text-sm text-white/50">Total Visits</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism-enhanced border-white/20 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{avgUptime.toFixed(1)}%</div>
              <div className="text-sm text-white/50">Avg Uptime</div>
            </CardContent>
          </Card>

          <Card className="glass-morphism-enhanced border-white/20 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/50">Availability</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deployment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            {!showForm ? (
              <Card className="glass-morphism-enhanced border-white/20 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to Deploy?</h3>
                  <p className="text-white/70 mb-6">Launch your healing app and start helping people worldwide</p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    New Deployment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <DeploymentForm onSubmit={handleDeploy} />
            )}

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Deployments List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="glass-morphism-enhanced border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Cloud className="w-5 h-5 mr-2 text-blue-400" />
                    Your Deployments
                  </div>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    {deployments.length} apps
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {deployments.map((deployment, index) => (
                      <motion.div
                        key={deployment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <DeploymentCard deployment={deployment} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-morphism-enhanced border-white/20">
                <CardContent className="p-4 text-center">
                  <Settings className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-medium text-white mb-1">Deployment Settings</h4>
                  <p className="text-xs text-white/50 mb-3">Configure global deployment options</p>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism-enhanced border-white/20">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-medium text-white mb-1">Analytics Dashboard</h4>
                  <p className="text-xs text-white/50 mb-3">View detailed app performance metrics</p>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}