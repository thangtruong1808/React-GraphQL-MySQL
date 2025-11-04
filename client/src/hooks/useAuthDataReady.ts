import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ensureAuthDataReady } from '../services/graphql/apollo-client';

/**
 * Hook to ensure auth data (tokens) is ready before running queries
 * Prevents race conditions during fast navigation by waiting for tokens to be collected
 * Returns boolean indicating if auth data is ready
 * 
 * USE CASE: Dashboard pages that need to wait for tokens before querying
 * Similar to useNotificationCount but returns only the ready state
 * 
 * @returns {boolean} isAuthDataReady - true when tokens are ready, false otherwise
 */
export const useAuthDataReady = (): boolean => {
  const { isAuthenticated } = useAuth();
  const [isAuthDataReady, setIsAuthDataReady] = useState(false);

  // Wait for auth data to be ready after authentication
  // This ensures Apollo Client's authLink has collected tokens before query runs
  useEffect(() => {
    if (!isAuthenticated) {
      // Reset auth data ready state when not authenticated
      setIsAuthDataReady(false);
      return;
    }

    // Track if effect is still active to prevent state updates after unmount
    let isActive = true;
    const timeouts: NodeJS.Timeout[] = [];

    // Check if auth data is ready asynchronously
    // Retry multiple times with increasing delays to handle race conditions
    const checkAuthDataReady = async (retryCount: number = 0): Promise<void> => {
      // Don't continue if effect is no longer active
      if (!isActive) {
        return;
      }

      try {
        // Wait for tokens to be collected by Apollo Client's authLink
        const ready = await ensureAuthDataReady();
        
        if (ready && isActive) {
          setIsAuthDataReady(true);
          return;
        }

        // If not ready and we haven't exceeded max retries, retry
        if (retryCount < 5 && isActive) {
          // Retry with increasing delays: 50ms, 100ms, 150ms, 200ms, 250ms
          const delay = 50 * (retryCount + 1);
          const timeout = setTimeout(() => {
            checkAuthDataReady(retryCount + 1);
          }, delay);
          timeouts.push(timeout);
        } else if (isActive) {
          // Max retries exceeded - auth data not ready
          setIsAuthDataReady(false);
        }
      } catch (error) {
        // Auth data check failed - retry if we haven't exceeded max retries
        if (retryCount < 5 && isActive) {
          const delay = 50 * (retryCount + 1);
          const timeout = setTimeout(() => {
            checkAuthDataReady(retryCount + 1);
          }, delay);
          timeouts.push(timeout);
        } else if (isActive) {
          setIsAuthDataReady(false);
        }
      }
    };

    // Start checking immediately
    checkAuthDataReady();

    // Cleanup function to clear timeouts and prevent state updates
    return () => {
      isActive = false;
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isAuthenticated]);

  return isAuthDataReady;
};
