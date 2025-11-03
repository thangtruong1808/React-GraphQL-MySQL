import React, { useState, useEffect } from 'react';
import { TimerCalculator, TimerState } from './TimerCalculator';
import TransitionProgressBar from './TransitionProgressBar';
import RefreshTokenInfo from './RefreshTokenInfo';
import {
  ACTIVITY_DEBUGGER_UI,
  ACTIVITY_DEBUGGER_MESSAGES
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



  

  // Determine display colors based on state using theme variables
  const getTimerColor = () => {
    if (timerState.timerType === 'transition') {
      return { color: '#ca8a04' }; // yellow-600 equivalent
    }
    if (timerState.timerType === 'refresh') {
      return { color: 'var(--error-text, #991b1b)' }; // Red for refresh token countdown
    }
    if (timerState.isAccessTokenExpired) {
      return { color: 'var(--error-text, #991b1b)' };
    }
    return { color: 'var(--success-text, #166534)' };
  };

  const getProgressBarColor = () => {
    if (timerState.timerType === 'transition') {
      return { backgroundColor: '#eab308' }; // yellow-500 equivalent
    }
    if (timerState.timerType === 'refresh') {
      return { backgroundColor: '#dc2626' }; // red-600 equivalent
    }
    if (timerState.isAccessTokenExpired) {
      return { backgroundColor: '#dc2626' }; // red-600 equivalent
    }
    if (timerState.progressPercentage >= ACTIVITY_DEBUGGER_UI.PROGRESS_WARNING_THRESHOLD) {
      return { backgroundColor: '#eab308' }; // yellow-500 equivalent
    }
    return { backgroundColor: '#16a34a' }; // green-600 equivalent
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

  const timerColor = getTimerColor();
  const progressBarColor = getProgressBarColor();

  return (
    <>
      <div 
        className={className}
        style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}
      >
        <div 
          className="text-xs font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {timerState.sectionTitle}
        </div>

        {/* Main Timer Display */}
        <div className="text-center mb-2">
          <div 
            className="text-2xl font-bold"
            style={timerColor}
          >
            {timerState.timeDisplay}
          </div>
          <div 
            className="text-sm font-semibold"
            style={timerColor}
          >
            {getStatusIcon()}
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          className="w-full rounded-full h-2 mb-2"
          style={{ backgroundColor: 'var(--border-light, #f3f4f6)' }}
        >
          <div
            className="h-2 rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.min(100, timerState.progressPercentage)}%`,
              ...progressBarColor
            }}
          ></div>
        </div>

        {/* Status Message - Only show for refresh token countdown */}
        {timerState.isCountingDown && timerState.timerType === 'refresh' && (
          <div 
            className="text-center mb-2 text-xs"
            style={{ color: 'var(--error-text, #991b1b)' }}
          >
            <div className="font-medium">
              {timerState.statusMessage}
            </div>
          </div>
        )}

        {/* Essential Timer Details - Simplified */}
        <div className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-primary)' }}>Type:</span>
            <span className="font-mono">
              {timerState.timerType === 'access' ? 'Access Token' :
                timerState.timerType === 'refresh' ? 'Refresh Token' : 'Transition'}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-primary)' }}>Progress:</span>
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
