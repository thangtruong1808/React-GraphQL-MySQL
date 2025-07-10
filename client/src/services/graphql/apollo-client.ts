import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { from } from '@apollo/client/link/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { 
  getTokens, 
  clearTokens, 
  isTokenExpired,
  isAuthenticated
} from '../../utils/tokenManager';
import { API_CONFIG, ROUTES, ERROR_MESSAGES } from '../../constants';

/**
 * Enhanced Apollo Client Configuration
 * Handles authentication headers and error management with httpOnly cookie support
 * Implements secure token handling for cookie-based authentication
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
    // Get access token from memory
    const tokens = getTokens();
    
    // Debug: Log token retrieval
    console.log('🔍 Auth link - Token check:', {
      hasAccessToken: !!tokens.accessToken,
      accessTokenLength: tokens.accessToken?.length,
      isAuthenticated: isAuthenticated(),
    });
    
    // Only add authorization header if token exists and is not expired
    const shouldAddToken = tokens.accessToken && !isTokenExpired(tokens.accessToken);
    
    if (shouldAddToken) {
      console.log('🔐 Adding authorization header to request');
    } else {
      console.log('❌ No valid access token found for request');
    }
    
    return {
      headers: {
        ...headers,
        authorization: shouldAddToken ? `Bearer ${tokens.accessToken}` : '',
        'Content-Type': 'application/json',
      },
    };
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
        console.log('🔐 Authentication error detected - user may have been force logged out');
        
        // Clear client-side tokens and redirect to login
        clearTokens();
        
        // Show a more specific message for force logout
        if (message.includes('logged out by an administrator') || message.includes('force') || message.includes('revoked')) {
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

export default client; 