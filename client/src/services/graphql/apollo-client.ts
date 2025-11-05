/**
 * Apollo Client Module
 * Re-exports all Apollo Client functionality for backward compatibility
 * 
 * @deprecated This file is maintained for backward compatibility.
 * New code should import directly from './apollo-client/' submodules.
 */

// Re-export everything from the new structure (explicit path to avoid circular dependency)
export { default } from './apollo-client/index';
export {
  setGlobalErrorHandler,
  setAuthInitializing,
  setAppInitialized,
  setCSRFToken,
  clearCSRFToken,
  clearAuthDataPromise,
  ensureAuthDataReady,
} from './apollo-client/index';
