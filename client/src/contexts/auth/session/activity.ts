import { useCallback } from 'react';
import { AUTH_CONFIG } from '../../../constants';
import {
  getTokens,
  updateActivity,
  TokenManager,
} from '../../../utils/tokenManager';
import { SessionManagerDependencies } from './types';

/**
 * Activity Handling Hook
 * Handles user activity tracking and proactive token refresh
 */
export const useActivityHandling = (deps: SessionManagerDependencies) => {
  const { refreshUserSession, showSessionExpiryModal } = deps;

  /**
   * Handle application-level user activity (form submissions, API calls, data operations)
   * Updates activity timestamp and proactively refreshes tokens for active users
   * Note: This function is called manually by components, not automatically by DOM events
   */
  const handleUserActivity = useCallback(async () => {
    try {
      if (showSessionExpiryModal) {
        return;
      }

      // Update activity timestamp asynchronously
      await updateActivity();

      // Check if access token needs refresh (proactive for active users)
      const tokens = getTokens();
      if (tokens.accessToken) {
        // Use activity-based token expiry if enabled
        const activityBasedExpiry = TokenManager.getActivityBasedTokenExpiry();
        if (activityBasedExpiry && AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          const timeUntilExpiry = activityBasedExpiry - Date.now();
          // Refresh token if it's more than halfway through its lifetime (30 seconds for 1-minute token)
          const shouldRefresh = timeUntilExpiry < AUTH_CONFIG.ACTIVITY_TOKEN_REFRESH_THRESHOLD;

          if (shouldRefresh) {
            // Proactive token refresh for active users
            await refreshUserSession(false); // false = token refresh (proactive refresh)
          }
        } else {
          // Fallback to original token expiry check
          const expiry = TokenManager.getTokenExpiration(tokens.accessToken);
          if (expiry) {
            const timeUntilExpiry = expiry - Date.now();
            const shouldRefresh = timeUntilExpiry < AUTH_CONFIG.ACTIVITY_TOKEN_REFRESH_THRESHOLD;

            if (shouldRefresh) {
              // Proactive token refresh for active users
              await refreshUserSession(false); // false = token refresh (proactive refresh)
            }
          }
        }
      }
    } catch (error) {
      // Error handling user activity
    }
  }, [refreshUserSession, showSessionExpiryModal]);

  return { handleUserActivity };
};

