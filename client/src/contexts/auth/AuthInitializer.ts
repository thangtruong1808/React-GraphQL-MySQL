import { useCallback, useRef, useEffect } from 'react';
import { AUTH_CONFIG, AUTH_FEATURES, AUTH_ERROR_MESSAGES } from '../../constants';
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
      if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
        console.log('🔍 Starting authentication initialization...');
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
          if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
            console.log('🔍 Access token found in memory, checking if valid...');
          }

          // Check if access token is expired (using activity-based validation if enabled)
          let isExpired = false;
          if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
            isExpired = isActivityBasedTokenExpired();
          } else {
            isExpired = isTokenExpired(tokens.accessToken);
          }

          if (isExpired) {
            if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
              console.log('🔍 Access token expired, attempting token refresh...');
            }
            // Try to refresh the access token using the refresh token from httpOnly cookie
            const refreshSuccess = await refreshAccessToken();
            if (!refreshSuccess) {
              if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
                console.log('🔍 Token refresh failed - user must login (refresh token expired or invalid)');
              }
              await performCompleteLogout();
              return;
            }
            // refreshAccessToken already sets user data, so we're done
            if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
              console.log('✅ Authentication restored via token refresh');
            }
            return;
          } else {
            if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
              console.log('✅ Valid access token found, fetching user data...');
            }
            // Token is valid, fetch user data
            await fetchCurrentUser();
            return;
          }
        } else {
          if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
            console.log('🔍 No access token found, attempting token refresh...');
          }
          // Try to refresh the access token using the refresh token from httpOnly cookie
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
              console.log('🔍 Token refresh failed - user must login (no refresh token available)');
            }
            // For first-time users, don't call performCompleteLogout immediately
            // Let them see the login page naturally
            return;
          }
          // refreshAccessToken already sets user data, so we're done
          if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
            console.log('✅ Authentication restored via token refresh');
          }
          return;
        }
      })();

      // Race between auth initialization and timeout
      await Promise.race([authPromise, timeoutPromise]);

      // Clear loading timer if auth completed quickly
      clearTimeout(loadingTimer);
      setShowLoadingSpinner(false);

      if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
        console.log('✅ Authentication initialization completed successfully');
      }

    } catch (error) {
      if (AUTH_FEATURES.ENABLE_AUTH_DEBUG_LOGGING) {
        console.error('❌ Error during authentication initialization:', error);
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