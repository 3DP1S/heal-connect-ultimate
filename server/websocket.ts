import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface HealingSession {
  id: string;
  type: 'meditation' | 'breathing' | 'stress-tracking' | 'collaboration';
  participants: Set<string>;
  createdAt: Date;
  data: any;
}

class HealingWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, { userId?: string; sessionId?: string }> = new Map();
  private sessions: Map<string, HealingSession> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/healing-ws',
      verifyClient: this.verifyClient.bind(this)
    });

    this.setupEventHandlers();
    this.startHeartbeat();
  }

  private verifyClient(info: { origin: string; secure: boolean; req: IncomingMessage }): boolean {
    // Add authentication logic here if needed
    return true;
  }

  private setupEventHandlers(): void {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      console.log('New WebSocket connection established');
      
      this.clients.set(ws, {});
      
      // Send welcome message
      this.sendMessage(ws, {
        type: 'connection',
        payload: { status: 'connected', timestamp: Date.now() },
        timestamp: Date.now()
      });

      ws.on('message', (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Invalid WebSocket message:', error);
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.handleDisconnection(ws);
      });

      // Send ping to keep connection alive
      ws.ping();
    });
  }

  private handleMessage(ws: WebSocket, message: WebSocketMessage): void {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) return;

    switch (message.type) {
      case 'authenticate':
        this.handleAuthentication(ws, message);
        break;
      
      case 'join-session':
        this.handleJoinSession(ws, message);
        break;
      
      case 'leave-session':
        this.handleLeaveSession(ws, message);
        break;
      
      case 'meditation-update':
        this.handleMeditationUpdate(ws, message);
        break;
      
      case 'breathing-sync':
        this.handleBreathingSync(ws, message);
        break;
      
      case 'stress-data':
        this.handleStressData(ws, message);
        break;
      
      case 'collaboration-edit':
        this.handleCollaborationEdit(ws, message);
        break;
      
      case 'chat-message':
        this.handleChatMessage(ws, message);
        break;
      
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleAuthentication(ws: WebSocket, message: WebSocketMessage): void {
    const { userId } = message.payload;
    const clientInfo = this.clients.get(ws);
    
    if (clientInfo && userId) {
      clientInfo.userId = userId;
      this.sendMessage(ws, {
        type: 'authenticated',
        payload: { userId, status: 'success' },
        timestamp: Date.now()
      });
    }
  }

  private handleJoinSession(ws: WebSocket, message: WebSocketMessage): void {
    const { sessionId, sessionType } = message.payload;
    const clientInfo = this.clients.get(ws);
    
    if (!clientInfo?.userId) {
      this.sendError(ws, 'Authentication required');
      return;
    }

    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        type: sessionType,
        participants: new Set(),
        createdAt: new Date(),
        data: {}
      };
      this.sessions.set(sessionId, session);
    }

    session.participants.add(clientInfo.userId);
    clientInfo.sessionId = sessionId;

    // Notify all participants
    this.broadcastToSession(sessionId, {
      type: 'user-joined',
      payload: { 
        userId: clientInfo.userId,
        participantCount: session.participants.size 
      },
      timestamp: Date.now()
    });
  }

  private handleLeaveSession(ws: WebSocket, message: WebSocketMessage): void {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo?.sessionId || !clientInfo.userId) return;

    const session = this.sessions.get(clientInfo.sessionId);
    if (session) {
      session.participants.delete(clientInfo.userId);
      
      if (session.participants.size === 0) {
        this.sessions.delete(clientInfo.sessionId);
      } else {
        this.broadcastToSession(clientInfo.sessionId, {
          type: 'user-left',
          payload: { 
            userId: clientInfo.userId,
            participantCount: session.participants.size 
          },
          timestamp: Date.now()
        });
      }
    }

    clientInfo.sessionId = undefined;
  }

  private handleMeditationUpdate(ws: WebSocket, message: WebSocketMessage): void {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo?.sessionId) return;

    this.broadcastToSession(clientInfo.sessionId, {
      type: 'meditation-sync',
      payload: {
        userId: clientInfo.userId,
        ...message.payload
      },
      timestamp: Date.now()
    }, ws);
  }

  private handleBreathingSync(ws: WebSocket, message: WebSocketMessage): void {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo?.sessionId) return;

    this.broadcastToSession(clientInfo.sessionId, {
      type: 'breathing-rhythm',
      payload: {
        userId: clientInfo.userId,
        ...message.payload
      },
      timestamp: Date.now()
    }, ws);
  }

  private handleStressData(ws: WebSocket, message: WebSocketMessage): void {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo?.sessionId) return;

    // Store stress data and broadcast to session
    this.broadcastToSession(clientInfo.sessionId, {
      type: 'stress-update',
      payload: {
        userId: clientInfo.userId,
        ...message.payload
      },
      timestamp: Date.now()
    }, ws);
  }

  private handleCollaborationEdit(ws: WebSocket, message: WebSocketMessage): void {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo?.sessionId) return;

    this.broadcastToSession(clientInfo.sessionId, {
      type: 'collaboration-change',
      payload: {
        userId: clientInfo.userId,
        ...message.payload
      },
      timestamp: Date.now()
    }, ws);
  }

  private handleChatMessage(ws: WebSocket, message: WebSocketMessage): void {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo?.sessionId || !clientInfo.userId) return;

    this.broadcastToSession(clientInfo.sessionId, {
      type: 'chat-message',
      payload: {
        userId: clientInfo.userId,
        message: message.payload.message,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    });
  }

  private handleDisconnection(ws: WebSocket): void {
    const clientInfo = this.clients.get(ws);
    
    if (clientInfo?.sessionId && clientInfo.userId) {
      const session = this.sessions.get(clientInfo.sessionId);
      if (session) {
        session.participants.delete(clientInfo.userId);
        
        if (session.participants.size === 0) {
          this.sessions.delete(clientInfo.sessionId);
        } else {
          this.broadcastToSession(clientInfo.sessionId, {
            type: 'user-disconnected',
            payload: { 
              userId: clientInfo.userId,
              participantCount: session.participants.size 
            },
            timestamp: Date.now()
          });
        }
      }
    }

    this.clients.delete(ws);
    console.log('WebSocket client disconnected');
  }

  private sendMessage(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: WebSocket, error: string): void {
    this.sendMessage(ws, {
      type: 'error',
      payload: { error },
      timestamp: Date.now()
    });
  }

  private broadcastToSession(sessionId: string, message: WebSocketMessage, exclude?: WebSocket): void {
    this.clients.forEach((clientInfo, ws) => {
      if (clientInfo.sessionId === sessionId && ws !== exclude) {
        this.sendMessage(ws, message);
      }
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        }
      });
    }, 30000); // Ping every 30 seconds
  }

  public getSessionInfo(sessionId: string): HealingSession | undefined {
    return this.sessions.get(sessionId);
  }

  public getActiveSessions(): HealingSession[] {
    return Array.from(this.sessions.values());
  }

  public getConnectedClients(): number {
    return this.clients.size;
  }

  public shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.wss.clients.forEach((ws) => {
      ws.close();
    });
    
    this.wss.close();
  }
}

export { HealingWebSocketServer };