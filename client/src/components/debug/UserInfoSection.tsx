import React from 'react';
import { ACTIVITY_DEBUGGER_LAYOUT, ACTIVITY_DEBUGGER_MESSAGES } from '../../constants/activityDebugger';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

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
  // Get authentication status display text and theme color
  const getAuthStatus = () => {
    if (isLoading) {
      return { 
        text: ACTIVITY_DEBUGGER_MESSAGES.LOADING, 
        color: '#ca8a04' // yellow-600 equivalent
      };
    }
    if (isAuthenticated) {
      return { 
        text: ACTIVITY_DEBUGGER_MESSAGES.AUTHENTICATED, 
        color: 'var(--success-text, #166534)' 
      };
    }
    return { 
      text: ACTIVITY_DEBUGGER_MESSAGES.NOT_AUTHENTICATED, 
      color: 'var(--error-text, #991b1b)' 
    };
  };

  const authStatus = getAuthStatus();

  return (
    <div 
      className={`${className}`}
      style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}
    >
      <div 
        className="text-xs font-semibold mb-1"
        style={{ color: 'var(--text-primary)' }}
      >
        {ACTIVITY_DEBUGGER_MESSAGES.USER_INFO_HEADER}
      </div>

      <div className="flex justify-between">
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Status:</span>
        <span className="font-mono" style={{ color: authStatus.color }}>
          {authStatus.text}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>User:</span>
        <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{userEmail}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Role:</span>
        <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{formatRoleForDisplay(userRole)}</span>
      </div>
    </div>
  );
};

export default UserInfoSection;
