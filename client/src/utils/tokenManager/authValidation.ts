import { MemoryStorage } from './memoryStorage';
import { TokenValidation } from './tokenValidation';
import { ActivityManager } from './activityManager';
import { DEBUG_CONFIG } from '../../constants';

/**
 * Authentication Validation Module
 * Handles authentication status checks and token expiry validation
 * Provides comprehensive authentication validation logic
 */

/**
 * Authentication Validation Class
 * Manages authentication status validation and token expiry checks
 */
export class AuthValidation {
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
      const activityExpiry = MemoryStorage.getActivityBasedExpiry();
      if (activityExpiry !== null) {
        return !ActivityManager.isActivityBasedTokenExpired();
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
      const tokenExpiry = MemoryStorage.getTokenExpiry();
      if (!tokenExpiry) {
        return true;
      }
      
      const now = Date.now();
      const isExpired = now >= tokenExpiry;
      
      // Debug logging disabled for better user experience
      
      return isExpired;
    } catch (error) {
      console.error('❌ Error checking access token expiry:', error);
      return true; // Assume expired on error
    }
  }

  /**
   * Get stored access token from memory with validation
   * @returns Access token or null if not found/invalid
   * 
   * CALLED BY: isAuthenticated(), apollo-client.ts authLink
   * SCENARIOS:
   * - Valid token: Returns JWT token for authorization header
   * - Expired token: Returns token (expiry checked separately)
   * - No token: Returns null (first time login)
   * - Invalid token: Returns null (cleared tokens)
   */
  static getAccessToken(): string | null {
    try {
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
      console.error('❌ Error getting access token:', error);
      return null;
    }
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
   * Get comprehensive authentication status for debugging
   * @returns Object with authentication status information
   * 
   * CALLED BY: Debug components for displaying comprehensive authentication information
   * SCENARIOS: Debugging and monitoring authentication status
   */
  static getAuthenticationStatus(): {
    isAuthenticated: boolean;
    hasAccessToken: boolean;
    isAccessTokenExpired: boolean;
    isActivityBasedTokenExpired: boolean;
    hasUserData: boolean;
    accessTokenExpiry: number | null;
    activityBasedExpiry: number | null;
  } {
    const isAuthenticated = this.isAuthenticated();
    const accessToken = this.getAccessToken();
    const hasAccessToken = !!accessToken;
    const isAccessTokenExpired = this.isAccessTokenExpired();
    const isActivityBasedTokenExpired = this.isActivityBasedTokenExpired();
    const userData = this.getUser();
    const hasUserData = !!userData;
    const accessTokenExpiry = MemoryStorage.getTokenExpiry();
    const activityBasedExpiry = this.getActivityBasedTokenExpiry();

    return {
      isAuthenticated,
      hasAccessToken,
      isAccessTokenExpired,
      isActivityBasedTokenExpired,
      hasUserData,
      accessTokenExpiry,
      activityBasedExpiry,
    };
  }
}
