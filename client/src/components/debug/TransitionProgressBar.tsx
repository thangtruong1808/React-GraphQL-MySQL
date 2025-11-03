import React, { useState, useEffect } from 'react';
import {
  ACTIVITY_DEBUGGER_MESSAGES,
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
    <div 
      className={className}
      style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}
    >
      <div 
        className="text-xs font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        ⏳ TRANSITION STATE
      </div>

      {/* Main Transition Display */}
      <div className="text-center mb-2">
        <div 
          className="text-2xl font-bold"
          style={{ color: '#ca8a04' }} // yellow-600 equivalent
        >
          Loading...
        </div>
        <div 
          className="text-sm font-semibold"
          style={{ color: '#ca8a04' }} // yellow-600 equivalent
        >
          🟡 PREPARING SESSION
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div 
        className="w-full rounded-full h-2 mb-2"
        style={{ backgroundColor: 'var(--border-light, #f3f4f6)' }}
      >
        <div
          className="h-2 rounded-full transition-all duration-300 animate-pulse"
          style={{ 
            width: `${Math.min(95, progress)}%`,
            backgroundColor: '#eab308' // yellow-500 equivalent
          }}
        ></div>
      </div>

      {/* Status Message */}
      <div 
        className="text-center mb-2 text-xs"
        style={{ color: '#ca8a04' }} // yellow-600 equivalent
      >
        <div className="font-medium">
          {ACTIVITY_DEBUGGER_MESSAGES.TRANSITION_STATE}
        </div>
        <div className="mt-1">
          Preparing session management...
        </div>
      </div>

      {/* Transition Details */}
      <div className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-primary)' }}>State:</span>
          <span className="font-mono">Transition</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-primary)' }}>Status:</span>
          <span className="font-mono">Access Token Expired</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-primary)' }}>Progress:</span>
          <span className="font-mono">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Additional Info */}
      <div 
        className="mt-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        <div>Waiting for session modal to appear</div>
        <div>This is the gap between token expiry and modal display</div>
      </div>
    </div>
  );
};

export default TransitionProgressBar;
