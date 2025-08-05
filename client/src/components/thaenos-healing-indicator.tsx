import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface HealingStatus {
  isHealing: boolean;
  isHealthy: boolean;
  lastHealTime: Date | null;
  connectionAttempts: number;
}

export function THAENOSHealingIndicator() {
  const [status, setStatus] = useState<HealingStatus>({
    isHealing: false,
    isHealthy: true,
    lastHealTime: null,
    connectionAttempts: 0
  });

  useEffect(() => {
    let healthCheckInterval: NodeJS.Timeout;
    let reconnectAttempts = 0;

    const checkHealth = async () => {
      try {
        const response = await fetch('/health');
        if (response.ok) {
          setStatus(prev => ({
            ...prev,
            isHealthy: true,
            isHealing: false,
            connectionAttempts: 0
          }));
          reconnectAttempts = 0;
        } else {
          throw new Error('Health check failed');
        }
      } catch (error) {
        reconnectAttempts++;
        setStatus(prev => ({
          ...prev,
          isHealthy: false,
          isHealing: true,
          connectionAttempts: reconnectAttempts,
          lastHealTime: new Date()
        }));

        // THAENOS healing protocol
        if (reconnectAttempts > 5) {
          console.log('🔧 THAENOS: Initiating emergency healing protocol');
          // Don't refresh immediately, let the healing system work
          setTimeout(() => {
            if (reconnectAttempts > 10) {
              window.location.reload();
            }
          }, 30000); // Give 30 seconds for healing
        }
      }
    };

    // Initial health check
    checkHealth();

    // Regular health monitoring every 10 seconds
    healthCheckInterval = setInterval(checkHealth, 10000);

    // Listen for THAENOS reconnection events
    const handleReconnect = (event: CustomEvent) => {
      setStatus(prev => ({
        ...prev,
        isHealing: true,
        connectionAttempts: event.detail.attempt,
        lastHealTime: new Date(event.detail.timestamp)
      }));
    };

    window.addEventListener('thaenos-reconnect', handleReconnect as EventListener);

    return () => {
      clearInterval(healthCheckInterval);
      window.removeEventListener('thaenos-reconnect', handleReconnect as EventListener);
    };
  }, []);

  // Don't show indicator if everything is healthy
  if (status.isHealthy && !status.isHealing) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert className={`border ${
        status.isHealing 
          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
          : 'border-red-500 bg-red-50 dark:bg-red-900/20'
      }`}>
        <div className="flex items-center gap-2">
          {status.isHealing ? (
            <Loader className="h-4 w-4 animate-spin text-yellow-600" />
          ) : status.isHealthy ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className="text-sm">
            {status.isHealing ? (
              <>
                <strong>THAENOS Healing Active</strong>
                <br />
                Connection repair in progress... (Attempt {status.connectionAttempts})
              </>
            ) : (
              <>
                <strong>Connection Issue Detected</strong>
                <br />
                Healing system activated
              </>
            )}
          </AlertDescription>
        </div>
        {status.lastHealTime && (
          <div className="text-xs text-muted-foreground mt-2">
            Last heal: {status.lastHealTime.toLocaleTimeString()}
          </div>
        )}
      </Alert>
    </div>
  );
}