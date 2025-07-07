import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

/**
 * Apollo Client Configuration
 * Sets up GraphQL client with authentication, error handling, and caching
 */

// HTTP Link - uses Vite's import.meta.env for environment variables
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

// Auth Link - automatically adds JWT token to all GraphQL requests
const authLink = setContext((_, { headers }) => {
  // Retrieve authentication token from localStorage
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error Link - handles GraphQL errors and network failures
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
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
    
    // Redirect to login on authentication errors (401)
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      localStorage.removeItem('authToken');
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