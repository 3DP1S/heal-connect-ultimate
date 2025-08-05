import { Request, Response, NextFunction } from 'express';
import { healthMonitor } from '../health-monitor.js';

export interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorCount: number;
  slowRequestCount: number;
  peakMemoryUsage: number;
}

class PerformanceTracker {
  private metrics: PerformanceMetrics = {
    requestCount: 0,
    averageResponseTime: 0,
    errorCount: 0,
    slowRequestCount: 0,
    peakMemoryUsage: 0
  };

  private responseTimes: number[] = [];
  private readonly MAX_RESPONSE_TIMES = 1000; // Keep last 1000 response times
  private readonly SLOW_REQUEST_THRESHOLD = 2000; // 2 seconds

  public middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      // Track memory usage
      const memoryUsage = process.memoryUsage();
      if (memoryUsage.heapUsed > this.metrics.peakMemoryUsage) {
        this.metrics.peakMemoryUsage = memoryUsage.heapUsed;
      }

      // Override res.end to capture response time
      const originalEnd = res.end;
      res.end = function(this: Response, chunk?: any, encoding?: BufferEncoding, cb?: () => void) {
        const responseTime = Date.now() - startTime;
        
        // Record metrics
        performanceTracker.recordRequest(responseTime, res.statusCode);
        healthMonitor.recordRequest(responseTime);
        
        if (res.statusCode >= 400) {
          healthMonitor.recordError();
        }

        return originalEnd.call(this, chunk, encoding, cb);
      };

      next();
    };
  }

  private recordRequest(responseTime: number, statusCode: number): void {
    this.metrics.requestCount++;
    
    // Track response times
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > this.MAX_RESPONSE_TIMES) {
      this.responseTimes.shift();
    }

    // Calculate average response time
    this.metrics.averageResponseTime = 
      this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;

    // Track slow requests
    if (responseTime > this.SLOW_REQUEST_THRESHOLD) {
      this.metrics.slowRequestCount++;
    }

    // Track errors
    if (statusCode >= 400) {
      this.metrics.errorCount++;
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getDetailedStats() {
    const sortedTimes = [...this.responseTimes].sort((a, b) => a - b);
    const len = sortedTimes.length;

    return {
      ...this.metrics,
      responseTimePercentiles: {
        p50: len > 0 ? sortedTimes[Math.floor(len * 0.5)] : 0,
        p90: len > 0 ? sortedTimes[Math.floor(len * 0.9)] : 0,
        p95: len > 0 ? sortedTimes[Math.floor(len * 0.95)] : 0,
        p99: len > 0 ? sortedTimes[Math.floor(len * 0.99)] : 0,
      },
      errorRate: this.metrics.requestCount > 0 
        ? (this.metrics.errorCount / this.metrics.requestCount) * 100 
        : 0,
      slowRequestRate: this.metrics.requestCount > 0 
        ? (this.metrics.slowRequestCount / this.metrics.requestCount) * 100 
        : 0,
      memoryUsageMB: Math.round(this.metrics.peakMemoryUsage / 1024 / 1024)
    };
  }

  public reset(): void {
    this.metrics = {
      requestCount: 0,
      averageResponseTime: 0,
      errorCount: 0,
      slowRequestCount: 0,
      peakMemoryUsage: 0
    };
    this.responseTimes = [];
  }
}

export const performanceTracker = new PerformanceTracker();

// Error handling middleware with performance tracking
export const errorTrackingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Request error:', {
    path: req.path,
    method: req.method,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  healthMonitor.recordError();

  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      timestamp: new Date().toISOString()
    });
  }
};

// Rate limiting middleware - More lenient for development
export const rateLimitMiddleware = () => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT = 1000; // Higher limit for development: 1000 requests per minute
  const WINDOW_MS = 60 * 1000; // 1 minute

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiting in development
    if (process.env.NODE_ENV === 'development') {
      return next();
    }

    const clientId = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    let clientData = requests.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      clientData = { count: 0, resetTime: now + WINDOW_MS };
      requests.set(clientId, clientData);
    }

    if (clientData.count >= RATE_LIMIT) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }

    clientData.count++;
    next();
  };
};