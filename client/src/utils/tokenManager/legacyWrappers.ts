import { TokenManager } from './TokenManager';

/**
 * Legacy Wrapper Functions
 * Provides backward compatibility with existing code
 * These functions maintain the same interface as the original tokenManager.ts
 */

/**
 * Save tokens to memory storage
 * @param accessToken - JWT access token
 * @param refreshToken - Hex refresh token
 * 
 * CALLED BY: AuthContext after successful login/refresh
 * SCENARIOS: All scenarios - stores tokens in memory
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  TokenManager.storeTokens(accessToken, refreshToken, null);
  
  // Store token creation time for dynamic buffer calculation
  // This enables the "Continue to Work" functionality with dynamic buffer based on session duration
  TokenManager.setTokenCreationTime(Date.now());
};

/**
 * Get tokens from memory storage
 * @returns Object with accessToken and refreshToken
 * 
 * CALLED BY: apollo-client.ts authLink, AuthContext validateSession()
 * SCENARIOS: All scenarios - retrieves tokens for validation
 */
export const getTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  return {
    accessToken: TokenManager.getAccessToken(),
    refreshToken: TokenManager.getRefreshToken(),
  };
};

/**
 * Clear all tokens from memory storage
 * 
 * CALLED BY: AuthContext logout, apollo-client.ts errorLink
 * SCENARIOS: Logout, authentication errors, token expiration
 */
export const clearTokens = (): void => {
  TokenManager.clearTokens();
};

/**
 * Check if token is expired
 * @param token - JWT token to check
 * @returns Boolean indicating if token is expired
 * 
 * CALLED BY: apollo-client.ts authLink, AuthContext validateSession()
 * SCENARIOS: All scenarios - validates token expiry
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = TokenManager.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp <= now;
  } catch (error) {
    return true; // Assume expired on error
  }
};

/**
 * Update user activity timestamp
 * @returns void
 * 
 * CALLED BY: AuthContext when user is active
 * SCENARIOS: All user interactions - updates last activity time
 */
export const updateActivity = async (): Promise<void> => {
  await TokenManager.updateActivity();
};

/**
 * Check if refresh token is expired (absolute session timeout) - async
 * @returns Boolean indicating if refresh token is expired
 * 
 * CALLED BY: SessionManager for session management
 * SCENARIOS: All scenarios - checks absolute session timeout
 */
export const isRefreshTokenExpired = async (): Promise<boolean> => {
  return await TokenManager.isRefreshTokenExpired();
};

/**
 * Check if activity-based token is expired
 * @returns Boolean indicating if activity-based token is expired
 * 
 * CALLED BY: apollo-client.ts authLink, AuthContext for activity-based validation
 * SCENARIOS: All scenarios - checks activity-based token expiry
 */
export const isActivityBasedTokenExpired = (): boolean => {
  return TokenManager.isActivityBasedTokenExpired();
};
