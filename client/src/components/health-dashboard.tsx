import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, Database, Server, Clock } from 'lucide-react';

interface HealthMetrics {
  status: string;
  timestamp: string;
  health: {
    score: number;
    checks: Array<{
      name: string;
      status: 'healthy' | 'degraded' | 'unhealthy';
      responseTime: number;
      lastCheck: string;
      errorMessage?: string;
    }>;
  };
  performance: {
    requestCount: number;
    averageResponseTime: number;
    errorCount: number;
    errorRate: number;
    memoryUsageMB: number;
    responseTimePercentiles: {
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
  };
  uptime: number;
  memory: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  version: string;
}

export function HealthDashboard() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHealthMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/health');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthMetrics();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchHealthMetrics, 10000); // Refresh every 10 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatBytes = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'healthy': return 'default' as const;
      case 'degraded': return 'secondary' as const;
      case 'unhealthy': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading health metrics...
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Health Check Failed</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchHealthMetrics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Health Dashboard</h2>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(metrics.status)}>
            {metrics.status.toUpperCase()}
          </Badge>
          <Button
            onClick={fetchHealthMetrics}
            size="sm"
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
            variant={autoRefresh ? "default" : "outline"}
          >
            <Activity className="h-4 w-4 mr-2" />
            {autoRefresh ? 'Auto ON' : 'Auto OFF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Health Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.health.score}/100</div>
            <Progress value={metrics.health.score} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Based on {metrics.health.checks.length} health checks
            </p>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(metrics.uptime)}</div>
            <p className="text-xs text-muted-foreground">
              Since last restart
            </p>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(metrics.memory.heapUsed)}</div>
            <Progress 
              value={(metrics.memory.heapUsed / metrics.memory.heapTotal) * 100} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-2">
              of {formatBytes(metrics.memory.heapTotal)} heap
            </p>
          </CardContent>
        </Card>

        {/* Request Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.performance.requestCount}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.performance.errorCount} errors ({metrics.performance.errorRate.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.performance.averageResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">
              P95: {metrics.performance.responseTimePercentiles.p95}ms
            </p>
          </CardContent>
        </Card>

        {/* Version */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Version</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.version}</div>
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Health Checks Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Health Checks</CardTitle>
          <CardDescription>Detailed status of system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.health.checks.map((check) => (
              <div key={check.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(check.status)}`} />
                  <div>
                    <div className="font-medium capitalize">{check.name}</div>
                    {check.errorMessage && (
                      <div className="text-sm text-red-600">{check.errorMessage}</div>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>{check.responseTime}ms</div>
                  <div>{new Date(check.lastCheck).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Percentiles */}
      <Card>
        <CardHeader>
          <CardTitle>Response Time Percentiles</CardTitle>
          <CardDescription>Distribution of response times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.performance.responseTimePercentiles.p50}ms</div>
              <div className="text-sm text-muted-foreground">P50 (Median)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.performance.responseTimePercentiles.p90}ms</div>
              <div className="text-sm text-muted-foreground">P90</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.performance.responseTimePercentiles.p95}ms</div>
              <div className="text-sm text-muted-foreground">P95</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.performance.responseTimePercentiles.p99}ms</div>
              <div className="text-sm text-muted-foreground">P99</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}