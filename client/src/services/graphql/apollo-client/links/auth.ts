import { setContext } from '@apollo/client/link/context';
import { ensureTokensReady, collectAuthData } from '../tokens';
import { getCSRFToken } from '../csrf';

/**
 * Authentication Link for Apollo Client
 * Description: Adds authentication headers to GraphQL requests with token refresh support
 * Date: 2024-12-19
 * Author: thangtruong
 */

/**
 * Enhanced auth link with token refresh support
 * Description: Runs BEFORE every GraphQL request to add authentication headers
 * Date: 2024-12-19
 * Author: thangtruong
 * 
 * CALLED BY: Every GraphQL request (queries and mutations)
 * SCENARIOS:
 * - Valid access token: Adds Bearer token to headers
 * - Expired access token: Refreshes token and adds Bearer token to headers
 * - No access token: Attempts refresh, adds token if successful
 * - All scenarios: Adds CSRF token if available
 * 
 * IMPORTANT: This function WAITS for tokens to be ready before proceeding
 * Uses ensureTokensReady to guarantee tokens are available before adding headers
 */
export const authLink = setContext(async (_, { headers }) => {
  try {
    // Ensure tokens are ready before proceeding (waits and refreshes if needed)
    // Use aggressive retries to ensure tokens are available, especially after bulk operations
    // Increased initial delay to allow time for token operations to complete after bulk operations
    await new Promise(resolve => setTimeout(resolve, 50));
    let accessToken = await ensureTokensReady(10);
    
    // If still no token after initial retries, try multiple times with progressive delays
    // This ensures tokens are available even during concurrent operations
    if (!accessToken) {
      for (let attempt = 0; attempt < 5 && !accessToken; attempt++) {
        // Progressive delays: 150ms, 300ms, 450ms, 600ms, 750ms
        await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)));
        accessToken = await ensureTokensReady(5);
        if (accessToken) break;
      }
    }
    
    // Final attempt with longer wait if still no token
    if (!accessToken) {
      await new Promise(resolve => setTimeout(resolve, 300));
      accessToken = await ensureTokensReady(3);
    }
    
    // Collect CSRF token (wait for mutex if needed)
    let currentCSRFToken = getCSRFToken();
    if (!currentCSRFToken) {
      const authData = await collectAuthData();
      if (authData.csrfToken) {
        currentCSRFToken = authData.csrfToken;
      }
    }

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
    // Return headers without auth on error
    // Note: This should rarely happen as ensureTokensReady handles errors internally
    return { headers };
  }
});

