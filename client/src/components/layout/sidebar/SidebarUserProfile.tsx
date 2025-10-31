import React from 'react';
import { formatRoleForDisplay } from '../../../utils/roleFormatter';

/**
 * Sidebar User Profile Props Interface
 */
interface SidebarUserProfileProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null;
  isCollapsed: boolean;
}

/**
 * Sidebar User Profile Component
 * Displays user avatar, name, email, and role in sidebar
 * Adapts to collapsed state by hiding user details
 */
const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ user, isCollapsed }) => {
  /**
   * Get user initials for avatar display
   * Returns user's first and last name initials
   */
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  return (
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
      {/* User Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-base">
            {getUserInitials()}
          </span>
        </div>
      </div>

      {/* User Details - Only show when expanded */}
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-gray-900 dark:text-white [data-theme='brand']:text-purple-900 truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600 truncate">
            {user?.email}
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 [data-theme='brand']:text-purple-700 font-medium truncate">
            {user?.role ? formatRoleForDisplay(user.role) : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default SidebarUserProfile;

