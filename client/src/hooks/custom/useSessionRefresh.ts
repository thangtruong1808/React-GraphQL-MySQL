import { useEffect, useRef } from 'react';
import { extendSession, isSessionValid } from '../../utils/helpers';

/**
 * Custom hook for automatic session refresh
 * Extends session before expiry to maintain user authentication
 */
export const useSessionRefresh = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if session is valid before setting up refresh
    if (!isSessionValid()) {
      return;
    }

    // Set up interval to check and extend session every 30 minutes
    const checkAndExtendSession = () => {
      if (isSessionValid()) {
        // Extend session if it's still valid
        extendSession();
      } else {
        // Clear interval if session is no longer valid
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    // Run initial check
    checkAndExtendSession();

    // Set up interval for periodic checks (every 30 minutes)
    intervalRef.current = setInterval(checkAndExtendSession, 30 * 60 * 1000);

    // Cleanup function to clear interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run on mount

  // Return function to manually refresh session
  const refreshSession = () => {
    if (isSessionValid()) {
      return extendSession();
    }
    return false;
  };

  return { refreshSession };
}; 