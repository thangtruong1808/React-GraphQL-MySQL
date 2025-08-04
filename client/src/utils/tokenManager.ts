import { AUTH_CONFIG, STORAGE_KEYS } from '../constants';

/**
 * Enhanced Token Manager with Memory-Only Storage for XSS Protection
 * Handles JWT access and refresh token management with secure memory-based storage
 * Implements secure storage practices and token validation
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

// Memory-only storage for access tokens (XSS protection)
let memoryAccessToken: string | null = null;
let memoryUserData: any | null = null;
let memoryTokenExpiry: number | null = null;
let memoryRefreshTokenExpiry: number | null = null;
let memoryLastActivity: number | null = null;
let memoryActivityBasedExpiry: number | null = null; // Activity-based token expiry timestamp

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
   * 
   * CALLED BY: AuthContext after successful login/refresh
   * SCENARIOS:
   * - First time login: Stores new tokens from server response
   * - Token refresh: Stores new tokens after successful refresh
   * - Re-login: Stores new tokens after successful login
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

      // DO NOT set refresh token expiry at login - it will be set when access token expires
      memoryRefreshTokenExpiry = null;
      console.log('✅ STORE TOKENS - Refresh token expiry not set yet (will be set when access token expires)');

      // Initialize last activity timestamp
      memoryLastActivity = Date.now();
      console.log('✅ STORE TOKENS - Last activity timestamp initialized:', new Date(memoryLastActivity).toISOString());

      // Initialize activity-based token expiry (1 minute from now)
      memoryActivityBasedExpiry = Date.now() + AUTH_CONFIG.ACTIVITY_TOKEN_EXPIRY;
      console.log('✅ STORE TOKENS - Activity-based token expiry initialized:', new Date(memoryActivityBasedExpiry).toISOString());

      
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
   * Update access token only
   * Used when only access token is refreshed
   * 
   * CALLED BY: AuthContext after successful access token refresh
   * SCENARIOS: Access token refresh - updates access token with new expiry
   */
  static updateAccessToken(accessToken: string): void {
    try {
      console.log('🔄 UPDATE ACCESS TOKEN - Updating access token...');
      
      // Validate access token format
      if (!this.isValidJWTFormat(accessToken)) {
        console.error('❌ UPDATE ACCESS TOKEN - Invalid access token format');
        throw new Error('Invalid access token format');
      }

      // Update access token
      memoryAccessToken = accessToken;
      
      // Update token expiry
      const expiry = this.getTokenExpiration(accessToken);
      if (expiry) {
        memoryTokenExpiry = expiry;
        console.log('✅ UPDATE ACCESS TOKEN - Access token expiry updated:', new Date(expiry).toISOString());
      }

      // Clear refresh token expiry timer since access token was refreshed
      // It will be set again when access token expires next time
      memoryRefreshTokenExpiry = null;
      console.log('✅ UPDATE ACCESS TOKEN - Refresh token expiry timer cleared (access token refreshed)');
      
      console.log('✅ Access token updated securely in memory. Refresh token expiry timer cleared.');
    } catch (error) {
      console.error('❌ Error updating access token:', error);
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
      console.log('🔄 UPDATE TOKENS - Updating both access and refresh tokens...');
      
      // Validate access token format
      if (!this.isValidJWTFormat(accessToken)) {
        console.error('❌ UPDATE TOKENS - Invalid access token format');
        throw new Error('Invalid access token format');
      }

      // Validate refresh token format
      if (!this.isValidHexFormat(refreshToken)) {
        console.error('❌ UPDATE TOKENS - Invalid refresh token format');
        throw new Error('Invalid refresh token format');
      }

      // Update access token
      memoryAccessToken = accessToken;
      
      // Update user data if provided
      if (user) {
        memoryUserData = user;
        console.log('✅ UPDATE TOKENS - User data updated');
      }
      
      // Update token expiry
      const expiry = this.getTokenExpiration(accessToken);
      if (expiry) {
        memoryTokenExpiry = expiry;
        console.log('✅ UPDATE TOKENS - Access token expiry updated:', new Date(expiry).toISOString());
      }

      // Clear refresh token expiry timer since tokens were refreshed
      // It will be set again when access token expires next time
      memoryRefreshTokenExpiry = null;
      console.log('✅ UPDATE TOKENS - Refresh token expiry timer cleared (tokens refreshed)');
      
      console.log('✅ Tokens updated securely in memory (refresh token handled server-side). Refresh token expiry timer cleared.');
    } catch (error) {
      console.error('❌ Error updating tokens:', error);
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
      console.log('🧹 CLEAR TOKENS - Starting secure cleanup...');
      
      // Clear memory storage
      memoryAccessToken = null;
      memoryUserData = null;
      memoryTokenExpiry = null;
      memoryRefreshTokenExpiry = null;
      memoryLastActivity = null;
      memoryActivityBasedExpiry = null; // Clear activity-based expiry
      
      console.log('✅ CLEAR TOKENS - All memory data cleared securely');
    } catch (error) {
      console.error('❌ CLEAR TOKENS - Error clearing tokens:', error);
    }
  }

  /**
   * Update user activity timestamp
   * Called when user performs any action
   * 
   * CALLED BY: AuthContext when user is active
   * SCENARIOS: All user interactions - updates last activity time
   */
  static updateActivity(): void {
    try {
      memoryLastActivity = Date.now();
      
      // Reset activity-based token expiry (1 minute from now)
      memoryActivityBasedExpiry = Date.now() + AUTH_CONFIG.ACTIVITY_TOKEN_EXPIRY;
    } catch (error) {
      console.error('❌ Error updating activity:', error);
    }
  }

  /**
   * Start refresh token expiry timer
   * Called when access token expires to start the 4-minute countdown
   * 
   * CALLED BY: AuthContext when access token expires
   * SCENARIOS: Access token expiry - starts refresh token countdown
   */
  static startRefreshTokenExpiryTimer(): void {
    try {
      memoryRefreshTokenExpiry = Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS;
      console.log('🔄 Refresh token expiry timer started:', new Date(memoryRefreshTokenExpiry).toISOString());
    } catch (error) {
      console.error('❌ Error starting refresh token expiry timer:', error);
    }
  }

  /**
   * Check if refresh token is expired (absolute timeout)
   * Uses the stored expiry timestamp in memory
   * 
   * @returns boolean - true if refresh token is expired
   */
  static isRefreshTokenExpired(): boolean {
    try {
      if (!memoryRefreshTokenExpiry) {
        console.log('❌ No refresh token expiry timestamp found');
        return false; // Not expired if timer hasn't started yet
      }
      
      const now = Date.now();
      const isExpired = now >= memoryRefreshTokenExpiry;
      
      if (isExpired) {
        console.log('❌ Refresh token expired at:', new Date(memoryRefreshTokenExpiry).toISOString());
      } else {
        console.log('✅ Refresh token valid until:', new Date(memoryRefreshTokenExpiry).toISOString());
      }
      
      return isExpired;
    } catch (error) {
      console.error('❌ Error checking refresh token expiry:', error);
      return false; // Not expired on error
    }
  }

  /**
   * Check if refresh token needs renewal (proactive renewal)
   * Returns true if refresh token will expire within the renewal threshold
   * 
   * @returns boolean - true if refresh token needs renewal
   */
  static isRefreshTokenNeedsRenewal(): boolean {
    try {
      if (!memoryRefreshTokenExpiry) {
        console.log('❌ No refresh token expiry timestamp found for renewal check');
        return false;
      }
      
      const now = Date.now();
      const timeUntilExpiry = memoryRefreshTokenExpiry - now;
      const needsRenewal = timeUntilExpiry <= AUTH_CONFIG.REFRESH_TOKEN_RENEWAL_THRESHOLD;
      
      if (needsRenewal) {
        console.log('🔄 Refresh token needs renewal - expires in:', Math.round(timeUntilExpiry / 1000), 'seconds');
        console.log('🔄 Renewal threshold:', Math.round(AUTH_CONFIG.REFRESH_TOKEN_RENEWAL_THRESHOLD / 1000), 'seconds');
      }
      
      return needsRenewal;
    } catch (error) {
      console.error('❌ Error checking refresh token renewal:', error);
      return false;
    }
  }

  /**
   * Update refresh token expiry after renewal
   * Extends the refresh token expiry time when token is renewed
   * OR clears the expiry timer when user continues working
   */
  static updateRefreshTokenExpiry(): void {
    try {
      const oldExpiry = memoryRefreshTokenExpiry;
      
      // Clear the refresh token expiry timer since user is continuing to work
      // It will be set again when access token expires next time
      memoryRefreshTokenExpiry = null;
      
      console.log('✅ Refresh token expiry timer cleared (user continuing to work). Previous expiry was:', oldExpiry ? new Date(oldExpiry).toISOString() : 'null');
    } catch (error) {
      console.error('❌ Error updating refresh token expiry:', error);
    }
  }

  /**
   * Get the timestamp of the last user activity
   * @returns Timestamp of last activity or null if no activity recorded
   * 
   * CALLED BY: ActivityDebugger for displaying activity information
   * SCENARIOS: Debugging and monitoring user activity
   */
  static getLastActivityTime(): number | null {
    return memoryLastActivity;
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
    try {
      if (!memoryLastActivity) {
        return true;
      }
      
      const now = Date.now();
      const timeSinceLastActivity = now - memoryLastActivity;
      const isInactive = timeSinceLastActivity >= inactivityThreshold;
      
      return isInactive;
    } catch (error) {
      console.error('❌ Error checking user inactivity:', error);
      return true; // Assume inactive on error
    }
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
    try {
      const token = this.getAccessToken();
      if (!token) return false;
      
      // Use activity-based token validation if enabled
      // This allows active users to stay logged in longer
      if (memoryActivityBasedExpiry !== null) {
        return !this.isActivityBasedTokenExpired();
      }
      
      // Fallback to original token expiry check
      return !this.isAccessTokenExpired();
    } catch (error) {
      console.error('❌ Error checking authentication:', error);
      return false;
    }
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
      return true; // Assume expired on error
    }
  }

  /**
   * Check if activity-based token is expired
   * @returns Boolean indicating if activity-based token is expired
   * 
   * CALLED BY: isAuthenticated(), AuthContext for activity-based validation
   * SCENARIOS:
   * - Active user: Returns false (token valid based on activity)
   * - Inactive user: Returns true (needs refresh or logout)
   * - No activity data: Returns true (assume expired)
   */
  static isActivityBasedTokenExpired(): boolean {
    try {
      if (!memoryActivityBasedExpiry) {
        return true;
      }
      
      const now = Date.now();
      const isExpired = now >= memoryActivityBasedExpiry;
      
      return isExpired;
    } catch (error) {
      console.error('❌ Error checking activity-based token expiry:', error);
      return true; // Assume expired on error
    }
  }

  /**
   * Get activity-based token expiry timestamp
   * @returns Activity-based expiry timestamp or null if not available
   * 
   * CALLED BY: ActivityDebugger for displaying activity-based expiry information
   * SCENARIOS: Debugging and monitoring activity-based token expiry
   */
  static getActivityBasedTokenExpiry(): number | null {
    return memoryActivityBasedExpiry;
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
    try {
      const tokenToDecode = token || memoryAccessToken;
      if (!tokenToDecode) return null;
      
      const decoded = this.decodeToken(tokenToDecode);
      if (!decoded || !decoded.exp) return null;
      
      // Convert to milliseconds
      return decoded.exp * 1000;
    } catch (error) {
      console.error('❌ Error getting token expiration:', error);
      return null;
    }
  }



  /**
   * Validate JWT token format
   * @param token - Token to validate
   * @returns Boolean indicating if token is valid JWT format
   * 
   * CALLED BY: storeTokens(), getAccessToken(), updateAccessToken()
   * SCENARIOS: All scenarios - validates JWT structure before use
   */
  private static isValidJWTFormat(token: string): boolean {
    try {
      if (!token || typeof token !== 'string') return false;
      
      // JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Check if parts are base64 encoded
      const [header, payload] = parts;
      try {
        JSON.parse(atob(header));
        JSON.parse(atob(payload));
        return true;
      } catch {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate hex token format
   * @param token - Token to validate
   * @returns Boolean indicating if token is valid hex format
   * 
   * CALLED BY: storeTokens(), updateTokens()
   * SCENARIOS: All scenarios - validates refresh token format
   */
  private static isValidHexFormat(token: string): boolean {
    try {
      if (!token || typeof token !== 'string') return false;
      
      // Check if string is valid hex
      return /^[0-9a-fA-F]+$/.test(token);
    } catch (error) {
      return false;
    }
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
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('❌ Error decoding token:', error);
      return null;
    }
  }
}

/**
 * Legacy wrapper functions for backward compatibility
 * These functions provide the same interface as the class methods
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

/**
 * Export TokenManager class for direct access to static methods
 * 
 * CALLED BY: AuthContext for advanced token operations
 * SCENARIOS: Token expiry calculation, advanced validation
 */
export { TokenManager };

 