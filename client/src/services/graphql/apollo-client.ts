import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { 
  getTokens, 
  clearTokens, 
  isTokenExpired
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

// Enhanced auth link with better token validation
const authLink = setContext((_, { headers }) => {
  try {
    // Get access token from memory
    const tokens = getTokens();
    
    // Only add authorization header if token exists and is not expired
    const shouldAddToken = tokens.accessToken && !isTokenExpired(tokens.accessToken);
    
    if (shouldAddToken) {
      console.log('🔐 Adding authorization header to request');
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

// Enhanced error link with simplified authentication handling
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        console.log('🔐 Authentication error detected');
        
        // Clear client-side tokens and redirect to login
        clearTokens();
        window.location.href = ROUTES.LOGIN;
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle network errors that might be related to authentication
    if (networkError.message.includes('401') || networkError.message.includes('Unauthorized')) {
      console.log('🔐 Network authentication error detected');
      clearTokens();
      window.location.href = ROUTES.LOGIN;
    }
  }
});

// Create Apollo Client instance with enhanced configuration
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          currentUser: {
            read(existing) {
              return existing;
            },
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
      User: {
        keyFields: ['id'],
        fields: {
          // Ensure user data is properly cached
          id: {
            read(id: string) {
              return id;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client; 