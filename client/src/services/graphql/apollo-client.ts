/**
 * Apollo Client Module
 * Description: Re-exports all Apollo Client functionality for backward compatibility
 * Date: 2024-12-19
 * Author: thangtruong
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
  collectAuthData,
} from './apollo-client/index';
