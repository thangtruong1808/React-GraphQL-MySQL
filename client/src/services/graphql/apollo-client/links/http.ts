import { createHttpLink } from '@apollo/client';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { API_CONFIG } from '../../../../constants';
import { collectAuthData } from '../tokens';

/**
 * HTTP and WebSocket Links for Apollo Client
 * Creates HTTP link for queries/mutations and WebSocket link for subscriptions
 */

/**
 * Create HTTP link with timeout using centralized constants
 * Handles all GraphQL queries and mutations
 */
export const httpLink = createHttpLink({
  uri: API_CONFIG.GRAPHQL_URL,
  fetchOptions: {
    timeout: API_CONFIG.REQUEST_TIMEOUT,
  },
  credentials: 'include', // Include cookies in requests
});

/**
 * Create WebSocket link for subscriptions
 * Handles real-time GraphQL subscriptions
 */
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

export const wsLink = new GraphQLWsLink(wsClient);

