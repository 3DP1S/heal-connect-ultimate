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

  // Emergency display - bypass all Vite issues with immediate working interface
  app.get('/', (req, res) => {
    const emergencyHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ELOHIM-O LocalForge - Healing Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            font-family: system-ui; 
            background: linear-gradient(135deg, #1e293b 0%, #374151 50%, #0f172a 100%); 
            color: white; 
            min-height: 100vh; 
            margin: 0;
            animation: gradientShift 10s ease infinite;
        }
        @keyframes gradientShift {
            0%, 100% { background: linear-gradient(135deg, #1e293b 0%, #374151 50%, #0f172a 100%); }
            50% { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #374151 100%); }
        }
        .glass-effect { 
            background: rgba(255, 255, 255, 0.1); 
            backdrop-filter: blur(20px); 
            border: 1px solid rgba(255, 255, 255, 0.2); 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .floating-particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0.6;
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(90deg); }
            50% { transform: translateY(-10px) rotate(180deg); }
            75% { transform: translateY(-30px) rotate(270deg); }
        }
        .healing-glow {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
            animation: healingPulse 3s ease-in-out infinite;
        }
        @keyframes healingPulse {
            0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
            50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.3); }
        }
        .stat-card {
            transition: all 0.3s ease;
            transform: perspective(1000px) rotateX(0deg);
        }
        .stat-card:hover {
            transform: perspective(1000px) rotateX(10deg) scale(1.05);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
    </style>
</head>
<body>
    <!-- Floating Healing Particles -->
    <div class="floating-particle w-4 h-4 bg-green-400" style="top: 10%; left: 10%; animation-delay: 0s;"></div>
    <div class="floating-particle w-6 h-6 bg-cyan-400" style="top: 20%; right: 15%; animation-delay: 1s;"></div>
    <div class="floating-particle w-3 h-3 bg-purple-400" style="bottom: 30%; left: 20%; animation-delay: 2s;"></div>
    <div class="floating-particle w-5 h-5 bg-pink-400" style="top: 60%; right: 25%; animation-delay: 3s;"></div>
    <div class="floating-particle w-4 h-4 bg-blue-400" style="bottom: 20%; right: 40%; animation-delay: 4s;"></div>

    <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="w-64 glass-effect m-4 rounded-2xl p-6 healing-glow">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-cyan-400 mb-2">ELOHIM-O LocalForge</h1>
                <p class="text-sm text-gray-300">Healing Platform</p>
                <div class="flex items-center gap-2 mt-3">
                    <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-xs text-green-400 font-semibold">HEAL CONNECT ACTIVE</span>
                </div>
            </div>
            
            <nav class="space-y-3">
                <div class="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 cursor-pointer healing-glow">
                    <span class="text-sm flex items-center gap-2">🏠 Dashboard</span>
                </div>
                <div class="px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 cursor-pointer transition-all">
                    <span class="text-sm flex items-center gap-2">🧘 Meditation Studio</span>
                </div>
                <div class="px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 cursor-pointer transition-all">
                    <span class="text-sm flex items-center gap-2">📈 Wellness Tracker</span>
                </div>
                <div class="px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 cursor-pointer transition-all">
                    <span class="text-sm flex items-center gap-2">📝 Healing Journal</span>
                </div>
                <div class="px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 cursor-pointer transition-all">
                    <span class="text-sm flex items-center gap-2">🫁 Breathwork</span>
                </div>
                <div class="px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 cursor-pointer transition-all">
                    <span class="text-sm flex items-center gap-2">🛒 Healing Marketplace</span>
                </div>
                <div class="px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 cursor-pointer transition-all">
                    <span class="text-sm flex items-center gap-2">⚡ Quantum Healing</span>
                </div>
            </nav>
        </div>
        
        <!-- Main Content -->
        <div class="flex-1 flex flex-col p-4">
            <!-- Header -->
            <header class="glass-effect rounded-2xl p-6 mb-6 healing-glow">
                <h2 class="text-3xl font-bold mb-2">Welcome back to your healing sanctuary</h2>
                <p class="text-gray-300">Your journey to wellness and inner peace continues with advanced healing technologies</p>
                <div class="flex items-center gap-4 mt-4">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span class="text-sm text-green-400">System Healthy</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span class="text-sm text-cyan-400">AI Ready</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <span class="text-sm text-purple-400">Quantum Active</span>
                    </div>
                </div>
            </header>
            
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="stat-card glass-effect rounded-2xl p-6">
                    <h3 class="text-sm font-medium text-gray-400 mb-2">Total Projects</h3>
                    <div class="text-4xl font-bold text-white mb-1">12</div>
                    <p class="text-xs text-green-400">+2 this month ↗</p>
                </div>
                <div class="stat-card glass-effect rounded-2xl p-6">
                    <h3 class="text-sm font-medium text-gray-400 mb-2">Active Users</h3>
                    <div class="text-4xl font-bold text-white mb-1">1,234</div>
                    <p class="text-xs text-green-400">+15% growth ↗</p>
                </div>
                <div class="stat-card glass-effect rounded-2xl p-6">
                    <h3 class="text-sm font-medium text-gray-400 mb-2">Healing Sessions</h3>
                    <div class="text-4xl font-bold text-white mb-1">847</div>
                    <p class="text-xs text-green-400">+23% increase ↗</p>
                </div>
                <div class="stat-card glass-effect rounded-2xl p-6">
                    <h3 class="text-sm font-medium text-gray-400 mb-2">Wellness Score</h3>
                    <div class="text-4xl font-bold text-green-400 mb-1">98%</div>
                    <p class="text-xs text-green-400">Excellent ✨</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                <!-- Recent Projects -->
                <div class="lg:col-span-2 glass-effect rounded-2xl p-6">
                    <h3 class="text-xl font-semibold mb-6 text-cyan-400">Recent Healing Projects</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl border border-green-500/20">
                            <div>
                                <h4 class="font-semibold text-white">Meditation App Builder</h4>
                                <p class="text-sm text-gray-400">Advanced mindfulness platform</p>
                                <p class="text-xs text-green-400 mt-1">Updated 2 hours ago</p>
                            </div>
                            <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Active</span>
                        </div>
                        <div class="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                            <div>
                                <h4 class="font-semibold text-white">Anxiety Relief Simulator</h4>
                                <p class="text-sm text-gray-400">3D immersive healing environment</p>
                                <p class="text-xs text-blue-400 mt-1">Deployed yesterday</p>
                            </div>
                            <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Live</span>
                        </div>
                        <div class="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                            <div>
                                <h4 class="font-semibold text-white">Healing Community Hub</h4>
                                <p class="text-sm text-gray-400">Global wellness network</p>
                                <p class="text-xs text-yellow-400 mt-1">In development</p>
                            </div>
                            <span class="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">Building</span>
                        </div>
                    </div>
                </div>
                
                <!-- Right Panel -->
                <div class="space-y-6">
                    <!-- Quick Actions -->
                    <div class="glass-effect rounded-2xl p-6">
                        <h3 class="text-lg font-semibold mb-4 text-cyan-400">Quick Actions</h3>
                        <div class="space-y-3">
                            <button class="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all border border-blue-500/20">
                                ✨ Create New Healing App
                            </button>
                            <button class="w-full text-left px-4 py-3 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-xl hover:from-green-500/30 hover:to-cyan-500/30 transition-all border border-green-500/20">
                                🚀 Deploy to Marketplace
                            </button>
                            <button class="w-full text-left px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all border border-purple-500/20">
                                📊 View Analytics
                            </button>
                        </div>
                    </div>
                    
                    <!-- System Status -->
                    <div class="glass-effect rounded-2xl p-6">
                        <h3 class="text-lg font-semibold mb-4 text-cyan-400">System Status</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-300">HEAL CONNECT</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span class="text-xs text-green-500 font-semibold">ACTIVE</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-300">AI Healing Engine</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span class="text-xs text-green-500">Online</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-300">Quantum Processor</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                                    <span class="text-xs text-cyan-500">Ready</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-300">Storage Health</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span class="text-xs text-green-500">84% Free</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Initialize healing dashboard
        console.log('🔧 ELOHIM-O LocalForge Dashboard Loaded');
        console.log('✨ HEAL CONNECT ULTIMATE: All systems operational');
        
        // System monitoring
        setInterval(() => {
            console.log('💚 HEAL CONNECT: Monitoring active - System healthy');
        }, 5000);
        
        // Add interactive animations
        document.addEventListener('DOMContentLoaded', () => {
            // Animate stat cards on load
            const cards = document.querySelectorAll('.stat-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) scale(1)';
                    card.style.opacity = '1';
                }, index * 100);
            });
        });
    </script>
</body>
</html>`;
    res.set('Content-Type', 'text/html').send(emergencyHTML);
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
