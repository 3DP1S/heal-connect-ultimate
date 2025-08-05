// THAENOS Client-Side Connection Stabilizer
// Purpose: Auto-heal client connections and prevent infinite reconnection loops

interface StabilizerConfig {
  maxReconnectAttempts: number;
  reconnectDelay: number;
  healthCheckInterval: number;
}

class ConnectionStabilizer {
  private config: StabilizerConfig;
  private reconnectAttempts: number = 0;
  private isStabilizing: boolean = false;
  private healthInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<StabilizerConfig> = {}) {
    this.config = {
      maxReconnectAttempts: 10,
      reconnectDelay: 2000,
      healthCheckInterval: 10000,
      ...config
    };
    
    this.startHealthChecks();
    this.setupErrorHandlers();
  }

  private startHealthChecks(): void {
    this.healthInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const response = await fetch('/health', { 
        method: 'GET',
        timeout: 5000 
      } as any);
      
      if (response.ok) {
        this.reconnectAttempts = 0; // Reset on successful health check
        this.isStabilizing = false;
      } else {
        this.handleConnectionIssue();
      }
    } catch (error) {
      this.handleConnectionIssue();
    }
  }

  private handleConnectionIssue(): void {
    if (this.isStabilizing) return;
    
    this.isStabilizing = true;
    this.reconnectAttempts++;
    
    console.log(`🔧 THAENOS Stabilizer: Connection issue detected (Attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
    
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.performEmergencyStabilization();
    } else {
      setTimeout(() => {
        this.attemptReconnection();
      }, this.config.reconnectDelay * this.reconnectAttempts);
    }
  }

  private attemptReconnection(): void {
    // Force page refresh if Vite is completely broken
    if (this.reconnectAttempts > 5 && window.location.pathname === '/') {
      console.log('🚨 THAENOS: Performing emergency page refresh');
      window.location.reload();
    } else {
      // Try to reconnect WebSocket or other connections
      this.triggerReconnection();
    }
  }

  private triggerReconnection(): void {
    // Emit custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('thaenos-reconnect', {
      detail: {
        attempt: this.reconnectAttempts,
        timestamp: Date.now()
      }
    }));
    
    this.isStabilizing = false;
  }

  private performEmergencyStabilization(): void {
    console.log('🚨 THAENOS Emergency Stabilization: Maximum attempts reached');
    
    // Trigger the ViteRecovery component by dispatching a custom event
    window.dispatchEvent(new CustomEvent('vite-emergency', {
      detail: {
        attempts: this.reconnectAttempts,
        timestamp: Date.now(),
        message: 'Emergency stabilization required'
      }
    }));
    
    this.isStabilizing = false;
    this.reconnectAttempts = 0;
  }

  private setupErrorHandlers(): void {
    window.addEventListener('error', (event) => {
      if (event.message.includes('Loading CSS chunk') || 
          event.message.includes('Loading chunk')) {
        console.log('🔧 THAENOS: Detected chunk loading error, attempting heal');
        this.handleConnectionIssue();
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('fetch')) {
        console.log('🔧 THAENOS: Detected fetch error, attempting heal');
        this.handleConnectionIssue();
      }
    });
  }

  public destroy(): void {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
      this.healthInterval = null;
    }
  }
}

// Auto-initialize stabilizer
export const connectionStabilizer = new ConnectionStabilizer();

// Export for manual control if needed
export { ConnectionStabilizer };