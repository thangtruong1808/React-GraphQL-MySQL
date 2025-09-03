import { TokenStorage } from './tokenStorage';
import { AuthValidation } from './authValidation';
import { ActivityManager } from './activityManager';
import { RefreshTokenManager } from './refreshTokenManager';
import { TokenValidation } from './tokenValidation';

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
   */
  static storeTokens(accessToken: string, refreshToken: string, user: any): void {
    TokenStorage.storeTokens(accessToken, refreshToken, user);
  }

  /**
   * Get stored access token from memory with validation
   * @returns Access token or null if not found/invalid
   */
  static getAccessToken(): string | null {
    return TokenStorage.getAccessToken();
  }

  /**
   * Get stored refresh token from httpOnly cookie
   * @returns null (refresh token is managed server-side)
   */
  static getRefreshToken(): string | null {
    return TokenStorage.getRefreshToken();
  }

  /**
   * Update access token only
   * Used when only access token is refreshed
   */
  static updateAccessToken(accessToken: string): void {
    TokenStorage.updateAccessToken(accessToken);
  }

  /**
   * Clears all data after server logout
   * Used for secure cleanup during logout or errors
   */
  static clearTokens(): void {
    TokenStorage.clearTokens();
  }

  /**
   * Update user activity timestamp
   * CALLED BY: AuthContext when user is active
   */
  static async updateActivity(): Promise<void> {
    await ActivityManager.updateActivity();
  }

  /**
   * Start refresh token expiry timer
   * SCENARIOS: Access token expiry - starts refresh token countdown
   */
  static async startRefreshTokenExpiryTimer(): Promise<void> {
    await RefreshTokenManager.startRefreshTokenExpiryTimer();
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
  static async isRefreshTokenExpired(): Promise<boolean> {
    return await RefreshTokenManager.isRefreshTokenExpired();
  }


  /**
   * Update refresh token expiry after renewal
   * Extends the refresh token expiry time when token is renewed with NEW tokens from server
   
   */
  static async updateRefreshTokenExpiry(): Promise<void> {
    await RefreshTokenManager.updateRefreshTokenExpiry();
  }

  /**
   * Clear refresh token expiry timer (async)
   * ONLY used when user logs out or session is completely reset
   */
  static async clearRefreshTokenExpiry(): Promise<void> {
    await RefreshTokenManager.clearRefreshTokenExpiry();
  }

  /**
   * Get refresh token expiry timestamp
   * @returns Refresh token expiry timestamp or null if not set
   */
  static async getRefreshTokenExpiry(): Promise<number | null> {
    return await RefreshTokenManager.getRefreshTokenExpiry();
  }

  /**
   * Get refresh token status information for debugging (async)
   * @returns Object with refresh token status information
   */
  static async getRefreshTokenStatus(): Promise<{
    expiry: number | null;
    isExpired: boolean;
    timeRemaining: number | null;
    isContinueToWorkTransition: boolean;
    isLogoutTransition: boolean;
  }> {
    return await RefreshTokenManager.getRefreshTokenStatus();
  }

  /**
   * Get the timestamp of the last user activity
   * @returns Timestamp of last activity or null if no activity recorded
   */
  static getLastActivityTime(): number | null {
    return ActivityManager.getLastActivityTime();
  }

  /**
   * Check if user has been inactive for too long
   * @param inactivityThreshold - Time in milliseconds to consider user inactive
   * @returns Boolean indicating if user is inactive
   */
  static isUserInactive(inactivityThreshold: number): boolean {
    return ActivityManager.isUserInactive(inactivityThreshold);
  }

  /**
   * Check if activity-based token is expired
   * @returns Boolean indicating if activity-based token is expired
   */
  static isActivityBasedTokenExpired(): boolean {
    return ActivityManager.isActivityBasedTokenExpired();
  }

  /**
   * Get activity-based token expiry timestamp
   * @returns Activity-based expiry timestamp or null if not available
   */
  static getActivityBasedTokenExpiry(): number | null {
    return ActivityManager.getActivityBasedTokenExpiry();
  }

  /**
   * Get token expiration timestamp from JWT
   * @param token - JWT token to decode
   * @returns Expiration timestamp or null if invalid
   */
  static getTokenExpiration(token?: string): number | null {
    if (!token) return null;
    return TokenValidation.getTokenExpiration(token);
  }

  /**
   * Decode JWT token without verification
   * @param token - JWT token to decode
   * @returns Decoded payload or null if invalid
   */
  static decodeToken(token: string): any {
    return TokenValidation.decodeToken(token);
  }

  /**
   * Set transition state for "Continue to Work" operation
   * @param isTransitioning - Whether the transition is active
   */
  static setContinueToWorkTransition(isTransitioning: boolean): void {
    RefreshTokenManager.setContinueToWorkTransition(isTransitioning);
  }

  /**
   * Get transition state for "Continue to Work" operation
   * @returns Whether the transition is active
   */
  static getContinueToWorkTransition(): boolean {
    return RefreshTokenManager.getContinueToWorkTransition();
  }

  /**
   * Store token creation timestamp for dynamic buffer calculation
   * @param timestamp - Token creation timestamp in milliseconds
   */
  static setTokenCreationTime(timestamp: number | null): void {
    TokenStorage.setTokenCreationTime(timestamp);
  }

  /**
   * Get token creation timestamp for dynamic buffer calculation
   * @returns Token creation timestamp or null if not available
   */
  static getTokenCreationTime(): number | null {
    return TokenStorage.getTokenCreationTime();
  }

  /**
   * Calculate dynamic buffer time based on token creation time
   * @returns Buffer time in milliseconds or null if creation time not available
   */
  static calculateDynamicBuffer(): number | null {
    return TokenStorage.calculateDynamicBuffer();
  }

  /**
   * Clear token creation time specifically
   * Used when a complete logout is performed and new tokens will be created
   */
  static clearTokenCreationTime(): void {
    TokenStorage.clearTokenCreationTime();
  }

  /**
   * Set logout transition state for logout operation
   * @param isTransitioning - Whether the logout transition is active
   */
  static setLogoutTransition(isTransitioning: boolean): void {
    TokenStorage.setLogoutTransition(isTransitioning);
  }

  /**
   * Get logout transition state
   * @returns Boolean indicating if logout transition is active
   */
  static getLogoutTransition(): boolean {
    return TokenStorage.getLogoutTransition();
  }

  /**
   * Check if session expiry modal is showing
   * @returns Boolean indicating if session expiry modal is visible
   */
  static isSessionExpiryModalShowing(): boolean {
    return TokenStorage.isSessionExpiryModalShowing();
  }

  /**
   * Set session expiry modal state
   * @param isShowing - Whether the session expiry modal is visible
   */
  static setSessionExpiryModalShowing(isShowing: boolean): void {
    TokenStorage.setSessionExpiryModalShowing(isShowing);
  }

  // NEW: Refresh operation state management
  static setRefreshOperationInProgress(isInProgress: boolean): void {
    TokenStorage.setRefreshOperationInProgress(isInProgress);
  }
  static getRefreshOperationInProgress(): boolean {
    return TokenStorage.getRefreshOperationInProgress();
  }
}
