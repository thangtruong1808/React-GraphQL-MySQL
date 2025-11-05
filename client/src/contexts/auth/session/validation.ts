import { useCallback } from 'react';
import { AUTH_CONFIG } from '../../../constants';
import {
  getTokens,
  isActivityBasedTokenExpired,
  isTokenExpired,
} from '../../../utils/tokenManager';
import { SessionManagerDependencies } from './types';

/**
 * Session Validation Hook
 * Handles session validation and token refresh
 */
export const useSessionValidation = (deps: SessionManagerDependencies) => {
  const { refreshUserSession } = deps;

  /**
   * Validate current session
   * Checks if user has valid tokens and is authenticated
   */
  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = getTokens();
      if (!tokens.accessToken) {
        const refreshSuccess = await refreshUserSession(true); // true = session restoration (browser refresh)
        return refreshSuccess;
      }

      // Use activity-based token validation if enabled
      if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
        const isExpired = isActivityBasedTokenExpired();
        if (isExpired) {
          const refreshSuccess = await refreshUserSession(false); // false = token refresh (expired token)
          return refreshSuccess;
        }
        return true;
      }

      // Fallback to fixed token expiry check
      const isExpired = isTokenExpired(tokens.accessToken);
      if (isExpired) {
        const refreshSuccess = await refreshUserSession(false); // false = token refresh (expired token)
        return refreshSuccess;
      }
      return true;
    } catch (error) {
      // Error in validateSession
      return false;
    }
  }, [refreshUserSession]);

  return { validateSession };
};

