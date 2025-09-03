import React from 'react';
import { useAppFocusedActivityTracker } from '../../hooks/custom/useAppFocusedActivityTracker';

/**

 * FEATURES:
 * - Tracks mouse, keyboard, touch, and scroll events automatically
 * - Only tracks activity when application window is focused
 * - Updates authentication activity timestamps
 * - Prevents false activity detection when app is not focused 
 */
const ActivityTracker: React.FC = () => {
  // Initialize the app-focused activity tracker
  // The hook automatically sets up event listeners and handles all activity tracking
  useAppFocusedActivityTracker();

  // This component doesn't render anything visible
  // It only handles background activity tracking logic
  return null;
};

export default ActivityTracker;
