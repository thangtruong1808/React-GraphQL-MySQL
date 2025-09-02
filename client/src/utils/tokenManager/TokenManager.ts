import { TokenStorage } from './tokenStorage';
import { AuthValidation } from './authValidation';
import { ActivityManager } from './activityManager';
import { TokenValidation } from './tokenValidation';
import { MemoryStorage } from './memoryStorage';

/**
 * Simplified Token Manager Class
 * Manages access tokens and transition states
 * Server handles refresh tokens via httpOnly cookies automatically
 */
export class TokenManager {
  /**
   * Store authentication tokens securely in memory only
   * @param accessToken - JWT access token (stored in memory only)
   * @param refreshToken - Random hex refresh token (stored in httpOnly cookie)
   * @param user - User data object (stored in memory only)
   * 
   * CALLED BY: AuthContext after successful login/refresh
   * SCENARIOS: First time login, token refresh, re-login
   */
  static storeTokens(accessToken: string, refreshToken: string, user: any): void {
    TokenStorage.storeTokens(accessToken, refreshToken, user);
  }

  /**
   * Get stored access token from memory with validation
   * @returns Access token or null if not found/invalid
   * 
   * CALLED BY: apollo-client.ts authLink, AuthContext validateSession()
   * SCENARIOS: Valid token, expired token, no token, invalid token
   */
  static getAccessToken(): string | null {
    return TokenStorage.getAccessToken();
  }

  /**
   * Update access token only
   * Used when only access token is refreshed
   * 
   * CALLED BY: AuthContext after successful access token refresh
   * SCENARIOS: Access token refresh with new expiry
   */
  static updateAccessToken(accessToken: string): void {
    TokenStorage.updateAccessToken(accessToken);
  }

  /**
   * Clear all authentication data securely
   * 
   * CALLED BY: AuthContext logout, apollo-client.ts errorLink
   * SCENARIOS: User logout, force logout, token expiration, authentication errors
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
  static async updateActivity(): Promise<void> {
    await ActivityManager.updateActivity();
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
   * SCENARIOS: Valid token, expired token, no token, invalid token
   */
  static isAuthenticated(): boolean {
    return AuthValidation.isAuthenticated();
  }

  /**
   * Check if activity-based token is expired
   * @returns Boolean indicating if activity-based token is expired
   * 
   * CALLED BY: AuthContext for activity-based validation
   * SCENARIOS: Active user, inactive user, no activity data
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
   * CALLED BY: AuthActions during refreshUserSession
   * SCENARIOS: "Continue to Work" button clicked
   */
  static setContinueToWorkTransition(isTransitioning: boolean): void {
    MemoryStorage.setContinueToWorkTransition(isTransitioning);
  }

  /**
   * Get transition state for "Continue to Work" operation
   * @returns Whether the transition is active
   * 
   * CALLED BY: SessionManager to avoid interference during transitions
   * SCENARIOS: Session checking during "Continue to Work" operation
   */
  static getContinueToWorkTransition(): boolean {
    return MemoryStorage.getContinueToWorkTransition();
  }

  /**
   * Set logout transition state for logout operation
   * @param isTransitioning - Whether the logout transition is active
   * 
   * CALLED BY: AuthActions during logout
   * SCENARIOS: Logout button clicked
   */
  static setLogoutTransition(isTransitioning: boolean): void {
    MemoryStorage.setLogoutTransition(isTransitioning);
  }

  /**
   * Get logout transition state
   * @returns Boolean indicating if logout transition is active
   * 
   * CALLED BY: TimerCalculator for transition state detection
   * SCENARIOS: Logout transition state display
   */
  static getLogoutTransition(): boolean {
    return MemoryStorage.getLogoutTransition();
  }

  /**
   * Check if session expiry modal is showing
   * @returns Boolean indicating if session expiry modal is visible
   * 
   * CALLED BY: Activity tracker to prevent activity updates when modal is showing
   * SCENARIOS: Preventing activity interference during modal display
   */
  static isSessionExpiryModalShowing(): boolean {
    return TokenStorage.isSessionExpiryModalShowing();
  }

  /**
   * Set session expiry modal state
   * @param isShowing - Whether the session expiry modal is visible
   * 
   * CALLED BY: AuthContext when modal state changes
   * SCENARIOS: Modal show/hide state management
   */
  static setSessionExpiryModalShowing(isShowing: boolean): void {
    TokenStorage.setSessionExpiryModalShowing(isShowing);
  }

  /**
   * Set refresh operation state to prevent auto-logout interference
   * @param isInProgress - Whether refresh operation is in progress
   * 
   * CALLED BY: AuthActions during refresh operations
   * SCENARIOS: Prevent auto-logout during refresh
   */
  static setRefreshOperationInProgress(isInProgress: boolean): void {
    TokenStorage.setRefreshOperationInProgress(isInProgress);
  }

  /**
   * Get refresh operation state
   * @returns Boolean indicating if refresh operation is in progress
   * 
   * CALLED BY: SessionManager to check refresh state
   * SCENARIOS: Prevent session checks during refresh operations
   */
  static getRefreshOperationInProgress(): boolean {
    return TokenStorage.getRefreshOperationInProgress();
  }
}
