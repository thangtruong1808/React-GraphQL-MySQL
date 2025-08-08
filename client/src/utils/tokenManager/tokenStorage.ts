import { AUTH_CONFIG } from '../../constants';
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
      console.log(`${TOKEN_DEBUG.STORE_PREFIX} - ${TOKEN_DEBUG.STARTING_OPERATION}`);
      console.log(`${TOKEN_DEBUG.STORE_PREFIX} - Access token length:`, accessToken?.length);
      console.log(`${TOKEN_DEBUG.STORE_PREFIX} - Refresh token length:`, refreshToken?.length);

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
      console.log(`${TOKEN_DEBUG.STORE_PREFIX} - Access token stored in memory only`);
      
      // Store user data in memory only
      if (user && TokenValidation.isValidUserData(user)) {
        MemoryStorage.setUserData(user);
        console.log(`${TOKEN_DEBUG.STORE_PREFIX} - User data stored in memory only`);
      }

      // Store token expiry for quick validation
      const expiry = TokenValidation.getTokenExpiration(accessToken);
      if (expiry) {
        MemoryStorage.setTokenExpiry(expiry);
        console.log(`${TOKEN_DEBUG.STORE_PREFIX} - Token expiry stored in memory:`, new Date(expiry).toISOString());
      }

      // DO NOT set refresh token expiry at login - it will be set when access token expires
      MemoryStorage.setRefreshTokenExpiry(null);
      console.log(`${TOKEN_DEBUG.STORE_PREFIX} - Refresh token expiry not set yet (will be set when access token expires)`);

      // Initialize last activity timestamp
      const now = Date.now();
      MemoryStorage.setLastActivity(now);
      console.log(`${TOKEN_DEBUG.STORE_PREFIX} - Last activity timestamp initialized:`, new Date(now).toISOString());

      // Initialize activity-based token expiry (1 minute from now)
      const activityExpiry = now + AUTH_CONFIG.ACTIVITY_TOKEN_EXPIRY;
      MemoryStorage.setActivityBasedExpiry(activityExpiry);
      console.log(`${TOKEN_DEBUG.STORE_PREFIX} - Activity-based token expiry initialized:`, new Date(activityExpiry).toISOString());

      console.log(`${TOKEN_DEBUG.STORE_PREFIX} - ${TOKEN_SUCCESS_MESSAGES.TOKENS_STORED}`);
      
      // Verify storage
      console.log(`${TOKEN_DEBUG.STORE_PREFIX} - Verification - Stored token exists:`, !!MemoryStorage.getAccessToken());
      console.log(`${TOKEN_DEBUG.STORE_PREFIX} - Verification - Stored token length:`, MemoryStorage.getAccessToken()?.length);
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
      console.log(`${TOKEN_DEBUG.GET_PREFIX} - ${TOKEN_DEBUG.STARTING_OPERATION}`);
      
      const token = MemoryStorage.getAccessToken();
      console.log(`${TOKEN_DEBUG.GET_PREFIX} - Memory token exists:`, !!token);
      console.log(`${TOKEN_DEBUG.GET_PREFIX} - Token length:`, token?.length);
      console.log(`${TOKEN_DEBUG.GET_PREFIX} - Token preview:`, token ? `${token.substring(0, 20)}...` : 'null');
      
      if (!token) {
        console.log(`${TOKEN_DEBUG.GET_PREFIX} - No token found in memory`);
        return null;
      }
      
      const isValidJWT = TokenValidation.isValidJWTFormat(token);
      console.log(`${TOKEN_DEBUG.GET_PREFIX} - Is valid JWT format:`, isValidJWT);
      
      if (!isValidJWT) {
        console.log(`${TOKEN_DEBUG.GET_PREFIX} - Token validation failed - not a valid JWT`);
        return null;
      }
      
      console.log(`${TOKEN_DEBUG.GET_PREFIX} - ${TOKEN_SUCCESS_MESSAGES.TOKENS_RETRIEVED}`);
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
      console.log(`${TOKEN_DEBUG.UPDATE_PREFIX} - Updating access token...`);
      
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
        console.log(`${TOKEN_DEBUG.UPDATE_PREFIX} - Access token expiry updated:`, new Date(expiry).toISOString());
      }

      // Clear refresh token expiry timer since access token was refreshed
      // It will be set again when access token expires next time
      MemoryStorage.setRefreshTokenExpiry(null);
      console.log(`${TOKEN_DEBUG.UPDATE_PREFIX} - Refresh token expiry timer cleared (access token refreshed)`);
      
      console.log(`${TOKEN_DEBUG.UPDATE_PREFIX} - ${TOKEN_SUCCESS_MESSAGES.TOKENS_UPDATED}`);
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
      console.log(`${TOKEN_DEBUG.UPDATE_PREFIX} - Updating both access and refresh tokens...`);
      
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
        console.log(`${TOKEN_DEBUG.UPDATE_PREFIX} - User data updated`);
      }
      
      // Update token expiry
      const expiry = TokenValidation.getTokenExpiration(accessToken);
      if (expiry) {
        MemoryStorage.setTokenExpiry(expiry);
        console.log(`${TOKEN_DEBUG.UPDATE_PREFIX} - Access token expiry updated:`, new Date(expiry).toISOString());
      }

      // Clear refresh token expiry timer since tokens were refreshed
      // It will be set again when access token expires next time
      MemoryStorage.setRefreshTokenExpiry(null);
      console.log(`${TOKEN_DEBUG.UPDATE_PREFIX} - Refresh token expiry timer cleared (tokens refreshed)`);
      
      console.log(`${TOKEN_DEBUG.UPDATE_PREFIX} - ${TOKEN_SUCCESS_MESSAGES.TOKENS_UPDATED}`);
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
      console.log(`${TOKEN_DEBUG.CLEAR_PREFIX} - ${TOKEN_DEBUG.STARTING_OPERATION}`);
      
      // Clear memory storage
      MemoryStorage.clearAll();
      
      console.log(`${TOKEN_DEBUG.CLEAR_PREFIX} - ${TOKEN_SUCCESS_MESSAGES.TOKENS_CLEARED}`);
    } catch (error) {
      console.error(`${TOKEN_DEBUG.CLEAR_PREFIX} - ${TOKEN_DEBUG.OPERATION_FAILED}:`, error);
    }
  }
}
