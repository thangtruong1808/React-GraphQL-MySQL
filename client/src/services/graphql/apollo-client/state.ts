/**
 * Global State Management for Apollo Client
 * Manages initialization flags and error handler
 */

// Global error handler - will be set by App.tsx
let globalErrorHandler: ((message: string, source: string) => void) | null = null;

// Authentication initialization flag - prevents error messages during auth init
let isAuthInitializing = false;

// App initialization flag - prevents error messages during initial app load
let isAppInitializing = true;

/**
 * Function to set the global error handler
 * Called by App.tsx to set error handler for GraphQL operations
 */
export const setGlobalErrorHandler = (handler: (message: string, source: string) => void) => {
  globalErrorHandler = handler;
};

/**
 * Function to set authentication initialization state
 * Called during auth initialization to suppress error messages
 */
export const setAuthInitializing = (initializing: boolean) => {
  isAuthInitializing = initializing;
};

/**
 * Function to mark app as fully initialized
 * Called after app initialization completes
 */
export const setAppInitialized = () => {
  isAppInitializing = false;
};

/**
 * Get global error handler
 * Internal function for error link
 */
export const getGlobalErrorHandler = () => globalErrorHandler;

/**
 * Get authentication initialization state
 * Internal function for error link
 */
export const getIsAuthInitializing = () => isAuthInitializing;

/**
 * Get app initialization state
 * Internal function for error link
 */
export const getIsAppInitializing = () => isAppInitializing;

