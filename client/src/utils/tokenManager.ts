import { AUTH_CONFIG, STORAGE_KEYS } from '../constants';

/**
 * Enhanced Token Manager for httpOnly Cookies
 * Handles JWT access and refresh token management with secure cookie-based storage
 * Implements secure storage practices and token validation
 */

/**
 * Enhanced Token Manager Class for Cookie-based Storage
 * Manages JWT tokens with automatic refresh and secure cookie storage
 */
class TokenManager {
  /**
   * Store authentication tokens securely in httpOnly cookies
   * Note: Tokens are now stored server-side in httpOnly cookies
   * @param accessToken - JWT access token (stored in memory temporarily)
   * @param refreshToken - Random hex refresh token (stored in httpOnly cookie)
   * @param user - User data object (stored in memory)
   */
  static storeTokens(accessToken: string, refreshToken: string, user: any): void {
    try {
      console.log('🔐 STORE TOKENS - Starting token storage...');
      console.log('🔐 STORE TOKENS - Access token length:', accessToken?.length);
      console.log('🔐 STORE TOKENS - Refresh token length:', refreshToken?.length);
      console.log('🔐 STORE TOKENS - Storage key:', AUTH_CONFIG.ACCESS_TOKEN_KEY);

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

      // Store access token in memory (temporary, will be refreshed)
      sessionStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, accessToken);
      console.log('✅ STORE TOKENS - Access token stored in sessionStorage');
      
      // Store user data in session storage
      if (user) {
        sessionStorage.setItem(AUTH_CONFIG.USER_DATA_KEY, JSON.stringify(user));
        console.log('✅ STORE TOKENS - User data stored in sessionStorage');
      }

      // Store token expiry for quick validation
      const expiry = this.getTokenExpiration(accessToken);
      if (expiry) {
        sessionStorage.setItem(AUTH_CONFIG.TOKEN_EXPIRY_KEY, expiry.toString());
        console.log('✅ STORE TOKENS - Token expiry stored:', new Date(expiry).toISOString());
      }

      // Reset refresh attempts on successful login
      this.resetRefreshAttempts();
      
      console.log('✅ STORE TOKENS - All tokens stored successfully');
      
      // Verify storage
      const storedToken = sessionStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      console.log('🔍 STORE TOKENS - Verification - Stored token exists:', !!storedToken);
      console.log('🔍 STORE TOKENS - Verification - Stored token length:', storedToken?.length);
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
      console.log('🔍 GET ACCESS TOKEN - Starting token retrieval...');
      console.log('🔍 GET ACCESS TOKEN - Storage key:', AUTH_CONFIG.ACCESS_TOKEN_KEY);
      
      const token = sessionStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      
      console.log('🔍 GET ACCESS TOKEN - Raw token from storage:', !!token);
      console.log('🔍 GET ACCESS TOKEN - Token length:', token?.length);
      console.log('🔍 GET ACCESS TOKEN - Token preview:', token ? `${token.substring(0, 20)}...` : 'null');
      
      if (!token) {
        console.log('❌ GET ACCESS TOKEN - No token found in storage');
        return null;
      }
      
      const isValidJWT = this.isValidJWTFormat(token);
      console.log('🔍 GET ACCESS TOKEN - Is valid JWT format:', isValidJWT);
      
      if (!isValidJWT) {
        console.log('❌ GET ACCESS TOKEN - Token validation failed - not a valid JWT');
        return null;
      }
      
      console.log('✅ GET ACCESS TOKEN - Token retrieved successfully');
      return token;
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
      const userData = sessionStorage.getItem(AUTH_CONFIG.USER_DATA_KEY);
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      // Basic validation of user object structure
      if (!user || typeof user !== 'object' || !user.id) {
        return null;
      }
      return user;
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

      sessionStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, accessToken);
      
      // Update expiry
      const expiry = this.getTokenExpiration(accessToken);
      if (expiry) {
        sessionStorage.setItem(AUTH_CONFIG.TOKEN_EXPIRY_KEY, expiry.toString());
      }

      console.log('✅ Access token updated securely');
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

      sessionStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, accessToken);
      
      // Update expiry
      const expiry = this.getTokenExpiration(accessToken);
      if (expiry) {
        sessionStorage.setItem(AUTH_CONFIG.TOKEN_EXPIRY_KEY, expiry.toString());
      }

      // Reset refresh attempts on successful refresh
      this.resetRefreshAttempts();
      
      console.log('✅ Tokens updated securely (refresh token handled server-side)');
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
      sessionStorage.removeItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_CONFIG.USER_DATA_KEY);
      sessionStorage.removeItem(AUTH_CONFIG.TOKEN_EXPIRY_KEY);
      sessionStorage.removeItem(AUTH_CONFIG.REFRESH_ATTEMPT_KEY);
      
      console.log('✅ All tokens cleared securely');
    } catch (error) {
      console.error('❌ Error clearing tokens:', error);
    }
  }

  /**
   * Check if user is authenticated with token validation
   * @returns True if valid access token exists
   */
  static isAuthenticated(): boolean {
    try {
      const token = this.getAccessToken();
      if (!token) return false;

      // Check if token is expired
      if (this.isAccessTokenExpired()) {
        this.clearTokens();
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Check if access token is expired
   * @returns True if token is expired
   */
  static isAccessTokenExpired(): boolean {
    try {
      const expiry = sessionStorage.getItem(AUTH_CONFIG.TOKEN_EXPIRY_KEY);
      if (!expiry) return true;

      const expiryTime = parseInt(expiry, 10);
      const currentTime = Date.now();

      return currentTime >= expiryTime;
    } catch (error) {
      console.error('❌ Error checking token expiry:', error);
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
      const tokenToDecode = token || this.getAccessToken();
      if (!tokenToDecode) return null;

      const decoded = this.decodeToken(tokenToDecode);
      if (!decoded || !decoded.exp) return null;

      return decoded.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error('❌ Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * Check if token should be refreshed (within threshold)
   * @returns True if token should be refreshed
   */
  static shouldRefreshToken(): boolean {
    try {
      const expiry = sessionStorage.getItem(AUTH_CONFIG.TOKEN_EXPIRY_KEY);
      if (!expiry) return false;

      const expiryTime = parseInt(expiry, 10);
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      // Refresh if token expires within the threshold
      return timeUntilExpiry <= AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD;
    } catch (error) {
      console.error('❌ Error checking refresh threshold:', error);
      return false;
    }
  }

  /**
   * Check if refresh attempt is allowed (rate limiting)
   * @returns True if refresh can be attempted
   */
  static canAttemptRefresh(): boolean {
    try {
      const attempts = sessionStorage.getItem(AUTH_CONFIG.REFRESH_ATTEMPT_KEY);
      const attemptCount = attempts ? parseInt(attempts, 10) : 0;
      
      return attemptCount < AUTH_CONFIG.MAX_REFRESH_ATTEMPTS;
    } catch (error) {
      console.error('❌ Error checking refresh attempts:', error);
      return false;
    }
  }

  /**
   * Increment refresh attempt counter
   */
  static incrementRefreshAttempts(): void {
    try {
      const attempts = sessionStorage.getItem(AUTH_CONFIG.REFRESH_ATTEMPT_KEY);
      const attemptCount = attempts ? parseInt(attempts, 10) : 0;
      
      sessionStorage.setItem(AUTH_CONFIG.REFRESH_ATTEMPT_KEY, (attemptCount + 1).toString());
    } catch (error) {
      console.error('❌ Error incrementing refresh attempts:', error);
    }
  }

  /**
   * Reset refresh attempt counter
   */
  static resetRefreshAttempts(): void {
    try {
      sessionStorage.removeItem(AUTH_CONFIG.REFRESH_ATTEMPT_KEY);
    } catch (error) {
      console.error('❌ Error resetting refresh attempts:', error);
    }
  }

  /**
   * Validate JWT token format (header.payload.signature)
   * @param token - Token to validate
   * @returns True if token has valid JWT format
   */
  private static isValidJWTFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    // JWT format validation (3 parts separated by dots)
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  /**
   * Validate hex string format (for refresh tokens)
   * @param token - Token to validate
   * @returns True if token has valid hex format
   */
  private static isValidHexFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    // Hex string validation (even length, only hex characters)
    return token.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(token);
  }

  /**
   * Decode JWT token payload (without verification)
   * @param token - JWT token to decode
   * @returns Decoded payload or null if invalid
   */
  static decodeToken(token: string): any {
    try {
      if (!this.isValidJWTFormat(token)) return null;
      
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('❌ Error decoding token:', error);
      return null;
    }
  }
}

// Export utility functions for backward compatibility
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  console.log('🔐 SAVE TOKENS - Function called');
  TokenManager.storeTokens(accessToken, refreshToken, null);
};

export const getTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  try {
    console.log('🔍 GET TOKENS - Function called');
    const accessToken = TokenManager.getAccessToken();
    
    console.log('🔍 GET TOKENS - Access token retrieved:', !!accessToken);
    console.log('🔍 GET TOKENS - Access token length:', accessToken?.length);
    
    const result = {
      accessToken,
      refreshToken: TokenManager.getRefreshToken(),
    };
    
    console.log('🔍 GET TOKENS - Final result:', {
      hasAccessToken: !!result.accessToken,
      hasRefreshToken: !!result.refreshToken,
    });
    
    return result;
  } catch (error) {
    console.error('❌ GET TOKENS - Error in getTokens:', error);
    return {
      accessToken: null,
      refreshToken: null,
    };
  }
};

export const clearTokens = (): void => {
  console.log('🗑️ CLEAR TOKENS - Function called');
  TokenManager.clearTokens();
};

export const isTokenExpired = (token: string): boolean => {
  try {
    console.log('⏰ IS TOKEN EXPIRED - Checking token expiry');
    const decoded = TokenManager.decodeToken(token);
    if (!decoded || !decoded.exp) {
      console.log('❌ IS TOKEN EXPIRED - No expiry found in token');
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp < currentTime;
    
    console.log('⏰ IS TOKEN EXPIRED - Result:', {
      tokenExpiry: new Date(decoded.exp * 1000).toISOString(),
      currentTime: new Date(currentTime * 1000).toISOString(),
      isExpired,
    });
    
    return isExpired;
  } catch (error) {
    console.error('❌ IS TOKEN EXPIRED - Error checking token expiry:', error);
    return true;
  }
};

export const isAuthenticated = (): boolean => {
  const result = TokenManager.isAuthenticated();
  console.log('🔐 IS AUTHENTICATED - Result:', result);
  return result;
};
export const shouldRefreshToken = (): boolean => TokenManager.shouldRefreshToken();
export const canAttemptRefresh = (): boolean => TokenManager.canAttemptRefresh();
export const incrementRefreshAttempts = (): void => TokenManager.incrementRefreshAttempts();
export const resetRefreshAttempts = (): void => TokenManager.resetRefreshAttempts(); 