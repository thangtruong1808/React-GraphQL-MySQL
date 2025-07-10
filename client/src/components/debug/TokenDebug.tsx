import React, { useEffect, useState } from 'react';
import { getTokens, isAuthenticated } from '../../utils/tokenManager';
import { AUTH_CONFIG } from '../../constants';

/**
 * Debug component to help troubleshoot token issues
 * Only shows in development mode
 */
const TokenDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const updateDebugInfo = () => {
      const tokens = getTokens();
      const sessionStorageInfo = {
        accessToken: sessionStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY),
        userData: sessionStorage.getItem(AUTH_CONFIG.USER_DATA_KEY),
        tokenExpiry: sessionStorage.getItem(AUTH_CONFIG.TOKEN_EXPIRY_KEY),
        refreshAttempts: sessionStorage.getItem(AUTH_CONFIG.REFRESH_ATTEMPT_KEY),
      };

      setDebugInfo({
        tokens,
        sessionStorage: sessionStorageInfo,
        isAuthenticated: isAuthenticated(),
        timestamp: new Date().toISOString(),
      });
    };

    // Update immediately
    updateDebugInfo();

    // Update every 2 seconds
    const interval = setInterval(updateDebugInfo, 2000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">🔍 Token Debug</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-64">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};

export default TokenDebug; 