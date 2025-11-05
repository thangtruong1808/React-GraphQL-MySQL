import { split, from } from '@apollo/client/link/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { httpLink, wsLink } from './http';
import { authLink } from './auth';
import { errorLink } from './error';

/**
 * Apollo Client Links
 * Combines HTTP, WebSocket, auth, and error links
 */

/**
 * Create split link to route queries/mutations to HTTP and subscriptions to WebSocket
 * Routes subscriptions to WebSocket and queries/mutations to HTTP
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

