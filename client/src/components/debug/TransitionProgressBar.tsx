import React, { useState, useEffect } from 'react';
import {
  ACTIVITY_DEBUGGER_LAYOUT,
  ACTIVITY_DEBUGGER_MESSAGES,
  ACTIVITY_DEBUGGER_COLORS
} from '../../constants/activityDebugger';

/**
 * Transition Progress Bar Props Interface
 * Defines props for the TransitionProgressBar component
 */
interface TransitionProgressBarProps {
  className?: string;
}

/**
 * Transition Progress Bar Component
 * Displays a skeleton-like loading state during token transition
 * Shows when access token expires but before session modal appears
 * 
 * Features:
 * - Animated progress bar with pulsing effect
 * - Loading state indicator
 * - Simulates waiting for server response
 * - Smooth transition animation
 */
const TransitionProgressBar: React.FC<TransitionProgressBarProps> = ({
  className = ''
}) => {
  const [progress, setProgress] = useState<number>(0);

  // Animate progress bar during transition
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Smooth progress animation that never reaches 100%
        const newProgress = prev + Math.random() * 5;
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${ACTIVITY_DEBUGGER_LAYOUT.SECTION_BORDER} ${className}`}>
      <div className={`${ACTIVITY_DEBUGGER_LAYOUT.HEADER_TEXT} mb-2`}>
        ⏳ TRANSITION STATE
      </div>

      {/* Main Transition Display */}
      <div className="text-center mb-2">
        <div className={`${ACTIVITY_DEBUGGER_LAYOUT.LARGE_TIMER_TEXT} ${ACTIVITY_DEBUGGER_COLORS.WARNING}`}>
          Loading...
        </div>
        <div className={`${ACTIVITY_DEBUGGER_LAYOUT.CONTENT_TEXT} font-semibold ${ACTIVITY_DEBUGGER_COLORS.WARNING}`}>
          🟡 PREPARING SESSION
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className={`w-full ${ACTIVITY_DEBUGGER_COLORS.PROGRESS_BACKGROUND} rounded-full h-2 mb-2`}>
        <div
          className={`h-2 rounded-full transition-all duration-300 ${ACTIVITY_DEBUGGER_COLORS.PROGRESS_WARNING} animate-pulse`}
          style={{ width: `${Math.min(95, progress)}%` }}
        ></div>
      </div>

      {/* Status Message */}
      <div className={`text-center mb-2 ${ACTIVITY_DEBUGGER_LAYOUT.SMALL_TEXT} ${ACTIVITY_DEBUGGER_COLORS.WARNING}`}>
        <div className="font-medium">
          {ACTIVITY_DEBUGGER_MESSAGES.TRANSITION_STATE}
        </div>
        <div className="mt-1">
          Preparing session management...
        </div>
      </div>

      {/* Transition Details */}
      <div className={`space-y-1 ${ACTIVITY_DEBUGGER_LAYOUT.SMALL_TEXT}`}>
        <div className="flex justify-between">
          <span>State:</span>
          <span className="font-mono">Transition</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="font-mono">Access Token Expired</span>
        </div>
        <div className="flex justify-between">
          <span>Progress:</span>
          <span className="font-mono">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className={`mt-2 ${ACTIVITY_DEBUGGER_LAYOUT.SMALL_TEXT} ${ACTIVITY_DEBUGGER_COLORS.NEUTRAL}`}>
        <div>Waiting for session modal to appear</div>
        <div>This is the gap between token expiry and modal display</div>
      </div>
    </div>
  );
};

export default TransitionProgressBar;
