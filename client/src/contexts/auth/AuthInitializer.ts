import { useCallback, useRef, useEffect } from 'react';
import { AUTH_CONFIG, AUTH_FEATURES, AUTH_ERROR_MESSAGES, DEBUG_CONFIG } from '../../constants';
import { getTokens, isTokenExpired, isActivityBasedTokenExpired, TokenManager } from '../../utils/tokenManager';
import { setAuthInitializing, setAppInitialized } from '../../services/graphql/apollo-client';

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
 * Implements simple authentication flow to prevent flicker and handle errors gracefully
 * 
 * SIMPLE APPROACH: 
 * 1. Always attempt refresh token first (httpOnly cookie is secure and server will validate)
 * 2. If successful, user data is set by refreshAccessToken
 * 3. If failed, set user to null and isAuthenticated to false
 * 4. Handle errors gracefully without showing error messages for new users
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
   * Initialize authentication state with proper error handling
   * Attempts refresh token first, then sets appropriate state based on result
   * Handles missing refresh tokens gracefully for new users
   */
  const initializeAuth = useCallback(async () => {
    try {
      // Set authentication initialization flag to prevent error messages
      setAuthInitializing(true);
      
      // Set loading states immediately to show skeleton
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
        // Step 1: Always attempt to refresh access token
        // The httpOnly cookie will be sent automatically by the browser
        // Server will validate the refresh token and return appropriate response
        
        try {
          const refreshSuccess = await refreshAccessToken(true); // true = session restoration
          
          if (!refreshSuccess) {
            // Refresh failed - user is not authenticated
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // Refresh successful - user data is already set by refreshAccessToken
            // Ensure authentication state is properly set
            setIsAuthenticated(true);
          }
        } catch (error: any) {
          // Handle specific GraphQL errors gracefully
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            const graphQLError = error.graphQLErrors[0];
            
            // Handle "Refresh token is required" or "Invalid refresh token" errors
            if (graphQLError.message === 'Refresh token is required' || 
                graphQLError.message === 'Invalid refresh token') {
              // This is normal for new users or expired tokens - no error display needed
              setUser(null);
              setIsAuthenticated(false);
              return;
            }
            
            // Handle other GraphQL errors
            if (graphQLError.extensions?.code === 'UNAUTHENTICATED') {
              // User is not authenticated - clear state
              setUser(null);
              setIsAuthenticated(false);
              return;
            }
          }
          
          // For other errors, perform logout to ensure clean state
          await performCompleteLogout();
        }
      })();

      // Wait for authentication to complete with timeout
      await Promise.race([authPromise, timeoutPromise]);

      // Clear loading timer if auth completed quickly
      clearTimeout(loadingTimer);
      setShowLoadingSpinner(false);

    } catch (error) {
      setShowLoadingSpinner(false);
      
      // Handle timeout errors gracefully
      if (error instanceof Error && error.message === AUTH_ERROR_MESSAGES.INITIALIZATION_TIMEOUT) {
        // Set unauthenticated state for timeout
        setUser(null);
        setIsAuthenticated(false);
      } else {
        // For other errors, perform logout to ensure clean state
        await performCompleteLogout();
      }
    } finally {
      // Clear authentication initialization flag
      setAuthInitializing(false);
      
      // Mark app as initialized to allow error messages for future operations
      setAppInitialized();
      
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
        // Reset initialization state on error
        isInitializedRef.current = false;
      });
    }
  }, [initializeAuth]); // Include initializeAuth in dependencies

  return {
    initializeAuth,
  };
}; 