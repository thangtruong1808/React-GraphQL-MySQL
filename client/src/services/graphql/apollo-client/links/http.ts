import { createHttpLink } from '@apollo/client';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { API_CONFIG } from '../../../../constants';
import { collectAuthData } from '../tokens';

/**
 * HTTP and WebSocket Links for Apollo Client
 * Description: Creates HTTP link for queries/mutations and WebSocket link for subscriptions
 * Date: 2024-12-19
 * Author: thangtruong
 */

/**
 * Create HTTP link with timeout using centralized constants
 * Description: Handles all GraphQL queries and mutations
 * Date: 2024-12-19
 * Author: thangtruong
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
 * Description: Handles real-time GraphQL subscriptions with proper URL conversion
 * Date: 2024-12-19
 * Author: thangtruong
 */
const wsUrl = API_CONFIG.GRAPHQL_URL.replace(/^https?/, (match) => match === 'https' ? 'wss' : 'ws');
const wsClient = createClient({
  url: wsUrl,
  connectionParams: async () => {
    // Get authentication data for WebSocket connection
    const { accessToken } = await collectAuthData();
    return {
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    };
  },
  shouldRetry: () => true,
  retryAttempts: 5,
  retryWait: async function* () {
    for (let i = 1; i <= 5; i++) {
      yield i * 1000; // Wait 1s, 2s, 3s, 4s, 5s between retries
    }
  },
});

export const wsLink = new GraphQLWsLink(wsClient);

