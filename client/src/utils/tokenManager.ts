/**
 * Token Manager - Refactored Module
 * This file now re-exports the refactored token manager modules
 * for backward compatibility with existing code
 * 
 * The original 819-line file has been refactored into smaller, more maintainable modules:
 * - constants.ts: Token management constants and configuration
 * - memoryStorage.ts: Secure memory-based storage operations
 * - tokenValidation.ts: JWT and hex token validation
 * - tokenStorage.ts: Token storage, retrieval, and update operations
 * - activityManager.ts: User activity tracking and management
 * - refreshTokenManager.ts: Refresh token expiry and renewal operations
 * - authValidation.ts: Authentication status validation
 * - TokenManager.ts: Main orchestrator class
 * - legacyWrappers.ts: Backward compatibility functions
 * 
 * All functionality remains the same, but now follows React coding conventions
 * with each module having a maximum of 250-300 lines of code.
 */

// Re-export all functionality from the refactored modules
export * from './tokenManager/index';
