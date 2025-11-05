import { API_CONFIG } from '../../../constants';

/**
 * CSRF Token Management for Apollo Client
 * Handles CSRF token storage and retrieval
 */

// CSRF token storage in memory (XSS protection)
let csrfToken: string | null = null;

/**
 * Fetch initial CSRF token from server
 * Only called once on app startup - no DB connection needed
 * 
 * CALLED BY: Apollo Client initialization
 * SCENARIOS: All scenarios - fetches CSRF token for security
 * PURPOSE: Provides CSRF protection for all GraphQL mutations
 */
export const fetchInitialCSRFToken = async (): Promise<void> => {
  try {
    const baseUrl = API_CONFIG.GRAPHQL_URL.replace('/graphql', '');
    const response = await fetch(`${baseUrl}/csrf-token`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.csrfToken) {
        csrfToken = data.csrfToken;
      } else {
        throw new Error('CSRF token not found in server response');
      }
    } else {
      const errorText = await response.text();
      throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (error) {
    // Set a fallback CSRF token to prevent app from breaking
    csrfToken = 'fallback-csrf-token';
  }
};

/**
 * Get CSRF token from memory
 * Internal function for auth link
 */
export const getCSRFToken = (): string | null => csrfToken;

/**
 * Set CSRF token in Apollo Client memory
 * Called when new CSRF token is received from server
 * 
 * CALLED BY: AuthContext after successful login/refresh
 * SCENARIOS: All scenarios - updates CSRF token for security
 */
export const setCSRFToken = (token: string) => {
  csrfToken = token;
};

/**
 * Clear CSRF token from Apollo Client memory
 * Called during logout or token clearing
 *
 * CALLED BY: AuthContext during logout
 * SCENARIOS: Logout scenarios - clears CSRF token
 */
export const clearCSRFToken = () => {
  csrfToken = null;
};

