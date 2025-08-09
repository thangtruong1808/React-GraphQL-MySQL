import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import InactivityTimer from './InactivityTimer';
import SystemInfoSection from './SystemInfoSection';
import HelpInfoSection from './HelpInfoSection';
import UserInfoSection from './UserInfoSection';
import {
  ACTIVITY_DEBUGGER_LAYOUT,
  ACTIVITY_DEBUGGER_MESSAGES,
  ACTIVITY_DEBUGGER_COLORS
} from '../../constants/activityDebugger';

/**
 * Activity Debugger Component
 * Simplified debug tool for monitoring user activity and system information
 * Includes prominent inactivity timer, system info, user info, and help sections
 * 
 * NOTE: This component should only be used in development mode
 * IMPORTANT: Only displays when user is successfully logged in
 */
const ActivityDebugger: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <>
      {/* Only show toggle button when user is authenticated */}
      {isAuthenticated && (
        <button
          onClick={() => setIsVisible(!isVisible)} // Toggle debug panel visibility
          className={`${ACTIVITY_DEBUGGER_LAYOUT.TOGGLE_BUTTON_POSITION} ${ACTIVITY_DEBUGGER_COLORS.PRIMARY_BUTTON} ${ACTIVITY_DEBUGGER_COLORS.BUTTON_TEXT} px-4 py-2 ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_ROUNDED} text-sm font-medium transition-colors ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_SHADOW}`}
        >
          {isVisible ? ACTIVITY_DEBUGGER_MESSAGES.HIDE_DEBUG : ACTIVITY_DEBUGGER_MESSAGES.SHOW_DEBUG}
        </button>
      )}

      {/* Debug Panel - only show when authenticated and visible */}
      {isAuthenticated && isVisible && (
        <div className={`${ACTIVITY_DEBUGGER_LAYOUT.PANEL_POSITION} ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_BACKGROUND} ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_BORDER} ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_ROUNDED} ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_SHADOW} ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_PADDING} w-80 max-h-full overflow-y-auto`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {ACTIVITY_DEBUGGER_MESSAGES.TITLE}
          </h3>

          <div className={`${ACTIVITY_DEBUGGER_LAYOUT.SECTION_SPACING} ${ACTIVITY_DEBUGGER_LAYOUT.CONTENT_TEXT}`}>
            {/* User Information Section */}
            <UserInfoSection
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              userEmail={user?.email || ACTIVITY_DEBUGGER_MESSAGES.NOT_AVAILABLE}
              userRole={user?.role || ACTIVITY_DEBUGGER_MESSAGES.NOT_AVAILABLE}
            />

            {/* Prominent Inactivity Timer */}
            <InactivityTimer />

            {/* System Information Section */}
            <SystemInfoSection currentTime={currentTime} />

            {/* Help Information Section */}
            <HelpInfoSection />
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityDebugger;