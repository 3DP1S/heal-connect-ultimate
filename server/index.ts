import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { healthMonitor } from "./health-monitor.js";
import { performanceTracker, rateLimitMiddleware } from "./middleware/performance.js";
import { HealingWebSocketServer } from "./websocket.js";
import { createConnectionHealer } from "./connection-healer.js";
import { createHealConnectUltimate } from "./heal-connect-ultimate.js";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Only add performance tracking in development
if (process.env.NODE_ENV === 'development') {
  app.use(performanceTracker.middleware());
}
// Disable rate limiting temporarily for development
// app.use(rateLimitMiddleware());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthStatus = healthMonitor.getHealthStatus();
  const performanceMetrics = performanceTracker.getDetailedStats();
  
  res.status(healthStatus.status === 'healthy' ? 200 : 503).json({
    status: healthStatus.status,
    timestamp: new Date().toISOString(),
    health: {
      score: healthStatus.score,
      checks: healthStatus.checks
    },
    performance: performanceMetrics,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Emergency redirect to working dashboard
  app.get('/', (req, res) => {
    res.redirect('/emergency');
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Start health monitoring
    healthMonitor.startMonitoring();
    
    // Initialize WebSocket server for real-time healing features
    const wsServer = new HealingWebSocketServer(server);
    
    // Initialize THAENOS Connection Healer
    const connectionHealer = createConnectionHealer(server);
    log('🔧 THAENOS Connection Healer activated');
    
    // Initialize HEAL CONNECT ULTIMATE
    const healConnect = createHealConnectUltimate(server);
    log('🚀 HEAL CONNECT ULTIMATE: Universal bug detection and repair system activated');
    
    // Set global reference for diagnostics API
    import('./routes/systems-diagnostics.js').then(({ setGlobalHealConnect }) => {
      setGlobalHealConnect(healConnect);
    });
    
    // Enhanced error handling for connection issues
    server.on('clientError', (err, socket) => {
      log(`Client error: ${err.message}`, 'connection-healer');
      connectionHealer.recordError();
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
    
    // Monitor connection health
    connectionHealer.on('healingPulse', (data) => {
      if (data.health.errorCount > 10) {
        log('🚨 High error count detected, performing emergency heal', 'connection-healer');
        connectionHealer.emergencyHeal();
      }
    });
    
    // Graceful shutdown handling
    const gracefulShutdown = () => {
      log('Received shutdown signal, shutting down gracefully');
      healthMonitor.stopMonitoring();
      connectionHealer.stopHealing();
      wsServer.shutdown();
      server.close(() => {
        log('Server closed');
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  });
})();
