import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/graphql';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

/**
 * User Dropdown Component
 * Displays user avatar and dropdown menu for authenticated users
 * Handles user profile actions and logout functionality with enhanced styling and icons
 */
interface UserDropdownProps {
  user: User | null;
  isDropdownOpen: boolean;
  logoutLoading: boolean;
  onToggleDropdown: () => void;
  onLogout: () => void;
  getUserInitials: () => string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  isDropdownOpen,
  logoutLoading,
  onToggleDropdown,
  onLogout,
  getUserInitials,
}) => {
  return (
    <div className="relative">
      {/* User Avatar and Dropdown Trigger - Horizontal Layout */}
      <button
        onClick={onToggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-emerald-50 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
          <span className="text-sm font-semibold text-white">
            {getUserInitials()}
          </span>
        </div>

        {/* Dropdown Icon */}
        <svg
          className={`w-4 h-4 theme-navbar-text-secondary transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-emerald-600' : ''
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-3 w-64 theme-user-dropdown-bg rounded-2xl shadow-2xl z-50 theme-user-dropdown-border border backdrop-blur-sm bg-opacity-95 animate-in slide-in-from-top-2 duration-300">
          {/* User Profile Section */}
          <div className="px-6 py-4 theme-user-profile-bg rounded-t-2xl">
            <div className="flex items-center space-x-4">
              {/* User Avatar in Dropdown */}
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold theme-user-profile-text truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm theme-user-profile-text-secondary truncate mt-1">
                  {user?.email}
                </div>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold theme-user-profile-role-bg theme-user-profile-role-text shadow-sm">
                    {user?.role ? formatRoleForDisplay(user.role) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="theme-user-dropdown-border border-t rounded-b-2xl overflow-hidden">
            <button
              onClick={onLogout}
              disabled={logoutLoading}
              className="w-full flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-all duration-300 hover:shadow-inner"
            >
              {logoutLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-3"></div>
                  Logging out...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown; 