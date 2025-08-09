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
 * Timer Calculator Utility
 * Calculates timer states for both access and refresh tokens
 * Handles activity-based token reset for access tokens
 * Keeps refresh token countdown unaffected by user activity
 */
export class TimerCalculator {
  /**
   * Calculate the current timer state based on token status
   * @returns TimerState object with all timer information
   */
  static calculateTimerState(): TimerState {
    try {
      const tokens = getTokens();
      const now = Date.now();

      // Get refresh token status for display
      const refreshTokenStatus = TokenManager.getRefreshTokenStatus();

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
        
        // Only log when state changes occur
        const currentState = isActivityBasedTokenExpired ? (refreshTokenExpiry ? 'refresh' : 'transition') : 'activity';
        if (!this.lastLoggedState || this.lastLoggedState !== currentState) {
          console.log('🔄 Timer State Change:', currentState, debugInfo);
          this.lastLoggedState = currentState;
        }
      }

      // The logic must match the session manager:
      // 1. Activity-based token NOT expired -> Show activity timer
      // 2. Activity-based token expired AND no refresh timer -> Transition state (modal is being prepared)
      // 3. Activity-based token expired AND refresh timer exists -> Refresh countdown
      
      if (!isActivityBasedTokenExpired) {
        // Activity-based token is still valid - show activity timer
        // This covers the case where user moves mouse and resets the timer
        return this.calculateAccessTokenTimer(now, refreshTokenStatus);
      } else {
        // Activity-based token has expired - check modal/refresh state
        if (!refreshTokenExpiry) {
          // No refresh token timer started yet - transition state (waiting for modal)
          // This is the brief period between activity expiry and modal appearance
          return this.calculateTransitionState(now, refreshTokenStatus);
        } else {
          // Refresh token timer active - show countdown
          // Modal has appeared and refresh token countdown started
          return this.calculateRefreshTokenTimer(now, refreshTokenStatus);
        }
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
  private static calculateAccessTokenTimer(now: number, refreshTokenStatus: any): TimerState {
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
   * NOTE: This state only appears when:
   * 1. Activity-based token has expired (user was inactive for 2 minutes)
   * 2. Refresh token timer hasn't started yet (modal preparing to show)
   * 3. This is the brief gap between token expiry detection and modal appearance
   */
  private static calculateTransitionState(now: number, refreshTokenStatus: any): TimerState {
    // Show a loading/transition state with progress bar
    // This represents the brief time between activity-based token expiry and session modal appearance
    
    // Use a simple animated progress that cycles between 20% and 80%
    // This avoids timing-based calculations that could be inconsistent
    const cycleTime = 1000; // 1 second cycle
    const phase = (now % cycleTime) / cycleTime; // 0 to 1
    const baseProgress = 20 + (Math.sin(phase * Math.PI * 2) + 1) * 30; // 20% to 80%
    
    return {
      timeDisplay: 'Loading...',
      statusMessage: ACTIVITY_DEBUGGER_MESSAGES.TRANSITION_STATE,
      progressPercentage: Math.round(baseProgress),
      isAccessTokenExpired: true,
      isCountingDown: false,
      remainingCountdownSeconds: 0,
      timerType: 'transition',
      sectionTitle: ACTIVITY_DEBUGGER_MESSAGES.INACTIVITY_TIMER_HEADER,
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
   */
  private static calculateRefreshTokenTimer(now: number, refreshTokenStatus: any): TimerState {
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

    // Progress based on refresh token duration (4 minutes) - countdown style
    const totalCountdown = AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS / 1000;
    const progressPercentage = Math.min(100, ((totalCountdown - countdownSeconds) / totalCountdown) * 100);

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
  private static createErrorState(message: string, refreshTokenStatus?: any): TimerState {
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
