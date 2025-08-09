import React from 'react';
import { ACTIVITY_DEBUGGER_LAYOUT, ACTIVITY_DEBUGGER_MESSAGES } from '../../constants/activityDebugger';

/**
 * User Info Section Props Interface
 * Defines props for the UserInfoSection component
 */
interface UserInfoSectionProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string;
  userRole: string;
  className?: string;
}

/**
 * User Information Section Component
 * Displays user authentication status and basic user information
 * 
 * Features:
 * - Authentication status display
 * - User email and role information
 * - Loading state handling
 * - Color-coded status indicators
 */
const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  isAuthenticated,
  isLoading,
  userEmail,
  userRole,
  className = ''
}) => {
  // Get authentication status display text and color
  const getAuthStatus = () => {
    if (isLoading) return { text: ACTIVITY_DEBUGGER_MESSAGES.LOADING, color: 'text-yellow-600' };
    if (isAuthenticated) return { text: ACTIVITY_DEBUGGER_MESSAGES.AUTHENTICATED, color: 'text-green-600' };
    return { text: ACTIVITY_DEBUGGER_MESSAGES.NOT_AUTHENTICATED, color: 'text-red-600' };
  };

  const authStatus = getAuthStatus();

  return (
    <div className={`${ACTIVITY_DEBUGGER_LAYOUT.SECTION_BORDER} ${className}`}>
      <div className={`${ACTIVITY_DEBUGGER_LAYOUT.HEADER_TEXT} mb-1`}>
        {ACTIVITY_DEBUGGER_MESSAGES.USER_INFO_HEADER}
      </div>

      <div className="flex justify-between">
        <span className="font-medium">Status:</span>
        <span className={`font-mono ${authStatus.color}`}>
          {authStatus.text}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="font-medium">User:</span>
        <span className="font-mono text-gray-600">{userEmail}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-medium">Role:</span>
        <span className="font-mono text-gray-600">{userRole}</span>
      </div>
    </div>
  );
};

export default UserInfoSection;
