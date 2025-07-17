import { AUTH_CONFIG, STORAGE_KEYS } from '../constants';

/**
 * Enhanced Token Manager with Memory-Only Storage for XSS Protection
 * Handles JWT access and refresh token management with secure memory-based storage
 * Implements secure storage practices and token validation
 */

// Memory-only storage for access tokens (XSS protection)
let memoryAccessToken: string | null = null;
let memoryUserData: any | null = null;
let memoryTokenExpiry: number | null = null;
let memoryRefreshAttempts: number = 0;

/**
 * Enhanced Token Manager Class for Memory-Only Storage
 * Manages JWT tokens with automatic refresh and secure memory storage
 */
class TokenManager {
  /**
   * Store authentication tokens securely in memory only
   * @param accessToken - JWT access token (stored in memory only)
   * @param refreshToken - Random hex refresh token (stored in httpOnly cookie)
   * @param user - User data object (stored in memory only)
   */
  static storeTokens(accessToken: string, refreshToken: string, user: any): void {
    try {
      console.log('🔐 STORE TOKENS - Starting secure memory storage...');
      console.log('🔐 STORE TOKENS - Access token length:', accessToken?.length);
      console.log('🔐 STORE TOKENS - Refresh token length:', refreshToken?.length);

      // Validate access token format (should be JWT)
      if (!this.isValidJWTFormat(accessToken)) {
        console.error('❌ STORE TOKENS - Invalid access token format:', accessToken ? `${accessToken.substring(0, 20)}...` : 'null');
        throw new Error('Invalid access token format');
      }

      // Validate refresh token format (should be hex string)
      if (!this.isValidHexFormat(refreshToken)) {
        console.error('❌ STORE TOKENS - Invalid refresh token format:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null');
        throw new Error('Invalid refresh token format');
      }

      // Store access token in memory only (XSS protection)
      memoryAccessToken = accessToken;
      console.log('✅ STORE TOKENS - Access token stored in memory only');
      
      // Store user data in memory only
      if (user) {
        memoryUserData = user;
        console.log('✅ STORE TOKENS - User data stored in memory only');
      }

      // Store token expiry for quick validation
      const expiry = this.getTokenExpiration(accessToken);
      if (expiry) {
        memoryTokenExpiry = expiry;
        console.log('✅ STORE TOKENS - Token expiry stored in memory:', new Date(expiry).toISOString());
      }

      // Reset refresh attempts on successful login
      this.resetRefreshAttempts();
      
      console.log('✅ STORE TOKENS - All tokens stored securely in memory');
      
      // Verify storage
      console.log('🔍 STORE TOKENS - Verification - Stored token exists:', !!memoryAccessToken);
      console.log('🔍 STORE TOKENS - Verification - Stored token length:', memoryAccessToken?.length);
    } catch (error) {
      console.error('❌ STORE TOKENS - Error storing tokens:', error);
      this.clearTokens(); // Clear any partial data
      throw error;
    }
  }

  /**
   * Get stored access token from memory with validation
   * @returns Access token or null if not found/invalid
   */
  static getAccessToken(): string | null {
    try {
      console.log('🔍 GET ACCESS TOKEN - Starting secure token retrieval...');
      
      console.log('🔍 GET ACCESS TOKEN - Memory token exists:', !!memoryAccessToken);
      console.log('🔍 GET ACCESS TOKEN - Token length:', memoryAccessToken?.length);
      console.log('🔍 GET ACCESS TOKEN - Token preview:', memoryAccessToken ? `${memoryAccessToken.substring(0, 20)}...` : 'null');
      
      if (!memoryAccessToken) {
        console.log('❌ GET ACCESS TOKEN - No token found in memory');
        return null;
      }
      
      const isValidJWT = this.isValidJWTFormat(memoryAccessToken);
      console.log('🔍 GET ACCESS TOKEN - Is valid JWT format:', isValidJWT);
      
      if (!isValidJWT) {
        console.log('❌ GET ACCESS TOKEN - Token validation failed - not a valid JWT');
        return null;
      }
      
      console.log('✅ GET ACCESS TOKEN - Token retrieved securely from memory');
      return memoryAccessToken;
    } catch (error) {
      console.error('❌ GET ACCESS TOKEN - Error getting access token:', error);
      return null;
    }
  }

  /**
   * Get stored refresh token from httpOnly cookie
   * Note: This is handled server-side, client can't directly access httpOnly cookies
   * @returns null (refresh token is managed server-side)
   */
  static getRefreshToken(): string | null {
    // Refresh tokens are now stored in httpOnly cookies and managed server-side
    // Client cannot directly access httpOnly cookies for security
    return null;
  }

  /**
   * Get stored user data with validation
   * @returns User data object or null if not found/invalid
   */
  static getUser(): any | null {
    try {
      if (!memoryUserData) return null;
      
      // Basic validation of user object structure
      if (!memoryUserData || typeof memoryUserData !== 'object' || !memoryUserData.id) {
        return null;
      }
      return memoryUserData;
    } catch (error) {
      console.error('❌ Error getting user data:', error);
      return null;
    }
  }

  /**
   * Update access token securely (for token refresh)
   * @param accessToken - New access token
   */
  static updateAccessToken(accessToken: string): void {
    try {
      if (!this.isValidJWTFormat(accessToken)) {
        throw new Error('Invalid access token format');
      }

      memoryAccessToken = accessToken;
      
      // Update expiry
      const expiry = this.getTokenExpiration(accessToken);
      if (expiry) {
        memoryTokenExpiry = expiry;
      }

      console.log('✅ Access token updated securely in memory');
    } catch (error) {
      console.error('❌ Error updating access token:', error);
      throw error;
    }
  }

  /**
   * Update both tokens securely (for token rotation)
   * @param accessToken - New access token
   * @param refreshToken - New refresh token (handled server-side)
   */
  static updateTokens(accessToken: string, refreshToken: string): void {
    try {
      if (!this.isValidJWTFormat(accessToken)) {
        throw new Error('Invalid access token format');
      }

      if (!this.isValidHexFormat(refreshToken)) {
        throw new Error('Invalid refresh token format');
      }

      memoryAccessToken = accessToken;
      
      // Update expiry
      const expiry = this.getTokenExpiration(accessToken);
      if (expiry) {
        memoryTokenExpiry = expiry;
      }

      // Reset refresh attempts on successful refresh
      this.resetRefreshAttempts();
      
      console.log('✅ Tokens updated securely in memory (refresh token handled server-side)');
    } catch (error) {
      console.error('❌ Error updating tokens:', error);
      throw error;
    }
  }

  /**
   * Clear all authentication data securely
   */
  static clearTokens(): void {
    try {
      console.log('🧹 CLEAR TOKENS - Starting secure cleanup...');
      
      // Clear memory storage
      memoryAccessToken = null;
      memoryUserData = null;
      memoryTokenExpiry = null;
      memoryRefreshAttempts = 0;
      
      console.log('✅ CLEAR TOKENS - All memory data cleared securely');
    } catch (error) {
      console.error('❌ CLEAR TOKENS - Error clearing tokens:', error);
    }
  }

  /**
   * Check if user is authenticated
   * @returns Boolean indicating if user is authenticated
   */
  static isAuthenticated(): boolean {
    try {
      const token = this.getAccessToken();
      if (!token) return false;
      
      return !this.isAccessTokenExpired();
    } catch (error) {
      console.error('❌ Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Check if access token is expired
   * @returns Boolean indicating if access token is expired
   */
  static isAccessTokenExpired(): boolean {
    try {
      if (!memoryTokenExpiry) {
        return true;
      }
      
      const now = Date.now();
      const isExpired = now >= memoryTokenExpiry;
      
      console.log('🔍 ACCESS TOKEN EXPIRY CHECK - Current time:', new Date(now).toISOString());
      console.log('🔍 ACCESS TOKEN EXPIRY CHECK - Token expires:', new Date(memoryTokenExpiry).toISOString());
      console.log('🔍 ACCESS TOKEN EXPIRY CHECK - Is expired:', isExpired);
      
      return isExpired;
    } catch (error) {
      console.error('❌ Error checking access token expiry:', error);
      return true;
    }
  }

  /**
   * Get token expiration time
   * @param token - JWT token to decode
   * @returns Expiration timestamp or null
   */
  static getTokenExpiration(token?: string): number | null {
    try {
      const tokenToDecode = token || memoryAccessToken;
      if (!tokenToDecode) return null;
      
      const decoded = this.decodeToken(tokenToDecode);
      if (!decoded || !decoded.exp) return null;
      
      // Convert to milliseconds if in seconds
      return decoded.exp * 1000;
    } catch (error) {
      console.error('❌ Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * Check if token should be refreshed
   * @returns Boolean indicating if token should be refreshed
   */
  static shouldRefreshToken(): boolean {
    try {
      if (!memoryTokenExpiry) return false;
      
      const now = Date.now();
      const timeUntilExpiry = memoryTokenExpiry - now;
      const refreshThreshold = AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD;
      
      console.log('🔍 SHOULD REFRESH CHECK - Time until expiry:', timeUntilExpiry);
      console.log('🔍 SHOULD REFRESH CHECK - Refresh threshold:', refreshThreshold);
      console.log('🔍 SHOULD REFRESH CHECK - Should refresh:', timeUntilExpiry <= refreshThreshold);
      
      return timeUntilExpiry <= refreshThreshold;
    } catch (error) {
      console.error('❌ Error checking if should refresh token:', error);
      return false;
    }
  }

  /**
   * Check if refresh can be attempted
   * @returns Boolean indicating if refresh can be attempted
   */
  static canAttemptRefresh(): boolean {
    try {
      const canAttempt = memoryRefreshAttempts < AUTH_CONFIG.MAX_REFRESH_ATTEMPTS;
      console.log('🔍 CAN ATTEMPT REFRESH - Current attempts:', memoryRefreshAttempts);
      console.log('🔍 CAN ATTEMPT REFRESH - Max attempts:', AUTH_CONFIG.MAX_REFRESH_ATTEMPTS);
      console.log('🔍 CAN ATTEMPT REFRESH - Can attempt:', canAttempt);
      return canAttempt;
    } catch (error) {
      console.error('❌ Error checking if can attempt refresh:', error);
      return false;
    }
  }

  /**
   * Increment refresh attempts counter
   */
  static incrementRefreshAttempts(): void {
    try {
      memoryRefreshAttempts++;
      console.log('📈 REFRESH ATTEMPTS - Incremented to:', memoryRefreshAttempts);
    } catch (error) {
      console.error('❌ Error incrementing refresh attempts:', error);
    }
  }

  /**
   * Reset refresh attempts counter
   */
  static resetRefreshAttempts(): void {
    try {
      memoryRefreshAttempts = 0;
      console.log('🔄 REFRESH ATTEMPTS - Reset to 0');
    } catch (error) {
      console.error('❌ Error resetting refresh attempts:', error);
    }
  }

  /**
   * Validate JWT token format
   * @param token - Token to validate
   * @returns Boolean indicating if token is valid JWT format
   */
  private static isValidJWTFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if parts are base64 encoded
    try {
      parts.forEach(part => {
        if (part) {
          atob(part.replace(/-/g, '+').replace(/_/g, '/'));
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate hex token format
   * @param token - Token to validate
   * @returns Boolean indicating if token is valid hex format
   */
  private static isValidHexFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    // Check if token is valid hex string
    return /^[0-9a-fA-F]+$/.test(token);
  }

  /**
   * Decode JWT token
   * @param token - JWT token to decode
   * @returns Decoded token payload or null
   */
  static decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('❌ Error decoding token:', error);
      return null;
    }
  }
}

// Export functions for backward compatibility
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  TokenManager.storeTokens(accessToken, refreshToken, null);
};

export const getTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  return {
    accessToken: TokenManager.getAccessToken(),
    refreshToken: TokenManager.getRefreshToken(),
  };
};

export const clearTokens = (): void => {
  TokenManager.clearTokens();
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = TokenManager.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return now >= decoded.exp;
  } catch (error) {
    console.error('❌ Error checking token expiry:', error);
    return true;
  }
};

export const isAuthenticated = (): boolean => {
  return TokenManager.isAuthenticated();
};

export const shouldRefreshToken = (): boolean => TokenManager.shouldRefreshToken();
export const canAttemptRefresh = (): boolean => TokenManager.canAttemptRefresh();
export const incrementRefreshAttempts = (): void => TokenManager.incrementRefreshAttempts();
export const resetRefreshAttempts = (): void => TokenManager.resetRefreshAttempts(); 