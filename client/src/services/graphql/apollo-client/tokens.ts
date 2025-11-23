import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { API_CONFIG, AUTH_CONFIG } from '../../../constants';
import { clearTokens, getTokens, isTokenExpired, TokenManager } from '../../../utils/tokenManager';
import { REFRESH_TOKEN } from '../mutations';
import { getCSRFToken, setCSRFToken } from './csrf';

/**
 * Token Management for Apollo Client
 * Description: Handles token refresh and auth data collection with mutex to prevent race conditions
 * Date: 2024-12-19
 * Author: thangtruong
 */

// Token refresh state management with mutex
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Removed authDataPromise caching - memory storage is synchronous, no need to cache promises

// Mutex for token operations to prevent concurrent access
let tokenOperationMutex: Promise<void> | null = null;

/**
 * Automatic token refresh function
 * Description: Refreshes tokens when expired with mutex protection to prevent race conditions
 * Date: 2024-12-19
 * Author: thangtruong
 * 
 * Returns new access token or null if refresh fails
 * Note: Refresh token is stored in httpOnly cookie, not in memory
 */
export const refreshTokenAutomatically = async (): Promise<string | null> => {
  // Wait for any ongoing token operation to complete (mutex) - CHECK FIRST
  if (tokenOperationMutex) {
    await tokenOperationMutex;
  }

  // After mutex wait, check if refresh is already in progress
  // This prevents race conditions where multiple calls pass the mutex check
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Create mutex for this refresh operation BEFORE setting isRefreshing
  // This ensures mutex is acquired atomically
  let mutexResolve: (() => void) | null = null;
  tokenOperationMutex = new Promise<void>((resolve) => {
    mutexResolve = resolve;
  });
  
  // Set refreshing flag AFTER mutex is created
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
        const { saveTokens, getTokens } = await import('../../../utils/tokenManager');
        await saveTokens(refreshData.accessToken, refreshData.refreshToken);
        
        // Verify tokens are actually available before proceeding
        const storedTokens = getTokens();
        if (!storedTokens.accessToken || storedTokens.accessToken !== refreshData.accessToken) {
          // Tokens not verified - return null but don't clear existing tokens
          // They might still be valid, just not refreshed yet
          return null;
        }
        
        // Update CSRF token if provided
        if (refreshData.csrfToken) {
          setCSRFToken(refreshData.csrfToken);
        }

        // Memory storage is synchronous - tokens are immediately available
        // Verify token is available before returning
        const finalCheckTokens = getTokens();
        if (finalCheckTokens.accessToken === refreshData.accessToken) {
          return refreshData.accessToken;
        }
        
        // Token verification failed - return null but don't clear tokens
        // They might still be valid
        return null;
      }

      return null;
    } catch (error) {
      // Refresh failed - return null but don't clear tokens
      // They might still be valid, just refresh failed
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
      // Release mutex after operation completes
      if (mutexResolve) {
        mutexResolve();
        tokenOperationMutex = null;
      }
    }
  })();

  return refreshPromise;
};

/**
 * Collect all necessary authentication data asynchronously
 * Description: Collects tokens and CSRF token with mutex protection
 * Date: 2024-12-19
 * Author: thangtruong
 * 
 * Uses mutex to prevent race conditions when multiple mutations happen concurrently
 * Returns object with accessToken and csrfToken
 * Note: Memory storage is synchronous, so tokens are immediately available after saveTokens()
 */
export const collectAuthData = async (): Promise<{ accessToken: string | null; csrfToken: string | null }> => {
  // Wait for any ongoing token operation to complete (mutex)
  // This ensures we don't read tokens while they're being refreshed
  if (tokenOperationMutex) {
    await tokenOperationMutex;
  }

  // Small delay to ensure tokens are fully available after mutex release
  // This prevents race conditions where tokens are saved but not yet readable
  await new Promise(resolve => setTimeout(resolve, 10));

  // Get current tokens synchronously (memory storage is immediate)
  const tokens = getTokens();
  let accessToken: string | null = null;
  
  // Validate token if it exists
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
};

/**
 * Clear auth data promise cache (no-op - caching removed)
 * Description: Kept for backward compatibility, but no longer needed
 * Date: 2024-12-19
 * Author: thangtruong
 */
export const clearAuthDataPromise = () => {
  // No-op: Removed promise caching since memory storage is synchronous
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

/**
 * Ensure tokens are ready with retry logic
 * Description: Waits for tokens to be available, refreshing if needed
 * Date: 2024-12-19
 * Author: thangtruong
 * 
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @returns Promise resolving to access token or null if unavailable
 */
export const ensureTokensReady = async (maxRetries: number = 3): Promise<string | null> => {
  // Wait for any ongoing token operation to complete (mutex)
  if (tokenOperationMutex) {
    await tokenOperationMutex;
  }

  // Small delay after mutex to ensure tokens are fully available
  await new Promise(resolve => setTimeout(resolve, 10));

  // Try to get tokens first
  const { accessToken } = await collectAuthData();
  if (accessToken) {
    return accessToken;
  }

  // Token not available - try to refresh with retries
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const refreshedToken = await refreshTokenAutomatically();
      if (refreshedToken) {
        // Wait a bit longer after refresh to ensure tokens are fully persisted
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Tokens are saved synchronously - verify immediately
        const verifyData = await collectAuthData();
        if (verifyData.accessToken) {
          return verifyData.accessToken;
        }
      }
    } catch (refreshError) {
      // Refresh failed - continue to retry
    }

    // Wait before retry (only if not last attempt)
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
    }
  }

  return null;
};

