/**
 * Token Manager Module Index
 * Main entry point for all token management functionality
 * Provides both modular access and backward compatibility
 */

// Import TokenManager for legacy function exports
import { TokenManager } from './TokenManager';
import { TokenValidation } from './tokenValidation';

// Token Manager Exports
export { TokenManager } from './TokenManager';

// Token Storage Exports
export { TokenStorage } from './tokenStorage';

// Auth Validation Exports
export { AuthValidation } from './authValidation';

// Activity Manager Exports
export { ActivityManager } from './activityManager';

// Token Validation Exports
export { TokenValidation } from './tokenValidation';

// Memory Storage Exports
export { MemoryStorage } from './memoryStorage';

// Legacy function exports for backward compatibility
// These functions are now part of TokenManager class
export const getTokens = () => ({
  accessToken: TokenManager.getAccessToken(),
  refreshToken: null // Refresh tokens are handled server-side via httpOnly cookies
});

export const clearTokens = () => TokenManager.clearTokens();

export const saveTokens = (accessToken: string, refreshToken: string, user: any) => 
  TokenManager.storeTokens(accessToken, refreshToken, user);

export const isTokenExpired = (token: string) => TokenValidation.isTokenExpired(token);

export const isActivityBasedTokenExpired = () => TokenManager.isActivityBasedTokenExpired();

export const updateActivity = () => TokenManager.updateActivity();

