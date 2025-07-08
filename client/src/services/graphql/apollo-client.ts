import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import TokenManager from '../../utils/tokenManager';
import { REFRESH_TOKEN } from './mutations';

/**
 * Apollo Client Configuration
 * Sets up GraphQL client with JWT refresh token authentication, automatic token refresh, and error handling
 */

// HTTP Link - uses Vite's import.meta.env for environment variables
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

/**
 * Process failed requests queue
 * @param error - Error that occurred
 * @param token - New token or null
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Refresh access token using refresh token
 * @returns Promise with new access token
 */
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Create a temporary Apollo Client for refresh request
    const tempClient = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    });

    const { data } = await tempClient.mutate({
      mutation: REFRESH_TOKEN,
      variables: { input: { refreshToken } },
    });

    if (data?.refreshToken) {
      // Update tokens with new ones (token rotation)
      TokenManager.updateTokens(data.refreshToken.accessToken, data.refreshToken.refreshToken);
      return data.refreshToken.accessToken;
    }

    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear tokens on refresh failure
    TokenManager.clearTokens();
    return null;
  }
};

// Auth Link - automatically adds JWT access token to all GraphQL requests
const authLink = setContext(async (_, { headers }) => {
  // Check if token needs refresh
  if (TokenManager.shouldRefreshToken() && !isRefreshing) {
    isRefreshing = true;
    
    try {
      const newToken = await refreshAccessToken();
      if (newToken) {
        processQueue(null, newToken);
      } else {
        processQueue(new Error('Token refresh failed'));
      }
    } catch (error) {
      processQueue(error);
    } finally {
      isRefreshing = false;
    }
  }

  // Get current access token
  const token = TokenManager.getAccessToken();
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error Link - handles GraphQL errors and authentication failures
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // Log GraphQL errors for debugging
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  // Handle network errors and authentication failures
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle 401 Unauthorized errors (token expired)
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      // Clear tokens and redirect to login on authentication failure
      TokenManager.clearTokens();
      window.location.href = '/login';
    }
  }
});

// Cache configuration - defines how Apollo Client manages data caching
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Field policies for better cache management - always use latest data
        users: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        tasks: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

// Create Apollo Client instance with all configured links and cache
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]), // Chain links in order: error → auth → http
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all', // Return partial data even if there are errors
    },
    query: {
      errorPolicy: 'all', // Return partial data even if there are errors
    },
  },
});

export default client; 