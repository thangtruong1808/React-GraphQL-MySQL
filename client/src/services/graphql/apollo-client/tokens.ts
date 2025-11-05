import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { API_CONFIG, AUTH_CONFIG } from '../../../constants';
import { clearTokens, getTokens, isTokenExpired, TokenManager } from '../../../utils/tokenManager';
import { REFRESH_TOKEN } from '../mutations';
import { getCSRFToken, setCSRFToken } from './csrf';

/**
 * Token Management for Apollo Client
 * Handles token refresh and auth data collection
 */

// Token refresh state management
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Auth data collection promise queue - prevents race conditions during fast navigation
let authDataPromise: Promise<{ accessToken: string | null; csrfToken: string | null }> | null = null;

/**
 * Automatic token refresh function
 * Refreshes tokens when they're about to expire or have expired
 * Returns new access token or null if refresh fails
 * Note: Refresh token is stored in httpOnly cookie, not in memory
 */
export const refreshTokenAutomatically = async (): Promise<string | null> => {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      // Create a temporary client for the refresh request
      const tempClient = new ApolloClient({
        link: createHttpLink({
          uri: API_CONFIG.GRAPHQL_URL,
          credentials: 'include', // This includes the httpOnly refresh token cookie
        }),
        cache: new InMemoryCache(),
      });

      // Call refresh token mutation - server will use httpOnly cookie
      const result = await tempClient.mutate({
        mutation: REFRESH_TOKEN,
        variables: {
          dynamicBuffer: undefined,
        },
      });

      const refreshData = result.data?.refreshToken;
      if (refreshData?.accessToken && refreshData?.refreshToken) {
        // Update tokens in memory and verify they're stored
        const { saveTokens } = await import('../../../utils/tokenManager');
        await saveTokens(refreshData.accessToken, refreshData.refreshToken);
        
        // Clear auth data promise cache to force fresh token collection on next request
        authDataPromise = null;
        
        // Update CSRF token if provided
        if (refreshData.csrfToken) {
          setCSRFToken(refreshData.csrfToken);
        }

        return refreshData.accessToken;
      }

      return null;
    } catch (error) {
      // Refresh failed, clear tokens
      clearTokens();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Collect all necessary authentication data asynchronously
 * Ensures all required data is available before mutations
 * Uses promise queue to prevent race conditions during fast navigation
 * Returns object with accessToken and csrfToken
 */
export const collectAuthData = async (): Promise<{ accessToken: string | null; csrfToken: string | null }> => {
  // If auth data collection is already in progress, check if tokens exist now
  // If tokens exist, the promise might be stale (created before tokens were saved)
  // Clear it and create a new one to ensure we use fresh tokens
  if (authDataPromise) {
    const tokens = getTokens();
    if (tokens.accessToken) {
      // Tokens exist now - the existing promise might be stale, clear it and create new one
      authDataPromise = null;
    } else {
      // No tokens - safe to reuse existing promise
      return authDataPromise;
    }
  }

  // Create new promise for auth data collection
  authDataPromise = (async () => {
    try {
      // Get current tokens
      const tokens = getTokens();
      
      let accessToken: string | null = null;

      // Only use access token if it is still valid; DO NOT auto-refresh here
      if (tokens.accessToken) {
        const { isActivityBasedTokenExpired } = await import('../../../utils/tokenManager');
        const activityModeEnabled = AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED;
        const isExpired = activityModeEnabled
          ? isActivityBasedTokenExpired()
          : isTokenExpired(tokens.accessToken);
        
        if (!isExpired) {
          accessToken = tokens.accessToken;
        }
      }

      // Ensure CSRF token is available
      let currentCSRFToken = getCSRFToken();
      if (!currentCSRFToken) {
        try {
          const baseUrl = API_CONFIG.GRAPHQL_URL.replace('/graphql', '');
          const response = await fetch(`${baseUrl}/csrf-token`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            if (data.csrfToken) {
              setCSRFToken(data.csrfToken);
              currentCSRFToken = data.csrfToken;
            }
          }
        } catch (error) {
          // CSRF token fetch failed
        }
      }

      return { accessToken, csrfToken: currentCSRFToken };
    } catch (error) {
      return { accessToken: null, csrfToken: null };
    } finally {
      // Clear promise after completion to allow new collection
      authDataPromise = null;
    }
  })();

  return authDataPromise;
};

/**
 * Clear auth data promise cache to force fresh token collection
 * Called after tokens are saved/refreshed to ensure next collectAuthData() uses new tokens
 *
 * CALLED BY: AuthActions after login/refresh, refreshTokenAutomatically after token refresh
 * SCENARIOS: After successful token save/refresh - ensures fresh promise with new tokens
 */
export const clearAuthDataPromise = () => {
  authDataPromise = null;
};

/**
 * Collect all necessary authentication data asynchronously
 * Can be used by components to ensure auth data is ready before mutations
 * 
 * CALLED BY: Components that need to ensure authentication before mutations
 * SCENARIOS: Comment posting, like toggling, and other authenticated operations
 */
export const ensureAuthDataReady = async (): Promise<boolean> => {
  try {
    const { accessToken, csrfToken: currentCSRFToken } = await collectAuthData();
    const isReady = !!(accessToken && currentCSRFToken);
    return isReady;
  } catch (error) {
    return false;
  }
};

