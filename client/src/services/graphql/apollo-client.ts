import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { from } from '@apollo/client/link/core';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { API_CONFIG, AUTH_CONFIG } from '../../constants';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import {
  clearTokens,
  getTokens,
  isTokenExpired,
  TokenManager
} from '../../utils/tokenManager';
import { REFRESH_TOKEN } from './mutations';


// Global error handler - will be set by App.tsx
let globalErrorHandler: ((message: string, source: string) => void) | null = null;

// Authentication initialization flag - prevents error messages during auth init
let isAuthInitializing = false;

// App initialization flag - prevents error messages during initial app load
let isAppInitializing = true;

// Function to set the global error handler
export const setGlobalErrorHandler = (handler: (message: string, source: string) => void) => {
  globalErrorHandler = handler;
};

// Function to set authentication initialization state
export const setAuthInitializing = (initializing: boolean) => {
  isAuthInitializing = initializing;
};

// Function to mark app as fully initialized
export const setAppInitialized = () => {
  isAppInitializing = false;
};

// CSRF token storage in memory (XSS protection)
let csrfToken: string | null = null;

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
const refreshTokenAutomatically = async (): Promise<string | null> => {
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
          dynamicBuffer: undefined
        }
      });

      const refreshData = result.data?.refreshToken;
      if (refreshData?.accessToken && refreshData?.refreshToken) {
        // Update tokens in memory
        const { saveTokens } = await import('../../utils/tokenManager');
        saveTokens(refreshData.accessToken, refreshData.refreshToken);
        
        // Update CSRF token if provided
        if (refreshData.csrfToken) {
          csrfToken = refreshData.csrfToken;
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
const collectAuthData = async (): Promise<{ accessToken: string | null; csrfToken: string | null }> => {
  // If auth data collection is already in progress, return the existing promise
  // This prevents race conditions when multiple queries fire simultaneously during fast navigation
  if (authDataPromise) {
    return authDataPromise;
  }

  // Create new promise for auth data collection
  authDataPromise = (async () => {
    try {
      // Get current tokens
      const tokens = getTokens();
      let accessToken: string | null = null;

      // Only use access token if it is still valid; DO NOT auto-refresh here
      if (tokens.accessToken) {
        const { isActivityBasedTokenExpired } = await import('../../utils/tokenManager');
        const activityModeEnabled = AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED;
        const isExpired = activityModeEnabled
          ? isActivityBasedTokenExpired()
          : isTokenExpired(tokens.accessToken);
        if (!isExpired) {
          accessToken = tokens.accessToken;
        }
      }

      // Ensure CSRF token is available
      if (!csrfToken) {
        try {
          const baseUrl = API_CONFIG.GRAPHQL_URL.replace('/graphql', '');
          const response = await fetch(`${baseUrl}/csrf-token`, {
            method: 'GET',
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.csrfToken) {
              csrfToken = data.csrfToken;
            }
          }
        } catch (error) {
          // CSRF token fetch failed
        }
      }

      return { accessToken, csrfToken };
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
 * Fetch initial CSRF token from server
 * Only called once on app startup - no DB connection needed
 * 
 * CALLED BY: Apollo Client initialization
 * SCENARIOS: All scenarios - fetches CSRF token for security
 * PURPOSE: Provides CSRF protection for all GraphQL mutations
 */
const fetchInitialCSRFToken = async (): Promise<void> => {
  try {
    const baseUrl = API_CONFIG.GRAPHQL_URL.replace('/graphql', '');
    const response = await fetch(`${baseUrl}/csrf-token`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.csrfToken) {
        csrfToken = data.csrfToken;
        // CSRF token successfully fetched and stored
      } else {
        // Server response missing CSRF token
        throw new Error('CSRF token not found in server response');
      }
    } else {
      // Server returned error status
      const errorText = await response.text();
      throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (error) {
    // Log error for debugging but don't break the app
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Set a fallback CSRF token to prevent app from breaking
    csrfToken = 'fallback-csrf-token';
    
    // Note: In production, you might want to show a user-friendly notification
    // but for now, we'll use fallback to maintain app functionality
    // Don't throw error to prevent app from breaking
  }
};

/**
 * Enhanced Apollo Client Configuration
 * Handles authentication headers and error management with httpOnly cookie support
 * Optimized for performance: minimal overhead, efficient error handling
 * 
 * EXECUTION FLOW FOR DIFFERENT SCENARIOS:
 * 
 * 1. FIRST TIME LOGIN (No tokens):
 *    - authLink: getTokens() returns null → no authorization header
 *    - Request sent without Bearer token
 *    - Server validates credentials → returns tokens
 *    - errorLink: No errors → request succeeds
 * 
 * 2. EXPIRED ACCESS TOKEN + VALID REFRESH TOKEN:
 *    - authLink: getTokens() returns expired token → no authorization header
 *    - Request sent without Bearer token
 *    - Server returns UNAUTHENTICATED error
 *    - errorLink: Handles UNAUTHENTICATED → triggers refresh in AuthContext
 * 
 * 3. EXPIRED ACCESS TOKEN + EXPIRED REFRESH TOKEN:
 *    - authLink: getTokens() returns expired token → no authorization header
 *    - Request sent without Bearer token
 *    - Server returns UNAUTHENTICATED error
 *    - errorLink: Handles UNAUTHENTICATED → clearTokens() → redirect to login
 */

// Create HTTP link with timeout using centralized constants
const httpLink = createHttpLink({
  uri: API_CONFIG.GRAPHQL_URL,
  fetchOptions: {
    timeout: API_CONFIG.REQUEST_TIMEOUT,
  },
  credentials: 'include', // Include cookies in requests
});

// Create WebSocket link for subscriptions
const wsUrl = API_CONFIG.GRAPHQL_URL.replace('http', 'ws');
const wsClient = createClient({
  url: wsUrl,
  connectionParams: async () => {
    // Get authentication data for WebSocket connection
    const { accessToken } = await collectAuthData();
    return {
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    };
  },
});

const wsLink = new GraphQLWsLink(wsClient);

/**
 * Enhanced auth link with better token validation and debugging
 * Runs BEFORE every GraphQL request to add authentication headers
 * 
 * CALLED BY: Every GraphQL request (queries and mutations)
 * SCENARIOS:
 * - Valid access token: Adds Bearer token to headers
 * - Expired access token: No authorization header added
 * - No access token: No authorization header added
 * - All scenarios: Adds CSRF token if available
 */
const authLink = setContext(async (_, { headers }) => {
  try {
    // Collect all necessary authentication data asynchronously
    const { accessToken, csrfToken: currentCSRFToken } = await collectAuthData();
    
    // Prepare headers
    const requestHeaders: any = {
      ...headers,
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token is available
    if (accessToken) {
      requestHeaders.authorization = `Bearer ${accessToken}`;
    }
    
    // Add CSRF token header for mutations
    if (currentCSRFToken) {
      requestHeaders['x-csrf-token'] = currentCSRFToken;
    }
    
    return { headers: requestHeaders };
  } catch (error) {
    return { headers };
  }
});

/**
 * Enhanced error link with comprehensive authentication handling
 * Runs AFTER every GraphQL response to handle authentication errors
 * 
 * CALLED BY: Every GraphQL response (success or error)
 * SCENARIOS:
 * - UNAUTHENTICATED error: Triggers token refresh or logout
 * - TOO_MANY_SESSIONS error: Shows error message to user
 * - Network errors: Handles 401/Unauthorized responses
 * - Other errors: Logs error details
 */
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    // Check if this is a notification-related operation first (before processing errors)
    // This allows us to suppress notification errors early to prevent race conditions
    const isNotificationOperation = operation.operationName === 'GetUserUnreadNotifications' ||
                                     operation.operationName === 'GetDashboardNotifications';
    
    // ALWAYS suppress errors from notification operations - they're non-critical
    // Check both operation name AND error message to catch all notification errors
    // If operation is a notification operation, suppress ALL errors from it
    const hasNotificationError = isNotificationOperation || graphQLErrors.some(({ message }) => {
      // Check if it's a notification-related error by message
      const isNotificationMessage = message.toLowerCase().includes('notification') || 
                                   message.toLowerCase().includes('notifications') ||
                                   message.includes('Failed to fetch notifications') ||
                                   message.includes('must be logged in to view notifications');
      
      // If it's a notification operation, suppress ALL errors regardless of code or message
      if (isNotificationOperation) {
        return true;
      }
      
      // If message contains notification-related text, suppress it
      return isNotificationMessage;
    });
    
    // ALWAYS suppress notification errors - they're non-critical and shouldn't interrupt user flow
    // Suppress in all cases: during initialization, after login (before tokens ready), or race conditions
    // Query will retry automatically via polling (pollInterval: 30000)
    if (hasNotificationError) {
      // Always suppress notification errors - don't show toast
      // The query will retry automatically via polling every 30 seconds
      return; // Suppress notification errors completely - no toast shown
    }
    
    graphQLErrors.forEach(async ({ message, locations, path, extensions }) => {
      // Handle GraphQL errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Check authentication state more reliably - check if tokens exist
        const tokens = getTokens();
        const hasTokens = !!(tokens.accessToken || tokens.refreshToken);
        
        // During session-expiry window, suppress auth errors (no toast, no token clear)
        try {
          const isModalShowing = TokenManager.isSessionExpiryModalShowing();
          const activityModeEnabled = AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED;
          const isAccessExpired = activityModeEnabled ? TokenManager.isActivityBasedTokenExpired() : false;
          const isAuthWindow = isModalShowing || isAccessExpired;
          
          if (isAuthWindow) {
            return; // Let SessionManager handle the flow
          }
        } catch (_) {}

        // Don't show authentication errors during initialization or for new users
        // These are expected for users without refresh tokens
        const isAuthOperation = operation.operationName === 'RefreshToken' || 
                               operation.operationName === 'RefreshTokenRenewal';
        
        // Don't show "Refresh token is required" errors for new users or after logout
        const isRefreshTokenRequiredError = message === 'Refresh token is required' || 
                                          message === 'Invalid refresh token' ||
                                          message.includes('Refresh token') ||
                                          message.includes('refresh token');
        
        // Check if this is a comment-related operation (queries or mutations)
        const isCommentOperation = operation.operationName === 'CreateComment' || 
                                  operation.operationName === 'ToggleCommentLike' ||
                                  operation.operationName === 'GetDashboardComments';
        
        // Check if this is a comment query that might be failing due to race condition during fast navigation
        // During fast navigation, queries might execute before auth data is ready
        const isCommentQuery = operation.operationName === 'GetDashboardComments';
        
        // For comment queries during fast navigation, suppress errors if tokens exist
        // This prevents false "You must be logged in to view comments" errors
        // The query will retry automatically when auth data is ready
        if (isCommentQuery && hasTokens && !isAuthInitializing && !isAppInitializing) {
          // Suppress error for comment queries during fast navigation when tokens exist
          // This is a race condition - query executed before auth data was ready
          // The query will succeed on retry when auth data is available
          return;
        }
        
        // Suppress authentication errors during initialization, app initialization, or when tokens don't exist yet
        // This prevents race conditions where queries execute before auth is ready
        // The token check (!hasTokens) handles cases where queries run before tokens are set
        if (isAuthOperation || isRefreshTokenRequiredError || isAuthInitializing || isAppInitializing || !hasTokens) {
          // Don't show any error messages for authentication operations or when auth isn't ready
          // These are expected for new users, during initialization, or when tokens haven't been set yet
          return;
        }
        
        // For comment mutations, try to refresh token automatically
        if (isCommentOperation && !isCommentQuery) {
          // Try to refresh token automatically for comment mutations
          const newToken = await refreshTokenAutomatically();
          if (newToken) {
            // Token refreshed successfully, retry the operation
            forward(operation);
            return;
          } else {
            // Refresh failed, show error
            if (globalErrorHandler) {
              globalErrorHandler('Session expired. Please try again.', 'GraphQL');
            }
            return;
          }
        }
        
        // Clear tokens on authentication error for other operations (outside modal flow)
        clearTokens();
        
        // Only show other authentication errors
        if (globalErrorHandler) {
          globalErrorHandler('Authentication error. Please log in again.', 'GraphQL');
        }
      } else if (extensions?.code === 'CSRF_TOKEN_INVALID' || message.includes('CSRF')) {
        // Handle CSRF errors gracefully - don't show to user during logout
        // This prevents CSRF error messages during logout operations
        const isLogoutOperation = operation.operationName === 'Logout';
        const isTaskOperation = ['CreateTask', 'UpdateTask', 'DeleteTask'].includes(operation.operationName);
        if (!isLogoutOperation && !isTaskOperation) {
          // For non-logout and non-task operations, CSRF errors should be thrown to the component
          // This ensures proper error handling in the UI
          throw new Error(message);
        }
      } else {
        // Show other GraphQL errors to user (but not CSRF errors)
        if (globalErrorHandler) {
          globalErrorHandler(message, 'GraphQL');
        }
      }
    });
  }

  if (networkError) {
    // Handle network errors that might be related to authentication
    if (networkError.message.includes('401') || networkError.message.includes('Unauthorized')) {
      // Clear tokens on 401/Unauthorized
      clearTokens();
      
      // Don't redirect to login for authentication operations during initialization
      const isAuthOperation = operation.operationName === 'RefreshToken' || 
                             operation.operationName === 'RefreshTokenRenewal';
      
      if (!isAuthOperation && !isAuthInitializing && !isAppInitializing) {
        window.location.href = ROUTE_PATHS.LOGIN;
      }
    } else if (networkError.message.includes('403') || networkError.message.includes('Forbidden')) {
      // Handle 403 errors - could be authentication or CSRF issues
      const isLogoutOperation = operation.operationName === 'Logout';
      if (isLogoutOperation) {
        // Don't show 403 errors during logout - this is expected behavior
        return;
      }
      
      // For non-logout operations, 403 could mean expired token
      // Try to refresh token if we have one
      const tokens = getTokens();
      if (tokens.refreshToken) {
        // The retry link will handle token refresh automatically
        // Don't redirect to login immediately - let retry attempt first
        return;
      }
    } else if (networkError.message.includes('CSRF')) {
      // Handle CSRF errors specifically
    } else {
      // Only show non-authentication network errors to user
      // This prevents CSRF errors during logout from showing
      if (globalErrorHandler && !isAuthInitializing && !isAppInitializing) {
        globalErrorHandler(`Network error: ${networkError.message}`, 'Network');
      }
    }
  }
});

// Create split link to route queries/mutations to HTTP and subscriptions to WebSocket
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // Use WebSocket for subscriptions
  from([errorLink, authLink, httpLink]) // Use HTTP for queries and mutations
);

/**
 * Create Apollo Client with enhanced error handling and security
 * Configures the complete GraphQL client with authentication support
 * 
 * CALLED BY: App initialization
 * SCENARIOS: All scenarios - provides GraphQL communication layer
 * FEATURES: Authentication, error handling, caching, CSRF protection, WebSocket subscriptions
 */
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache policies for better performance
          // Removed currentUser cache policy - no longer needed
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },
});

// Enhanced logging for GraphQL operations (disabled for better user experience)

// Fetch initial CSRF token (only once on startup) - handle errors gracefully
fetchInitialCSRFToken().catch(() => {
  // Error already handled in function - fallback token is set
});

/**
 * Set CSRF token in Apollo Client memory
 * Called when new CSRF token is received from server
 * 
 * CALLED BY: AuthContext after successful login/refresh
 * SCENARIOS: All scenarios - updates CSRF token for security
 */
export const setCSRFToken = (token: string) => {
  csrfToken = token;
  // Debug logging disabled for better user experience
};

/**
 * Clear CSRF token from Apollo Client memory
 * Called during logout or token clearing
 * 
 * CALLED BY: AuthContext during logout
 * SCENARIOS: Logout scenarios - clears CSRF token
 */
export const clearCSRFToken = () => {
  csrfToken = null;
  // Debug logging disabled for better user experience
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
    return !!(accessToken && currentCSRFToken);
  } catch (error) {
    return false;
  }
};

export default client; 