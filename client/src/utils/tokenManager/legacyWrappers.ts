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
export const updateActivity = (): void => {
  TokenManager.updateActivity();
};

/**
 * Check if refresh token is expired (absolute session timeout)
 * @returns Boolean indicating if refresh token is expired
 * 
 * CALLED BY: AuthContext for session management
 * SCENARIOS: All scenarios - checks absolute session timeout
 */
export const isRefreshTokenExpired = (): boolean => {
  return TokenManager.isRefreshTokenExpired();
};

/**
 * Check if refresh token needs renewal (proactive renewal)
 * @returns Boolean indicating if refresh token needs renewal
 * 
 * CALLED BY: AuthContext for proactive token renewal
 * SCENARIOS: All scenarios - checks if refresh token is about to expire
 */
export const isRefreshTokenNeedsRenewal = (): boolean => {
  return TokenManager.isRefreshTokenNeedsRenewal();
};

/**
 * Update refresh token expiry after renewal
 * @returns void
 * 
 * CALLED BY: AuthContext after successful token refresh
 * SCENARIOS: All scenarios - updates refresh token expiry
 */
export const updateRefreshTokenExpiry = (): void => {
  TokenManager.updateRefreshTokenExpiry();
};

/**
 * Check if user has been inactive for too long
 * @param inactivityThreshold - Time in milliseconds to consider user inactive
 * @returns Boolean indicating if user is inactive
 * 
 * CALLED BY: AuthContext for inactivity detection
 * SCENARIOS: All scenarios - checks user activity level
 */
export const isUserInactive = (inactivityThreshold: number): boolean => {
  return TokenManager.isUserInactive(inactivityThreshold);
};

/**
 * Get the timestamp of the last user activity
 * @returns Timestamp of last activity or null if no activity recorded
 * 
 * CALLED BY: ActivityDebugger for displaying activity information
 * SCENARIOS: Debugging and monitoring user activity
 */
export const getLastActivityTime = (): number | null => {
  return TokenManager.getLastActivityTime();
};

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user is authenticated
 * 
 * CALLED BY: apollo-client.ts authLink, AuthContext validateSession()
 * SCENARIOS: All scenarios - checks authentication status
 */
export const isAuthenticated = (): boolean => {
  return TokenManager.isAuthenticated();
};

/**
 * Check if activity-based token is expired
 * @returns Boolean indicating if activity-based token is expired
 * 
 * CALLED BY: AuthContext for activity-based validation
 * SCENARIOS: All scenarios - checks activity-based token expiry
 */
export const isActivityBasedTokenExpired = (): boolean => {
  return TokenManager.isActivityBasedTokenExpired();
};

/**
 * Get activity-based token expiry timestamp
 * @returns Activity-based expiry timestamp or null if not available
 * 
 * CALLED BY: ActivityDebugger for displaying activity-based expiry information
 * SCENARIOS: Debugging and monitoring activity-based token expiry
 */
export const getActivityBasedTokenExpiry = (): number | null => {
  return TokenManager.getActivityBasedTokenExpiry();
};
