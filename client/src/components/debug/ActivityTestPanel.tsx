import React from 'react';
import { useAppFocusedActivityTracker } from '../../hooks/custom/useAppFocusedActivityTracker';
import { ActivityManager } from '../../utils/tokenManager';

/**
 * Activity Test Panel Component
 * Debug component to test and verify activity tracking functionality
 * Only shown in development mode
 * 
 * CALLED BY: App component (development only)
 * SCENARIOS: Testing activity tracking behavior
 */
const ActivityTestPanel: React.FC = () => {
  const { isAppFocused } = useAppFocusedActivityTracker();
  const [lastActivity, setLastActivity] = React.useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = React.useState<number | null>(null);

  // Update activity info every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      const activityStatus = ActivityManager.getActivityStatus();
      setLastActivity(activityStatus.lastActivity);
      setTimeRemaining(activityStatus.timeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDuration = (ms: number | null) => {
    if (ms === null) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Activity Debug</h3>
      <div className="space-y-1 text-xs">
        <div>App Focused: <span className={isAppFocused ? 'text-green-600' : 'text-red-600'}>{isAppFocused ? 'Yes' : 'No'}</span></div>
        <div>Last Activity: {formatTime(lastActivity)}</div>
        <div>Time Remaining: {formatDuration(timeRemaining)}</div>
        <div className="text-xs text-gray-500 mt-2">
          Move mouse inside app to test activity tracking
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Check console for detailed mouse tracking logs
        </div>
      </div>
    </div>
  );
};

export default ActivityTestPanel;
