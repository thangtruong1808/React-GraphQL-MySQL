/**
 * Debug Logger Utility
 * Provides centralized debug logging for development and troubleshooting
 */

/**
 * Debug configuration
 */
const DEBUG_CONFIG = {
  ENABLE_TOKEN_REFRESH_LOGGING: false, // DISABLED: Dynamic buffer issue fixed
  ENABLE_TIMING_LOGGING: false, // DISABLED: Remove console.log from browser
  ENABLE_SESSION_LOGGING: false, // DISABLED: Remove console.log from browser
};

/**
 * Log token refresh timing information
 * @param operation - The operation being performed
 * @param timeRemaining - Time remaining on refresh token
 * @param additionalInfo - Additional information to log
 */
export const logTokenRefreshTiming = (
  operation: string,
  timeRemaining: number | null,
  additionalInfo?: Record<string, any>
) => {
  if (!DEBUG_CONFIG.ENABLE_TOKEN_REFRESH_LOGGING) return;

  const info = {
    operation,
    timeRemaining: timeRemaining ? `${Math.ceil(timeRemaining / 1000)}s` : 'null',
    timestamp: new Date().toISOString(),
    ...additionalInfo,
  };

  console.log('🔄 Token Refresh Timing:', info);
};

/**
 * Log session state information
 * @param state - The session state
 * @param additionalInfo - Additional information to log
 */
export const logSessionState = (
  state: string,
  additionalInfo?: Record<string, any>
) => {
  if (!DEBUG_CONFIG.ENABLE_SESSION_LOGGING) return;

  const info = {
    state,
    timestamp: new Date().toISOString(),
    ...additionalInfo,
  };

  console.log('📊 Session State:', info);
};

/**
 * Log timing information
 * @param context - The timing context
 * @param value - The timing value
 * @param additionalInfo - Additional information to log
 */
export const logTiming = (
  context: string,
  value: number | string,
  additionalInfo?: Record<string, any>
) => {
  if (!DEBUG_CONFIG.ENABLE_TIMING_LOGGING) return;

  const info = {
    context,
    value,
    timestamp: new Date().toISOString(),
    ...additionalInfo,
  };

  console.log('⏱️ Timing:', info);
};
