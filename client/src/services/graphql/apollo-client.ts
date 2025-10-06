import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { from } from '@apollo/client/link/core';
import { onError } from '@apollo/client/link/error';
import { API_CONFIG, AUTH_CONFIG } from '../../constants';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import {
  clearTokens,
  getTokens,
  isTokenExpired
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

/**
 * Automatic token refresh function
 * Refreshes tokens when they're about to expire or have expired
 * Returns new access token or null if refresh fails
 */
const refreshTokenAutomatically = async (): Promise<string | null> => {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Check if we have a refresh token
  const tokens = getTokens();
  if (!tokens.refreshToken) {
    return null;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      // Create a temporary client for the refresh request
      const tempClient = new ApolloClient({
        link: createHttpLink({
          uri: API_CONFIG.GRAPHQL_URL,
          credentials: 'include',
        }),
        cache: new InMemoryCache(),
      });

      // Call refresh token mutation
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
    throw new Error(errorMessage);
    // console.error('CSRF Token Fetch Error:', errorMessage);
    
    // Set a fallback CSRF token to prevent app from breaking
    csrfToken = 'fallback-csrf-token';
    
    // Note: In production, you might want to show a user-friendly notification
    // but for now, we'll use fallback to maintain app functionality
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
    // Get access token from memory
    const tokens = getTokens();
    
    let accessToken = tokens.accessToken;
    
    // Check if token exists and is about to expire (within 30 seconds)
    if (accessToken) {
      const isExpired = isTokenExpired(accessToken);
      
      if (isExpired) {
        // Token is expired, try to refresh automatically
        const newToken = await refreshTokenAutomatically();
        if (newToken) {
          accessToken = newToken;
        } else {
          // Refresh failed, no token available
          accessToken = null;
        }
      }
    }
    
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
    if (csrfToken) {
      requestHeaders['x-csrf-token'] = csrfToken;
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
    graphQLErrors.forEach(async ({ message, locations, path, extensions }) => {
      // Handle GraphQL errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Don't show authentication errors during initialization or for new users
        // These are expected for users without refresh tokens
        const isAuthOperation = operation.operationName === 'RefreshToken' || 
                               operation.operationName === 'RefreshTokenRenewal';
        
        // Don't show "Refresh token is required" errors for new users or after logout
        const isRefreshTokenRequiredError = message === 'Refresh token is required' || 
                                          message === 'Invalid refresh token' ||
                                          message.includes('Refresh token') ||
                                          message.includes('refresh token');
        
        // Check if this is a comment operation that might be failing due to missing auth header
        const isCommentOperation = operation.operationName === 'CreateComment' || 
                                  operation.operationName === 'ToggleCommentLike';
        
        // Completely suppress authentication errors during initialization and after logout
        if (isAuthOperation || isRefreshTokenRequiredError || isAuthInitializing || isAppInitializing) {
          // Don't show any error messages for authentication operations
          // These are expected for new users, during initialization, or after logout
          return;
        }
        
        // For comment operations, try to refresh token automatically
        if (isCommentOperation) {
          // Try to refresh token automatically for comment operations
          const newToken = await refreshTokenAutomatically();
          if (newToken) {
            // Token refreshed successfully, retry the operation
            return forward(operation);
          } else {
            // Refresh failed, show error
            if (globalErrorHandler) {
              globalErrorHandler('Session expired. Please try again.', 'GraphQL');
            }
            return;
          }
        }
        
        // Clear tokens on authentication error for other operations
        clearTokens();
        
        // Only show other authentication errors
        if (globalErrorHandler) {
          globalErrorHandler('Authentication error. Please log in again.', 'GraphQL');
        }
      } else if (extensions?.code === 'CSRF_TOKEN_INVALID' || message.includes('CSRF')) {
        // Handle CSRF errors gracefully - don't show to user during logout
        // This prevents CSRF error messages during logout operations
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

/**
 * Create Apollo Client with enhanced error handling and security
 * Configures the complete GraphQL client with authentication support
 * 
 * CALLED BY: App initialization
 * SCENARIOS: All scenarios - provides GraphQL communication layer
 * FEATURES: Authentication, error handling, caching, CSRF protection
 */
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
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
  connectToDevTools: process.env.NODE_ENV === 'development',
});

// Enhanced logging for GraphQL operations (disabled for better user experience)

// Fetch initial CSRF token (only once on startup) - temporarily disabled for debugging
// fetchInitialCSRFToken();

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

export default client; 