import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TimerCalculator, TimerState } from './TimerCalculator';
import TransitionProgressBar from './TransitionProgressBar';
import RefreshTokenInfo from './RefreshTokenInfo';
import {
  ACTIVITY_DEBUGGER_UI,
  ACTIVITY_DEBUGGER_MESSAGES,
  ACTIVITY_DEBUGGER_COLORS,
  ACTIVITY_DEBUGGER_LAYOUT
} from '../../constants/activityDebugger';

/**
 * Inactivity Timer Props Interface
 * Defines props for the InactivityTimer component
 */
interface InactivityTimerProps {
  className?: string;
}

/**
 * Inactivity Timer Component
 * Displays prominent token expiry timer with progress bar and countdown
 * Shows different states based on access token validity and expiry
 * 
 * Features:
 * - Dynamic access token timer (resets on user activity)
 * - Fixed refresh token countdown (unaffected by user activity)
 * - Progress bar with color-coded states
 * - Real-time updates every second
 */
const InactivityTimer: React.FC<InactivityTimerProps> = ({ className = '' }) => {
  const { showSessionExpiryModal } = useAuth(); // Access modal state for transition detection
  const [timerState, setTimerState] = useState<TimerState>({
    timeDisplay: ACTIVITY_DEBUGGER_MESSAGES.NOT_AVAILABLE,
    statusMessage: ACTIVITY_DEBUGGER_MESSAGES.ACCESS_TOKEN_VALID,
    progressPercentage: 0,
    isAccessTokenExpired: false,
    isCountingDown: false,
    remainingCountdownSeconds: 0,
    timerType: 'access',
    sectionTitle: ACTIVITY_DEBUGGER_MESSAGES.INACTIVITY_TIMER_HEADER,
  });

  // Update timer state every second
  useEffect(() => {
    // Update timer state using the TimerCalculator utility (async)
    const updateTimer = async () => {
      try {
        const newTimerState = await TimerCalculator.calculateTimerState();
        setTimerState(newTimerState);
      } catch (error) {
        console.error('Error updating timer state:', error);
        // Set fallback state on error
        setTimerState({
          timeDisplay: ACTIVITY_DEBUGGER_MESSAGES.NOT_AVAILABLE,
          statusMessage: 'Error updating timer',
          progressPercentage: 0,
          isAccessTokenExpired: false,
          isCountingDown: false,
          remainingCountdownSeconds: 0,
          timerType: 'access',
          sectionTitle: ACTIVITY_DEBUGGER_MESSAGES.INACTIVITY_TIMER_HEADER,
        });
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, ACTIVITY_DEBUGGER_UI.UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []); // No dependencies needed - TimerCalculator handles all state internally



  // Determine display colors based on state
  const getTimerColor = () => {
    if (timerState.timerType === 'transition') {
      return ACTIVITY_DEBUGGER_COLORS.WARNING; // Yellow for transition state
    }
    if (timerState.timerType === 'refresh') {
      return ACTIVITY_DEBUGGER_COLORS.DANGER; // Red for refresh token countdown
    }
    if (timerState.isAccessTokenExpired) {
      return ACTIVITY_DEBUGGER_COLORS.DANGER;
    }
    return ACTIVITY_DEBUGGER_COLORS.SUCCESS;
  };

  const getProgressBarColor = () => {
    if (timerState.timerType === 'transition') {
      return ACTIVITY_DEBUGGER_COLORS.PROGRESS_WARNING; // Yellow progress for transition
    }
    if (timerState.timerType === 'refresh') {
      return ACTIVITY_DEBUGGER_COLORS.PROGRESS_DANGER; // Red progress for refresh token
    }
    if (timerState.isAccessTokenExpired) {
      return ACTIVITY_DEBUGGER_COLORS.PROGRESS_DANGER;
    }
    if (timerState.progressPercentage >= ACTIVITY_DEBUGGER_UI.PROGRESS_WARNING_THRESHOLD) {
      return ACTIVITY_DEBUGGER_COLORS.PROGRESS_WARNING;
    }
    return ACTIVITY_DEBUGGER_COLORS.PROGRESS_SUCCESS;
  };

  const getStatusIcon = () => {
    if (timerState.timerType === 'transition') {
      return '🟡 TRANSITIONING'; // Special status for transition state
    }
    if (timerState.timerType === 'refresh') {
      return '🔴 LOGOUT COUNTDOWN'; // Special status for refresh token countdown
    }
    return timerState.isAccessTokenExpired
      ? ACTIVITY_DEBUGGER_MESSAGES.INACTIVE_STATUS
      : ACTIVITY_DEBUGGER_MESSAGES.ACTIVE_STATUS;
  };

  // Show transition progress bar for transition state
  if (timerState.timerType === 'transition') {
    return (
      <>
        <TransitionProgressBar className={className} />
        {/* Don't show RefreshTokenInfo during transition - wait for refresh timer to start */}
      </>
    );
  }

  return (
    <>
      <div className={`${ACTIVITY_DEBUGGER_LAYOUT.SECTION_BORDER} ${className}`}>
        <div className={`${ACTIVITY_DEBUGGER_LAYOUT.HEADER_TEXT} mb-2`}>
          {timerState.sectionTitle}
        </div>

        {/* Main Timer Display */}
        <div className="text-center mb-2">
          <div className={`${ACTIVITY_DEBUGGER_LAYOUT.LARGE_TIMER_TEXT} ${getTimerColor()}`}>
            {timerState.timeDisplay}
          </div>
          <div className={`${ACTIVITY_DEBUGGER_LAYOUT.CONTENT_TEXT} font-semibold ${getTimerColor()}`}>
            {getStatusIcon()}
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full ${ACTIVITY_DEBUGGER_COLORS.PROGRESS_BACKGROUND} rounded-full h-2 mb-2`}>
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${getProgressBarColor()}`}
            style={{ width: `${Math.min(100, timerState.progressPercentage)}%` }}
          ></div>
        </div>

        {/* Status Message - Only show for refresh token countdown */}
        {timerState.isCountingDown && timerState.timerType === 'refresh' && (
          <div className={`text-center mb-2 ${ACTIVITY_DEBUGGER_LAYOUT.SMALL_TEXT} ${ACTIVITY_DEBUGGER_COLORS.DANGER}`}>
            <div className="font-medium">
              {timerState.statusMessage}
            </div>
          </div>
        )}

        {/* Essential Timer Details - Simplified */}
        <div className={`space-y-1 ${ACTIVITY_DEBUGGER_LAYOUT.SMALL_TEXT}`}>
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-mono">
              {timerState.timerType === 'access' ? 'Access Token' :
                timerState.timerType === 'refresh' ? 'Refresh Token' : 'Transition'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Progress:</span>
            <span className="font-mono">{Math.round(timerState.progressPercentage)}%</span>
          </div>
        </div>

      </div>

      {/* Show RefreshTokenInfo only when timer type is refresh */}
      {timerState.timerType === 'refresh' && (
        <RefreshTokenInfo timerState={timerState} />
      )}
    </>
  );
};

export default InactivityTimer;
