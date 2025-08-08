import React from 'react';
import { useAppFocusedActivityTracker } from '../../hooks/custom/useAppFocusedActivityTracker';

/**
 * Activity Tracker Component
 * Handles user activity tracking across the application
 * Only tracks activity when the application window is focused
 * 
 * CALLED BY: App component
 * SCENARIOS: All application scenarios where user activity needs to be tracked
 */
const ActivityTracker: React.FC = () => {
  // Track user activity across the application (only when app is focused)
  const { isAppFocused } = useAppFocusedActivityTracker();

  // This component doesn't render anything visible
  // It only handles activity tracking logic
  return null;
};

export default ActivityTracker;
