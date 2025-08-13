import { TokenStorage } from './tokenStorage';
import { AuthValidation } from './authValidation';
import { ActivityManager } from './activityManager';
import { RefreshTokenManager } from './refreshTokenManager';
import { TokenValidation } from './tokenValidation';

/**
 * Enhanced Token Manager Class
 * Orchestrates all token management operations using modular components
 * Manages JWT tokens with automatic refresh and secure memory storage
 * 
 * EXECUTION FLOW FOR DIFFERENT SCENARIOS:
 * 
 * 1. FIRST TIME LOGIN (No tokens):
 *    - getTokens() → returns { accessToken: null, refreshToken: null }
 *    - storeTokens() → stores new tokens in memory
 *    - isAuthenticated() → returns true after storage
 * 
 * 2. EXPIRED ACCESS TOKEN + VALID REFRESH TOKEN:
 *    - getTokens() → returns { accessToken: "expired_token", refreshToken: null }
 *    - isTokenExpired() → returns true
 *    - updateAccessToken() → stores new access token
 *    - isAuthenticated() → returns true after update
 * 
 * 3. EXPIRED ACCESS TOKEN + EXPIRED REFRESH TOKEN:
 *    - getTokens() → returns { accessToken: "expired_token", refreshToken: null }
 *    - isTokenExpired() → returns true
 *    - clearTokens() → clears all memory data
 *    - isAuthenticated() → returns false
 */

/**
 * Token Manager Class
 * Main orchestrator for all token management operations
 */
export class TokenManager {
  /**
   * Store authentication tokens securely in memory only
   * @param accessToken - JWT access token (stored in memory only)
   * @param refreshToken - Random hex refresh token (stored in httpOnly cookie)
   * @param user - User data object (stored in memory only)
   * 
   * CALLED BY: AuthContext after successful login/refresh
   * SCENARIOS:
   * - First time login: Stores new tokens from server response
   * - Token refresh: Stores new tokens after successful refresh
   * - Re-login: Stores new tokens after successful login
   */
  static storeTokens(accessToken: string, refreshToken: string, user: any): void {
    TokenStorage.storeTokens(accessToken, refreshToken, user);
  }

  /**
   * Get stored access token from memory with validation
   * @returns Access token or null if not found/invalid
   * 
   * CALLED BY: apollo-client.ts authLink, AuthContext validateSession()
   * SCENARIOS:
   * - Valid token: Returns JWT token for authorization header
   * - Expired token: Returns token (expiry checked separately)
   * - No token: Returns null (first time login)
   * - Invalid token: Returns null (cleared tokens)
   */
  static getAccessToken(): string | null {
    return TokenStorage.getAccessToken();
  }

  /**
   * Get stored refresh token from httpOnly cookie
   * Note: This is handled server-side, client can't directly access httpOnly cookies
   * @returns null (refresh token is managed server-side)
   * 
   * CALLED BY: Legacy code (not used in current implementation)
   * SCENARIOS: All scenarios - refresh tokens handled by server via httpOnly cookies
   */
  static getRefreshToken(): string | null {
    return TokenStorage.getRefreshToken();
  }

  /**
   * Get stored user data with validation
   * @returns User data object or null if not found/invalid
   * 
   * CALLED BY: Components needing user information
   * SCENARIOS:
   * - Valid user: Returns user object for UI display
   * - No user: Returns null (not logged in)
   * - Invalid user: Returns null (cleared data)
   */
  static getUser(): any | null {
    return TokenStorage.getUser();
  }

  /**
   * Update access token only
   * Used when only access token is refreshed
   * 
   * CALLED BY: AuthContext after successful access token refresh
   * SCENARIOS: Access token refresh - updates access token with new expiry
   */
  static updateAccessToken(accessToken: string): void {
    TokenStorage.updateAccessToken(accessToken);
  }

  /**
   * Update user data only
   * Used when user data needs to be updated without affecting tokens
   * 
   * CALLED BY: AuthContext after successful token refresh
   * SCENARIOS: Token refresh - updates user data without affecting token timers
   */
  static updateUser(user: any): void {
    TokenStorage.updateUser(user);
  }

  /**
   * Update both access and refresh tokens
   * Used when tokens are refreshed from server
   * 
   * CALLED BY: AuthContext after successful token refresh
   * SCENARIOS: Token refresh - updates both tokens with new expiry
   */
  static updateTokens(accessToken: string, refreshToken: string, user?: any): void {
    TokenStorage.updateTokens(accessToken, refreshToken, user);
  }

  /**
   * Clear all authentication data securely
   * 
   * CALLED BY: AuthContext logout, apollo-client.ts errorLink
   * SCENARIOS:
   * - User logout: Clears all data after server logout
   * - Force logout: Clears all data due to admin action
   * - Token expiration: Clears all data when refresh fails
   * - Authentication errors: Clears all data on server errors
   */
  static clearTokens(): void {
    TokenStorage.clearTokens();
  }

  /**
   * Update user activity timestamp
   * Called when user performs any action
   * 
   * CALLED BY: AuthContext when user is active
   * SCENARIOS: All user interactions - updates last activity time
   */
  static updateActivity(): void {
    ActivityManager.updateActivity();
  }

  /**
   * Start refresh token expiry timer
   * Called when access token expires to start the 4-minute countdown
   * 
   * CALLED BY: AuthContext when access token expires
   * SCENARIOS: Access token expiry - starts refresh token countdown
   */
  static startRefreshTokenExpiryTimer(): void {
    RefreshTokenManager.startRefreshTokenExpiryTimer();
  }

  /**
   * Check if refresh token is expired (absolute timeout)
   * Uses the stored expiry timestamp in memory
   * 
   * @returns boolean - true if refresh token is expired
   * 
   * CALLED BY: AuthContext for session management
   * SCENARIOS: All scenarios - checks absolute session timeout
   */
  static isRefreshTokenExpired(): boolean {
    return RefreshTokenManager.isRefreshTokenExpired();
  }

  /**
   * Check if refresh token needs renewal (proactive renewal)
   * Returns true if refresh token will expire within the renewal threshold
   * 
   * @returns boolean - true if refresh token needs renewal
   * 
   * CALLED BY: AuthContext for proactive token renewal
   * SCENARIOS: All scenarios - checks if refresh token is about to expire
   */
  static isRefreshTokenNeedsRenewal(): boolean {
    return RefreshTokenManager.isRefreshTokenNeedsRenewal();
  }

  /**
   * Update refresh token expiry after renewal
   * Extends the refresh token expiry time when token is renewed with NEW tokens from server
   * IMPORTANT: This should ONLY be called when getting NEW refresh tokens from server
   * 
   * CALLED BY: AuthContext after successful token refresh with NEW tokens
   * SCENARIOS: Full session refresh with new refresh token from server
   */
  static updateRefreshTokenExpiry(): void {
    RefreshTokenManager.updateRefreshTokenExpiry();
  }

  /**
   * Clear refresh token expiry timer
   * ONLY used when user logs out or session is completely reset
   * 
   * CALLED BY: AuthContext during logout operations
   * SCENARIOS: User logout, forced logout, session termination
   */
  static clearRefreshTokenExpiry(): void {
    RefreshTokenManager.clearRefreshTokenExpiry();
  }

  /**
   * Get refresh token expiry timestamp
   * @returns Refresh token expiry timestamp or null if not set
   * 
   * CALLED BY: Debug components for displaying refresh token information
   * SCENARIOS: Debugging and monitoring refresh token expiry
   */
  static getRefreshTokenExpiry(): number | null {
    return RefreshTokenManager.getRefreshTokenExpiry();
  }

  /**
   * Get refresh token status information for debugging
   * @returns Object with refresh token status information
   * 
   * CALLED BY: Debug components for displaying comprehensive refresh token information
   * SCENARIOS: Debugging and monitoring refresh token status
   */
  static getRefreshTokenStatus(): {
    expiry: number | null;
    isExpired: boolean;
    needsRenewal: boolean;
    timeRemaining: number | null;
  } {
    return RefreshTokenManager.getRefreshTokenStatus();
  }

  /**
   * Get the timestamp of the last user activity
   * @returns Timestamp of last activity or null if no activity recorded
   * 
   * CALLED BY: ActivityDebugger for displaying activity information
   * SCENARIOS: Debugging and monitoring user activity
   */
  static getLastActivityTime(): number | null {
    return ActivityManager.getLastActivityTime();
  }

  /**
   * Check if user has been inactive for too long
   * @param inactivityThreshold - Time in milliseconds to consider user inactive
   * @returns Boolean indicating if user is inactive
   * 
   * CALLED BY: AuthContext for inactivity detection
   * SCENARIOS: All scenarios - checks user activity level
   */
  static isUserInactive(inactivityThreshold: number): boolean {
    return ActivityManager.isUserInactive(inactivityThreshold);
  }

  /**
   * Check if user is authenticated
   * @returns Boolean indicating if user is authenticated
   * 
   * CALLED BY: apollo-client.ts authLink, AuthContext validateSession()
   * SCENARIOS:
   * - Valid token: Returns true (user is authenticated)
   * - Expired token: Returns false (needs refresh)
   * - No token: Returns false (not authenticated)
   * - Invalid token: Returns false (not authenticated)
   */
  static isAuthenticated(): boolean {
    return AuthValidation.isAuthenticated();
  }

  /**
   * Check if access token is expired
   * @returns Boolean indicating if access token is expired
   * 
   * CALLED BY: isAuthenticated(), apollo-client.ts authLink
   * SCENARIOS:
   * - Valid token: Returns false (token still valid)
   * - Expired token: Returns true (needs refresh)
   * - No expiry data: Returns true (assume expired)
   */
  static isAccessTokenExpired(): boolean {
    return AuthValidation.isAccessTokenExpired();
  }

  /**
   * Check if activity-based token is expired
   * @returns Boolean indicating if activity-based token is expired
   * 
   * CALLED BY: AuthContext for activity-based validation
   * SCENARIOS:
   * - Active user: Returns false (token valid based on activity)
   * - Inactive user: Returns true (needs refresh or logout)
   * - No activity data: Returns true (assume expired)
   */
  static isActivityBasedTokenExpired(): boolean {
    return ActivityManager.isActivityBasedTokenExpired();
  }

  /**
   * Get activity-based token expiry timestamp
   * @returns Activity-based expiry timestamp or null if not available
   * 
   * CALLED BY: ActivityDebugger for displaying activity-based expiry information
   * SCENARIOS: Debugging and monitoring activity-based token expiry
   */
  static getActivityBasedTokenExpiry(): number | null {
    return ActivityManager.getActivityBasedTokenExpiry();
  }

  /**
   * Get token expiration timestamp from JWT
   * @param token - JWT token to decode
   * @returns Expiration timestamp or null if invalid
   * 
   * CALLED BY: storeTokens(), updateAccessToken(), updateTokens()
   * SCENARIOS: All scenarios - extracts expiry from JWT payload
   */
  static getTokenExpiration(token?: string): number | null {
    if (!token) return null;
    return TokenValidation.getTokenExpiration(token);
  }

  /**
   * Decode JWT token without verification
   * @param token - JWT token to decode
   * @returns Decoded payload or null if invalid
   * 
   * CALLED BY: getTokenExpiration()
   * SCENARIOS: All scenarios - extracts data from JWT payload
   */
  static decodeToken(token: string): any {
    return TokenValidation.decodeToken(token);
  }

  /**
   * Set transition state for "Continue to Work" operation
   * @param isTransitioning - Whether the transition is active
   * 
   * CALLED BY: AuthActions during refreshSession
   * SCENARIOS: "Continue to Work" button clicked
   */
  static setContinueToWorkTransition(isTransitioning: boolean): void {
    RefreshTokenManager.setContinueToWorkTransition(isTransitioning);
  }
}
