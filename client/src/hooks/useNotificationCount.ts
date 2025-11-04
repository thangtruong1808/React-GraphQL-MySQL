import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_UNREAD_NOTIFICATIONS_QUERY } from '../services/graphql/notificationQueries';
import { useAuth } from '../contexts/AuthContext';
import { ensureAuthDataReady } from '../services/graphql/apollo-client';

/**
 * Hook to fetch and manage notification count for navbar
 * Waits for auth data to be ready after login to prevent race conditions
 * Returns unread count or null (for loading state)
 */
export const useNotificationCount = () => {
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

  // Query notifications with polling for automatic updates
  // Only query when authenticated AND auth data is ready (tokens collected)
  const { data: notificationData, loading } = useQuery(GET_USER_UNREAD_NOTIFICATIONS_QUERY, {
    variables: { limit: 100 },
    skip: !isAuthenticated || !isAuthDataReady, // Skip if not authenticated or auth data not ready
    pollInterval: isAuthenticated && isAuthDataReady ? 30000 : 0, // Poll every 30 seconds when ready
    errorPolicy: 'all', // Errors are suppressed in error link
    notifyOnNetworkStatusChange: true, // Track network status to detect when query starts
    fetchPolicy: 'cache-and-network' // Always fetch from network to ensure fresh data, especially on first login
  });

  // Calculate unread count from notifications
  const unreadCount = notificationData?.dashboardNotifications?.notifications?.filter(
    (notification: any) => !notification.isRead
  ).length || 0;

  // Return null if not authenticated (don't show badge)
  if (!isAuthenticated) {
    return null;
  }

  // Return null for loading state when:
  // 1. Auth data is not ready yet (waiting for tokens to be collected)
  // 2. Query is actively loading (loading is true)
  // 3. Authenticated but no data yet (first fetch after login or query hasn't completed)
  // This ensures loading indicator ("...") shows immediately after authentication
  if (!isAuthDataReady || loading || !notificationData) {
    return null;
  }

  // Return the calculated count once data is available
  return unreadCount;
};

