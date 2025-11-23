import { split, from } from '@apollo/client/link/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { httpLink, wsLink } from './http';
import { authLink } from './auth';
import { errorLink } from './error';

/**
 * Apollo Client Links
 * Description: Combines HTTP, WebSocket, auth, and error links
 * Date: 2024-12-19
 * Author: thangtruong
 */

/**
 * Create split link to route queries/mutations to HTTP and subscriptions to WebSocket
 * Description: Routes subscriptions to WebSocket and queries/mutations to HTTP
 * Date: 2024-12-19
 * Author: thangtruong
 */
export const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // Use WebSocket for subscriptions
  from([errorLink, authLink, httpLink]) // Use HTTP for queries and mutations
);

