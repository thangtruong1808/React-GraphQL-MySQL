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

      // Set refresh token expiry - should be 4 minutes from NOW (when tokens are refreshed)
      // This ensures refresh token countdown shows 4 minutes from the moment tokens are refreshed
      const refreshTokenExpiry = Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS;
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
}
