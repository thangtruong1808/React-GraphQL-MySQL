import { AUTH_CONFIG } from '../../constants';
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
   * Start refresh token expiry timer
   * Called when access token expires to start the 4-minute countdown
   * 
   * CALLED BY: AuthContext when access token expires
   * SCENARIOS: Access token expiry - starts refresh token countdown
   */
  static startRefreshTokenExpiryTimer(): void {
    try {
      const expiry = Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS;
      MemoryStorage.setRefreshTokenExpiry(expiry);
      console.log('🔄 Refresh token expiry timer started:', new Date(expiry).toISOString());
    } catch (error) {
      console.error('❌ Error starting refresh token expiry timer:', error);
    }
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
  static isRefreshTokenExpired(): boolean {
    try {
      const refreshTokenExpiry = MemoryStorage.getRefreshTokenExpiry();
      if (!refreshTokenExpiry) {
        console.log('❌ No refresh token expiry timestamp found');
        return false; // Not expired if timer hasn't started yet
      }
      
      const now = Date.now();
      const isExpired = now >= refreshTokenExpiry;
      
      if (isExpired) {
        console.log('❌ Refresh token expired at:', new Date(refreshTokenExpiry).toISOString());
      } else {
        console.log('✅ Refresh token valid until:', new Date(refreshTokenExpiry).toISOString());
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
   * 
   * CALLED BY: AuthContext for proactive token renewal
   * SCENARIOS: All scenarios - checks if refresh token is about to expire
   */
  static isRefreshTokenNeedsRenewal(): boolean {
    try {
      const refreshTokenExpiry = MemoryStorage.getRefreshTokenExpiry();
      if (!refreshTokenExpiry) {
        console.log('❌ No refresh token expiry timestamp found for renewal check');
        return false;
      }
      
      const now = Date.now();
      const timeUntilExpiry = refreshTokenExpiry - now;
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
   * 
   * CALLED BY: AuthContext after successful token refresh
   * SCENARIOS: All scenarios - updates refresh token expiry
   */
  static updateRefreshTokenExpiry(): void {
    try {
      const oldExpiry = MemoryStorage.getRefreshTokenExpiry();
      
      // Clear the refresh token expiry timer since user is continuing to work
      // It will be set again when access token expires next time
      MemoryStorage.setRefreshTokenExpiry(null);
      
      console.log('✅ Refresh token expiry timer cleared (user continuing to work). Previous expiry was:', oldExpiry ? new Date(oldExpiry).toISOString() : 'null');
    } catch (error) {
      console.error('❌ Error updating refresh token expiry:', error);
    }
  }

  /**
   * Get refresh token expiry timestamp
   * @returns Refresh token expiry timestamp or null if not set
   * 
   * CALLED BY: Debug components for displaying refresh token information
   * SCENARIOS: Debugging and monitoring refresh token expiry
   */
  static getRefreshTokenExpiry(): number | null {
    return MemoryStorage.getRefreshTokenExpiry();
  }

  /**
   * Calculate time remaining until refresh token expires
   * @returns Time remaining in milliseconds or null if no expiry set
   * 
   * CALLED BY: Debug components for displaying countdown information
   * SCENARIOS: Debugging and monitoring refresh token expiry
   */
  static getRefreshTokenTimeRemaining(): number | null {
    try {
      const refreshTokenExpiry = MemoryStorage.getRefreshTokenExpiry();
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
   * Get refresh token status information for debugging
   * @returns Object with refresh token status information
   * 
   * CALLED BY: Debug components for displaying comprehensive refresh token information
   * SCENARIOS: Debugging and monitoring refresh token status
   */
  static getRefreshTokenStatus(): {
    expiry: number | null;
    isExpired: boolean;
    needsRenewal: boolean;
    timeRemaining: number | null;
  } {
    const expiry = this.getRefreshTokenExpiry();
    const isExpired = this.isRefreshTokenExpired();
    const needsRenewal = this.isRefreshTokenNeedsRenewal();
    const timeRemaining = this.getRefreshTokenTimeRemaining();

    return {
      expiry,
      isExpired,
      needsRenewal,
      timeRemaining,
    };
  }
}
