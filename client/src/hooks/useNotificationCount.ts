import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_UNREAD_NOTIFICATIONS_QUERY } from '../services/graphql/notificationQueries';
import { useAuth } from '../contexts/AuthContext';
import { ensureAuthDataReady } from '../services/graphql/apollo-client';
import { getTokens } from '../utils/tokenManager';

/**
 * Hook to fetch and manage notification count for navbar
 * Waits for auth data to be ready after login to prevent race conditions
 * Returns unread count or null (for loading state)
 */
export const useNotificationCount = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthDataReady, setIsAuthDataReady] = useState(false);

  // Debug: Track authentication state changes
  useEffect(() => {
    console.log('[useNotificationCount] isAuthenticated changed:', isAuthenticated);
    if (isAuthenticated) {
      const tokens = getTokens();
      console.log('[useNotificationCount] Tokens check when authenticated:', {
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        accessTokenLength: tokens.accessToken?.length || 0
      });
    }
  }, [isAuthenticated]);

  // Wait for auth data to be ready after authentication
  // This ensures Apollo Client's authLink has collected tokens before query runs
  useEffect(() => {
    if (!isAuthenticated) {
      // Reset auth data ready state when not authenticated
      console.log('[useNotificationCount] Not authenticated, resetting auth data ready');
      setIsAuthDataReady(false);
      return;
    }

    console.log('[useNotificationCount] Starting auth data readiness check...');

    // Track if effect is still active to prevent state updates after unmount
    let isActive = true;
    const timeouts: NodeJS.Timeout[] = [];

    // Check if auth data is ready asynchronously
    // Retry multiple times with increasing delays to handle race conditions
    const checkAuthDataReady = async (retryCount: number = 0): Promise<void> => {
      // Don't continue if effect is no longer active
      if (!isActive) {
        console.log('[useNotificationCount] Effect no longer active, stopping check');
        return;
      }

      console.log(`[useNotificationCount] Checking auth data ready (attempt ${retryCount + 1}/6)...`);

      try {
        // Wait for tokens to be collected by Apollo Client's authLink
        const ready = await ensureAuthDataReady();
        console.log(`[useNotificationCount] ensureAuthDataReady() returned:`, ready);
        
        if (ready && isActive) {
          console.log('[useNotificationCount] ✓ Auth data is ready! Setting isAuthDataReady = true');
          setIsAuthDataReady(true);
          return;
        }

        // If not ready and we haven't exceeded max retries, retry
        if (retryCount < 5 && isActive) {
          // Retry with increasing delays: 50ms, 100ms, 150ms, 200ms, 250ms
          const delay = 50 * (retryCount + 1);
          console.log(`[useNotificationCount] Auth data not ready yet, retrying in ${delay}ms...`);
          const timeout = setTimeout(() => {
            checkAuthDataReady(retryCount + 1);
          }, delay);
          timeouts.push(timeout);
        } else if (isActive) {
          // Max retries exceeded - auth data not ready
          console.warn('[useNotificationCount] ✗ Max retries exceeded, auth data still not ready');
          setIsAuthDataReady(false);
        }
      } catch (error) {
        console.error('[useNotificationCount] Error checking auth data ready:', error);
        // Auth data check failed - retry if we haven't exceeded max retries
        if (retryCount < 5 && isActive) {
          const delay = 50 * (retryCount + 1);
          console.log(`[useNotificationCount] Error occurred, retrying in ${delay}ms...`);
          const timeout = setTimeout(() => {
            checkAuthDataReady(retryCount + 1);
          }, delay);
          timeouts.push(timeout);
        } else if (isActive) {
          console.error('[useNotificationCount] Max retries exceeded after error');
          setIsAuthDataReady(false);
        }
      }
    };

    // Start checking immediately
    checkAuthDataReady();

    // Cleanup function to clear timeouts and prevent state updates
    return () => {
      console.log('[useNotificationCount] Cleaning up auth data readiness check');
      isActive = false;
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isAuthenticated]);

  // Debug: Track auth data ready state changes
  useEffect(() => {
    console.log('[useNotificationCount] isAuthDataReady changed:', isAuthDataReady);
  }, [isAuthDataReady]);

  // Query notifications with polling for automatic updates
  // Only query when authenticated AND auth data is ready (tokens collected)
  const shouldSkip = !isAuthenticated || !isAuthDataReady;
  console.log('[useNotificationCount] Query configuration:', {
    shouldSkip,
    isAuthenticated,
    isAuthDataReady,
    pollInterval: isAuthenticated && isAuthDataReady ? 30000 : 0
  });

  const { data: notificationData, loading, error } = useQuery(GET_USER_UNREAD_NOTIFICATIONS_QUERY, {
    variables: { limit: 100 },
    skip: shouldSkip, // Skip if not authenticated or auth data not ready
    pollInterval: isAuthenticated && isAuthDataReady ? 30000 : 0, // Poll every 30 seconds when ready
    errorPolicy: 'all', // Errors are suppressed in error link
    notifyOnNetworkStatusChange: true, // Track network status to detect when query starts
    fetchPolicy: 'cache-and-network' // Always fetch from network to ensure fresh data, especially on first login
  });

  // Debug: Track query state
  useEffect(() => {
    console.log('[useNotificationCount] Query state:', {
      loading,
      hasData: !!notificationData,
      notificationCount: notificationData?.dashboardNotifications?.notifications?.length || 0,
      unreadCount: notificationData?.dashboardNotifications?.notifications?.filter((n: any) => !n.isRead).length || 0,
      hasError: !!error,
      errorMessage: error?.message
    });
  }, [loading, notificationData, error]);

  // Calculate unread count from notifications
  const unreadCount = notificationData?.dashboardNotifications?.notifications?.filter(
    (notification: any) => !notification.isRead
  ).length || 0;

  // Debug: Track calculated unread count
  useEffect(() => {
    console.log('[useNotificationCount] Calculated unread count:', unreadCount);
  }, [unreadCount]);

  // Return null if not authenticated (don't show badge)
  if (!isAuthenticated) {
    console.log('[useNotificationCount] Returning null - not authenticated');
    return null;
  }

  // Return null for loading state when:
  // 1. Auth data is not ready yet (waiting for tokens to be collected)
  // 2. Query is actively loading (loading is true)
  // 3. Authenticated but no data yet (first fetch after login or query hasn't completed)
  // This ensures loading indicator ("...") shows immediately after authentication
  if (!isAuthDataReady || loading || !notificationData) {
    console.log('[useNotificationCount] Returning null - loading state:', {
      isAuthDataReady,
      loading,
      hasNotificationData: !!notificationData
    });
    return null;
  }

  // Return the calculated count once data is available
  console.log('[useNotificationCount] Returning unread count:', unreadCount);
  return unreadCount;
};

