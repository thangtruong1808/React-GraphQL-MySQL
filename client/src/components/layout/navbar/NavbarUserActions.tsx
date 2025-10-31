import React from 'react';
import UserDropdown from '../UserDropdown';

/**
 * Navbar User Actions Props Interface
 */
interface NavbarUserActionsProps {
  isAuthenticated: boolean;
  user: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  } | null;
  isUserDropdownOpen: boolean;
  userDropdownRef: React.RefObject<HTMLDivElement>;
  onToggleUserDropdown: () => void;
  onLogout: () => Promise<void>;
  logoutLoading: boolean;
  getUserInitials: () => string;
}

/**
 * Navbar User Actions Component
 * Displays user dropdown for authenticated users on desktop
 * Provides user profile access and logout functionality
 */
const NavbarUserActions: React.FC<NavbarUserActionsProps> = ({
  isAuthenticated,
  user,
  isUserDropdownOpen,
  userDropdownRef,
  onToggleUserDropdown,
  onLogout,
  logoutLoading,
  getUserInitials
}) => {
  return (
    <div className="flex items-center space-x-4">
      {/* User dropdown - only show for authenticated users on desktop (hidden on mobile) */}
      {isAuthenticated && (
        <div className="relative hidden md:block" ref={userDropdownRef}>
          <UserDropdown
            user={user}
            isDropdownOpen={isUserDropdownOpen}
            onToggleDropdown={onToggleUserDropdown}
            onLogout={onLogout}
            logoutLoading={logoutLoading}
            getUserInitials={getUserInitials}
          />
        </div>
      )}
    </div>
  );
};

export default NavbarUserActions;

