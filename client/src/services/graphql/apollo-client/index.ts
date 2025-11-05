/**
 * Apollo Client Module
 * Central export point for Apollo Client and related utilities
 */

import { createApolloClient } from './config';
import { fetchInitialCSRFToken } from './csrf';
import {
  setGlobalErrorHandler,
  setAuthInitializing,
  setAppInitialized,
} from './state';
import {
  setCSRFToken,
  clearCSRFToken,
} from './csrf';
import {
  clearAuthDataPromise,
  ensureAuthDataReady,
} from './tokens';

// Create Apollo Client instance
const client = createApolloClient();

// Fetch initial CSRF token (only once on startup) - handle errors gracefully
fetchInitialCSRFToken().catch(() => {
  // Error already handled in function - fallback token is set
});

// Export Apollo Client instance
export default client;

// Export state management functions
export { setGlobalErrorHandler, setAuthInitializing, setAppInitialized };

// Export CSRF token management functions
export { setCSRFToken, clearCSRFToken };

// Export token management functions
export { clearAuthDataPromise, ensureAuthDataReady };

