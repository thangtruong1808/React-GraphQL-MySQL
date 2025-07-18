import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { from } from '@apollo/client/link/core';
import { onError } from '@apollo/client/link/error';
import { API_CONFIG, ROUTES } from '../../constants';
import {
  clearTokens,
  getTokens,
  isAuthenticated,
  isTokenExpired
} from '../../utils/tokenManager';

// CSRF token storage in memory (XSS protection)
let csrfToken: string | null = null;

/**
 * Fetch initial CSRF token from server
 * Only called once on app startup - no DB connection needed
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
        console.log('🔒 Initial CSRF token fetched successfully');
      }
    } else {
      console.warn('⚠️ Failed to fetch initial CSRF token:', response.status);
    }
  } catch (error) {
    console.warn('⚠️ Error fetching initial CSRF token:', error);
  }
};

/**
 * Enhanced Apollo Client Configuration
 * Handles authentication headers and error management with httpOnly cookie support
 * Optimized for performance: minimal overhead, efficient error handling
 */

// Create HTTP link with timeout using centralized constants
const httpLink = createHttpLink({
  uri: API_CONFIG.GRAPHQL_URL,
  fetchOptions: {
    timeout: API_CONFIG.REQUEST_TIMEOUT,
  },
  credentials: 'include', // Include cookies in requests
});

// Enhanced auth link with better token validation and debugging
const authLink = setContext((_, { headers }) => {
  try {
    // Get access token from memory (no DB connection)
    const tokens = getTokens();
    
    // Debug: Log token retrieval
    console.log('🔍 Auth link - Token check:', {
      hasAccessToken: !!tokens.accessToken,
      accessTokenLength: tokens.accessToken?.length,
      isAuthenticated: isAuthenticated(),
      hasCSRFToken: !!csrfToken,
    });
    
    // Only add authorization header if token exists and is not expired
    const shouldAddToken = tokens.accessToken && !isTokenExpired(tokens.accessToken);
    
    if (shouldAddToken) {
      console.log('🔐 Adding authorization header to request');
    } else {
      console.log('❌ No valid access token found for request');
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
      console.log('🔒 Adding CSRF token header to request');
    }
    
    return { headers: requestHeaders };
  } catch (error) {
    console.error('❌ Error setting auth context:', error);
    return { headers };
  }
});

// Enhanced error link with comprehensive authentication handling
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Handle authentication errors (including force logout)
      if (extensions?.code === 'UNAUTHENTICATED') {
        console.log('🔐 Authentication error detected - attempting token refresh...');
        
        // Check if this is a currentUser query (which should trigger refresh)
        const isCurrentUserQuery = operation.operationName === 'GetCurrentUser' || 
                                  path?.includes('currentUser');
        
        if (isCurrentUserQuery) {
          console.log('🔐 CurrentUser query failed - this will trigger token refresh in AuthContext');
          // Don't clear tokens here - let AuthContext handle the refresh
          return;
        }
        
        // For other queries, clear tokens and redirect
        console.log('🔐 Non-currentUser query failed - clearing tokens and redirecting');
        clearTokens();
        
        // Show a more specific message for force logout
        if (message.includes('logged out by an administrator') || 
            message.includes('force') || 
            message.includes('revoked') ||
            message.includes('blacklisted')) {
          alert('You have been logged out by an administrator. Please log in again.');
        }
        
        window.location.href = ROUTES.LOGIN;
      }

      // Handle too many sessions error
      if (extensions?.code === 'TOO_MANY_SESSIONS') {
        console.log('🔐 Too many sessions error detected - showing error message');
        
        // Show error message to user (don't clear tokens, just show error)
        alert(message || 'Maximum active sessions reached. Please log out from another device to continue.');
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle network errors that might be related to authentication
    if (networkError.message.includes('401') || networkError.message.includes('Unauthorized')) {
      console.log('🔐 Network authentication error detected - user may have been force logged out');
      clearTokens();
      window.location.href = ROUTES.LOGIN;
    }
  }
});

// Create Apollo Client with enhanced error handling and security
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache policies for better performance
          currentUser: {
            read(existing) {
              console.log('🔍 APOLLO CACHE - Reading currentUser from cache:', !!existing);
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

// Enhanced logging for GraphQL operations
console.log('🔧 Apollo Client initialized with enhanced debugging');

// Fetch initial CSRF token (only once on startup)
fetchInitialCSRFToken();

// Export function to set CSRF token
export const setCSRFToken = (token: string) => {
  csrfToken = token;
  console.log('🔒 CSRF token set in Apollo Client');
};

// Export function to clear CSRF token
export const clearCSRFToken = () => {
  csrfToken = null;
  console.log('🔒 CSRF token cleared from Apollo Client');
};

export default client; 