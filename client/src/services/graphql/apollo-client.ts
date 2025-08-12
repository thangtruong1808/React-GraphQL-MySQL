import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { from } from '@apollo/client/link/core';
import { onError } from '@apollo/client/link/error';
import { API_CONFIG, AUTH_CONFIG, DEBUG_CONFIG } from '../../constants';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import {
  clearTokens,
  getTokens,
  isActivityBasedTokenExpired,
  isTokenExpired
} from '../../utils/tokenManager';


// Global error handler - will be set by App.tsx
let globalErrorHandler: ((message: string, source: string) => void) | null = null;

// Function to set the global error handler
export const setGlobalErrorHandler = (handler: (message: string, source: string) => void) => {
  globalErrorHandler = handler;
};

// CSRF token storage in memory (XSS protection)
let csrfToken: string | null = null;

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
        // Debug logging disabled for better user experience
      }
    } else {
      console.warn('Failed to fetch initial CSRF token:', response.status);
    }
  } catch (error) {
    console.error('Error fetching initial CSRF token:', error);
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
const authLink = setContext((_, { headers }) => {
  try {
    // Get access token from memory (no DB connection)
    const tokens = getTokens();
    
    // Only add authorization header if token exists and is not expired
    let shouldAddToken = false;
    
    if (tokens.accessToken) {
      // Use activity-based token validation if enabled
      if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
        shouldAddToken = !isActivityBasedTokenExpired();
      } else {
        // Fallback to fixed token expiry check
        shouldAddToken = !isTokenExpired(tokens.accessToken);
      }
    }
    
    // Prepare headers
    const requestHeaders: any = {
      ...headers,
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token is valid
    if (shouldAddToken) {
      requestHeaders.authorization = `Bearer ${tokens.accessToken}`;
    }
    
    // Add CSRF token header for mutations
    if (csrfToken) {
      requestHeaders['x-csrf-token'] = csrfToken;
    }
    
    return { headers: requestHeaders };
  } catch (error) {
    console.error('Error setting auth context:', error);
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
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      // Handle expected "Refresh token is required" error gracefully
      // Don't log it as an error, but let it propagate to the mutation
      if (message === 'Refresh token is required') {
        // Don't log as error, but let the error propagate to the mutation
        // Continue to the next error or let it propagate
      }
      
      console.error(`GraphQL error: ${message}`, { locations, path, extensions });
      
      // Handle authentication errors (including force logout)
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Debug logging disabled for better user experience
        
        // Check if this is a currentUser query (which should trigger refresh)
        const isCurrentUserQuery = operation.operationName === 'GetCurrentUser' || 
                                  path?.includes('currentUser');
        
        if (isCurrentUserQuery) {
          // Don't clear tokens here - let AuthContext handle the refresh
          return;
        }
        
        // For other queries, don't immediately redirect - let AuthContext handle session expiry
        // Don't clear tokens or redirect - AuthContext will show session expiry modal
        return;
      }

      // Handle too many sessions error
      if (extensions?.code === 'TOO_MANY_SESSIONS') {
        // Show error message to user (don't clear tokens, just show error)
        const errorMessage = message || 'Maximum active sessions reached. Please log out from another device to continue.';
        if (globalErrorHandler) {
          globalErrorHandler(errorMessage, 'Authentication');
        }
        // Removed alert() - using inline error display instead
      } else {
        // Show other GraphQL errors to user
        if (globalErrorHandler) {
          globalErrorHandler(message, 'GraphQL');
        }
      }
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError.message}`, networkError);
    
    // Show network errors to user
    if (globalErrorHandler) {
      globalErrorHandler(`Network error: ${networkError.message}`, 'Network');
    }
    
    // Handle network errors that might be related to authentication
    if (networkError.message.includes('401') || networkError.message.includes('Unauthorized')) {
      // Debug logging disabled for better user experience
      clearTokens();
      window.location.href = ROUTE_PATHS.LOGIN;
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
          currentUser: {
            read(existing) {
              // Debug logging disabled for better user experience
              return existing;
            },
          },
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

// Fetch initial CSRF token (only once on startup)
fetchInitialCSRFToken();

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