import { useCallback, useRef, useEffect } from 'react';
import { AUTH_CONFIG, AUTH_FEATURES, AUTH_ERROR_MESSAGES, DEBUG_CONFIG } from '../../constants';
import { getTokens, isTokenExpired, isActivityBasedTokenExpired } from '../../utils/tokenManager';

/**
 * Authentication Initializer Interface
 * Defines the structure of authentication initialization functions
 */
export interface AuthInitializer {
  // Initialization
  initializeAuth: () => Promise<void>;
}

/**
 * Authentication Initializer Hook
 * Manages authentication initialization on app startup
 * Handles first-time users and returning users appropriately
 */
export const useAuthInitializer = (
  refreshAccessToken: () => Promise<boolean>,
  fetchCurrentUser: () => Promise<void>,
  performCompleteLogout: () => Promise<void>,
  setIsInitializing: (isInitializing: boolean) => void,
  setShowLoadingSpinner: (showLoadingSpinner: boolean) => void,
  setIsLoading: (isLoading: boolean) => void,
) => {
  // Ref to track if auth has been initialized (prevents duplicate initialization)
  const isInitializedRef = useRef(false);

  /**
   * Initialize authentication state
   * Only runs once on app startup
   * Handles first-time users and returning users appropriately
   */
  const initializeAuth = useCallback(async () => {
    try {
      if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
        // Debug logging disabled for better user experience
      }
      
      setIsInitializing(true);

      // Start delayed loading spinner timer
      const loadingTimer = setTimeout(() => {
        setShowLoadingSpinner(true);
      }, AUTH_CONFIG.SHOW_LOADING_AFTER_DELAY);

      // Set overall timeout for auth initialization
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(AUTH_ERROR_MESSAGES.INITIALIZATION_TIMEOUT)), AUTH_CONFIG.AUTH_INITIALIZATION_TIMEOUT);
      });

      const authPromise = (async () => {
        const tokens = getTokens();

        // Check if we have a valid access token in memory
        if (tokens.accessToken) {
          if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
            // Debug logging disabled for better user experience
          }

          // Check if access token is expired (using activity-based validation if enabled)
          let isExpired = false;
          if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
            isExpired = isActivityBasedTokenExpired();
          } else {
            isExpired = isTokenExpired(tokens.accessToken);
          }

          if (isExpired) {
            if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
              // Debug logging disabled for better user experience
            }
            // Try to refresh the access token using the refresh token from httpOnly cookie
            const refreshSuccess = await refreshAccessToken();
            if (!refreshSuccess) {
              if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
                // Debug logging disabled for better user experience
              }
              await performCompleteLogout();
              return;
            }
            // refreshAccessToken already sets user data, so we're done
            if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
              // Debug logging disabled for better user experience
            }
            return;
          } else {
            if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
              // Debug logging disabled for better user experience
            }
            // Token is valid, fetch user data
            await fetchCurrentUser();
            return;
          }
        } else {
          if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
            // Debug logging disabled for better user experience
          }
          // No access token found in memory - this could be:
          // 1. A new user (no refresh token in cookie)
          // 2. A returning user after browser refresh (has refresh token in cookie)
          // Attempt to restore session using refresh token from httpOnly cookie
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
              // Debug logging disabled for better user experience
            }
            // No valid refresh token found - this is a new user
            // Let them see the login page naturally
            return;
          }
          // refreshAccessToken already sets user data, so we're done
          if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
            // Debug logging disabled for better user experience
          }
          return;
        }
      })();

      // Race between auth initialization and timeout
      await Promise.race([authPromise, timeoutPromise]);

      // Clear loading timer if auth completed quickly
      clearTimeout(loadingTimer);
      setShowLoadingSpinner(false);

      if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
        // Debug logging disabled for better user experience
      }

    } catch (error) {
      if (DEBUG_CONFIG.ENABLE_AUTH_DEBUG_LOGGING) {
        // Debug logging disabled for better user experience
      }
      setShowLoadingSpinner(false);
      
      // Only perform logout if it's not a timeout error (first-time users)
      if (error instanceof Error && error.message !== AUTH_ERROR_MESSAGES.INITIALIZATION_TIMEOUT) {
        await performCompleteLogout();
      }
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
    }
  }, [refreshAccessToken, fetchCurrentUser, performCompleteLogout, setIsInitializing, setShowLoadingSpinner, setIsLoading]);

  // Initialize authentication on mount (only once)
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeAuth();
    }
  }, [initializeAuth]);

  return {
    initializeAuth,
  };
}; 