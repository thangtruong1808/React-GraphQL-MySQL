import { useCallback, useRef, useEffect } from 'react';
import { AUTH_CONFIG, AUTH_FEATURES, AUTH_ERROR_MESSAGES, DEBUG_CONFIG } from '../../constants';
import { getTokens, isTokenExpired, isActivityBasedTokenExpired, TokenManager } from '../../utils/tokenManager';

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
  refreshAccessToken: (isSessionRestoration?: boolean) => Promise<boolean>,
  fetchCurrentUser: () => Promise<void>,
  performCompleteLogout: () => Promise<void>,
  setIsInitializing: (isInitializing: boolean) => void,
  setShowLoadingSpinner: (showLoadingSpinner: boolean) => void,
  setIsLoading: (isLoading: boolean) => void,
  setUser: (user: any) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
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
      // Always set loading states to true immediately to show skeleton
      // This ensures consistent behavior regardless of optimization settings
      setIsInitializing(true);
      setIsLoading(true);

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
          // Check if access token is expired (using activity-based validation if enabled)
          let isExpired = false;
          if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
            isExpired = isActivityBasedTokenExpired();
          } else {
            isExpired = isTokenExpired(tokens.accessToken);
          }

          if (isExpired) {
            // Try to refresh the access token using the refresh token from httpOnly cookie
            const refreshSuccess = await refreshAccessToken(false); // false = token refresh (expired token)
            if (!refreshSuccess) {
              await performCompleteLogout();
              return;
            }
            // refreshAccessToken already sets user data, so we're done
            return;
          } else {
            // Token is valid, fetch user data
            await fetchCurrentUser();
            return;
          }
        } else {
          // No access token found in memory - this could be:
          // 1. A new user (no refresh token in cookie)
          // 2. A returning user after browser refresh (has refresh token in cookie)
          
          // Always attempt session restoration - let server handle HttpOnly cookie validation
          // HttpOnly cookies are not accessible via JavaScript, so we can't check them client-side
          
          // Attempt to restore session using refresh token from HttpOnly cookie
          // The browser will automatically send the HttpOnly cookie with this request
          const refreshSuccess = await refreshAccessToken(true); // true = session restoration (browser refresh)
          
          if (!refreshSuccess) {
            // No valid refresh token found - this is a new user
            // Explicitly set authentication state to false to prevent showing unauthenticated state during loading
            setUser(null);
            setIsAuthenticated(false);
            return;
          }
          
          // refreshAccessToken already sets user data, so we're done
          return;
        }
      })();

      // Wait for authentication to complete with timeout
      await Promise.race([authPromise, timeoutPromise]);

      // Clear loading timer if auth completed quickly
      clearTimeout(loadingTimer);
      setShowLoadingSpinner(false);

    } catch (error) {
      setShowLoadingSpinner(false);
      
      // Only perform logout if it's not a timeout error (first-time users)
      if (error instanceof Error && error.message !== AUTH_ERROR_MESSAGES.INITIALIZATION_TIMEOUT) {
        await performCompleteLogout();
      }
    } finally {
      // Set loading states to false after authentication process is complete
      setIsLoading(false);
      setIsInitializing(false);
    }
  }, [refreshAccessToken, fetchCurrentUser, performCompleteLogout, setIsInitializing, setShowLoadingSpinner, setIsLoading, setUser, setIsAuthenticated]);

  // Initialize authentication on mount (only once)
  useEffect(() => {
    // Always initialize authentication on mount
    // This ensures consistent behavior for both first-time users and returning users
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeAuth().catch((error) => {
        // Handle any errors during initialization
        console.error('Auth initialization failed:', error);
        // Reset initialization state on error
        isInitializedRef.current = false;
      });
    }
  }, [initializeAuth]); // Include initializeAuth in dependencies

  return {
    initializeAuth,
  };
}; 