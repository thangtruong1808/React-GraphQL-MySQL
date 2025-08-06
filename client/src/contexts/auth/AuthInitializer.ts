import { useCallback, useRef, useEffect } from 'react';
import { AUTH_CONFIG } from '../../constants';
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
   */
  const initializeAuth = useCallback(async () => {
    try {
      console.log('🔍 Initializing authentication...');
      setIsInitializing(true);

      // Start delayed loading spinner timer
      const loadingTimer = setTimeout(() => {
        setShowLoadingSpinner(true);
      }, AUTH_CONFIG.SHOW_LOADING_AFTER_DELAY);

      // Set overall timeout for auth initialization
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Auth initialization timeout')), AUTH_CONFIG.AUTH_INITIALIZATION_TIMEOUT);
      });

      const authPromise = (async () => {
        const tokens = getTokens();

        // Check if we have a valid access token in memory
        if (tokens.accessToken) {
          console.log('🔍 Access token found in memory, checking if valid...');

          // Check if access token is expired (using activity-based validation if enabled)
          let isExpired = false;
          if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
            isExpired = isActivityBasedTokenExpired();
          } else {
            isExpired = isTokenExpired(tokens.accessToken);
          }

          if (isExpired) {
            console.log('🔍 Access token expired, attempting token refresh...');
            // Try to refresh the access token using the refresh token from httpOnly cookie
            const refreshSuccess = await refreshAccessToken();
            if (!refreshSuccess) {
              console.log('🔍 Token refresh failed - user must login (refresh token expired or invalid)');
              await performCompleteLogout();
              return;
            }
            // refreshAccessToken already sets user data, so we're done
            console.log('✅ Authentication restored via token refresh');
            return;
          } else {
            console.log('✅ Valid access token found, fetching user data...');
            // Token is valid, fetch user data
            await fetchCurrentUser();
            return;
          }
        } else {
          console.log('🔍 No access token found, attempting token refresh...');
          // Try to refresh the access token using the refresh token from httpOnly cookie
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            console.log('🔍 Token refresh failed - user must login (no refresh token available)');
            await performCompleteLogout();
            return;
          }
          // refreshAccessToken already sets user data, so we're done
          console.log('✅ Authentication restored via token refresh');
          return;
        }
      })();

      // Race between auth initialization and timeout
      await Promise.race([authPromise, timeoutPromise]);

      // Clear loading timer if auth completed quickly
      clearTimeout(loadingTimer);
      setShowLoadingSpinner(false);

    } catch (error) {
      console.error('❌ Error during authentication initialization:', error);
      setShowLoadingSpinner(false);
      await performCompleteLogout();
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