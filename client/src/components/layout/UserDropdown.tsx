import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/graphql';

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
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-white">
            {getUserInitials()}
          </span>
        </div>

        {/* Dropdown Icon */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
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
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          {/* User Profile Section */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center space-x-3">
              {/* User Avatar in Dropdown */}
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {user?.email}
                </div>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* No additional menu items for minimal login feature */}
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-100 pt-0">
            <button
              onClick={onLogout}
              disabled={logoutLoading}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors duration-200"
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