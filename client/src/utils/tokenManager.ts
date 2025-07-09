/**
 * Token Manager
 * Handles JWT access and refresh token storage, retrieval, and automatic refresh
 */

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'user';

/**
 * Token Manager Class
 * Manages JWT tokens with automatic refresh and secure storage
 */
class TokenManager {
  /**
   * Store authentication tokens and user data
   * @param accessToken - JWT access token
   * @param refreshToken - JWT refresh token
   * @param user - User data object
   */
  static storeTokens(accessToken: string, refreshToken: string, user: any): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  /**
   * Get stored access token
   * @returns Access token or null if not found
   */
  static getAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Get stored refresh token
   * @returns Refresh token or null if not found
   */
  static getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Get stored user data
   * @returns User data object or null if not found
   */
  static getUser(): any | null {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Update access token (for token refresh)
   * @param accessToken - New access token
   */
  static updateAccessToken(accessToken: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } catch (error) {
      console.error('Error updating access token:', error);
    }
  }

  /**
   * Update both tokens (for token rotation)
   * @param accessToken - New access token
   * @param refreshToken - New refresh token
   */
  static updateTokens(accessToken: string, refreshToken: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error updating tokens:', error);
    }
  }

  /**
   * Clear all authentication data
   */
  static clearTokens(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * Check if user is authenticated
   * @returns True if access token exists
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Check if access token is expired (basic check)
   * @returns True if token appears to be expired
   */
  static isAccessTokenExpired(): boolean {
    try {
      const token = this.getAccessToken();
      if (!token) return true;

      // Basic JWT expiration check (decode without verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Get token expiration time
   * @returns Expiration timestamp or null
   */
  static getTokenExpiration(): number | null {
    try {
      const token = this.getAccessToken();
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * Check if token needs refresh (expires within 5 minutes)
   * @returns True if token should be refreshed
   */
  static shouldRefreshToken(): boolean {
    try {
      const expiration = this.getTokenExpiration();
      if (!expiration) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60; // 5 minutes in seconds
      
      return expiration - currentTime < fiveMinutes;
    } catch (error) {
      console.error('Error checking if token should be refreshed:', error);
      return true;
    }
  }
}

// Export individual functions for useAuth hook
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
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export default TokenManager; 