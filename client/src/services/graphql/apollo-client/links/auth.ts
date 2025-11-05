import { setContext } from '@apollo/client/link/context';
import { collectAuthData } from '../tokens';
import { getCSRFToken } from '../csrf';

/**
 * Authentication Link for Apollo Client
 * Adds authentication headers to GraphQL requests
 */

/**
 * Enhanced auth link with better token validation and debugging
 * Runs BEFORE every GraphQL request to add authentication headers
 * 
 * CALLED BY: Every GraphQL request (queries and mutations)
 * SCENARIOS:
 * - Valid access token: Adds Bearer token to headers
 * - Expired access token: No authorization header added
 * - No access token: No authorization header added
 * - All scenarios: Adds CSRF token if available
 */
export const authLink = setContext(async (_, { headers }) => {
  try {
    // Collect all necessary authentication data asynchronously
    const { accessToken, csrfToken: currentCSRFToken } = await collectAuthData();

    // Prepare headers
    const requestHeaders: any = {
      ...headers,
      'Content-Type': 'application/json',
    };

    // Add authorization header if token is available
    if (accessToken) {
      requestHeaders.authorization = `Bearer ${accessToken}`;
    }

    // Add CSRF token header for mutations
    if (currentCSRFToken) {
      requestHeaders['x-csrf-token'] = currentCSRFToken;
    }

    return { headers: requestHeaders };
  } catch (error) {
    return { headers };
  }
});

