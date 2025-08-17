import { AUTH_CONFIG, DEBUG_CONFIG } from '../../constants';
import { MemoryStorage } from './memoryStorage';
import { TokenValidation } from './tokenValidation';
import { TOKEN_DEBUG, TOKEN_ERROR_MESSAGES, TOKEN_SUCCESS_MESSAGES } from './constants';

/**
 * Token Storage Module
 * Handles storing, retrieving, and updating authentication tokens
 * Provides secure memory-based storage with validation
 */

/**
 * Token Storage Class
 * Manages token storage operations with validation and error handling
 */
export class TokenStorage {
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
    try {
      // Debug logging disabled for better user experience

      // Validate access token format (should be JWT)
      if (!TokenValidation.isValidJWTFormat(accessToken)) {
        console.error(`${TOKEN_DEBUG.STORE_PREFIX} - Invalid access token format:`, accessToken ? `${accessToken.substring(0, 20)}...` : 'null');
        throw new Error(TOKEN_ERROR_MESSAGES.INVALID_JWT_FORMAT);
      }

      // Validate refresh token format (should be hex string)
      if (!TokenValidation.isValidHexFormat(refreshToken)) {
        console.error(`${TOKEN_DEBUG.STORE_PREFIX} - Invalid refresh token format:`, refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null');
        throw new Error(TOKEN_ERROR_MESSAGES.INVALID_HEX_FORMAT);
      }

      // Store access token in memory only (XSS protection)
      MemoryStorage.setAccessToken(accessToken);
      
      // Store user data in memory only
      if (user && TokenValidation.isValidUserData(user)) {
        MemoryStorage.setUserData(user);
      }

      // Store token expiry for quick validation
      const expiry = TokenValidation.getTokenExpiration(accessToken);
      if (expiry) {
        MemoryStorage.setTokenExpiry(expiry);
      }

      // DO NOT set refresh token expiry at login - it will be set when access token expires
      MemoryStorage.setRefreshTokenExpiry(null);

      // Initialize last activity timestamp
      const now = Date.now();
      MemoryStorage.setLastActivity(now);

      // Initialize activity-based token expiry (1 minute from now)
      const activityExpiry = now + AUTH_CONFIG.ACTIVITY_TOKEN_EXPIRY;
      MemoryStorage.setActivityBasedExpiry(activityExpiry);
    } catch (error) {
      console.error(`${TOKEN_DEBUG.STORE_PREFIX} - ${TOKEN_DEBUG.OPERATION_FAILED}:`, error);
      this.clearTokens(); // Clear any partial data
      throw error;
    }
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
    try {
      // Debug logging disabled for better user experience
      
      const token = MemoryStorage.getAccessToken();
      
      if (!token) {
        return null;
      }
      
      const isValidJWT = TokenValidation.isValidJWTFormat(token);
      
      if (!isValidJWT) {
        return null;
      }
      
      return token;
    } catch (error) {
      console.error(`${TOKEN_DEBUG.GET_PREFIX} - ${TOKEN_DEBUG.OPERATION_FAILED}:`, error);
      return null;
    }
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
    // Refresh tokens are now stored in httpOnly cookies and managed server-side
    // Client cannot directly access httpOnly cookies for security
    return null;
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
    try {
      const userData = MemoryStorage.getUserData();
      if (!userData) return null;
      
      // Basic validation of user object structure
      if (!TokenValidation.isValidUserData(userData)) {
        return null;
      }
      return userData;
    } catch (error) {
      console.error('❌ Error getting user data:', error);
      return null;
    }
  }

  /**
   * Update access token only
   * Used when only access token is refreshed
   * 
   * CALLED BY: AuthContext after successful access token refresh
   * SCENARIOS: Access token refresh - updates access token with new expiry
   */
  static updateAccessToken(accessToken: string): void {
    try {
      // Debug logging disabled for better user experience
      
      // Validate access token format
      if (!TokenValidation.isValidJWTFormat(accessToken)) {
        console.error(`${TOKEN_DEBUG.UPDATE_PREFIX} - Invalid access token format`);
        throw new Error(TOKEN_ERROR_MESSAGES.INVALID_JWT_FORMAT);
      }

      // Update access token
      MemoryStorage.setAccessToken(accessToken);
      
      // Update token expiry
      const expiry = TokenValidation.getTokenExpiration(accessToken);
      if (expiry) {
        MemoryStorage.setTokenExpiry(expiry);
      }

      // DO NOT clear refresh token expiry timer when only access token is refreshed
      // This preserves the refresh token countdown for "Continue to Work" scenarios
    } catch (error) {
      console.error(`${TOKEN_DEBUG.UPDATE_PREFIX} - ${TOKEN_DEBUG.OPERATION_FAILED}:`, error);
    }
  }

  /**
   * Update user data only
   * Used when user data needs to be updated without affecting tokens
   * 
   * CALLED BY: AuthContext after successful token refresh
   * SCENARIOS: Token refresh - updates user data without affecting token timers
   */
  static updateUser(user: any): void {
    try {
      // Debug logging disabled for better user experience
      
      // Validate and update user data
      if (user && TokenValidation.isValidUserData(user)) {
        MemoryStorage.setUserData(user);
      }
    } catch (error) {
      console.error(`${TOKEN_DEBUG.UPDATE_PREFIX} - ${TOKEN_DEBUG.OPERATION_FAILED}:`, error);
    }
  }

  /**
   * Update both access and refresh tokens
   * Used when tokens are refreshed from server
   * 
   * CALLED BY: AuthContext after successful token refresh
   * SCENARIOS: Token refresh - updates both tokens with new expiry
   */
  static updateTokens(accessToken: string, refreshToken: string, user?: any): void {
    try {
      // Debug logging disabled for better user experience
      
      // Validate access token format
      if (!TokenValidation.isValidJWTFormat(accessToken)) {
        console.error(`${TOKEN_DEBUG.UPDATE_PREFIX} - Invalid access token format`);
        throw new Error(TOKEN_ERROR_MESSAGES.INVALID_JWT_FORMAT);
      }

      // Validate refresh token format
      if (!TokenValidation.isValidHexFormat(refreshToken)) {
        console.error(`${TOKEN_DEBUG.UPDATE_PREFIX} - Invalid refresh token format`);
        throw new Error(TOKEN_ERROR_MESSAGES.INVALID_HEX_FORMAT);
      }

      // Update access token
      MemoryStorage.setAccessToken(accessToken);
      
      // Update user data if provided
      if (user && TokenValidation.isValidUserData(user)) {
        MemoryStorage.setUserData(user);
      }
      
      // Update token expiry
      const expiry = TokenValidation.getTokenExpiration(accessToken);
      if (expiry) {
        MemoryStorage.setTokenExpiry(expiry);
      }

      // SIMPLE FIX: Reset all timers to original 1-minute values
      const now = Date.now();
      
      // Reset activity-based token expiry to 1 minute from now
      const activityExpiry = now + AUTH_CONFIG.ACTIVITY_TOKEN_EXPIRY;
      MemoryStorage.setActivityBasedExpiry(activityExpiry);
      
      // Reset last activity timestamp
      MemoryStorage.setLastActivity(now);

      // Reset refresh token expiry to 1 minute from now
      const refreshTokenExpiry = now + AUTH_CONFIG.MODAL_COUNTDOWN_DURATION;
      MemoryStorage.setRefreshTokenExpiry(refreshTokenExpiry);
    } catch (error) {
      console.error(`${TOKEN_DEBUG.UPDATE_PREFIX} - ${TOKEN_DEBUG.OPERATION_FAILED}:`, error);
    }
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
    try {
      // Debug logging disabled for better user experience
      
      // Clear memory storage
      MemoryStorage.clearAll();
    } catch (error) {
      console.error(`${TOKEN_DEBUG.CLEAR_PREFIX} - ${TOKEN_DEBUG.OPERATION_FAILED}:`, error);
    }
  }

  /**
   * Store token creation timestamp for dynamic buffer calculation
   * @param timestamp - Token creation timestamp in milliseconds
   * 
   * CALLED BY: AuthActions after successful login/refresh
   * SCENARIOS: New token creation for dynamic buffer calculation
   */
  static setTokenCreationTime(timestamp: number | null): void {
    MemoryStorage.setTokenCreationTime(timestamp);
  }

  /**
   * Get token creation timestamp for dynamic buffer calculation
   * @returns Token creation timestamp or null if not available
   * 
   * CALLED BY: Dynamic buffer calculation
   * SCENARIOS: "Continue to Work" functionality
   */
  static getTokenCreationTime(): number | null {
    return MemoryStorage.getTokenCreationTime();
  }

  /**
   * Calculate dynamic buffer time based on token creation time
   * Buffer = Current time - Token creation time
   * @returns Buffer time in milliseconds or null if creation time not available
   * 
   * CALLED BY: Server-side refresh operation for cookie expiry
   * SCENARIOS: "Continue to Work" functionality with dynamic buffer
   */
  static calculateDynamicBuffer(): number | null {
    return MemoryStorage.calculateDynamicBuffer();
  }

  /**
   * Clear token creation time specifically
   * Used when a complete logout is performed and new tokens will be created
   * 
   * CALLED BY: AuthActions during complete logout
   * SCENARIOS: User logout, session termination
   */
  static clearTokenCreationTime(): void {
    MemoryStorage.clearTokenCreationTime();
  }

  /**
   * Store logout transition state for logout operation
   * @param isTransitioning - Whether the logout transition is active
   * 
   * CALLED BY: AuthActions during logout from modal
   * SCENARIOS: "Logout" button clicked from session expiry modal
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
    return MemoryStorage.getSessionExpiryModalShowing();
  }

  /**
   * Set session expiry modal state
   * @param isShowing - Whether the session expiry modal is visible
   * 
   * CALLED BY: AuthContext when modal state changes
   * SCENARIOS: Modal show/hide state management
   */
  static setSessionExpiryModalShowing(isShowing: boolean): void {
    MemoryStorage.setSessionExpiryModalShowing(isShowing);
  }

  // NEW: Refresh operation state management
  static setRefreshOperationInProgress(isInProgress: boolean): void {
    MemoryStorage.setRefreshOperationInProgress(isInProgress);
  }
  static getRefreshOperationInProgress(): boolean {
    return MemoryStorage.getRefreshOperationInProgress();
  }
}
