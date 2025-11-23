import { ApolloClient, InMemoryCache } from '@apollo/client';
import { splitLink } from './links';

/**
 * Apollo Client Configuration
 * Description: Creates and configures the Apollo Client instance
 * Date: 2024-12-19
 * Author: thangtruong
 */

/**
 * Create Apollo Client with enhanced error handling and security
 * Description: Configures the complete GraphQL client with authentication support
 * Date: 2024-12-19
 * Author: thangtruong
 * 
 * CALLED BY: App initialization
 * SCENARIOS: All scenarios - provides GraphQL communication layer
 * FEATURES: Authentication, error handling, caching, CSRF protection, WebSocket subscriptions
 */
export const createApolloClient = () => {
  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Cache policies for better performance
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
};

