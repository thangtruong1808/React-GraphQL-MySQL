import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import InactivityTimer from './InactivityTimer';
import SystemInfoSection from './SystemInfoSection';
import HelpInfoSection from './HelpInfoSection';
import UserInfoSection from './UserInfoSection';
import {
  ACTIVITY_DEBUGGER_LAYOUT,
  ACTIVITY_DEBUGGER_MESSAGES,
  ACTIVITY_DEBUGGER_COLORS,
  ACTIVITY_DEBUGGER_UI
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
  const prevIsAuthenticatedRef = useRef<boolean>(isAuthenticated);

  // Hide debug panel only on actual logout (not during refresh operations)
  useEffect(() => {
    const wasAuthenticated = prevIsAuthenticatedRef.current;
    const isNowAuthenticated = isAuthenticated;

    // Only hide panel when transitioning from authenticated to unauthenticated (actual logout)
    // This prevents hiding during session refresh when user remains authenticated
    if (wasAuthenticated && !isNowAuthenticated && ACTIVITY_DEBUGGER_UI.HIDE_ON_AUTH_CHANGE) {
      setIsVisible(false);
    }

    // Update ref to track current authentication state
    prevIsAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]); // Only watch isAuthenticated, not user?.id

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
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      {/* Only show toggle button when user is authenticated */}
      {isAuthenticated && (
        <button
          onClick={() => setIsVisible(!isVisible)} // Toggle debug panel visibility
          className={`${ACTIVITY_DEBUGGER_LAYOUT.TOGGLE_BUTTON_POSITION} px-4 py-2 ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_ROUNDED} text-sm font-medium transition-colors ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_SHADOW}`}
          style={{
            backgroundColor: 'var(--accent-from)',
            color: 'var(--text-primary)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-to)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-from)'}
        >
          {isVisible ? ACTIVITY_DEBUGGER_MESSAGES.HIDE_DEBUG : ACTIVITY_DEBUGGER_MESSAGES.SHOW_DEBUG}
        </button>
      )}

      {/* Debug Panel - only show when authenticated and visible */}
      {isAuthenticated && isVisible && (
        <div
          className={`${ACTIVITY_DEBUGGER_LAYOUT.PANEL_POSITION} ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_ROUNDED} ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_SHADOW} ${ACTIVITY_DEBUGGER_LAYOUT.PANEL_PADDING} w-80 max-h-full overflow-y-auto`}
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}
        >
          <h3
            className="text-lg font-semibold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
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