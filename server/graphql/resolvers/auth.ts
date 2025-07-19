/**
 * @deprecated This file has been refactored into modular components.
 * Please use the new modular structure in the auth/ folder:
 * - auth/tokenManager.ts - JWT and refresh token operations
 * - auth/tokenCleanup.ts - Database cleanup and token limiting
 * - auth/validation.ts - Input validation utilities
 * - auth/operations.ts - Core authentication operations
 * - auth/index.ts - Main resolver exports
 * 
 * This file is maintained for backward compatibility only.
 */

// Re-export from the new modular structure
export { authResolvers } from './auth/index'; 