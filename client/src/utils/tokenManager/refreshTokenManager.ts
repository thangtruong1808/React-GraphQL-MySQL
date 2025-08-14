import { AUTH_CONFIG, DEBUG_CONFIG } from '../../constants';
import { MemoryStorage } from './memoryStorage';

/**
 * Refresh Token Management Module
 * Handles refresh token expiry and renewal operations
 * Provides refresh token lifecycle management
 */

/**
 * Refresh Token Manager Class
 * Manages refresh token expiry and renewal operations
 */
export class RefreshTokenManager {
  /**
   * Start refresh token expiry timer (async)
   * Called when access token expires to start the refresh token countdown
   * 
   * CALLED BY: AuthContext when access token expires
   * SCENARIOS: Access token expiry - starts refresh token countdown
   */
  static async startRefreshTokenExpiryTimer(): Promise<void> {
    try {
      // Calculate refresh token expiry - should be 1 minute from NOW (when modal appears)
      // This ensures refresh token countdown shows 1 minute from when the modal appears
      const expiry = Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS; // 1 minute from now
      await MemoryStorage.setRefreshTokenExpiry(expiry);
      // Debug logging disabled for better user experience
    } catch (error) {
      console.error('❌ Error starting refresh token expiry timer:', error);
    }
  }

  /**
   * Check if refresh token is expired (absolute timeout) - async
   * Uses the stored expiry timestamp in memory
   * 
   * @returns boolean - true if refresh token is expired
   * 
   * CALLED BY: AuthContext for session management
   * SCENARIOS: All scenarios - checks absolute session timeout
   */
  static async isRefreshTokenExpired(): Promise<boolean> {
    try {
      const refreshTokenExpiry = await MemoryStorage.getRefreshTokenExpiry();
      if (!refreshTokenExpiry) {
        return false; // Not expired if timer hasn't started yet (access token still valid)
      }
      
      const now = Date.now();
      const isExpired = now >= refreshTokenExpiry;
      
      // Debug logging disabled for better user experience
      
      return isExpired;
    } catch (error) {
      console.error('❌ Error checking refresh token expiry:', error);
      return false; // Not expired on error
    }
  }

  /**
   * Check if refresh token is expired for server operations
   * Simple check using the original refresh token expiry with improved async handling
   * 
   * @returns boolean - true if refresh token is expired
   * 
   * CALLED BY: AuthActions for server operations
   * SCENARIOS: Token refresh operations when timing is critical
   */
  static async isRefreshTokenExpiredForOperations(): Promise<boolean> {
    try {
      const refreshTokenExpiry = await MemoryStorage.getRefreshTokenExpiry();
      if (!refreshTokenExpiry) {
        if (import.meta.env.DEV) {
          console.log('🔍 No refresh token expiry available');
        }
        return true; // Expired if no expiry available
      }
      
      const now = Date.now();
      const timeRemaining = refreshTokenExpiry - now;
      const isExpired = timeRemaining <= 0;
      
      // Debug logging for refresh token expiry check
      if (import.meta.env.DEV) {
        console.log('🔍 Refresh token expiry check:', {
          refreshTokenExpiry,
          now,
          timeRemaining,
          isExpired
        });
      }
      
      return isExpired;
    } catch (error) {
      console.error('❌ Error checking refresh token expiry for operations:', error);
      return true; // Expired on error
    }
  }

  /**
   * Check if refresh token needs renewal (proactive renewal) - async
   * Returns true if refresh token will expire within the renewal threshold
   * 
   * @returns boolean - true if refresh token needs renewal
   * 
   * CALLED BY: AuthContext for proactive token renewal
   * SCENARIOS: All scenarios - checks if refresh token is about to expire
   */
  static async isRefreshTokenNeedsRenewal(): Promise<boolean> {
    try {
      const refreshTokenExpiry = await MemoryStorage.getRefreshTokenExpiry();
      if (!refreshTokenExpiry) {
        return false;
      }
      
      const now = Date.now();
      const timeUntilExpiry = refreshTokenExpiry - now;
      const needsRenewal = timeUntilExpiry <= AUTH_CONFIG.REFRESH_TOKEN_RENEWAL_THRESHOLD;
      
      // Debug logging disabled for better user experience
      
      return needsRenewal;
    } catch (error) {
      console.error('❌ Error checking refresh token renewal:', error);
      return false;
    }
  }

  /**
   * Update refresh token expiry after renewal (async)
   * Extends the refresh token expiry time when token is renewed with NEW tokens from server
   * IMPORTANT: This should ONLY be called when getting NEW refresh tokens from server
   * 
   * CALLED BY: AuthContext after successful token refresh with NEW tokens
   * SCENARIOS: Full session refresh with new refresh token from server
   */
  static async updateRefreshTokenExpiry(): Promise<void> {
    try {
      const oldExpiry = await MemoryStorage.getRefreshTokenExpiry();
      
      // Calculate refresh token expiry - should be 1 minute from NOW (when tokens are refreshed)
      // This ensures refresh token countdown shows 1 minute from the moment tokens are refreshed
      const newExpiry = Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS;
      await MemoryStorage.setRefreshTokenExpiry(newExpiry);
      
      // Debug logging disabled for better user experience
    } catch (error) {
      console.error('❌ Error updating refresh token expiry:', error);
    }
  }

  /**
   * Clear refresh token expiry timer (async)
   * ONLY used when user logs out or session is completely reset
   * 
   * CALLED BY: AuthContext during logout operations
   * SCENARIOS: User logout, forced logout, session termination
   */
  static async clearRefreshTokenExpiry(): Promise<void> {
    try {
      const oldExpiry = await MemoryStorage.getRefreshTokenExpiry();
      await MemoryStorage.setRefreshTokenExpiry(null);
      // Debug logging disabled for better user experience
    } catch (error) {
      console.error('❌ Error clearing refresh token expiry:', error);
    }
  }

  /**
   * Get refresh token expiry timestamp (async)
   * @returns Refresh token expiry timestamp or null if not set
   * 
   * CALLED BY: Debug components for displaying refresh token information
   * SCENARIOS: Debugging and monitoring refresh token expiry
   */
  static async getRefreshTokenExpiry(): Promise<number | null> {
    return await MemoryStorage.getRefreshTokenExpiry();
  }

  /**
   * Calculate time remaining until refresh token expires (async)
   * @returns Time remaining in milliseconds or null if no expiry set
   * 
   * CALLED BY: Debug components for displaying countdown information
   * SCENARIOS: Debugging and monitoring refresh token expiry
   */
  static async getRefreshTokenTimeRemaining(): Promise<number | null> {
    try {
      const refreshTokenExpiry = await MemoryStorage.getRefreshTokenExpiry();
      if (!refreshTokenExpiry) {
        return null;
      }
      
      const now = Date.now();
      const timeRemaining = refreshTokenExpiry - now;
      
      return timeRemaining > 0 ? timeRemaining : 0;
    } catch (error) {
      console.error('❌ Error calculating refresh token time remaining:', error);
      return null;
    }
  }



  /**
   * Get refresh token status information for debugging (async)
   * @returns Object with refresh token status information
   * 
   * CALLED BY: Debug components for displaying comprehensive refresh token information
   * SCENARIOS: Debugging and monitoring refresh token status
   */
  static async getRefreshTokenStatus(): Promise<{
    expiry: number | null;
    isExpired: boolean;
    needsRenewal: boolean;
    timeRemaining: number | null;
    isContinueToWorkTransition: boolean;
    isLogoutTransition: boolean;
  }> {
    const expiry = await this.getRefreshTokenExpiry();
    const isExpired = await this.isRefreshTokenExpired();
    const needsRenewal = await this.isRefreshTokenNeedsRenewal();
    const timeRemaining = await this.getRefreshTokenTimeRemaining();
    const isContinueToWorkTransition = MemoryStorage.getContinueToWorkTransition();
    const isLogoutTransition = MemoryStorage.getLogoutTransition();

    return {
      expiry,
      isExpired,
      needsRenewal,
      timeRemaining,
      isContinueToWorkTransition,
      isLogoutTransition,
    };
  }

  /**
   * Set transition state for "Continue to Work" operation
   * @param isTransitioning - Whether the transition is active
   * 
   * CALLED BY: AuthActions during refreshSession
   * SCENARIOS: "Continue to Work" button clicked
   */
  static setContinueToWorkTransition(isTransitioning: boolean): void {
    try {
      MemoryStorage.setContinueToWorkTransition(isTransitioning);
    } catch (error) {
      console.error('❌ Error setting continue to work transition:', error);
    }
  }

  /**
   * Get transition state for "Continue to Work" operation
   * @returns Whether the transition is active
   * 
   * CALLED BY: TokenManager to check transition state
   * SCENARIOS: Session checking during "Continue to Work" operation
   */
  static getContinueToWorkTransition(): boolean {
    try {
      return MemoryStorage.getContinueToWorkTransition();
    } catch (error) {
      console.error('❌ Error getting continue to work transition:', error);
      return false;
    }
  }

  /**
   * Set transition state for logout operation
   * @param isTransitioning - Whether the logout transition is active
   * 
   * CALLED BY: AuthActions during logout from modal
   * SCENARIOS: "Logout" button clicked from session expiry modal
   */
  static setLogoutTransition(isTransitioning: boolean): void {
    try {
      MemoryStorage.setLogoutTransition(isTransitioning);
    } catch (error) {
      console.error('❌ Error setting logout transition:', error);
    }
  }


}
