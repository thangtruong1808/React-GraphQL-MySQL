import { getTokens, TokenManager } from '../../utils/tokenManager';
import { ActivityManager } from '../../utils/tokenManager/activityManager';
import { AUTH_CONFIG } from '../../constants/auth';
import { ACTIVITY_DEBUGGER_MESSAGES } from '../../constants/activityDebugger';

/**
 * Timer State Interface
 * Defines the structure of timer state information
 */
export interface TimerState {
  timeDisplay: string;
  statusMessage: string;
  progressPercentage: number;
  isAccessTokenExpired: boolean;
  isCountingDown: boolean;
  remainingCountdownSeconds: number;
  timerType: 'access' | 'refresh' | 'transition';
  sectionTitle: string;
  isTransitionState?: boolean;
  refreshTokenExpiry?: number | null;
  refreshTokenTimeRemaining?: number | null;
}

/**
 * Refresh Token Status Interface
 * Defines the structure of refresh token status information
 */
interface RefreshTokenStatus {
  expiry: number | null;
  isExpired: boolean;
  needsRenewal: boolean;
  timeRemaining: number | null;
  isContinueToWorkTransition: boolean;
  isLogoutTransition: boolean;
}

/**
 * Timer Calculator Utility
 * Calculates timer states for both access and refresh tokens
 * Handles activity-based token reset for access tokens
 * Keeps refresh token countdown unaffected by user activity
 */
export class TimerCalculator {
  /**
   * Calculate the current timer state based on token status (async)
   * @returns TimerState object with all timer information
   */
  static async calculateTimerState(): Promise<TimerState> {
    try {
      const tokens = getTokens();
      const now = Date.now();

      // Get refresh token status for display
      const refreshTokenStatus = await TokenManager.getRefreshTokenStatus();

      // Check if we have access token
      if (!tokens.accessToken) {
        return this.createErrorState('No access token', refreshTokenStatus);
      }

      const accessTokenExpiry = TokenManager.getTokenExpiration(tokens.accessToken);
      
      if (!accessTokenExpiry) {
        return this.createErrorState('Invalid token', refreshTokenStatus);
      }

      // Get activity status to make informed decisions
      const activityStatus = ActivityManager.getActivityStatus();
      const isActivityBasedTokenExpired = activityStatus.isActivityBasedTokenExpired;
      
      // Get refresh token status to determine current state
      const refreshTokenExpiry = refreshTokenStatus.expiry;

      // Debug logging (only in development)
      if (import.meta.env.DEV) {
        const debugInfo = {
          isActivityBasedTokenExpired,
          hasRefreshTokenExpiry: !!refreshTokenExpiry,
          activityExpiry: activityStatus.activityExpiry ? new Date(activityStatus.activityExpiry).toLocaleTimeString() : null,
          timeNow: new Date(now).toLocaleTimeString()
        };
        
        // Only log when state changes occur - prioritize refresh token countdown
        const currentState = refreshTokenExpiry ? 'refresh' : (isActivityBasedTokenExpired ? 'transition' : 'activity');
        if (!this.lastLoggedState || this.lastLoggedState !== currentState) {
          // Debug logging disabled for better user experience
          this.lastLoggedState = currentState;
        }
      }

      // BUSINESS LOGIC: Refresh token timer should only show AFTER access token expires
      // This matches the business requirement: 2min access + 2min refresh = 4min total
      
      // Priority 1: Check for transition states first (Continue to Work or Logout)
      // This provides better user experience by showing animated progress bar during operations
      if (refreshTokenStatus.isContinueToWorkTransition || refreshTokenStatus.isLogoutTransition) {
        return this.calculateTransitionState(now, refreshTokenStatus);
      }
      
      // Priority 2: If access token is still valid, show access token timer (regardless of refresh token)
      if (!isActivityBasedTokenExpired) {
        // Access token is still valid - show access token timer
        // Hide refresh token timer during access token period
        return this.calculateAccessTokenTimer(now, refreshTokenStatus);
      }
      
      // Priority 3: Access token expired - check if refresh token countdown is active
      if (refreshTokenExpiry) {
        // Refresh token timer is active - show countdown
        // This is the 2-minute period after access token expires
        return this.calculateRefreshTokenTimer(now, refreshTokenStatus);
      } else {
        // Access token expired AND no refresh timer yet - transition state
        // This is the brief period between access token expiry and modal appearance
        return this.calculateTransitionState(now, refreshTokenStatus);
      }
    } catch (error) {
      console.error('Error calculating timer state:', error);
      return this.createErrorState('Error calculating time');
    }
  }

  // Static property to track last logged state for debugging
  private static lastLoggedState: string | null = null;

  /**
   * Calculate access token timer (activity-based, resets on user activity)
   * @param now - Current timestamp
   * @param refreshTokenStatus - Refresh token status information
   * @returns TimerState for access token
   */
  private static calculateAccessTokenTimer(now: number, refreshTokenStatus: RefreshTokenStatus): TimerState {
    // Get activity-based token expiry (this resets when user is active)
    const activityStatus = ActivityManager.getActivityStatus();
    const activityExpiry = activityStatus.activityExpiry;

    if (!activityExpiry) {
      return this.createErrorState('No activity expiry data', refreshTokenStatus);
    }

    const timeUntilActivityExpiry = Math.max(0, activityExpiry - now);
    const minutes = Math.floor(timeUntilActivityExpiry / 60000);
    const seconds = Math.floor((timeUntilActivityExpiry % 60000) / 1000);
    const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    // Calculate progress based on activity token duration (2 minutes)
    const totalDuration = AUTH_CONFIG.ACTIVITY_TOKEN_EXPIRY;
    const elapsed = totalDuration - timeUntilActivityExpiry;
    const progressPercentage = Math.min(100, (elapsed / totalDuration) * 100);

    return {
      timeDisplay,
      statusMessage: ACTIVITY_DEBUGGER_MESSAGES.ACCESS_TOKEN_VALID,
      progressPercentage,
      isAccessTokenExpired: false,
      isCountingDown: false,
      remainingCountdownSeconds: Math.ceil(timeUntilActivityExpiry / 1000),
      timerType: 'access',
      sectionTitle: ACTIVITY_DEBUGGER_MESSAGES.INACTIVITY_TIMER_HEADER,
      isTransitionState: false,
      refreshTokenExpiry: refreshTokenStatus.expiry,
      refreshTokenTimeRemaining: refreshTokenStatus.timeRemaining,
    };
  }

  /**
   * Calculate transition state (Activity-based token expired, waiting for modal)
   * @param now - Current timestamp
   * @param refreshTokenStatus - Refresh token status information
   * @returns TimerState for transition period
   * 
   * NOTE: This state appears in two scenarios:
   * 1. Activity-based token has expired (user was inactive for 1 minute)
   * 2. Refresh token timer hasn't started yet (modal preparing to show)
   * 3. This is the brief gap between token expiry detection and modal appearance
   * 4. User clicked "Continue to Work" and refresh operation is in progress
   * 5. User clicked "Logout" and logout operation is in progress
   */
  private static calculateTransitionState(now: number, refreshTokenStatus: RefreshTokenStatus): TimerState {
    // Check if we're in a "Continue to Work" transition state
    const isContinueToWorkTransition = refreshTokenStatus.isContinueToWorkTransition;
    const isLogoutTransition = refreshTokenStatus.isLogoutTransition;
    
    if (isContinueToWorkTransition) {
      // Transition state during "Continue to Work" refresh operation
      return {
        timeDisplay: 'Refreshing...',
        statusMessage: ACTIVITY_DEBUGGER_MESSAGES.TRANSITION_CONTINUE_TO_WORK,
        progressPercentage: 50, // Show progress during refresh
        isAccessTokenExpired: true,
        isCountingDown: false,
        remainingCountdownSeconds: 0,
        timerType: 'transition',
        sectionTitle: ACTIVITY_DEBUGGER_MESSAGES.TRANSITION_HEADER,
        isTransitionState: true,
        refreshTokenExpiry: refreshTokenStatus.expiry,
        refreshTokenTimeRemaining: refreshTokenStatus.timeRemaining,
      };
    }
    
    if (isLogoutTransition) {
      // Transition state during logout operation
      return {
        timeDisplay: 'Logging out...',
        statusMessage: 'Logging out of session...',
        progressPercentage: 50, // Show progress during logout
        isAccessTokenExpired: true,
        isCountingDown: false,
        remainingCountdownSeconds: 0,
        timerType: 'transition',
        sectionTitle: ACTIVITY_DEBUGGER_MESSAGES.TRANSITION_HEADER,
        isTransitionState: true,
        refreshTokenExpiry: refreshTokenStatus.expiry,
        refreshTokenTimeRemaining: refreshTokenStatus.timeRemaining,
      };
    }
    
    // Normal transition state (waiting for modal)
    return {
      timeDisplay: 'Preparing...',
      statusMessage: ACTIVITY_DEBUGGER_MESSAGES.TRANSITION_WAITING,
      progressPercentage: 100, // Full progress - waiting for modal
      isAccessTokenExpired: true,
      isCountingDown: false,
      remainingCountdownSeconds: 0,
      timerType: 'transition',
      sectionTitle: ACTIVITY_DEBUGGER_MESSAGES.TRANSITION_HEADER,
      isTransitionState: true,
      refreshTokenExpiry: refreshTokenStatus.expiry,
      refreshTokenTimeRemaining: refreshTokenStatus.timeRemaining,
    };
  }

  /**
   * Calculate refresh token timer (fixed countdown, NOT affected by user activity)
   * @param now - Current timestamp
   * @param refreshTokenStatus - Refresh token status information
   * @returns TimerState for refresh token
   * 
   * IMPORTANT: This method IGNORES all user activity and shows fixed countdown
   * The refresh token countdown should NEVER be affected by mouse movement or user actions
   * 
   * NEW: Progress bar now shows 0% to 100% over the 1-minute refresh token duration
   * This provides a clearer visual representation of the refresh token countdown
   */
  private static calculateRefreshTokenTimer(now: number, refreshTokenStatus: RefreshTokenStatus): TimerState {
    const refreshTokenExpiry = refreshTokenStatus.expiry;
    const timeRemaining = refreshTokenStatus.timeRemaining;

    if (!refreshTokenExpiry || !timeRemaining || timeRemaining <= 0) {
      return {
        timeDisplay: '0m 0s',
        statusMessage: 'Session expired',
        progressPercentage: 100,
        isAccessTokenExpired: true,
        isCountingDown: false,
        remainingCountdownSeconds: 0,
        timerType: 'refresh',
        sectionTitle: ACTIVITY_DEBUGGER_MESSAGES.INACTIVITY_TIMER_HEADER,
        isTransitionState: false,
        refreshTokenExpiry: refreshTokenStatus.expiry,
        refreshTokenTimeRemaining: refreshTokenStatus.timeRemaining,
      };
    }

    const countdownSeconds = Math.ceil(timeRemaining / 1000);
    const minutes = Math.floor(countdownSeconds / 60);
    const seconds = countdownSeconds % 60;
    const timeDisplay = `${minutes}m ${seconds}s`;

    // NEW: Progress based on 1-minute refresh token duration (0% to 100%)
    // This provides a clearer visual representation of the refresh token countdown
    const refreshTokenDurationSeconds = AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS / 1000; // 1 minute in seconds
    const elapsedSeconds = refreshTokenDurationSeconds - countdownSeconds;
    const progressPercentage = Math.min(100, Math.max(0, (elapsedSeconds / refreshTokenDurationSeconds) * 100));

    return {
      timeDisplay,
      statusMessage: ACTIVITY_DEBUGGER_MESSAGES.COUNTDOWN_WARNING,
      progressPercentage,
      isAccessTokenExpired: true,
      isCountingDown: true,
      remainingCountdownSeconds: countdownSeconds,
      timerType: 'refresh',
      sectionTitle: ACTIVITY_DEBUGGER_MESSAGES.INACTIVITY_TIMER_HEADER,
      isTransitionState: false,
      refreshTokenExpiry: refreshTokenStatus.expiry,
      refreshTokenTimeRemaining: refreshTokenStatus.timeRemaining,
    };
  }

  /**
   * Create error state when timer calculation fails
   * @param message - Error message to display
   * @param refreshTokenStatus - Refresh token status information
   * @returns TimerState for error condition
   */
  private static createErrorState(message: string, refreshTokenStatus?: RefreshTokenStatus): TimerState {
    return {
      timeDisplay: ACTIVITY_DEBUGGER_MESSAGES.NOT_AVAILABLE,
      statusMessage: message,
      progressPercentage: 0,
      isAccessTokenExpired: false,
      isCountingDown: false,
      remainingCountdownSeconds: 0,
      timerType: 'access',
      sectionTitle: ACTIVITY_DEBUGGER_MESSAGES.INACTIVITY_TIMER_HEADER,
      isTransitionState: false,
      refreshTokenExpiry: refreshTokenStatus?.expiry || null,
      refreshTokenTimeRemaining: refreshTokenStatus?.timeRemaining || null,
    };
  }
}
