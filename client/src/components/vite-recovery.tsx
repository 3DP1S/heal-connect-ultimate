import { useEffect, useState } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ViteRecovery() {
  const [showRecovery, setShowRecovery] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let connectionAttempts = 0;
    let checkInterval: NodeJS.Timeout;

    const checkViteConnection = () => {
      // Check if Vite is constantly trying to connect
      const viteErrors = performance.getEntriesByType('navigation').length;
      connectionAttempts++;

      if (connectionAttempts > 10) {
        setShowRecovery(true);
        setAttempts(connectionAttempts);
      }
    };

    // Monitor console for Vite connection issues
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('[vite] server connection lost') || 
          message.includes('[vite] connecting...')) {
        connectionAttempts++;
        if (connectionAttempts > 8) {
          setShowRecovery(true);
          setAttempts(connectionAttempts);
        }
      }
      originalConsoleLog.apply(console, args);
    };

    checkInterval = setInterval(checkViteConnection, 5000);

    return () => {
      clearInterval(checkInterval);
      console.log = originalConsoleLog;
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDisableHMR = () => {
    // Disable Vite HMR by removing the connection script
    const viteScripts = document.querySelectorAll('script[src*="@vite/client"]');
    viteScripts.forEach(script => script.remove());
    setShowRecovery(false);
  };

  if (!showRecovery) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Alert className="max-w-md bg-white dark:bg-gray-900 border-red-500">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="space-y-4">
          <div>
            <strong>Connection Recovery Needed</strong>
            <p className="text-sm text-muted-foreground mt-1">
              Vite development server connection is unstable ({attempts} attempts). 
              The app can still work, but hot reloading might not function.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleRefresh} size="sm" className="flex items-center gap-2">
              <RefreshCw className="h-3 w-3" />
              Refresh Page
            </Button>
            <Button onClick={handleDisableHMR} variant="outline" size="sm">
              Continue Without HMR
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}