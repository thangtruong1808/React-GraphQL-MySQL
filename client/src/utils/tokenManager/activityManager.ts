import { AUTH_CONFIG } from '../../constants';
import { MemoryStorage } from './memoryStorage';

/**
 * Activity Management Module
 * Handles user activity tracking and activity-based token expiry
 * Provides activity monitoring for session management
 */

/**
 * Activity Manager Class
 * Manages user activity tracking and activity-based token operations
 */
export class ActivityManager {
  /**
   * Update user activity timestamp
   * Called when user performs any action
   * 
   * CALLED BY: AuthContext when user is active
   * SCENARIOS: All user interactions - updates last activity time
   */
  static async updateActivity(): Promise<void> {
    try {
      const now = Date.now();
      
      // Step 1: Update last activity timestamp
      MemoryStorage.setLastActivity(now);
      
      // Step 2: Reset activity-based token expiry (1 minute from now)
      const activityExpiry = now + AUTH_CONFIG.ACTIVITY_TOKEN_EXPIRY;
      MemoryStorage.setActivityBasedExpiry(activityExpiry);
      
      // Debug logging to understand activity updates
      console.log('🔍 ActivityManager - Activity updated:', {
        now,
        activityExpiry,
        timeUntilExpiry: activityExpiry - now
      });
      
      // Step 3: Ensure all operations are completed before returning
      // Small delay to ensure memory operations are fully processed
      await new Promise(resolve => setTimeout(resolve, 10));
    } catch (error) {
      console.error('❌ Error updating activity:', error);
      throw error; // Re-throw to allow proper error handling
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
    return MemoryStorage.getLastActivity();
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
      const lastActivity = MemoryStorage.getLastActivity();
      if (!lastActivity) {
        return true;
      }
      
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      const isInactive = timeSinceLastActivity >= inactivityThreshold;
      
      return isInactive;
    } catch (error) {
      console.error('❌ Error checking user inactivity:', error);
      return true; // Assume inactive on error
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
   * - No activity data: Returns false (assume valid for new users)
   */
  static isActivityBasedTokenExpired(): boolean {
    try {
      const activityExpiry = MemoryStorage.getActivityBasedExpiry();
      if (!activityExpiry) {
        console.log('🔍 ActivityManager - No activity expiry set, assuming valid (new user)');
        return false; // Assume valid for new users who haven't had activity yet
      }
      
      const now = Date.now();
      const isExpired = now >= activityExpiry;
      
      // Debug logging to understand activity-based token expiry checks
      console.log('🔍 ActivityManager - Activity-based token expiry check:', {
        activityExpiry,
        now,
        isExpired,
        timeRemaining: activityExpiry - now
      });
      
      return isExpired;
    } catch (error) {
      console.error('❌ Error checking activity-based token expiry:', error);
      return false; // Assume valid on error to prevent false positives
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
    return MemoryStorage.getActivityBasedExpiry();
  }

  /**
   * Calculate time remaining until activity-based token expires
   * @returns Time remaining in milliseconds or null if no expiry set
   * 
   * CALLED BY: ActivityDebugger for displaying countdown information
   * SCENARIOS: Debugging and monitoring activity-based token expiry
   */
  static getActivityBasedTokenTimeRemaining(): number | null {
    try {
      const activityExpiry = MemoryStorage.getActivityBasedExpiry();
      if (!activityExpiry) {
        return null;
      }
      
      const now = Date.now();
      const timeRemaining = activityExpiry - now;
      
      return timeRemaining > 0 ? timeRemaining : 0;
    } catch (error) {
      console.error('❌ Error calculating activity-based token time remaining:', error);
      return null;
    }
  }

  /**
   * Get activity status information for debugging
   * @returns Object with activity status information
   * 
   * CALLED BY: ActivityDebugger for displaying comprehensive activity information
   * SCENARIOS: Debugging and monitoring user activity
   */
  static getActivityStatus(): {
    lastActivity: number | null;
    activityExpiry: number | null;
    isInactive: boolean;
    isActivityBasedTokenExpired: boolean;
    timeRemaining: number | null;
  } {
    const lastActivity = this.getLastActivityTime();
    const activityExpiry = this.getActivityBasedTokenExpiry();
    const isInactive = this.isUserInactive(AUTH_CONFIG.INACTIVITY_THRESHOLD);
    const isActivityBasedTokenExpired = this.isActivityBasedTokenExpired();
    const timeRemaining = this.getActivityBasedTokenTimeRemaining();

    return {
      lastActivity,
      activityExpiry,
      isInactive,
      isActivityBasedTokenExpired,
      timeRemaining,
    };
  }
}
