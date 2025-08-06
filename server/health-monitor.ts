import { EventEmitter } from 'events';

interface HealthMetrics {
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: number;
  requestCount: number;
  errorCount: number;
  responseTime: number;
  dbConnectionStatus: boolean;
  healthScore: number;
}

interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  errorMessage?: string;
}

export class HealthMonitor extends EventEmitter {
  private metrics: HealthMetrics;
  private checks: Map<string, HealthCheck>;
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number;

  constructor() {
    super();
    this.startTime = Date.now();
    this.metrics = this.initializeMetrics();
    this.checks = new Map();
    this.setupBasicChecks();
  }

  private initializeMetrics(): HealthMetrics {
    return {
      uptime: 0,
      memoryUsage: process.memoryUsage(),
      cpuUsage: 0,
      requestCount: 0,
      errorCount: 0,
      responseTime: 0,
      dbConnectionStatus: false,
      healthScore: 100
    };
  }

  private setupBasicChecks(): void {
    // Memory usage check
    this.addHealthCheck('memory', async () => {
      const usage = process.memoryUsage();
      const memoryUsagePercent = (usage.heapUsed / usage.heapTotal) * 100;
      
      if (memoryUsagePercent > 90) {
        throw new Error(`Memory usage critical: ${memoryUsagePercent.toFixed(2)}%`);
      } else if (memoryUsagePercent > 75) {
        return { status: 'degraded' as const, message: `Memory usage high: ${memoryUsagePercent.toFixed(2)}%` };
      }
      
      return { status: 'healthy' as const };
    });

    // Uptime check
    this.addHealthCheck('uptime', async () => {
      const uptime = Date.now() - this.startTime;
      return { 
        status: 'healthy' as const, 
        metadata: { uptime: Math.floor(uptime / 1000) }
      };
    });
  }

  public addHealthCheck(name: string, checkFn: () => Promise<{ status: 'healthy' | 'degraded' | 'unhealthy', message?: string, metadata?: any }>): void {
    this.checks.set(name, {
      name,
      status: 'healthy',
      responseTime: 0,
      lastCheck: new Date()
    });
  }

  public async runHealthChecks(): Promise<Map<string, HealthCheck>> {
    const results = new Map<string, HealthCheck>();

    for (const name of [...this.checks.keys()]) {
      const startTime = Date.now();
      try {
        const checkFn = this.getCheckFunction(name);
        if (checkFn) {
          const result = await checkFn();
          const responseTime = Date.now() - startTime;

          results.set(name, {
            name,
            status: result.status,
            responseTime,
            lastCheck: new Date(),
            errorMessage: result.message
          });
        }
      } catch (error) {
        const responseTime = Date.now() - startTime;
        results.set(name, {
          name,
          status: 'unhealthy',
          responseTime,
          lastCheck: new Date(),
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    this.checks = results;
    this.updateHealthScore();
    return results;
  }

  private getCheckFunction(name: string) {
    // This would be expanded to include actual check functions
    const checkFunctions = new Map();
    return checkFunctions.get(name);
  }

  private updateHealthScore(): void {
    let score = 100;
    let totalChecks = 0;
    let unhealthyChecks = 0;
    let degradedChecks = 0;

    for (const [, check] of Array.from(this.checks.entries())) {
      totalChecks++;
      if (check.status === 'unhealthy') {
        unhealthyChecks++;
        score -= 20;
      } else if (check.status === 'degraded') {
        degradedChecks++;
        score -= 10;
      }
    }

    // Factor in error rate
    if (this.metrics.requestCount > 0) {
      const errorRate = (this.metrics.errorCount / this.metrics.requestCount) * 100;
      score -= Math.min(errorRate * 2, 30);
    }

    this.metrics.healthScore = Math.max(0, Math.min(100, score));
    
    // Emit health score updates
    if (this.metrics.healthScore < 50) {
      this.emit('healthCritical', this.metrics);
    } else if (this.metrics.healthScore < 75) {
      this.emit('healthDegraded', this.metrics);
    }
  }

  public recordRequest(responseTime: number): void {
    this.metrics.requestCount++;
    this.metrics.responseTime = (this.metrics.responseTime + responseTime) / 2;
  }

  public recordError(): void {
    this.metrics.errorCount++;
    this.updateHealthScore();
  }

  public getMetrics(): HealthMetrics {
    this.metrics.uptime = Date.now() - this.startTime;
    this.metrics.memoryUsage = process.memoryUsage();
    return { ...this.metrics };
  }

  public getHealthStatus(): { status: string; score: number; checks: HealthCheck[] } {
    const healthChecks = Array.from(this.checks.values());
    
    let overallStatus = 'healthy';
    if (this.metrics.healthScore < 50) {
      overallStatus = 'unhealthy';
    } else if (this.metrics.healthScore < 75) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      score: this.metrics.healthScore,
      checks: healthChecks
    };
  }

  public startMonitoring(intervalMs: number = 30000): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(async () => {
      await this.runHealthChecks();
    }, intervalMs);
  }

  public stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const healthMonitor = new HealthMonitor();

