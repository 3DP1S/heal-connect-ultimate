import { useState, useEffect, useRef, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface WebSocketHook {
  socket: WebSocket | null;
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: Omit<WebSocketMessage, 'timestamp'>) => void;
  connect: () => void;
  disconnect: () => void;
  joinSession: (sessionId: string, sessionType: string) => void;
  leaveSession: () => void;
}

export function useWebSocket(url?: string): WebSocketHook {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const wsUrl = url || `ws${window.location.protocol === 'https:' ? 's' : ''}://${window.location.host}/healing-ws`;

  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setSocket(ws);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          // Handle specific message types
          switch (message.type) {
            case 'connection':
              console.log('WebSocket connection confirmed');
              break;
            case 'error':
              console.error('WebSocket error:', message.payload.error);
              break;
            default:
              // Custom message handling can be added here
              break;
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setSocket(null);

        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay * reconnectAttemptsRef.current);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [wsUrl]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socket) {
      socket.close(1000, 'User disconnect');
    }
    
    setSocket(null);
    setIsConnected(false);
    reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent reconnection
  }, [socket]);

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (socket?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: Date.now()
      };
      socket.send(JSON.stringify(fullMessage));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, [socket]);

  const joinSession = useCallback((sessionId: string, sessionType: string) => {
    sendMessage({
      type: 'join-session',
      payload: { sessionId, sessionType }
    });
  }, [sendMessage]);

  const leaveSession = useCallback(() => {
    sendMessage({
      type: 'leave-session',
      payload: {}
    });
  }, [sendMessage]);

  // Auto-connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    joinSession,
    leaveSession
  };
}

// Specialized hooks for different healing session types
export function useMeditationSession(sessionId?: string) {
  const ws = useWebSocket();
  
  const startMeditation = useCallback((meditationType: string, duration: number) => {
    if (sessionId) {
      ws.joinSession(sessionId, 'meditation');
    }
    
    ws.sendMessage({
      type: 'meditation-update',
      payload: {
        action: 'start',
        meditationType,
        duration,
        timestamp: Date.now()
      }
    });
  }, [ws, sessionId]);

  const updateProgress = useCallback((progress: number, currentPhase: string) => {
    ws.sendMessage({
      type: 'meditation-update',
      payload: {
        action: 'progress',
        progress,
        currentPhase,
        timestamp: Date.now()
      }
    });
  }, [ws]);

  const endMeditation = useCallback(() => {
    ws.sendMessage({
      type: 'meditation-update',
      payload: {
        action: 'end',
        timestamp: Date.now()
      }
    });
  }, [ws]);

  return {
    ...ws,
    startMeditation,
    updateProgress,
    endMeditation
  };
}

export function useBreathingSession(sessionId?: string) {
  const ws = useWebSocket();
  
  const syncBreathingPattern = useCallback((pattern: 'inhale' | 'exhale' | 'hold', duration: number) => {
    if (sessionId) {
      ws.joinSession(sessionId, 'breathing');
    }
    
    ws.sendMessage({
      type: 'breathing-sync',
      payload: {
        pattern,
        duration,
        timestamp: Date.now()
      }
    });
  }, [ws, sessionId]);

  return {
    ...ws,
    syncBreathingPattern
  };
}

export function useStressTracking() {
  const ws = useWebSocket();
  
  const updateStressLevel = useCallback((level: number, factors: string[], notes?: string) => {
    ws.sendMessage({
      type: 'stress-data',
      payload: {
        level,
        factors,
        notes,
        timestamp: Date.now()
      }
    });
  }, [ws]);

  return {
    ...ws,
    updateStressLevel
  };
}