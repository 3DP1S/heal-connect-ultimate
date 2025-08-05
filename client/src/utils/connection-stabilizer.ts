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
    
    // Show user-friendly message
    const emergency = document.createElement('div');
    emergency.id = 'thaenos-emergency';
    emergency.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        color: white; 
        padding: 15px; 
        border-radius: 10px; 
        z-index: 10000;
        font-family: system-ui;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      ">
        <strong>🔧 THAENOS Healing Protocol</strong><br>
        Connection stabilization in progress...<br>
        <button onclick="window.location.reload()" style="
          background: rgba(255,255,255,0.2); 
          border: none; 
          color: white; 
          padding: 8px 16px; 
          border-radius: 5px; 
          margin-top: 10px; 
          cursor: pointer;
        ">Refresh Page</button>
      </div>
    `;
    
    document.body.appendChild(emergency);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      const elem = document.getElementById('thaenos-emergency');
      if (elem) elem.remove();
    }, 10000);
    
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